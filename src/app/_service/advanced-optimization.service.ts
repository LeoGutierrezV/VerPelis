import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService } from './performance.service';
import { BehaviorAnalyticsService } from './behavior-analytics.service';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { AdvancedUXAnalyticsService } from './advanced-ux-analytics.service';
import { IntelligentContentService } from './intelligent-content.service';
import { TrendAnalysisService } from './trend-analysis.service';
import { SecurityService } from './security.service';
import { AuditService } from './audit.service';
import { AIIntelligenceService } from './ai-intelligence.service';
import { AutomationService } from './automation.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface OptimizationTask {
  id: string;
  timestamp: number;
  type: 'performance' | 'security' | 'user' | 'content' | 'market' | 'system' | 'ai';
  category: 'optimization' | 'maintenance' | 'monitoring' | 'recovery' | 'learning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  data: {
    metrics: Record<string, number>;
    patterns: string[];
    correlations: Record<string, number>;
    predictions: Record<string, any>;
    recommendations: {
      type: 'automatic' | 'manual' | 'suggested';
      description: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      impact: string;
      confidence: number;
    }[];
  };
  actions: {
    type: 'automatic' | 'manual' | 'suggested';
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    result?: {
      success: boolean;
      message: string;
      timestamp: number;
      metrics: Record<string, number>;
    };
  }[];
}

interface OptimizationMetrics {
  totalTasks: number;
  activeTasks: number;
  successRate: number;
  efficiency: number;
  lastExecution: number;
  optimizationPerformance: {
    processingTime: number;
    accuracy: number;
    efficiency: number;
    reliability: number;
    learningRate: number;
  };
  taskDistribution: {
    performance: number;
    security: number;
    user: number;
    content: number;
    market: number;
    system: number;
    ai: number;
  };
  actionSuccess: {
    automatic: number;
    manual: number;
    suggested: number;
  };
  optimizationImpact: {
    performance: number;
    security: number;
    user: number;
    content: number;
    market: number;
    system: number;
    ai: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedOptimizationService {
  private tasks = new BehaviorSubject<OptimizationTask[]>([]);
  private metrics = new BehaviorSubject<OptimizationMetrics>({
    totalTasks: 0,
    activeTasks: 0,
    successRate: 0,
    efficiency: 0,
    lastExecution: Date.now(),
    optimizationPerformance: {
      processingTime: 0,
      accuracy: 0,
      efficiency: 0,
      reliability: 0,
      learningRate: 0
    },
    taskDistribution: {
      performance: 0,
      security: 0,
      user: 0,
      content: 0,
      market: 0,
      system: 0,
      ai: 0
    },
    actionSuccess: {
      automatic: 0,
      manual: 0,
      suggested: 0
    },
    optimizationImpact: {
      performance: 0,
      security: 0,
      user: 0,
      content: 0,
      market: 0,
      system: 0,
      ai: 0
    }
  });

  private readonly OPTIMIZATION_THRESHOLDS = {
    successRate: { warning: 0.7, critical: 0.5 },
    efficiency: { warning: 0.6, critical: 0.4 },
    processingTime: { warning: 1000, critical: 2000 },
    reliability: { warning: 0.8, critical: 0.6 },
    learningRate: { warning: 0.5, critical: 0.3 }
  };

  constructor(
    private performanceService: PerformanceService,
    private behaviorAnalyticsService: BehaviorAnalyticsService,
    private predictiveAnalyticsService: PredictiveAnalyticsService,
    private uxAnalyticsService: AdvancedUXAnalyticsService,
    private contentService: IntelligentContentService,
    private trendAnalysisService: TrendAnalysisService,
    private securityService: SecurityService,
    private auditService: AuditService,
    private aiIntelligenceService: AIIntelligenceService,
    private automationService: AutomationService
  ) {
    this.startOptimizationMonitoring();
  }

  /**
   * Inicia el monitoreo de optimización
   */
  private startOptimizationMonitoring(): void {
    // Monitoreo de optimización
    interval(1 * 60 * 1000).pipe( // Cada minuto
      tap(() => this.monitorOptimization())
    ).subscribe();

    // Optimización de rendimiento
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.optimizePerformance())
    ).subscribe();

    // Aprendizaje y adaptación
    interval(15 * 60 * 1000).pipe( // Cada 15 minutos
      tap(() => this.learnAndAdapt())
    ).subscribe();
  }

