import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface UserBehavior {
  userId: string;
  actions: {
    type: string;
    timestamp: number;
    details: any;
  }[];
  patterns: {
    type: string;
    confidence: number;
    details: any;
  }[];
  riskScore: number;
  lastUpdated: number;
}

interface BehaviorPattern {
  type: string;
  threshold: number;
  window: number;
  weight: number;
  description: string;
}

interface BehaviorMetrics {
  totalUsers: number;
  highRiskUsers: number;
  patternsDetected: number;
  lastAnalysis: number;
}

@Injectable({
  providedIn: 'root'
})
export class BehaviorAnalyticsService {
  private behaviors = new BehaviorSubject<Map<string, UserBehavior>>(new Map());
  private metrics = new BehaviorSubject<BehaviorMetrics>({
    totalUsers: 0,
    highRiskUsers: 0,
    patternsDetected: 0,
    lastAnalysis: Date.now()
  });

  private readonly PATTERNS: BehaviorPattern[] = [
    {
      type: 'rapid_actions',
      threshold: 10,
      window: 60000, // 1 minuto
      weight: 0.3,
      description: 'Acciones muy rápidas en un corto período'
    },
    {
      type: 'unusual_hours',
      threshold: 3,
      window: 86400000, // 24 horas
      weight: 0.2,
      description: 'Actividad en horas inusuales'
    },
    {
      type: 'multiple_failures',
      threshold: 5,
      window: 300000, // 5 minutos
      weight: 0.4,
      description: 'Múltiples intentos fallidos'
    },
    {
      type: 'suspicious_patterns',
      threshold: 2,
      window: 3600000, // 1 hora
      weight: 0.5,
      description: 'Patrones de comportamiento sospechosos'
    }
  ];

  private readonly RISK_THRESHOLD = 0.7;

  constructor() {
    this.startBehaviorMonitoring();
  }

