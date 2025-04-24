import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService } from './performance.service';
import { BehaviorAnalyticsService } from './behavior-analytics.service';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { AdvancedUXAnalyticsService } from './advanced-ux-analytics.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface ContentOptimization {
  timestamp: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    relevance: number;
    engagement: number;
    performance: number;
    accessibility: number;
    seo: number;
  };
  insights: {
    type: 'content' | 'metadata' | 'structure' | 'seo';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
    confidence: number;
  }[];
  recommendations: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;
    impact: string;
    confidence: number;
  }[];
}

interface ContentMetrics {
  totalContent: number;
  optimizedContent: number;
  contentPerformance: number;
  lastAnalysis: number;
  contentSegments: {
    highPerformance: number;
    mediumPerformance: number;
    lowPerformance: number;
  };
  optimizationMetrics: {
    averageLoadTime: number;
    compressionRatio: number;
    cacheHitRate: number;
    contentTypes: Record<string, number>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IntelligentContentService {
  private optimization = new BehaviorSubject<ContentOptimization>({
    timestamp: Date.now(),
    status: 'excellent',
    metrics: {
      relevance: 0,
      engagement: 0,
      performance: 0,
      accessibility: 0,
      seo: 0
    },
    insights: [],
    recommendations: []
  });

  private metrics = new BehaviorSubject<ContentMetrics>({
    totalContent: 0,
    optimizedContent: 0,
    contentPerformance: 0,
    lastAnalysis: Date.now(),
    contentSegments: {
      highPerformance: 0,
      mediumPerformance: 0,
      lowPerformance: 0
    },
    optimizationMetrics: {
      averageLoadTime: 0,
      compressionRatio: 0,
      cacheHitRate: 0,
      contentTypes: {}
    }
  });

  private readonly OPTIMIZATION_THRESHOLDS = {
    relevance: { warning: 0.7, critical: 0.5 },
    engagement: { warning: 0.6, critical: 0.4 },
    performance: { warning: 0.8, critical: 0.6 },
    accessibility: { warning: 0.8, critical: 0.6 },
    seo: { warning: 0.7, critical: 0.5 }
  };

  constructor(
    private performanceService: PerformanceService,
    private behaviorAnalyticsService: BehaviorAnalyticsService,
    private predictiveAnalyticsService: PredictiveAnalyticsService,
    private uxAnalyticsService: AdvancedUXAnalyticsService
  ) {
    this.startContentMonitoring();
  }

  /**
   * Inicia el monitoreo de contenido
   */
  private startContentMonitoring(): void {
    // Análisis de contenido
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.analyzeContent())
    ).subscribe();

    // Actualización de métricas
    interval(15 * 60 * 1000).pipe( // Cada 15 minutos
      tap(() => this.updateMetrics())
    ).subscribe();
  }

  /**
   * Analiza el contenido
   */
  private analyzeContent(): void {
    combineLatest([
      this.performanceService.getMetrics(),
      this.behaviorAnalyticsService.getMetrics(),
      this.predictiveAnalyticsService.getPredictions(),
      this.uxAnalyticsService.getAnalytics()
    ]).pipe(
      tap(([performanceMetrics, behaviorMetrics, predictions, uxAnalytics]) => {
        const insights = this.detectInsights(performanceMetrics, behaviorMetrics, predictions, uxAnalytics);
        const recommendations = this.generateRecommendations(insights);
        const status = this.calculateStatus(performanceMetrics, behaviorMetrics);

        this.optimization.next({
          timestamp: Date.now(),
          status,
          metrics: {
            relevance: this.calculateRelevance(behaviorMetrics),
            engagement: this.calculateEngagement(behaviorMetrics),
            performance: this.calculatePerformance(performanceMetrics),
            accessibility: this.calculateAccessibility(performanceMetrics),
            seo: this.calculateSEO(uxAnalytics)
          },
          insights,
          recommendations
        });

        this.updateMetrics();
      })
    ).subscribe();
  }