  /**
   * Monitorea la optimización
   */
  private monitorOptimization(): void {
    const startTime = Date.now();

    combineLatest([
      this.performanceService.getMetrics(),
      this.behaviorAnalyticsService.getMetrics(),
      this.predictiveAnalyticsService.getPredictions(),
      this.uxAnalyticsService.getAnalytics(),
      this.contentService.getOptimization(),
      this.trendAnalysisService.getAnalysis(),
      this.securityService.getMetrics(),
      this.auditService.getMetrics(),
      this.aiIntelligenceService.getInsights(),
      this.automationService.getMetrics()
    ]).pipe(
      tap(([performanceMetrics, behaviorMetrics, predictions, uxAnalytics, contentOptimization, trendAnalysis, securityMetrics, auditMetrics, aiInsights, automationMetrics]) => {
        const tasks = this.generateTasks(
          performanceMetrics,
          behaviorMetrics,
          predictions,
          uxAnalytics,
          contentOptimization,
          trendAnalysis,
          securityMetrics,
          auditMetrics,
          aiInsights,
          automationMetrics
        );

        const processingTime = Date.now() - startTime;
        this.updateMetrics(tasks, processingTime);
        this.tasks.next(tasks);
      })
    ).subscribe();
  }

  /**
   * Genera tareas de optimización
   */
  private generateTasks(
    performanceMetrics: any,
    behaviorMetrics: any,
    predictions: any,
    uxAnalytics: any,
    contentOptimization: any,
    trendAnalysis: any,
    securityMetrics: any,
    auditMetrics: any,
    aiInsights: any,
    automationMetrics: any
  ): OptimizationTask[] {
    const tasks: OptimizationTask[] = [];

    // Tareas de rendimiento
    if (performanceMetrics.performanceTrend < this.OPTIMIZATION_THRESHOLDS.efficiency.warning) {
      tasks.push(this.createPerformanceTask(performanceMetrics));
    }

    // Tareas de seguridad
    if (securityMetrics.threatLevel > 0.7) {
      tasks.push(this.createSecurityTask(securityMetrics));
    }

    // Tareas de usuario
    if (behaviorMetrics.riskScore > 0.6) {
      tasks.push(this.createUserTask(behaviorMetrics));
    }

    // Tareas de contenido
    if (contentOptimization.metrics.engagement < this.OPTIMIZATION_THRESHOLDS.efficiency.warning) {
      tasks.push(this.createContentTask(contentOptimization));
    }

    // Tareas de mercado
    if (predictions.marketTrend < this.OPTIMIZATION_THRESHOLDS.successRate.warning) {
      tasks.push(this.createMarketTask(predictions));
    }

    // Tareas de sistema
    if (auditMetrics.errorRate > 0.1) {
      tasks.push(this.createSystemTask(auditMetrics));
    }

    // Tareas de IA
    if (aiInsights.confidence < this.OPTIMIZATION_THRESHOLDS.learningRate.warning) {
      tasks.push(this.createAITask(aiInsights));
    }

    return tasks;
  }

