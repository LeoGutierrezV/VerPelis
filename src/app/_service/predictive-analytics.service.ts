import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService } from './performance.service';
import { ErrorAnalyticsService } from './error-analytics.service';
import { ResourceOptimizationService } from './resource-optimization.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface PredictionMetrics {
  predictedLoadTime: number;
  predictedMemoryUsage: number;
  predictedErrorRate: number;
  confidence: number;
  timestamp: number;
}

interface OptimizationRecommendation {
  type: 'performance' | 'resource' | 'error' | 'user';
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  impact: string;
  estimatedImprovement: number;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictiveAnalyticsService {
  private predictions = new BehaviorSubject<PredictionMetrics>({
    predictedLoadTime: 0,
    predictedMemoryUsage: 0,
    predictedErrorRate: 0,
    confidence: 0,
    timestamp: Date.now()
  });

  private recommendations = new BehaviorSubject<OptimizationRecommendation[]>([]);
  private historicalData: any[] = [];
  private readonly MAX_HISTORICAL_DATA = 1000;

  constructor(
    private performanceService: PerformanceService,
    private errorAnalyticsService: ErrorAnalyticsService,
    private resourceOptimizationService: ResourceOptimizationService
  ) {
    this.startPredictionEngine();
  }

  /**
   * Inicia el motor de predicción
   */
  private startPredictionEngine(): void {
    // Recolección de datos históricos
    interval(APP_CONSTANTS.API.CACHE_TIME).pipe(
      tap(() => this.collectHistoricalData())
    ).subscribe();

    // Análisis predictivo
    interval(3600000).pipe( // Cada hora
      tap(() => this.generatePredictions())
    ).subscribe();

    // Optimización proactiva
    interval(1800000).pipe( // Cada 30 minutos
      tap(() => this.generateOptimizationRecommendations())
    ).subscribe();
  }

  /**
   * Recolecta datos históricos
   */
  private collectHistoricalData(): void {
    const currentData = {
      timestamp: Date.now(),
      performance: this.performanceService.generateReport(),
      errors: this.errorAnalyticsService.generateReport(),
      resources: this.resourceOptimizationService.generateReport()
    };

    this.historicalData.push(currentData);
    if (this.historicalData.length > this.MAX_HISTORICAL_DATA) {
      this.historicalData.shift();
    }
  }

  /**
   * Genera predicciones basadas en datos históricos
   */
  private generatePredictions(): void {
    if (this.historicalData.length < 100) {
      return;
    }

    const predictions = this.calculatePredictions();
    this.predictions.next({
      ...predictions,
      timestamp: Date.now()
    });

    this.analyzePredictionAccuracy();
  }

  /**
   * Calcula predicciones usando regresión lineal
   */
  private calculatePredictions(): Omit<PredictionMetrics, 'timestamp'> {
    const recentData = this.historicalData.slice(-100);

    // Predicción de tiempo de carga
    const loadTimePrediction = this.predictLinearRegression(
      recentData.map(d => d.performance.loadTime)
    );

    // Predicción de uso de memoria
    const memoryPrediction = this.predictLinearRegression(
      recentData.map(d => d.performance.memoryUsage)
    );

    // Predicción de tasa de errores
    const errorRatePrediction = this.predictLinearRegression(
      recentData.map(d => d.errors.errorRate)
    );

    // Cálculo de confianza basado en la variabilidad de los datos
    const confidence = this.calculateConfidence(recentData);

    return {
      predictedLoadTime: loadTimePrediction,
      predictedMemoryUsage: memoryPrediction,
      predictedErrorRate: errorRatePrediction,
      confidence
    };
  }

  /**
   * Predice valores usando regresión lineal
   */
  private predictLinearRegression(data: number[]): number {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return slope * n + intercept;
  }

  /**
   * Calcula el nivel de confianza de las predicciones
   */
  private calculateConfidence(data: any[]): number {
    const recentData = data.slice(-10);
    const variance = this.calculateVariance(recentData);
    const confidence = Math.max(0, 1 - variance / 100);
    return confidence;
  }

  /**
   * Calcula la varianza de un conjunto de datos
   */
  private calculateVariance(data: any[]): number {
    const values = data.map(d => d.performance.loadTime);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Analiza la precisión de las predicciones anteriores
   */
  private analyzePredictionAccuracy(): void {
    const recentPredictions = this.historicalData.slice(-10);
    const accuracy = this.calculatePredictionAccuracy(recentPredictions);

    if (accuracy < 0.7) {
      this.adjustPredictionModel();
    }
  }

  /**
   * Calcula la precisión de las predicciones
   */
  private calculatePredictionAccuracy(data: any[]): number {
    let correctPredictions = 0;
    const total = data.length;

    for (let i = 1; i < data.length; i++) {
      const prediction = data[i - 1];
      const actual = data[i];

      if (this.isPredictionAccurate(prediction, actual)) {
        correctPredictions++;
      }
    }

    return correctPredictions / total;
  }

  /**
   * Verifica si una predicción fue precisa
   */
  private isPredictionAccurate(prediction: any, actual: any): boolean {
    const loadTimeDiff = Math.abs(prediction.performance.loadTime - actual.performance.loadTime);
    const memoryDiff = Math.abs(prediction.performance.memoryUsage - actual.performance.memoryUsage);
    const errorRateDiff = Math.abs(prediction.errors.errorRate - actual.errors.errorRate);

    return loadTimeDiff < 100 && memoryDiff < 50 && errorRateDiff < 2;
  }

  /**
   * Ajusta el modelo de predicción
   */
  private adjustPredictionModel(): void {
    // Implementar ajuste del modelo
    console.log('Ajustando modelo de predicción...');
  }

  /**
   * Genera recomendaciones de optimización
   */
  private generateOptimizationRecommendations(): void {
    const predictions = this.predictions.value;
    const recommendations: OptimizationRecommendation[] = [];

    // Recomendaciones basadas en predicciones de rendimiento
    if (predictions.predictedLoadTime > 2000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        action: 'Implementar lazy loading de componentes',
        impact: 'Reducción del tiempo de carga inicial',
        estimatedImprovement: 30,
        confidence: predictions.confidence
      });
    }

    if (predictions.predictedMemoryUsage > 400) {
      recommendations.push({
        type: 'resource',
        priority: 'high',
        action: 'Optimizar gestión de memoria',
        impact: 'Reducción del consumo de memoria',
        estimatedImprovement: 25,
        confidence: predictions.confidence
      });
    }

    if (predictions.predictedErrorRate > 5) {
      recommendations.push({
        type: 'error',
        priority: 'critical',
        action: 'Mejorar manejo de errores',
        impact: 'Reducción de errores en producción',
        estimatedImprovement: 40,
        confidence: predictions.confidence
      });
    }

    this.recommendations.next(recommendations);
  }