  /**
   * Detecta insights de contenido
   */
  private detectInsights(
    performanceMetrics: any,
    behaviorMetrics: any,
    predictions: any,
    uxAnalytics: any
  ): ContentOptimization['insights'] {
    const insights: ContentOptimization['insights'] = [];

    // Insights de contenido
    if (behaviorMetrics.contentEngagement < this.OPTIMIZATION_THRESHOLDS.engagement.warning) {
      insights.push({
        type: 'content',
        priority: this.calculatePriority(behaviorMetrics.contentEngagement, 'engagement'),
        description: 'Bajo engagement con el contenido',
        impact: 'Reducción de satisfacción del usuario',
        confidence: 0.8
      });
    }

    // Insights de metadata
    if (performanceMetrics.metadataQuality < this.OPTIMIZATION_THRESHOLDS.relevance.warning) {
      insights.push({
        type: 'metadata',
        priority: this.calculatePriority(performanceMetrics.metadataQuality, 'relevance'),
        description: 'Calidad de metadata deficiente',
        impact: 'Reducción de relevancia',
        confidence: 0.7
      });
    }

    // Insights de estructura
    if (performanceMetrics.contentStructure < this.OPTIMIZATION_THRESHOLDS.performance.warning) {
      insights.push({
        type: 'structure',
        priority: this.calculatePriority(performanceMetrics.contentStructure, 'performance'),
        description: 'Estructura de contenido no optimizada',
        impact: 'Reducción de rendimiento',
        confidence: 0.6
      });
    }

    // Insights de SEO
    if (uxAnalytics.metrics.seo < this.OPTIMIZATION_THRESHOLDS.seo.warning) {
      insights.push({
        type: 'seo',
        priority: this.calculatePriority(uxAnalytics.metrics.seo, 'seo'),
        description: 'Optimización SEO deficiente',
        impact: 'Reducción de visibilidad',
        confidence: 0.7
      });
    }

    return insights;
  }

  /**
   * Calcula la prioridad de un insight
   */
  private calculatePriority(value: number, metric: keyof typeof this.OPTIMIZATION_THRESHOLDS): ContentOptimization['insights'][0]['priority'] {
    const thresholds = this.OPTIMIZATION_THRESHOLDS[metric];

    if (value < thresholds.critical) return 'critical';
    if (value < thresholds.warning) return 'high';
    return 'medium';
  }

  /**
   * Genera recomendaciones de contenido
   */
  private generateRecommendations(insights: ContentOptimization['insights']): ContentOptimization['recommendations'] {
    const recommendations: ContentOptimization['recommendations'] = [];

    for (const insight of insights) {
      if (insight.priority === 'critical') {
        recommendations.push({
          priority: 'critical',
          action: this.getCriticalAction(insight.type),
          impact: 'Alta mejora de contenido',
          confidence: insight.confidence
        });
      } else if (insight.priority === 'high') {
        recommendations.push({
          priority: 'high',
          action: this.getHighPriorityAction(insight.type),
          impact: 'Media mejora de contenido',
          confidence: insight.confidence
        });
      }
    }

    return recommendations;
  }

  /**
   * Obtiene una acción crítica para un tipo de insight
   */
  private getCriticalAction(type: ContentOptimization['insights'][0]['type']): string {
    const actions: Record<ContentOptimization['insights'][0]['type'], string> = {
      content: 'Mejorar urgentemente la calidad del contenido',
      metadata: 'Optimizar urgentemente la metadata',
      structure: 'Reestructurar urgentemente el contenido',
      seo: 'Implementar mejoras SEO críticas'
    };

    return actions[type];
  }

  /**
   * Obtiene una acción de alta prioridad para un tipo de insight
   */
  private getHighPriorityAction(type: ContentOptimization['insights'][0]['type']): string {
    const actions: Record<ContentOptimization['insights'][0]['type'], string> = {
      content: 'Mejorar la calidad del contenido',
      metadata: 'Optimizar la metadata',
      structure: 'Reestructurar el contenido',
      seo: 'Implementar mejoras SEO'
    };

    return actions[type];
  }

  /**
   * Calcula el estado general del contenido
   */
  private calculateStatus(performanceMetrics: any, behaviorMetrics: any): ContentOptimization['status'] {
    const relevance = this.calculateRelevance(behaviorMetrics);
    const engagement = this.calculateEngagement(behaviorMetrics);
    const performance = this.calculatePerformance(performanceMetrics);

    if (relevance < this.OPTIMIZATION_THRESHOLDS.relevance.critical ||
        engagement < this.OPTIMIZATION_THRESHOLDS.engagement.critical ||
        performance < this.OPTIMIZATION_THRESHOLDS.performance.critical) {
      return 'poor';
    }

    if (relevance < this.OPTIMIZATION_THRESHOLDS.relevance.warning ||
        engagement < this.OPTIMIZATION_THRESHOLDS.engagement.warning ||
        performance < this.OPTIMIZATION_THRESHOLDS.performance.warning) {
      return 'fair';
    }

    if (relevance > 0.8 && engagement > 0.8 && performance > 0.8) {
      return 'excellent';
    }

    return 'good';
  }