  /**
   * Crea una tarea de rendimiento
   */
  private createPerformanceTask(metrics: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'performance',
      category: 'optimization',
      priority: this.calculatePriority(metrics.performanceTrend, 'efficiency'),
      status: 'pending',
      title: 'Optimización Avanzada de Rendimiento',
      description: 'Se detectó una tendencia de rendimiento en declive',
      impact: 'Reducción de experiencia de usuario',
      confidence: 0.8,
      data: {
        metrics: {
          performanceTrend: metrics.performanceTrend,
          stability: metrics.stability,
          efficiency: metrics.efficiency
        },
        patterns: ['rendimiento_declive', 'alta_latencia'],
        correlations: {
          usuarios: 0.7,
          recursos: 0.6
        },
        predictions: {
          tendencia: 'negativa',
          impacto: 'alto'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Optimizar recursos del sistema',
            priority: 'high',
            impact: 'Mejora inmediata del rendimiento',
            confidence: 0.8
          },
          {
            type: 'automatic',
            description: 'Ajustar configuración de caché',
            priority: 'medium',
            impact: 'Mejora a largo plazo',
            confidence: 0.6
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Optimizar recursos del sistema',
          priority: 'high',
          impact: 'Mejora inmediata del rendimiento',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Ajustar configuración de caché',
          priority: 'medium',
          impact: 'Mejora a largo plazo',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Crea una tarea de seguridad
   */
  private createSecurityTask(metrics: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'security',
      category: 'monitoring',
      priority: 'critical',
      status: 'pending',
      title: 'Optimización Avanzada de Seguridad',
      description: 'Se detectó un nivel de amenaza elevado',
      impact: 'Riesgo de seguridad',
      confidence: 0.9,
      data: {
        metrics: {
          threatLevel: metrics.threatLevel,
          blockedIPs: metrics.blockedIPs,
          failedAttempts: metrics.failedAttempts
        },
        patterns: ['ataque_detectado', 'intentos_fallidos'],
        correlations: {
          ips: 0.8,
          usuarios: 0.6
        },
        predictions: {
          tendencia: 'creciente',
          riesgo: 'alto'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Bloquear IPs maliciosas',
            priority: 'critical',
            impact: 'Protección inmediata',
            confidence: 0.9
          },
          {
            type: 'automatic',
            description: 'Aumentar nivel de seguridad',
            priority: 'high',
            impact: 'Mejora de protección',
            confidence: 0.7
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Bloquear IPs maliciosas',
          priority: 'critical',
          impact: 'Protección inmediata',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Aumentar nivel de seguridad',
          priority: 'high',
          impact: 'Mejora de protección',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Crea una tarea de usuario
   */
  private createUserTask(metrics: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'user',
      category: 'monitoring',
      priority: this.calculatePriority(metrics.riskScore, 'successRate'),
      status: 'pending',
      title: 'Optimización Avanzada de Usuario',
      description: 'Se detectó un comportamiento de usuario de alto riesgo',
      impact: 'Riesgo de seguridad y experiencia',
      confidence: 0.7,
      data: {
        metrics: {
          riskScore: metrics.riskScore,
          actions: metrics.actions,
          patterns: metrics.patterns
        },
        patterns: ['comportamiento_sospechoso', 'acciones_rapidas'],
        correlations: {
          seguridad: 0.7,
          experiencia: 0.5
        },
        predictions: {
          tendencia: 'negativa',
          riesgo: 'medio'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Aumentar monitoreo de usuario',
            priority: 'high',
            impact: 'Mejora de seguridad',
            confidence: 0.7
          },
          {
            type: 'automatic',
            description: 'Ajustar políticas de usuario',
            priority: 'medium',
            impact: 'Mejora a largo plazo',
            confidence: 0.5
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Aumentar monitoreo de usuario',
          priority: 'high',
          impact: 'Mejora de seguridad',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Ajustar políticas de usuario',
          priority: 'medium',
          impact: 'Mejora a largo plazo',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Crea una tarea de contenido
   */
  private createContentTask(optimization: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'content',
      category: 'optimization',
      priority: this.calculatePriority(optimization.metrics.engagement, 'efficiency'),
      status: 'pending',
      title: 'Optimización Avanzada de Contenido',
      description: 'Se detectó un engagement bajo con el contenido',
      impact: 'Reducción de satisfacción de usuario',
      confidence: 0.6,
      data: {
        metrics: {
          engagement: optimization.metrics.engagement,
          relevance: optimization.metrics.relevance,
          performance: optimization.metrics.performance
        },
        patterns: ['bajo_engagement', 'contenido_no_relevante'],
        correlations: {
          usuarios: 0.6,
          satisfaccion: 0.5
        },
        predictions: {
          tendencia: 'negativa',
          impacto: 'medio'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Optimizar relevancia de contenido',
            priority: 'high',
            impact: 'Mejora de engagement',
            confidence: 0.6
          },
          {
            type: 'automatic',
            description: 'Mejorar calidad de contenido',
            priority: 'medium',
            impact: 'Mejora a largo plazo',
            confidence: 0.4
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Optimizar relevancia de contenido',
          priority: 'high',
          impact: 'Mejora de engagement',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Mejorar calidad de contenido',
          priority: 'medium',
          impact: 'Mejora a largo plazo',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Crea una tarea de mercado
   */
  private createMarketTask(predictions: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'market',
      category: 'monitoring',
      priority: this.calculatePriority(predictions.marketTrend, 'successRate'),
      status: 'pending',
      title: 'Optimización Avanzada de Mercado',
      description: 'Se detectó una tendencia de mercado negativa',
      impact: 'Reducción de oportunidades',
      confidence: predictions.confidence,
      data: {
        metrics: {
          marketTrend: predictions.marketTrend,
          competition: predictions.competition,
          opportunities: predictions.opportunities
        },
        patterns: ['tendencia_negativa', 'alta_competencia'],
        correlations: {
          mercado: 0.7,
          competencia: 0.6
        },
        predictions: {
          tendencia: 'negativa',
          impacto: 'alto'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Adaptar estrategia de mercado',
            priority: 'high',
            impact: 'Mejora de posicionamiento',
            confidence: 0.7
          },
          {
            type: 'automatic',
            description: 'Analizar competencia',
            priority: 'medium',
            impact: 'Mejora de competitividad',
            confidence: 0.5
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Adaptar estrategia de mercado',
          priority: 'high',
          impact: 'Mejora de posicionamiento',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Analizar competencia',
          priority: 'medium',
          impact: 'Mejora de competitividad',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Crea una tarea de sistema
   */
  private createSystemTask(metrics: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'system',
      category: 'recovery',
      priority: this.calculatePriority(metrics.errorRate, 'efficiency'),
      status: 'pending',
      title: 'Optimización Avanzada del Sistema',
      description: 'Se detectó una tasa de errores elevada',
      impact: 'Reducción de estabilidad',
      confidence: 0.8,
      data: {
        metrics: {
          errorRate: metrics.errorRate,
          stability: metrics.stability,
          performance: metrics.performance
        },
        patterns: ['alta_tasa_errores', 'inestabilidad'],
        correlations: {
          rendimiento: 0.7,
          estabilidad: 0.6
        },
        predictions: {
          tendencia: 'negativa',
          impacto: 'alto'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Optimizar manejo de errores',
            priority: 'high',
            impact: 'Mejora de estabilidad',
            confidence: 0.8
          },
          {
            type: 'automatic',
            description: 'Revisar logs de error',
            priority: 'medium',
            impact: 'Mejora a largo plazo',
            confidence: 0.6
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Optimizar manejo de errores',
          priority: 'high',
          impact: 'Mejora de estabilidad',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Revisar logs de error',
          priority: 'medium',
          impact: 'Mejora a largo plazo',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Crea una tarea de IA
   */
  private createAITask(insights: any): OptimizationTask {
    return {
      id: this.generateUniqueId(),
      timestamp: Date.now(),
      type: 'ai',
      category: 'learning',
      priority: this.calculatePriority(insights.confidence, 'learningRate'),
      status: 'pending',
      title: 'Optimización Avanzada de IA',
      description: 'Se detectó un nivel de confianza bajo en las predicciones de IA',
      impact: 'Reducción de precisión de predicciones',
      confidence: insights.confidence,
      data: {
        metrics: {
          confidence: insights.confidence,
          accuracy: insights.accuracy,
          learningRate: insights.learningRate
        },
        patterns: ['baja_confianza', 'predicciones_imprecisas'],
        correlations: {
          precision: 0.7,
          aprendizaje: 0.6
        },
        predictions: {
          tendencia: 'negativa',
          impacto: 'alto'
        },
        recommendations: [
          {
            type: 'automatic',
            description: 'Mejorar modelo de IA',
            priority: 'high',
            impact: 'Mejora de precisión',
            confidence: 0.7
          },
          {
            type: 'automatic',
            description: 'Ajustar parámetros de aprendizaje',
            priority: 'medium',
            impact: 'Mejora a largo plazo',
            confidence: 0.5
          }
        ]
      },
      actions: [
        {
          type: 'automatic',
          description: 'Mejorar modelo de IA',
          priority: 'high',
          impact: 'Mejora de precisión',
          status: 'pending'
        },
        {
          type: 'automatic',
          description: 'Ajustar parámetros de aprendizaje',
          priority: 'medium',
          impact: 'Mejora a largo plazo',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Calcula la prioridad de una tarea
   */
  private calculatePriority(value: number, metric: keyof typeof this.OPTIMIZATION_THRESHOLDS): OptimizationTask['priority'] {
    const thresholds = this.OPTIMIZATION_THRESHOLDS[metric];

    if (value < thresholds.critical) return 'critical';
    if (value < thresholds.warning) return 'high';
    return 'medium';
  }

  /**
   * Genera un ID único
   */
  private generateUniqueId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Optimiza el rendimiento
   */
  private optimizePerformance(): void {
    const currentMetrics = this.metrics.value;
    const tasks = this.tasks.value;

    // Optimizar rendimiento
    if (currentMetrics.optimizationPerformance.processingTime > this.OPTIMIZATION_THRESHOLDS.processingTime.warning) {
      this.optimizeProcessing();
    }

    // Optimizar precisión
    if (currentMetrics.optimizationPerformance.accuracy < this.OPTIMIZATION_THRESHOLDS.reliability.warning) {
      this.optimizeAccuracy();
    }

    // Optimizar eficiencia
    if (currentMetrics.optimizationPerformance.efficiency < this.OPTIMIZATION_THRESHOLDS.efficiency.warning) {
      this.optimizeEfficiency();
    }

    // Optimizar confiabilidad
    if (currentMetrics.optimizationPerformance.reliability < this.OPTIMIZATION_THRESHOLDS.reliability.warning) {
      this.optimizeReliability();
    }

    // Actualizar métricas
    this.updateMetrics(tasks, currentMetrics.optimizationPerformance.processingTime);
  }

  /**
   * Optimiza el procesamiento
   */
  private optimizeProcessing(): void {
    // Implementar optimizaciones de procesamiento
    console.log('Optimizando procesamiento de optimización...');
  }

  /**
   * Optimiza la precisión
   */
  private optimizeAccuracy(): void {
    // Implementar optimizaciones de precisión
    console.log('Optimizando precisión de optimización...');
  }

  /**
   * Optimiza la eficiencia
   */
  private optimizeEfficiency(): void {
    // Implementar optimizaciones de eficiencia
    console.log('Optimizando eficiencia de optimización...');
  }

  /**
   * Optimiza la confiabilidad
   */
  private optimizeReliability(): void {
    // Implementar optimizaciones de confiabilidad
    console.log('Optimizando confiabilidad de optimización...');
  }

  /**
   * Aprende y se adapta
   */
  private learnAndAdapt(): void {
    const currentMetrics = this.metrics.value;
    const tasks = this.tasks.value;

    // Aprender de tareas completadas
    const completedTasks = tasks.filter(t =>
      t.actions.every(a => a.status === 'completed')
    );

    // Adaptar basado en resultados
    const successfulTasks = completedTasks.filter(t =>
      t.actions.every(a => a.result?.success)
    );

    // Actualizar métricas
    this.updateMetrics(tasks, currentMetrics.optimizationPerformance.processingTime);
  }

  /**
   * Actualiza las métricas
   */
  private updateMetrics(tasks: OptimizationTask[], processingTime: number): void {
    const currentMetrics = this.metrics.value;
    const activeTasks = tasks.filter(t =>
      t.actions.some(a => a.status === 'pending')
    );

    const taskDistribution = this.calculateTaskDistribution(tasks);
    const actionSuccess = this.calculateActionSuccess(tasks);
    const optimizationImpact = this.calculateOptimizationImpact(tasks);

    this.metrics.next({
      totalTasks: currentMetrics.totalTasks + tasks.length,
      activeTasks: activeTasks.length,
      successRate: this.calculateSuccessRate(tasks),
      efficiency: this.calculateEfficiency(tasks),
      lastExecution: Date.now(),
      optimizationPerformance: {
        processingTime,
        accuracy: this.calculateAccuracy(tasks),
        efficiency: this.calculateEfficiency(tasks),
        reliability: this.calculateReliability(tasks),
        learningRate: this.calculateLearningRate(tasks)
      },
      taskDistribution,
      actionSuccess,
      optimizationImpact
    });
  }

  /**
   * Calcula la distribución de tareas
   */
  private calculateTaskDistribution(tasks: OptimizationTask[]): OptimizationMetrics['taskDistribution'] {
    const total = tasks.length;
    if (total === 0) {
      return {
        performance: 0,
        security: 0,
        user: 0,
        content: 0,
        market: 0,
        system: 0,
        ai: 0
      };
    }

    return {
      performance: tasks.filter(t => t.type === 'performance').length / total,
      security: tasks.filter(t => t.type === 'security').length / total,
      user: tasks.filter(t => t.type === 'user').length / total,
      content: tasks.filter(t => t.type === 'content').length / total,
      market: tasks.filter(t => t.type === 'market').length / total,
      system: tasks.filter(t => t.type === 'system').length / total,
      ai: tasks.filter(t => t.type === 'ai').length / total
    };
  }

  /**
   * Calcula el éxito de las acciones
   */
  private calculateActionSuccess(tasks: OptimizationTask[]): OptimizationMetrics['actionSuccess'] {
    const actions = tasks.flatMap(t => t.actions);
    const total = actions.length;
    if (total === 0) {
      return {
        automatic: 0,
        manual: 0,
        suggested: 0
      };
    }

    return {
      automatic: actions.filter(a => a.type === 'automatic' && a.status === 'completed').length / total,
      manual: actions.filter(a => a.type === 'manual' && a.status === 'completed').length / total,
      suggested: actions.filter(a => a.type === 'suggested' && a.status === 'completed').length / total
    };
  }

  /**
   * Calcula el impacto de la optimización
   */
  private calculateOptimizationImpact(tasks: OptimizationTask[]): OptimizationMetrics['optimizationImpact'] {
    const completedTasks = tasks.filter(t =>
      t.actions.every(a => a.status === 'completed' && a.result?.success)
    );

    const total = completedTasks.length;
    if (total === 0) {
      return {
        performance: 0,
        security: 0,
        user: 0,
        content: 0,
        market: 0,
        system: 0,
        ai: 0
      };
    }

    return {
      performance: completedTasks.filter(t => t.type === 'performance').length / total,
      security: completedTasks.filter(t => t.type === 'security').length / total,
      user: completedTasks.filter(t => t.type === 'user').length / total,
      content: completedTasks.filter(t => t.type === 'content').length / total,
      market: completedTasks.filter(t => t.type === 'market').length / total,
      system: completedTasks.filter(t => t.type === 'system').length / total,
      ai: completedTasks.filter(t => t.type === 'ai').length / total
    };
  }

  /**
   * Calcula la tasa de éxito
   */
  private calculateSuccessRate(tasks: OptimizationTask[]): number {
    const completedActions = tasks.flatMap(t => t.actions).filter(a => a.status === 'completed');
    if (completedActions.length === 0) return 0;

    const successfulActions = completedActions.filter(a => a.result?.success);
    return successfulActions.length / completedActions.length;
  }

  /**
   * Calcula la eficiencia
   */
  private calculateEfficiency(tasks: OptimizationTask[]): number {
    if (tasks.length === 0) return 0;
    const automaticActions = tasks.flatMap(t => t.actions).filter(a => a.type === 'automatic');
    return automaticActions.length / tasks.length;
  }

  /**
   * Calcula la precisión
   */
  private calculateAccuracy(tasks: OptimizationTask[]): number {
    if (tasks.length === 0) return 0;
    const totalConfidence = tasks.reduce((sum, t) => sum + t.confidence, 0);
    return totalConfidence / tasks.length;
  }

  /**
   * Calcula la confiabilidad
   */
  private calculateReliability(tasks: OptimizationTask[]): number {
    const completedActions = tasks.flatMap(t => t.actions).filter(a => a.status === 'completed');
    if (completedActions.length === 0) return 0;

    const reliableActions = completedActions.filter(a =>
      a.result?.success && a.type === 'automatic'
    );
    return reliableActions.length / completedActions.length;
  }

  /**
   * Calcula la tasa de aprendizaje
   */
  private calculateLearningRate(tasks: OptimizationTask[]): number {
    const aiTasks = tasks.filter(t => t.type === 'ai');
    if (aiTasks.length === 0) return 0;

    const successfulAITasks = aiTasks.filter(t =>
      t.actions.every(a => a.status === 'completed' && a.result?.success)
    );
    return successfulAITasks.length / aiTasks.length;
  }

  /**
   * Obtiene las tareas actuales
   */
  getTasks(): Observable<OptimizationTask[]> {
    return this.tasks.asObservable();
  }

  /**
   * Obtiene las métricas de optimización
   */
  getMetrics(): Observable<OptimizationMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de optimización
   */
  generateReport(): {
    tasks: OptimizationTask[];
    metrics: OptimizationMetrics;
    summary: {
      totalTasks: number;
      activeTasks: number;
      successRate: number;
      efficiency: number;
      optimizationPerformance: OptimizationMetrics['optimizationPerformance'];
    };
  } {
    const tasks = this.tasks.value;
    const metrics = this.metrics.value;

    return {
      tasks,
      metrics,
      summary: {
        totalTasks: metrics.totalTasks,
        activeTasks: metrics.activeTasks,
        successRate: metrics.successRate,
        efficiency: metrics.efficiency,
        optimizationPerformance: metrics.optimizationPerformance
      }
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.tasks.next([]);
    this.metrics.next({
      totalTasks: 0,
      activeTasks: 0,
      successRate: 0,
      efficiency: 0,
      lastExecution: Date.now(),
      optimizationPerformance: {
        processingTime: 0,
        accuracy: 0,
        efficiency: 0,
        reliability: 0,
        learningRate: 0
      },
      taskDistribution: {
        performance: 0,
        security: 0,
        user: 0,
        content: 0,
        market: 0,
        system: 0,
        ai: 0
      },
      actionSuccess: {
        automatic: 0,
        manual: 0,
        suggested: 0
      },
      optimizationImpact: {
        performance: 0,
        security: 0,
        user: 0,
        content: 0,
        market: 0,
        system: 0,
        ai: 0
      }
    });
  }
}
