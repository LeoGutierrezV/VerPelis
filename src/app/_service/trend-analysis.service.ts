import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService } from './performance.service';
import { BehaviorAnalyticsService } from './behavior-analytics.service';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { AdvancedUXAnalyticsService } from './advanced-ux-analytics.service';
import { IntelligentContentService } from './intelligent-content.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface TrendAnalysis {
  timestamp: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    userTrends: number;
    contentTrends: number;
    performanceTrends: number;
    engagementTrends: number;
    marketTrends: number;
  };
  insights: {
    type: 'user' | 'content' | 'performance' | 'engagement' | 'market';
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

interface TrendMetrics {
  totalTrends: number;
  activeTrends: number;
  trendPerformance: number;
  lastAnalysis: number;
  trendSegments: {
    growing: number;
    stable: number;
    declining: number;
  };
  trendMetrics: {
    averageGrowth: number;
    volatility: number;
    predictionAccuracy: number;
    trendTypes: Record<string, number>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TrendAnalysisService {
  private analysis = new BehaviorSubject<TrendAnalysis>({
    timestamp: Date.now(),
    status: 'excellent',
    metrics: {
      userTrends: 0,
      contentTrends: 0,
      performanceTrends: 0,
      engagementTrends: 0,
      marketTrends: 0
    },
    insights: [],
    recommendations: []
  });

  private metrics = new BehaviorSubject<TrendMetrics>({
    totalTrends: 0,
    activeTrends: 0,
    trendPerformance: 0,
    lastAnalysis: Date.now(),
    trendSegments: {
      growing: 0,
      stable: 0,
      declining: 0
    },
    trendMetrics: {
      averageGrowth: 0,
      volatility: 0,
      predictionAccuracy: 0,
      trendTypes: {}
    }
  });

  private readonly TREND_THRESHOLDS = {
    userTrends: { warning: 0.7, critical: 0.5 },
    contentTrends: { warning: 0.6, critical: 0.4 },
    performanceTrends: { warning: 0.8, critical: 0.6 },
    engagementTrends: { warning: 0.7, critical: 0.5 },
    marketTrends: { warning: 0.6, critical: 0.4 }
  };

  constructor(
    private performanceService: PerformanceService,
    private behaviorAnalyticsService: BehaviorAnalyticsService,
    private predictiveAnalyticsService: PredictiveAnalyticsService,
    private uxAnalyticsService: AdvancedUXAnalyticsService,
    private contentService: IntelligentContentService
  ) {
    this.startTrendMonitoring();
  }

  /**
   * Inicia el monitoreo de tendencias
   */
  private startTrendMonitoring(): void {
    // Análisis de tendencias
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.analyzeTrends())
    ).subscribe();

    // Actualización de métricas
    interval(15 * 60 * 1000).pipe( // Cada 15 minutos
      tap(() => this.updateMetrics())
    ).subscribe();
  }

  /**
   * Analiza las tendencias
   */
  private analyzeTrends(): void {
    combineLatest([
      this.performanceService.getMetrics(),
      this.behaviorAnalyticsService.getMetrics(),
      this.predictiveAnalyticsService.getPredictions(),
      this.uxAnalyticsService.getAnalytics(),
      this.contentService.getOptimization()
    ]).pipe(
      tap(([performanceMetrics, behaviorMetrics, predictions, uxAnalytics, contentOptimization]) => {
        const insights = this.detectInsights(performanceMetrics, behaviorMetrics, predictions, uxAnalytics, contentOptimization);
        const recommendations = this.generateRecommendations(insights);
        const status = this.calculateStatus(performanceMetrics, behaviorMetrics);

        this.analysis.next({
          timestamp: Date.now(),
          status,
          metrics: {
            userTrends: this.calculateUserTrends(behaviorMetrics),
            contentTrends: this.calculateContentTrends(contentOptimization),
            performanceTrends: this.calculatePerformanceTrends(performanceMetrics),
            engagementTrends: this.calculateEngagementTrends(behaviorMetrics),
            marketTrends: this.calculateMarketTrends(predictions)
          },
          insights,
          recommendations
        });

        this.updateMetrics();
      })
    ).subscribe();
  }

  /**
   * Detecta insights de tendencias
   */
  private detectInsights(
    performanceMetrics: any,
    behaviorMetrics: any,
    predictions: any,
    uxAnalytics: any,
    contentOptimization: any
  ): TrendAnalysis['insights'] {
    const insights: TrendAnalysis['insights'] = [];

    // Insights de usuario
    if (behaviorMetrics.userGrowth < this.TREND_THRESHOLDS.userTrends.warning) {
      insights.push({
        type: 'user',
        priority: this.calculatePriority(behaviorMetrics.userGrowth, 'userTrends'),
        description: 'Crecimiento de usuarios en declive',
        impact: 'Reducción de base de usuarios',
        confidence: 0.8
      });
    }

    // Insights de contenido
    if (contentOptimization.metrics.engagement < this.TREND_THRESHOLDS.contentTrends.warning) {
      insights.push({
        type: 'content',
        priority: this.calculatePriority(contentOptimization.metrics.engagement, 'contentTrends'),
        description: 'Engagement con el contenido en declive',
        impact: 'Reducción de satisfacción',
        confidence: 0.7
      });
    }

    // Insights de rendimiento
    if (performanceMetrics.performanceTrend < this.TREND_THRESHOLDS.performanceTrends.warning) {
      insights.push({
        type: 'performance',
        priority: this.calculatePriority(performanceMetrics.performanceTrend, 'performanceTrends'),
        description: 'Rendimiento en declive',
        impact: 'Reducción de experiencia',
        confidence: 0.6
      });
    }

    // Insights de engagement
    if (behaviorMetrics.engagementTrend < this.TREND_THRESHOLDS.engagementTrends.warning) {
      insights.push({
        type: 'engagement',
        priority: this.calculatePriority(behaviorMetrics.engagementTrend, 'engagementTrends'),
        description: 'Engagement general en declive',
        impact: 'Reducción de interacción',
        confidence: 0.7
      });
    }

    // Insights de mercado
    if (predictions.marketTrend < this.TREND_THRESHOLDS.marketTrends.warning) {
      insights.push({
        type: 'market',
        priority: this.calculatePriority(predictions.marketTrend, 'marketTrends'),
        description: 'Tendencias de mercado negativas',
        impact: 'Reducción de oportunidades',
        confidence: predictions.confidence
      });
    }

    return insights;
  }

  /**
   * Calcula la prioridad de un insight
   */
  private calculatePriority(value: number, metric: keyof typeof this.TREND_THRESHOLDS): TrendAnalysis['insights'][0]['priority'] {
    const thresholds = this.TREND_THRESHOLDS[metric];

    if (value < thresholds.critical) return 'critical';
    if (value < thresholds.warning) return 'high';
    return 'medium';
  }

  /**
   * Genera recomendaciones de tendencias
   */
  private generateRecommendations(insights: TrendAnalysis['insights']): TrendAnalysis['recommendations'] {
    const recommendations: TrendAnalysis['recommendations'] = [];

    for (const insight of insights) {
      if (insight.priority === 'critical') {
        recommendations.push({
          priority: 'critical',
          action: this.getCriticalAction(insight.type),
          impact: 'Alta mejora de tendencias',
          confidence: insight.confidence
        });
      } else if (insight.priority === 'high') {
        recommendations.push({
          priority: 'high',
          action: this.getHighPriorityAction(insight.type),
          impact: 'Media mejora de tendencias',
          confidence: insight.confidence
        });
      }
    }

    return recommendations;
  }

  /**
   * Obtiene una acción crítica para un tipo de insight
   */
  private getCriticalAction(type: TrendAnalysis['insights'][0]['type']): string {
    const actions: Record<TrendAnalysis['insights'][0]['type'], string> = {
      user: 'Implementar estrategias urgentes de crecimiento de usuarios',
      content: 'Mejorar urgentemente la calidad del contenido',
      performance: 'Optimizar urgentemente el rendimiento',
      engagement: 'Implementar estrategias urgentes de engagement',
      market: 'Adaptar urgentemente la estrategia de mercado'
    };

    return actions[type];
  }

  /**
   * Obtiene una acción de alta prioridad para un tipo de insight
   */
  private getHighPriorityAction(type: TrendAnalysis['insights'][0]['type']): string {
    const actions: Record<TrendAnalysis['insights'][0]['type'], string> = {
      user: 'Implementar estrategias de crecimiento de usuarios',
      content: 'Mejorar la calidad del contenido',
      performance: 'Optimizar el rendimiento',
      engagement: 'Implementar estrategias de engagement',
      market: 'Adaptar la estrategia de mercado'
    };

    return actions[type];
  }

  /**
   * Calcula el estado general de las tendencias
   */
  private calculateStatus(performanceMetrics: any, behaviorMetrics: any): TrendAnalysis['status'] {
    const userTrends = this.calculateUserTrends(behaviorMetrics);
    const contentTrends = this.calculateContentTrends({ metrics: { engagement: behaviorMetrics.contentEngagement } });
    const performanceTrends = this.calculatePerformanceTrends(performanceMetrics);

    if (userTrends < this.TREND_THRESHOLDS.userTrends.critical ||
        contentTrends < this.TREND_THRESHOLDS.contentTrends.critical ||
        performanceTrends < this.TREND_THRESHOLDS.performanceTrends.critical) {
      return 'poor';
    }

    if (userTrends < this.TREND_THRESHOLDS.userTrends.warning ||
        contentTrends < this.TREND_THRESHOLDS.contentTrends.warning ||
        performanceTrends < this.TREND_THRESHOLDS.performanceTrends.warning) {
      return 'fair';
    }

    if (userTrends > 0.8 && contentTrends > 0.8 && performanceTrends > 0.8) {
      return 'excellent';
    }

    return 'good';
  }

  /**
   * Calcula las tendencias de usuario
   */
  private calculateUserTrends(behaviorMetrics: any): number {
    const userGrowth = behaviorMetrics.userGrowth;
    const userRetention = behaviorMetrics.userRetention;
    const userSatisfaction = behaviorMetrics.userSatisfaction;

    return (userGrowth + userRetention + userSatisfaction) / 3;
  }

  /**
   * Calcula las tendencias de contenido
   */
  private calculateContentTrends(contentOptimization: any): number {
    const engagement = contentOptimization.metrics.engagement;
    const relevance = contentOptimization.metrics.relevance;
    const performance = contentOptimization.metrics.performance;

    return (engagement + relevance + performance) / 3;
  }

  /**
   * Calcula las tendencias de rendimiento
   */
  private calculatePerformanceTrends(performanceMetrics: any): number {
    const performanceTrend = performanceMetrics.performanceTrend;
    const stability = performanceMetrics.stability;
    const efficiency = performanceMetrics.efficiency;

    return (performanceTrend + stability + efficiency) / 3;
  }

  /**
   * Calcula las tendencias de engagement
   */
  private calculateEngagementTrends(behaviorMetrics: any): number {
    const engagementTrend = behaviorMetrics.engagementTrend;
    const interactionRate = behaviorMetrics.interactionRate;
    const returnRate = behaviorMetrics.returnRate;

    return (engagementTrend + interactionRate + returnRate) / 3;
  }

  /**
   * Calcula las tendencias de mercado
   */
  private calculateMarketTrends(predictions: any): number {
    const marketTrend = predictions.marketTrend;
    const competition = predictions.competition;
    const opportunities = predictions.opportunities;

    return (marketTrend + competition + opportunities) / 3;
  }

  /**
   * Actualiza las métricas
   */
  private updateMetrics(): void {
    const currentMetrics = this.metrics.value;
    const analysis = this.analysis.value;

    this.metrics.next({
      totalTrends: currentMetrics.totalTrends + 1,
      activeTrends: currentMetrics.activeTrends + (analysis.status === 'excellent' ? 1 : 0),
      trendPerformance: analysis.metrics.userTrends,
      lastAnalysis: Date.now(),
      trendSegments: {
        growing: Math.round(analysis.metrics.userTrends * 100),
        stable: Math.round((1 - analysis.metrics.userTrends) * 50),
        declining: Math.round((1 - analysis.metrics.userTrends) * 50)
      },
      trendMetrics: {
        averageGrowth: 0.15,
        volatility: 0.1,
        predictionAccuracy: 0.85,
        trendTypes: {
          user: 0.3,
          content: 0.25,
          performance: 0.2,
          engagement: 0.15,
          market: 0.1
        }
      }
    });
  }

  /**
   * Obtiene el análisis actual
   */
  getAnalysis(): Observable<TrendAnalysis> {
    return this.analysis.asObservable();
  }

  /**
   * Obtiene las métricas de tendencias
   */
  getMetrics(): Observable<TrendMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de tendencias
   */
  generateReport(): {
    analysis: TrendAnalysis;
    metrics: TrendMetrics;
    summary: {
      status: TrendAnalysis['status'];
      activeInsights: number;
      criticalRecommendations: number;
      trendPerformance: number;
    };
  } {
    const analysis = this.analysis.value;
    const metrics = this.metrics.value;

    return {
      analysis,
      metrics,
      summary: {
        status: analysis.status,
        activeInsights: analysis.insights.filter(i => i.priority === 'critical' || i.priority === 'high').length,
        criticalRecommendations: analysis.recommendations.filter(r => r.priority === 'critical').length,
        trendPerformance: metrics.trendPerformance
      }
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.analysis.next({
      timestamp: Date.now(),
      status: 'excellent',
      metrics: {
        userTrends: 0,
        contentTrends: 0,
        performanceTrends: 0,
        engagementTrends: 0,
        marketTrends: 0
      },
      insights: [],
      recommendations: []
    });
    this.metrics.next({
      totalTrends: 0,
      activeTrends: 0,
      trendPerformance: 0,
      lastAnalysis: Date.now(),
      trendSegments: {
        growing: 0,
        stable: 0,
        declining: 0
      },
      trendMetrics: {
        averageGrowth: 0,
        volatility: 0,
        predictionAccuracy: 0,
        trendTypes: {}
      }
    });
  }
}