  /**
   * Calcula la relevancia del contenido
   */
  private calculateRelevance(behaviorMetrics: any): number {
    const contentEngagement = behaviorMetrics.contentEngagement;
    const userSatisfaction = behaviorMetrics.userSatisfaction;
    const contentQuality = behaviorMetrics.contentQuality;

    return (contentEngagement + userSatisfaction + contentQuality) / 3;
  }

  /**
   * Calcula el engagement con el contenido
   */
  private calculateEngagement(behaviorMetrics: any): number {
    const timeSpent = behaviorMetrics.averageTimeSpent;
    const interactionRate = behaviorMetrics.interactionRate;
    const returnRate = behaviorMetrics.returnRate;

    return (timeSpent + interactionRate + returnRate) / 3;
  }

  /**
   * Calcula el rendimiento del contenido
   */
  private calculatePerformance(performanceMetrics: any): number {
    const loadTime = performanceMetrics.loadTime;
    const compressionRatio = performanceMetrics.compressionRatio;
    const cacheHitRate = performanceMetrics.cacheHitRate;

    const loadTimeScore = Math.max(0, 1 - (loadTime / 3000));
    const compressionScore = Math.min(1, compressionRatio / 0.8);
    const cacheScore = Math.min(1, cacheHitRate / 0.9);

    return (loadTimeScore + compressionScore + cacheScore) / 3;
  }

  /**
   * Calcula la accesibilidad del contenido
   */
  private calculateAccessibility(performanceMetrics: any): number {
    const accessibilityScore = performanceMetrics.accessibilityScore;
    const readabilityScore = performanceMetrics.readabilityScore;
    const compatibilityScore = performanceMetrics.compatibilityScore;

    return (accessibilityScore + readabilityScore + compatibilityScore) / 3;
  }

  /**
   * Calcula el SEO del contenido
   */
  private calculateSEO(uxAnalytics: any): number {
    const seoScore = uxAnalytics.metrics.seo;
    const visibilityScore = uxAnalytics.metrics.visibility;
    const rankingScore = uxAnalytics.metrics.ranking;

    return (seoScore + visibilityScore + rankingScore) / 3;
  }

  /**
   * Actualiza las métricas
   */
  private updateMetrics(): void {
    const currentMetrics = this.metrics.value;
    const optimization = this.optimization.value;

    this.metrics.next({
      totalContent: currentMetrics.totalContent + 1,
      optimizedContent: currentMetrics.optimizedContent + (optimization.status === 'excellent' ? 1 : 0),
      contentPerformance: optimization.metrics.performance,
      lastAnalysis: Date.now(),
      contentSegments: {
        highPerformance: Math.round(optimization.metrics.performance * 100),
        mediumPerformance: Math.round((1 - optimization.metrics.performance) * 50),
        lowPerformance: Math.round((1 - optimization.metrics.performance) * 50)
      },
      optimizationMetrics: {
        averageLoadTime: 2000, // 2 segundos
        compressionRatio: 0.7,
        cacheHitRate: 0.8,
        contentTypes: {
          text: 0.4,
          images: 0.3,
          video: 0.2,
          audio: 0.1
        }
      }
    });
  }

  /**
   * Obtiene la optimización actual
   */
  getOptimization(): Observable<ContentOptimization> {
    return this.optimization.asObservable();
  }

  /**
   * Obtiene las métricas de contenido
   */
  getMetrics(): Observable<ContentMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de contenido
   */
  generateReport(): {
    optimization: ContentOptimization;
    metrics: ContentMetrics;
    summary: {
      status: ContentOptimization['status'];
      activeInsights: number;
      criticalRecommendations: number;
      contentPerformance: number;
    };
  } {
    const optimization = this.optimization.value;
    const metrics = this.metrics.value;

    return {
      optimization,
      metrics,
      summary: {
        status: optimization.status,
        activeInsights: optimization.insights.filter(i => i.priority === 'critical' || i.priority === 'high').length,
        criticalRecommendations: optimization.recommendations.filter(r => r.priority === 'critical').length,
        contentPerformance: metrics.contentPerformance
      }
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.optimization.next({
      timestamp: Date.now(),
      status: 'excellent',
      metrics: {
        relevance: 0,
        engagement: 0,
        performance: 0,
        accessibility: 0,
        seo: 0
      },
      insights: [],
      recommendations: []
    });
    this.metrics.next({
      totalContent: 0,
      optimizedContent: 0,
      contentPerformance: 0,
      lastAnalysis: Date.now(),
      contentSegments: {
        highPerformance: 0,
        mediumPerformance: 0,
        lowPerformance: 0
      },
      optimizationMetrics: {
        averageLoadTime: 0,
        compressionRatio: 0,
        cacheHitRate: 0,
        contentTypes: {}
      }
    });
  }
}
