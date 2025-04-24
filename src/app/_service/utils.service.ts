import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { APP_CONSTANTS } from '../_constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitiza una URL para uso seguro en iframes
   * @param url URL a sanitizar
   * @returns URL segura
   */
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Formatea una fecha a formato local
   * @param date Fecha a formatear
   * @returns Fecha formateada
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatea un número a formato de moneda
   * @param amount Cantidad a formatear
   * @returns Cantidad formateada
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  /**
   * Formatea un número a formato de porcentaje
   * @param value Valor a formatear
   * @returns Valor formateado
   */
  formatPercentage(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  }

  /**
   * Genera una URL de imagen de TMDB
   * @param path Ruta de la imagen
   * @param size Tamaño de la imagen
   * @returns URL completa
   */
  getImageUrl(path: string | null, size: string = APP_CONSTANTS.API.IMAGE_SIZES.MEDIUM): string {
    if (!path) return '';
    return `${APP_CONSTANTS.API.IMAGE_BASE_URL}/${size}${path}`;
  }

  /**
   * Trunca un texto a una longitud máxima
   * @param text Texto a truncar
   * @param maxLength Longitud máxima
   * @returns Texto truncado
   */
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Genera un ID único
   * @returns ID único
   */
  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Verifica si un objeto está vacío
   * @param obj Objeto a verificar
   * @returns true si está vacío
   */
  isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * Clona un objeto profundamente
   * @param obj Objeto a clonar
   * @returns Objeto clonado
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Debounce una función
   * @param func Función a debounce
   * @param wait Tiempo de espera
   * @returns Función debounced
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
