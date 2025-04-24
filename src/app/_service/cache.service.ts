import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { APP_CONSTANTS } from '../_constants/app.constants';
import { CacheItem } from '../_types/app.types';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly DEFAULT_TTL = APP_CONSTANTS.API.CACHE_TIME;

  constructor() {
    this.startCleanupInterval();
  }

  /**
   * Obtiene datos de la caché o ejecuta la función de obtención
   * @param key Clave de la caché
   * @param fetchFn Función para obtener datos frescos
   * @param ttl Tiempo de vida en milisegundos
   * @returns Observable con los datos
   */
  get<T>(key: string, fetchFn: () => Observable<T>, ttl: number = this.DEFAULT_TTL): Observable<T> {
    const cached = this.getFromCache<T>(key);
    if (cached) {
      return of(cached);
    }

    return fetchFn().pipe(
      map(data => {
        this.set(key, data, ttl);
        return data;
      }),
      catchError(error => {
        console.error(`Error fetching data for key ${key}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Almacena datos en la caché
   * @param key Clave de la caché
   * @param data Datos a almacenar
   * @param ttl Tiempo de vida en milisegundos
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    this.cache.set(key, item);
  }

  /**
   * Elimina datos de la caché
   * @param key Clave de la caché
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpia toda la caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Invalida la caché basada en un patrón
   * @param pattern Patrón de clave a invalidar
   */
  invalidate(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
      }
    }
  }

  /**
   * Obtiene el tamaño actual de la caché
   * @returns Número de elementos en caché
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Obtiene estadísticas de la caché
   * @returns Objeto con estadísticas
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Inicia el intervalo de limpieza automática
   */
  private startCleanupInterval(): void {
    setInterval(() => this.cleanup(), 60000); // Limpia cada minuto
  }

  /**
   * Limpia entradas expiradas de la caché
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.delete(key);
      }
    }
  }

  /**
   * Obtiene datos de la caché si son válidos
   * @param key Clave de la caché
   * @returns Datos en caché o null si no existen o están expirados
   */
  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.data;
  }
}

