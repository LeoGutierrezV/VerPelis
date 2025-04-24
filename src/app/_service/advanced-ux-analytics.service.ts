import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService } from './performance.service';
import { BehaviorAnalyticsService } from './behavior-analytics.service';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface UXAnalytics {
  timestamp: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    satisfaction: number;
    engagement: number;
    usability: number;
    accessibility: number;
    performance: number;
  };
  insights: {
    type: 'user' | 'interface' | 'content' | 'technical';
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

interface UXMetrics {
  totalUsers: number;
  activeUsers: number;
  userSatisfaction: number;
  lastAnalysis: number;
  userSegments: {
    satisfied: number;
    neutral: number;
    dissatisfied: number;
  };
  engagementMetrics: {
    averageSessionTime: number;
    bounceRate: number;
    returnRate: number;
    featureUsage: Record<string, number>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedUXAnalyticsService {
  private analytics = new BehaviorSubject<UXAnalytics>({
    timestamp: Date.now(),
    status: 'excellent',
    metrics: {
      satisfaction: 0,
      engagement: 0,
      usability: 0,
      accessibility: 0,
      performance: 0
    },
    insights: [],
    recommendations: []
  });

  private metrics = new BehaviorSubject<UXMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    userSatisfaction: 0,
    lastAnalysis: Date.now(),
    userSegments: {
      satisfied: 0,
      neutral: 0,
      dissatisfied: 0
    },
    engagementMetrics: {
      averageSessionTime: 0,
      bounceRate: 0,
      returnRate: 0,
      featureUsage: {}
    }
  });

  private readonly UX_THRESHOLDS = {
    satisfaction: { warning: 0.7, critical: 0.5 },
    engagement: { warning: 0.6, critical: 0.4 },
    usability: { warning: 0.8, critical: 0.6 },
    accessibility: { warning: 0.8, critical: 0.6 },
    performance: { warning: 0.7, critical: 0.5 }
  };

  constructor(
    private performanceService: PerformanceService,
    private behaviorAnalyticsService: BehaviorAnalyticsService,
    private predictiveAnalyticsService: PredictiveAnalyticsService
  ) {
    this.startUXMonitoring();
  }

  /**
   * Inicia el monitoreo de UX
   */
  private startUXMonitoring(): void {
    // Análisis de UX
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.analyzeUX())
    ).subscribe();

    // Actualización de métricas
    interval(15 * 60 * 1000).pipe( // Cada 15 minutos
      tap(() => this.updateMetrics())
    ).subscribe();
  }

  /**
   * Analiza la experiencia de usuario
   */
  private analyzeUX(): void {
    combineLatest([
      this.performanceService.getMetrics(),
      this.behaviorAnalyticsService.getMetrics(),
      this.predictiveAnalyticsService.getPredictions()
    ]).pipe(
      tap(([performanceMetrics, behaviorMetrics, predictions]) => {
        const insights = this.detectInsights(performanceMetrics, behaviorMetrics, predictions);
        const recommendations = this.generateRecommendations(insights);
        const status = this.calculateStatus(performanceMetrics, behaviorMetrics);

        this.analytics.next({
          timestamp: Date.now(),
          status,
          metrics: {
            satisfaction: this.calculateSatisfaction(behaviorMetrics),
            engagement: this.calculateEngagement(behaviorMetrics),
            usability: this.calculateUsability(performanceMetrics),
            accessibility: this.calculateAccessibility(performanceMetrics),
            performance: this.calculatePerformance(performanceMetrics)
          },
          insights,
          recommendations
        });

        this.updateMetrics();
      })
    ).subscribe();
  }

  /**
   * Detecta insights de UX
   */
  private detectInsights(
    performanceMetrics: any,
    behaviorMetrics: any,
    predictions: any
  ): UXAnalytics['insights'] {
    const insights: UXAnalytics['insights'] = [];

    // Insights de usuario
    if (behaviorMetrics.highRiskUsers > 0) {
      insights.push({
        type: 'user',
        priority: this.calculatePriority(behaviorMetrics.highRiskUsers / behaviorMetrics.totalUsers, 'satisfaction'),
        description: 'Usuarios con experiencia deficiente detectados',
        impact: 'Alta reducción de satisfacción',
        confidence: 0.8
      });
    }

    // Insights de interfaz
    if (performanceMetrics.fps < this.UX_THRESHOLDS.performance.warning) {
      insights.push({
        type: 'interface',
        priority: this.calculatePriority(performanceMetrics.fps / 60, 'performance'),
        description: 'Problemas de rendimiento afectando la interfaz',
        impact: 'Reducción de usabilidad',
        confidence: 0.7
      });
    }

    // Insights de contenido
    if (behaviorMetrics.patternsDetected > 10) {
      insights.push({
        type: 'content',
        priority: this.calculatePriority(behaviorMetrics.patternsDetected / 20, 'engagement'),
        description: 'Patrones de comportamiento indicando problemas con el contenido',
        impact: 'Reducción de engagement',
        confidence: 0.6
      });
    }

    // Insights técnicos
    if (predictions.predictedErrorRate > 5) {
      insights.push({
        type: 'technical',
        priority: this.calculatePriority(predictions.predictedErrorRate / 10, 'usability'),
        description: 'Predicción de problemas técnicos',
        impact: 'Reducción de confiabilidad',
        confidence: predictions.confidence
      });
    }

    return insights;
  }

  /**
   * Calcula la prioridad de un insight
   */
  private calculatePriority(value: number, metric: keyof typeof this.UX_THRESHOLDS): UXAnalytics['insights'][0]['priority'] {
    const thresholds = this.UX_THRESHOLDS[metric];

    if (value < thresholds.critical) return 'critical';
    if (value < thresholds.warning) return 'high';
    return 'medium';
  }

  /**
   * Genera recomendaciones de UX
   */
  private generateRecommendations(insights: UXAnalytics['insights']): UXAnalytics['recommendations'] {
    const recommendations: UXAnalytics['recommendations'] = [];

    for (const insight of insights) {
      if (insight.priority === 'critical') {
        recommendations.push({
          priority: 'critical',
          action: this.getCriticalAction(insight.type),
          impact: 'Alta mejora de UX',
          confidence: insight.confidence
        });
      } else if (insight.priority === 'high') {
        recommendations.push({
          priority: 'high',
          action: this.getHighPriorityAction(insight.type),
          impact: 'Media mejora de UX',
          confidence: insight.confidence
        });
      }
    }

    return recommendations;
  }

  /**
   * Obtiene una acción crítica para un tipo de insight
   */
  private getCriticalAction(type: UXAnalytics['insights'][0]['type']): string {
    const actions: Record<UXAnalytics['insights'][0]['type'], string> = {
      user: 'Implementar mejoras urgentes en la experiencia de usuario',
      interface: 'Optimizar urgentemente el rendimiento de la interfaz',
      content: 'Revisar y mejorar el contenido crítico',
      technical: 'Resolver problemas técnicos críticos'
    };

    return actions[type];
  }

  /**
   * Obtiene una acción de alta prioridad para un tipo de insight
   */
  private getHighPriorityAction(type: UXAnalytics['insights'][0]['type']): string {
    const actions: Record<UXAnalytics['insights'][0]['type'], string> = {
      user: 'Mejorar la experiencia de usuario',
      interface: 'Optimizar el rendimiento de la interfaz',
      content: 'Mejorar el contenido',
      technical: 'Resolver problemas técnicos'
    };

    return actions[type];
  }

  /**
   * Calcula el estado general de UX
   */
  private calculateStatus(performanceMetrics: any, behaviorMetrics: any): UXAnalytics['status'] {
    const satisfaction = this.calculateSatisfaction(behaviorMetrics);
    const engagement = this.calculateEngagement(behaviorMetrics);
    const usability = this.calculateUsability(performanceMetrics);

    if (satisfaction < this.UX_THRESHOLDS.satisfaction.critical ||
        engagement < this.UX_THRESHOLDS.engagement.critical ||
        usability < this.UX_THRESHOLDS.usability.critical) {
      return 'poor';
    }

    if (satisfaction < this.UX_THRESHOLDS.satisfaction.warning ||
        engagement < this.UX_THRESHOLDS.engagement.warning ||
        usability < this.UX_THRESHOLDS.usability.warning) {
      return 'fair';
    }

    if (satisfaction > 0.8 && engagement > 0.8 && usability > 0.8) {
      return 'excellent';
    }

    return 'good';
  }

  /**
   * Calcula la satisfacción del usuario
   */
  private calculateSatisfaction(behaviorMetrics: any): number {
    const riskUsers = behaviorMetrics.highRiskUsers;
    const totalUsers = behaviorMetrics.totalUsers;
    return Math.max(0, 1 - (riskUsers / totalUsers));
  }

  /**
   * Calcula el engagement
   */
  private calculateEngagement(behaviorMetrics: any): number {
    const patterns = behaviorMetrics.patternsDetected;
    const totalUsers = behaviorMetrics.totalUsers;
    return Math.max(0, 1 - (patterns / (totalUsers * 2)));
  }

  /**
   * Calcula la usabilidad
   */
  private calculateUsability(performanceMetrics: any): number {
    const fps = performanceMetrics.fps;
    const loadTime = performanceMetrics.loadTime;
    const responseTime = performanceMetrics.responseTime;

    const fpsScore = Math.min(1, fps / 60);
    const loadTimeScore = Math.max(0, 1 - (loadTime / 3000));
    const responseTimeScore = Math.max(0, 1 - (responseTime / 1000));

    return (fpsScore + loadTimeScore + responseTimeScore) / 3;
  }

  /**
   * Calcula la accesibilidad
   */
  private calculateAccessibility(performanceMetrics: any): number {
    // Implementar cálculo de accesibilidad
    return 0.9;
  }

  /**
   * Calcula el rendimiento
   */
  private calculatePerformance(performanceMetrics: any): number {
    const fps = performanceMetrics.fps;
    const memoryUsage = performanceMetrics.memoryUsage;
    const loadTime = performanceMetrics.loadTime;

    const fpsScore = Math.min(1, fps / 60);
    const memoryScore = Math.max(0, 1 - (memoryUsage / 100));
    const loadTimeScore = Math.max(0, 1 - (loadTime / 3000));

    return (fpsScore + memoryScore + loadTimeScore) / 3;
  }

  /**
   * Actualiza las métricas
   */
  private updateMetrics(): void {
    const currentMetrics = this.metrics.value;
    const analytics = this.analytics.value;

    this.metrics.next({
      totalUsers: currentMetrics.totalUsers + 1,
      activeUsers: currentMetrics.activeUsers + 1,
      userSatisfaction: analytics.metrics.satisfaction,
      lastAnalysis: Date.now(),
      userSegments: {
        satisfied: Math.round(analytics.metrics.satisfaction * 100),
        neutral: Math.round((1 - analytics.metrics.satisfaction) * 50),
        dissatisfied: Math.round((1 - analytics.metrics.satisfaction) * 50)
      },
      engagementMetrics: {
        averageSessionTime: 300, // 5 minutos
        bounceRate: 0.2,
        returnRate: 0.8,
        featureUsage: {
          search: 0.7,
          favorites: 0.5,
          recommendations: 0.6
        }
      }
    });
  }

  /**
   * Obtiene los analytics actuales
   */
  getAnalytics(): Observable<UXAnalytics> {
    return this.analytics.asObservable();
  }

  /**
   * Obtiene las métricas de UX
   */
  getMetrics(): Observable<UXMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de UX
   */
  generateReport(): {
    analytics: UXAnalytics;
    metrics: UXMetrics;
    summary: {
      status: UXAnalytics['status'];
      activeInsights: number;
      criticalRecommendations: number;
      userSatisfaction: number;
    };
  } {
    const analytics = this.analytics.value;
    const metrics = this.metrics.value;

    return {
      analytics,
      metrics,
      summary: {
        status: analytics.status,
        activeInsights: analytics.insights.filter(i => i.priority === 'critical' || i.priority === 'high').length,
        criticalRecommendations: analytics.recommendations.filter(r => r.priority === 'critical').length,
        userSatisfaction: metrics.userSatisfaction
      }
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.analytics.next({
      timestamp: Date.now(),
      status: 'excellent',
      metrics: {
        satisfaction: 0,
        engagement: 0,
        usability: 0,
        accessibility: 0,
        performance: 0
      },
      insights: [],
      recommendations: []
    });
    this.metrics.next({
      totalUsers: 0,
      activeUsers: 0,
      userSatisfaction: 0,
      lastAnalysis: Date.now(),
      userSegments: {
        satisfied: 0,
        neutral: 0,
        dissatisfied: 0
      },
      engagementMetrics: {
        averageSessionTime: 0,
        bounceRate: 0,
        returnRate: 0,
        featureUsage: {}
      }
    });
  }
}
