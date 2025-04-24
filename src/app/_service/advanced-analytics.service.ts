import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, interval } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService, PerformanceMetrics } from './performance.service';
import { ErrorAnalyticsService, ErrorAnalytics } from './error-analytics.service';
import { CacheService } from './cache.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

export interface AnalyticsInsight {
  type: 'performance' | 'error' | 'cache' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  data?: any;
}

export interface AnalyticsReport {
  timestamp: number;
  period: 'hour' | 'day' | 'week' | 'month';
  insights: AnalyticsInsight[];
  metrics: {
    performance: PerformanceMetrics;
    errors: ErrorAnalytics;
    cache: {
      size: number;
      hitRate: number;
      keys: string[];
    };
  };
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedAnalyticsService {
  private insights = new BehaviorSubject<AnalyticsInsight[]>([]);
  private readonly PERFORMANCE_THRESHOLDS = {
    fps: 30,
    memoryUsage: 500, // MB
    responseTime: 1000, // ms
    errorRate: 5, // %
    cacheHitRate: 70 // %
  };

  constructor(
    private performanceService: PerformanceService,
    private errorAnalyticsService: ErrorAnalyticsService,
    private cacheService: CacheService
  ) {
    this.startMonitoring();
  }

  /**
   * Inicia el monitoreo avanzado
   */
  private startMonitoring(): void {
    // Monitoreo de rendimiento
    this.performanceService.getMetrics().pipe(
      filter(metrics => this.shouldAnalyzePerformance(metrics)),
      tap(metrics => this.analyzePerformance(metrics))
    ).subscribe();

    // Monitoreo de errores
    this.errorAnalyticsService.getAnalytics().pipe(
      filter(analytics => this.shouldAnalyzeErrors(analytics)),
      tap(analytics => this.analyzeErrors(analytics))
    ).subscribe();

    // Monitoreo de caché
    interval(APP_CONSTANTS.API.CACHE_TIME).pipe(
      tap(() => this.analyzeCache())
    ).subscribe();

    // Generación de reportes periódicos
    interval(3600000).pipe( // Cada hora
      tap(() => this.generatePeriodicReport())
    ).subscribe();
  }

  /**
   * Analiza métricas de rendimiento
   */
  private analyzePerformance(metrics: PerformanceMetrics): void {
    const insights: AnalyticsInsight[] = [];

    if (metrics.fps < this.PERFORMANCE_THRESHOLDS.fps) {
      insights.push({
        type: 'performance',
        severity: metrics.fps < 15 ? 'critical' : 'high',
        message: `FPS bajo detectado: ${metrics.fps}`,
        timestamp: Date.now(),
        data: { fps: metrics.fps }
      });
    }

    if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage) {
      insights.push({
        type: 'performance',
        severity: 'high',
        message: `Alto consumo de memoria: ${metrics.memoryUsage}MB`,
        timestamp: Date.now(),
        data: { memoryUsage: metrics.memoryUsage }
      });
    }

    if (metrics.responseTime > this.PERFORMANCE_THRESHOLDS.responseTime) {
      insights.push({
        type: 'performance',
        severity: 'medium',
        message: `Tiempo de respuesta alto: ${metrics.responseTime}ms`,
        timestamp: Date.now(),
        data: { responseTime: metrics.responseTime }
      });
    }

    this.addInsights(insights);
  }

  /**
   * Analiza métricas de errores
   */
  private analyzeErrors(analytics: ErrorAnalytics): void {
    const insights: AnalyticsInsight[] = [];

    if (analytics.errorRate > this.PERFORMANCE_THRESHOLDS.errorRate) {
      insights.push({
        type: 'error',
        severity: analytics.errorRate > 10 ? 'critical' : 'high',
        message: `Alta tasa de errores: ${analytics.errorRate}%`,
        timestamp: Date.now(),
        data: { errorRate: analytics.errorRate }
      });
    }

    // Análisis de patrones de errores
    const errorPatterns = this.analyzeErrorPatterns(analytics.errorTypes);
    if (errorPatterns.length > 0) {
      insights.push({
        type: 'error',
        severity: 'medium',
        message: 'Patrones de error detectados',
        timestamp: Date.now(),
        data: { patterns: errorPatterns }
      });
    }

    this.addInsights(insights);
  }