  /**
   * Obtiene las predicciones actuales
   */
  getPredictions(): Observable<PredictionMetrics> {
    return this.predictions.asObservable();
  }

  /**
   * Obtiene las recomendaciones actuales
   */
  getRecommendations(): Observable<OptimizationRecommendation[]> {
    return this.recommendations.asObservable();
  }

  /**
   * Obtiene recomendaciones por tipo
   */
  getRecommendationsByType(type: OptimizationRecommendation['type']): Observable<OptimizationRecommendation[]> {
    return this.recommendations.pipe(
      map(recs => recs.filter(r => r.type === type)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene recomendaciones por prioridad
   */
  getRecommendationsByPriority(priority: OptimizationRecommendation['priority']): Observable<OptimizationRecommendation[]> {
    return this.recommendations.pipe(
      map(recs => recs.filter(r => r.priority === priority)),
      distinctUntilChanged()
    );
  }

  /**
   * Genera un reporte predictivo completo
   */
  generateReport(): {
    predictions: PredictionMetrics;
    recommendations: OptimizationRecommendation[];
    historicalData: any[];
  } {
    return {
      predictions: this.predictions.value,
      recommendations: this.recommendations.value,
      historicalData: this.historicalData
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.historicalData = [];
    this.predictions.next({
      predictedLoadTime: 0,
      predictedMemoryUsage: 0,
      predictedErrorRate: 0,
      confidence: 0,
      timestamp: Date.now()
    });
    this.recommendations.next([]);
  }
}
