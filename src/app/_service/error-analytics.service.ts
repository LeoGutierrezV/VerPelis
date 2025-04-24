import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { APP_CONSTANTS } from '../_constants/app.constants';
import { ErrorResponse } from '../_types/app.types';

export interface ErrorAnalytics {
  totalErrors: number;
  errorTypes: { [key: string]: number };
  lastError: ErrorResponse | null;
  errorRate: number;
  affectedUsers: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorAnalyticsService {
  private analytics = new BehaviorSubject<ErrorAnalytics>({
    totalErrors: 0,
    errorTypes: {},
    lastError: null,
    errorRate: 0,
    affectedUsers: 0,
    timestamp: Date.now()
  });

  private errorCount = 0;
  private requestCount = 0;
  private affectedUsers = new Set<string>();

  constructor() {
    this.startCleanupInterval();
  }

  /**
   * Registra un error
   * @param error Error a registrar
   * @param userId ID del usuario afectado
   */
  recordError(error: ErrorResponse, userId?: string): void {
    this.errorCount++;
    this.requestCount++;

    if (userId) {
      this.affectedUsers.add(userId);
    }

    const errorTypes = { ...this.analytics.value.errorTypes };
    const errorType = error.code || 'unknown';
    errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;

    const errorRate = (this.errorCount / this.requestCount) * 100;

    this.analytics.next({
      totalErrors: this.errorCount,
      errorTypes,
      lastError: error,
      errorRate,
      affectedUsers: this.affectedUsers.size,
      timestamp: Date.now()
    });

    this.logError(error);
  }

  /**
   * Registra una solicitud exitosa
   */
  recordSuccess(): void {
    this.requestCount++;
    const errorRate = (this.errorCount / this.requestCount) * 100;

    this.analytics.next({
      ...this.analytics.value,
      errorRate,
      timestamp: Date.now()
    });
  }

  /**
   * Obtiene las estadísticas de errores
   * @returns Observable con las estadísticas
   */
  getAnalytics(): Observable<ErrorAnalytics> {
    return this.analytics.asObservable();
  }

  /**
   * Obtiene el número total de errores
   * @returns Observable con el número total de errores
   */
  getTotalErrors(): Observable<number> {
    return this.analytics.pipe(
      map(a => a.totalErrors),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene la tasa de errores
   * @returns Observable con la tasa de errores
   */
  getErrorRate(): Observable<number> {
    return this.analytics.pipe(
      map(a => a.errorRate),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene los tipos de errores
   * @returns Observable con los tipos de errores
   */
  getErrorTypes(): Observable<{ [key: string]: number }> {
    return this.analytics.pipe(
      map(a => a.errorTypes),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene el último error registrado
   * @returns Observable con el último error
   */
  getLastError(): Observable<ErrorResponse | null> {
    return this.analytics.pipe(
      map(a => a.lastError),
      distinctUntilChanged()
    );
  }

  /**
   * Genera un reporte de errores
   * @returns Objeto con el reporte
   */
  generateReport(): ErrorAnalytics {
    return this.analytics.value;
  }

  /**
   * Reinicia las estadísticas
   */
  resetAnalytics(): void {
    this.errorCount = 0;
    this.requestCount = 0;
    this.affectedUsers.clear();

    this.analytics.next({
      totalErrors: 0,
      errorTypes: {},
      lastError: null,
      errorRate: 0,
      affectedUsers: 0,
      timestamp: Date.now()
    });
  }

  /**
   * Inicia el intervalo de limpieza
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      const oneHourAgo = now - 3600000;

      // Limpia errores antiguos
      if (this.analytics.value.timestamp < oneHourAgo) {
        this.resetAnalytics();
      }
    }, 3600000); // Cada hora
  }

  /**
   * Registra el error en la consola
   * @param error Error a registrar
   */
  private logError(error: ErrorResponse): void {
    console.error('Error en la aplicación:', {
      timestamp: new Date().toISOString(),
      code: error.code,
      message: error.message,
      status: error.status,
      details: error.details
    });
  }
}
