import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  responseTime: number;
  errorRate: number;
  cacheHitRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private metrics = new BehaviorSubject<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    responseTime: 0,
    errorRate: 0,
    cacheHitRate: 0
  });

  private frameCount = 0;
  private lastTime = performance.now();
  private errorCount = 0;
  private totalRequests = 0;
  private cacheHits = 0;
  private totalCacheRequests = 0;

  constructor() {
    this.startMonitoring();
  }

  /**
   * Inicia el monitoreo de rendimiento
   */
  private startMonitoring(): void {
    // Monitoreo de FPS
    interval(1000).subscribe(() => {
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;
      const fps = Math.round((this.frameCount * 1000) / elapsed);

      this.updateMetrics({ fps });
      this.frameCount = 0;
      this.lastTime = currentTime;
    });

    // Monitoreo de memoria
    if ('memory' in performance) {
      interval(5000).subscribe(() => {
        const memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
        this.updateMetrics({ memoryUsage });
      });
    }

    // Monitoreo de tiempo de carga
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.updateMetrics({ loadTime });
    });
  }

  /**
   * Registra un frame renderizado
   */
  recordFrame(): void {
    this.frameCount++;
  }

  /**
   * Registra una solicitud HTTP
   * @param responseTime Tiempo de respuesta en ms
   * @param isError Si la solicitud resultó en error
   */
  recordRequest(responseTime: number, isError: boolean = false): void {
    this.totalRequests++;
    if (isError) {
      this.errorCount++;
    }

    const errorRate = (this.errorCount / this.totalRequests) * 100;
    this.updateMetrics({ responseTime, errorRate });
  }

  /**
   * Registra un hit de caché
   * @param isHit Si fue un hit de caché
   */
  recordCacheAccess(isHit: boolean): void {
    this.totalCacheRequests++;
    if (isHit) {
      this.cacheHits++;
    }

    const cacheHitRate = (this.cacheHits / this.totalCacheRequests) * 100;
    this.updateMetrics({ cacheHitRate });
  }

  /**
   * Actualiza las métricas de rendimiento
   * @param updates Objeto con las métricas a actualizar
   */
  private updateMetrics(updates: Partial<PerformanceMetrics>): void {
    this.metrics.next({
      ...this.metrics.value,
      ...updates
    });
  }

  /**
   * Obtiene las métricas actuales
   * @returns Observable con las métricas
   */
  getMetrics(): Observable<PerformanceMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Obtiene métricas específicas
   * @param metric Nombre de la métrica
   * @returns Observable con el valor de la métrica
   */
  getMetric<K extends keyof PerformanceMetrics>(
    metric: K
  ): Observable<PerformanceMetrics[K]> {
    return this.metrics.pipe(
      map(m => m[metric]),
      distinctUntilChanged()
    );
  }

  /**
   * Verifica si el rendimiento está por debajo del umbral
   * @param metric Nombre de la métrica
   * @param threshold Valor umbral
   * @returns Observable que emite true si está por debajo del umbral
   */
  isBelowThreshold<K extends keyof PerformanceMetrics>(
    metric: K,
    threshold: number
  ): Observable<boolean> {
    return this.getMetric(metric).pipe(
      map(value => value < threshold),
      distinctUntilChanged()
    );
  }

  /**
   * Genera un reporte de rendimiento
   * @returns Objeto con el reporte
   */
  generateReport(): PerformanceMetrics & { timestamp: number } {
    return {
      ...this.metrics.value,
      timestamp: Date.now()
    };
  }

  /**
   * Reinicia las métricas
   */
  resetMetrics(): void {
    this.frameCount = 0;
    this.errorCount = 0;
    this.totalRequests = 0;
    this.cacheHits = 0;
    this.totalCacheRequests = 0;
    this.lastTime = performance.now();

    this.metrics.next({
      fps: 0,
      memoryUsage: 0,
      loadTime: 0,
      responseTime: 0,
      errorRate: 0,
      cacheHitRate: 0
    });
  }
}