  /**
   * Analiza métricas de caché
   */
  private analyzeCache(): void {
    const stats = this.cacheService.getStats();
    const insights: AnalyticsInsight[] = [];

    if (stats.size > 1000) {
      insights.push({
        type: 'cache',
        severity: 'medium',
        message: `Caché muy grande: ${stats.size} elementos`,
        timestamp: Date.now(),
        data: { cacheSize: stats.size }
      });
    }

    this.addInsights(insights);
  }

  /**
   * Genera un reporte periódico
   */
  private generatePeriodicReport(): void {
    const report: AnalyticsReport = {
      timestamp: Date.now(),
      period: 'hour',
      insights: this.insights.value,
      metrics: {
        performance: this.performanceService.generateReport(),
        errors: this.errorAnalyticsService.generateReport(),
        cache: this.cacheService.getStats()
      },
      recommendations: this.generateRecommendations()
    };

    this.logReport(report);
    this.insights.next([]); // Limpia insights antiguos
  }

  /**
   * Genera recomendaciones basadas en las métricas
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.performanceService.generateReport();
    const errors = this.errorAnalyticsService.generateReport();

    if (metrics.fps < this.PERFORMANCE_THRESHOLDS.fps) {
      recommendations.push('Considerar optimización de renderizado y reducción de animaciones');
    }

    if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage) {
      recommendations.push('Implementar limpieza de memoria y optimización de recursos');
    }

    if (errors.errorRate > this.PERFORMANCE_THRESHOLDS.errorRate) {
      recommendations.push('Revisar manejo de errores y mejorar validaciones');
    }

    return recommendations;
  }

  /**
   * Añade nuevos insights a la lista
   */
  private addInsights(newInsights: AnalyticsInsight[]): void {
    const currentInsights = this.insights.value;
    this.insights.next([...currentInsights, ...newInsights]);
  }

  /**
   * Verifica si se deben analizar las métricas de rendimiento
   */
  private shouldAnalyzePerformance(metrics: PerformanceMetrics): boolean {
    return metrics.fps < this.PERFORMANCE_THRESHOLDS.fps ||
           metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage ||
           metrics.responseTime > this.PERFORMANCE_THRESHOLDS.responseTime;
  }

  /**
   * Verifica si se deben analizar las métricas de errores
   */
  private shouldAnalyzeErrors(analytics: ErrorAnalytics): boolean {
    return analytics.errorRate > this.PERFORMANCE_THRESHOLDS.errorRate;
  }

  /**
   * Analiza patrones en los tipos de errores
   */
  private analyzeErrorPatterns(errorTypes: { [key: string]: number }): string[] {
    const patterns: string[] = [];
    const totalErrors = Object.values(errorTypes).reduce((a, b) => a + b, 0);

    for (const [type, count] of Object.entries(errorTypes)) {
      const percentage = (count / totalErrors) * 100;
      if (percentage > 50) {
        patterns.push(`${type}: ${percentage.toFixed(1)}%`);
      }
    }

    return patterns;
  }

  /**
   * Registra el reporte en la consola
   */
  private logReport(report: AnalyticsReport): void {
    console.group('Reporte de Análisis Avanzado');
    console.log('Timestamp:', new Date(report.timestamp).toISOString());
    console.log('Período:', report.period);
    console.log('Insights:', report.insights);
    console.log('Métricas:', report.metrics);
    console.log('Recomendaciones:', report.recommendations);
    console.groupEnd();
  }

  /**
   * Obtiene los insights actuales
   */
  getInsights(): Observable<AnalyticsInsight[]> {
    return this.insights.asObservable();
  }

  /**
   * Obtiene insights por tipo
   */
  getInsightsByType(type: AnalyticsInsight['type']): Observable<AnalyticsInsight[]> {
    return this.insights.pipe(
      map(insights => insights.filter(i => i.type === type)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene insights por severidad
   */
  getInsightsBySeverity(severity: AnalyticsInsight['severity']): Observable<AnalyticsInsight[]> {
    return this.insights.pipe(
      map(insights => insights.filter(i => i.severity === severity)),
      distinctUntilChanged()
    );
  }

  /**
   * Genera un reporte completo
   */
  generateFullReport(): AnalyticsReport {
    return {
      timestamp: Date.now(),
      period: 'hour',
      insights: this.insights.value,
      metrics: {
        performance: this.performanceService.generateReport(),
        errors: this.errorAnalyticsService.generateReport(),
        cache: this.cacheService.getStats()
      },
      recommendations: this.generateRecommendations()
    };
  }
}