  /**
   * Inicia el monitoreo de comportamiento
   */
  private startBehaviorMonitoring(): void {
    // Análisis periódico de comportamiento
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.analyzeBehaviors())
    ).subscribe();

    // Limpieza de datos antiguos
    interval(24 * 60 * 60 * 1000).pipe( // Cada 24 horas
      tap(() => this.cleanupOldData())
    ).subscribe();
  }

  /**
   * Registra una acción de usuario
   */
  recordAction(userId: string, action: Omit<UserBehavior['actions'][0], 'timestamp'>): void {
    const behaviors = this.behaviors.value;
    const userBehavior = behaviors.get(userId) || this.initializeUserBehavior(userId);

    userBehavior.actions.push({
      ...action,
      timestamp: Date.now()
    });

    behaviors.set(userId, userBehavior);
    this.behaviors.next(behaviors);

    this.analyzeUserBehavior(userId);
  }

  /**
   * Inicializa el comportamiento de un usuario
   */
  private initializeUserBehavior(userId: string): UserBehavior {
    return {
      userId,
      actions: [],
      patterns: [],
      riskScore: 0,
      lastUpdated: Date.now()
    };
  }

  /**
   * Analiza el comportamiento de un usuario
   */
  private analyzeUserBehavior(userId: string): void {
    const behaviors = this.behaviors.value;
    const userBehavior = behaviors.get(userId);

    if (!userBehavior) return;

    const patterns = this.detectPatterns(userBehavior);
    const riskScore = this.calculateRiskScore(patterns);

    userBehavior.patterns = patterns;
    userBehavior.riskScore = riskScore;
    userBehavior.lastUpdated = Date.now();

    behaviors.set(userId, userBehavior);
    this.behaviors.next(behaviors);

    this.updateMetrics();
  }

  /**
   * Detecta patrones en el comportamiento
   */
  private detectPatterns(behavior: UserBehavior): UserBehavior['patterns'] {
    const patterns: UserBehavior['patterns'] = [];
    const recentActions = behavior.actions.filter(
      a => a.timestamp > Date.now() - 86400000 // Últimas 24 horas
    );

    for (const pattern of this.PATTERNS) {
      const windowActions = recentActions.filter(
        a => a.timestamp > Date.now() - pattern.window
      );

      const confidence = this.calculatePatternConfidence(windowActions, pattern);
      if (confidence > pattern.threshold) {
        patterns.push({
          type: pattern.type,
          confidence,
          details: this.generatePatternDetails(pattern, windowActions)
        });
      }
    }

    return patterns;
  }

  /**
   * Calcula la confianza de un patrón
   */
  private calculatePatternConfidence(
    actions: UserBehavior['actions'],
    pattern: BehaviorPattern
  ): number {
    switch (pattern.type) {
      case 'rapid_actions':
        return actions.length / pattern.threshold;
      case 'unusual_hours':
        const nightActions = actions.filter(
          a => new Date(a.timestamp).getHours() < 6 || new Date(a.timestamp).getHours() > 22
        ).length;
        return nightActions / pattern.threshold;
      case 'multiple_failures':
        const failures = actions.filter(a => a.type === 'auth_failure').length;
        return failures / pattern.threshold;
      case 'suspicious_patterns':
        const suspicious = actions.filter(
          a => a.type === 'api_error' || a.type === 'validation_error'
        ).length;
        return suspicious / pattern.threshold;
      default:
        return 0;
    }
  }

  /**
   * Genera detalles de un patrón
   */
  private generatePatternDetails(
    pattern: BehaviorPattern,
    actions: UserBehavior['actions']
  ): any {
    switch (pattern.type) {
      case 'rapid_actions':
        return {
          count: actions.length,
          timeWindow: pattern.window
        };
      case 'unusual_hours':
        return {
          nightActions: actions.filter(
            a => new Date(a.timestamp).getHours() < 6 || new Date(a.timestamp).getHours() > 22
          ).length,
          totalActions: actions.length
        };
      case 'multiple_failures':
        return {
          failures: actions.filter(a => a.type === 'auth_failure').length,
          timeWindow: pattern.window
        };
      case 'suspicious_patterns':
        return {
          errors: actions.filter(
            a => a.type === 'api_error' || a.type === 'validation_error'
          ).length,
          timeWindow: pattern.window
        };
      default:
        return {};
    }
  }

  /**
   * Calcula el puntaje de riesgo
   */
  private calculateRiskScore(patterns: UserBehavior['patterns']): number {
    let totalWeight = 0;
    let weightedScore = 0;

    for (const pattern of patterns) {
      const patternConfig = this.PATTERNS.find(p => p.type === pattern.type);
      if (patternConfig) {
        weightedScore += pattern.confidence * patternConfig.weight;
        totalWeight += patternConfig.weight;
      }
    }

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * Actualiza las métricas
   */
  private updateMetrics(): void {
    const behaviors = this.behaviors.value;
    const highRiskUsers = Array.from(behaviors.values()).filter(
      b => b.riskScore > this.RISK_THRESHOLD
    ).length;

    this.metrics.next({
      totalUsers: behaviors.size,
      highRiskUsers,
      patternsDetected: Array.from(behaviors.values()).reduce(
        (sum, b) => sum + b.patterns.length,
        0
      ),
      lastAnalysis: Date.now()
    });
  }

  /**
   * Limpia datos antiguos
   */
  private cleanupOldData(): void {
    const behaviors = this.behaviors.value;
    const cutoffDate = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 días

    for (const [userId, behavior] of behaviors.entries()) {
      behavior.actions = behavior.actions.filter(a => a.timestamp > cutoffDate);
      if (behavior.actions.length === 0) {
        behaviors.delete(userId);
      }
    }

    this.behaviors.next(behaviors);
  }

  /**
   * Analiza todos los comportamientos
   */
  private analyzeBehaviors(): void {
    const behaviors = this.behaviors.value;
    for (const [userId] of behaviors) {
      this.analyzeUserBehavior(userId);
    }
  }

  /**
   * Obtiene el comportamiento de un usuario
   */
  getUserBehavior(userId: string): Observable<UserBehavior | undefined> {
    return this.behaviors.pipe(
      map(behaviors => behaviors.get(userId)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene usuarios de alto riesgo
   */
  getHighRiskUsers(): Observable<string[]> {
    return this.behaviors.pipe(
      map(behaviors =>
        Array.from(behaviors.entries())
          .filter(([_, behavior]) => behavior.riskScore > this.RISK_THRESHOLD)
          .map(([userId]) => userId)
      ),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene las métricas de comportamiento
   */
  getMetrics(): Observable<BehaviorMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de comportamiento
   */
  generateReport(userId?: string): {
    metrics: BehaviorMetrics;
    behaviors: UserBehavior[];
    highRiskUsers: string[];
    patterns: {
      type: string;
      count: number;
      users: string[];
    }[];
  } {
    const behaviors = this.behaviors.value;
    const highRiskUsers = Array.from(behaviors.entries())
      .filter(([_, behavior]) => behavior.riskScore > this.RISK_THRESHOLD)
      .map(([userId]) => userId);

    const patterns = this.PATTERNS.map(pattern => ({
      type: pattern.type,
      count: Array.from(behaviors.values()).filter(b =>
        b.patterns.some(p => p.type === pattern.type)
      ).length,
      users: Array.from(behaviors.entries())
        .filter(([_, behavior]) =>
          behavior.patterns.some(p => p.type === pattern.type)
        )
        .map(([userId]) => userId)
    }));

    return {
      metrics: this.metrics.value,
      behaviors: userId
        ? [behaviors.get(userId)].filter(Boolean) as UserBehavior[]
        : Array.from(behaviors.values()),
      highRiskUsers,
      patterns
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.behaviors.next(new Map());
    this.metrics.next({
      totalUsers: 0,
      highRiskUsers: 0,
      patternsDetected: 0,
      lastAnalysis: Date.now()
    });
  }
}
