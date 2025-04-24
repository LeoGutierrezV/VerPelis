import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { SecurityService } from './security.service';
import { AuditService } from './audit.service';
import { BehaviorAnalyticsService } from './behavior-analytics.service';
import { PredictiveAnalyticsService } from './predictive-analytics.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface SecurityPrediction {
  timestamp: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threats: {
    type: string;
    probability: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  recommendations: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;
    impact: string;
    confidence: number;
  }[];
  confidence: number;
}

interface SecurityMetrics {
  totalThreats: number;
  activeThreats: number;
  blockedThreats: number;
  riskScore: number;
  lastAnalysis: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictiveSecurityService {
  private predictions = new BehaviorSubject<SecurityPrediction>({
    timestamp: Date.now(),
    riskLevel: 'low',
    threats: [],
    recommendations: [],
    confidence: 0
  });

  private metrics = new BehaviorSubject<SecurityMetrics>({
    totalThreats: 0,
    activeThreats: 0,
    blockedThreats: 0,
    riskScore: 100,
    lastAnalysis: Date.now()
  });

  private readonly THREAT_PATTERNS = [
    {
      type: 'brute_force',
      indicators: ['auth_failure', 'rapid_actions'],
      threshold: 0.7,
      weight: 0.4
    },
    {
      type: 'xss_attack',
      indicators: ['xss', 'injection'],
      threshold: 0.6,
      weight: 0.3
    },
    {
      type: 'ddos',
      indicators: ['ddos', 'rapid_actions'],
      threshold: 0.8,
      weight: 0.5
    },
    {
      type: 'data_exfiltration',
      indicators: ['suspicious_patterns', 'unusual_hours'],
      threshold: 0.5,
      weight: 0.4
    }
  ];

  constructor(
    private securityService: SecurityService,
    private auditService: AuditService,
    private behaviorAnalyticsService: BehaviorAnalyticsService,
    private predictiveAnalyticsService: PredictiveAnalyticsService
  ) {
    this.startPredictiveMonitoring();
  }

  /**
   * Inicia el monitoreo predictivo
   */
  private startPredictiveMonitoring(): void {
    // Análisis predictivo
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.analyzeSecurity())
    ).subscribe();

    // Actualización de métricas
    interval(15 * 60 * 1000).pipe( // Cada 15 minutos
      tap(() => this.updateMetrics())
    ).subscribe();
  }

  /**
   * Analiza la seguridad de forma predictiva
   */
  private analyzeSecurity(): void {
    combineLatest([
      this.securityService.getMetrics(),
      this.auditService.getMetrics(),
      this.behaviorAnalyticsService.getMetrics(),
      this.predictiveAnalyticsService.getPredictions()
    ]).pipe(
      tap(([securityMetrics, auditMetrics, behaviorMetrics, predictions]) => {
        const threats = this.detectThreats(securityMetrics, auditMetrics, behaviorMetrics, predictions);
        const recommendations = this.generateRecommendations(threats);
        const riskLevel = this.calculateRiskLevel(threats);
        const confidence = this.calculateConfidence(threats);

        this.predictions.next({
          timestamp: Date.now(),
          riskLevel,
          threats,
          recommendations,
          confidence
        });

        this.updateMetrics();
      })
    ).subscribe();
  }

  /**
   * Detecta amenazas basadas en múltiples fuentes de datos
   */
  private detectThreats(
    securityMetrics: any,
    auditMetrics: any,
    behaviorMetrics: any,
    predictions: any
  ): SecurityPrediction['threats'] {
    const threats: SecurityPrediction['threats'] = [];

    for (const pattern of this.THREAT_PATTERNS) {
      const probability = this.calculateThreatProbability(
        pattern,
        securityMetrics,
        auditMetrics,
        behaviorMetrics,
        predictions
      );

      if (probability > pattern.threshold) {
        threats.push({
          type: pattern.type,
          probability,
          impact: this.calculateThreatImpact(probability, pattern.weight),
          description: this.generateThreatDescription(pattern.type, probability)
        });
      }
    }

    return threats;
  }

  /**
   * Calcula la probabilidad de una amenaza
   */
  private calculateThreatProbability(
    pattern: typeof this.THREAT_PATTERNS[0],
    securityMetrics: any,
    auditMetrics: any,
    behaviorMetrics: any,
    predictions: any
  ): number {
    let probability = 0;
    let weightSum = 0;

    for (const indicator of pattern.indicators) {
      const weight = this.getIndicatorWeight(indicator);
      const value = this.getIndicatorValue(indicator, securityMetrics, auditMetrics, behaviorMetrics, predictions);

      probability += value * weight;
      weightSum += weight;
    }

    return weightSum > 0 ? probability / weightSum : 0;
  }

  /**
   * Obtiene el peso de un indicador
   */
  private getIndicatorWeight(indicator: string): number {
    switch (indicator) {
      case 'auth_failure':
        return 0.4;
      case 'rapid_actions':
        return 0.3;
      case 'xss':
        return 0.5;
      case 'injection':
        return 0.4;
      case 'ddos':
        return 0.6;
      case 'suspicious_patterns':
        return 0.3;
      case 'unusual_hours':
        return 0.2;
      default:
        return 0.1;
    }
  }

  /**
   * Obtiene el valor de un indicador
   */
  private getIndicatorValue(
    indicator: string,
    securityMetrics: any,
    auditMetrics: any,
    behaviorMetrics: any,
    predictions: any
  ): number {
    switch (indicator) {
      case 'auth_failure':
        return securityMetrics.failedAttempts / 5;
      case 'rapid_actions':
        return behaviorMetrics.patternsDetected / 10;
      case 'xss':
        return securityMetrics.securityScore < 70 ? 0.8 : 0.2;
      case 'injection':
        return auditMetrics.eventsByType.security / 100;
      case 'ddos':
        return predictions.predictedErrorRate / 10;
      case 'suspicious_patterns':
        return behaviorMetrics.highRiskUsers / behaviorMetrics.totalUsers;
      case 'unusual_hours':
        return auditMetrics.eventsByType.auth / 100;
      default:
        return 0;
    }
  }

  /**
   * Calcula el impacto de una amenaza
   */
  private calculateThreatImpact(probability: number, weight: number): SecurityPrediction['threats'][0]['impact'] {
    const score = probability * weight;
    if (score > 0.8) return 'critical';
    if (score > 0.6) return 'high';
    if (score > 0.4) return 'medium';
    return 'low';
  }

  /**
   * Genera una descripción de amenaza
   */
  private generateThreatDescription(type: string, probability: number): string {
    const descriptions: Record<string, string> = {
      brute_force: `Intento de fuerza bruta detectado (${Math.round(probability * 100)}% de probabilidad)`,
      xss_attack: `Posible ataque XSS en curso (${Math.round(probability * 100)}% de probabilidad)`,
      ddos: `Posible ataque DDoS detectado (${Math.round(probability * 100)}% de probabilidad)`,
      data_exfiltration: `Posible intento de exfiltración de datos (${Math.round(probability * 100)}% de probabilidad)`
    };

    return descriptions[type] || `Amenaza desconocida (${Math.round(probability * 100)}% de probabilidad)`;
  }

  /**
   * Genera recomendaciones de seguridad
   */
  private generateRecommendations(threats: SecurityPrediction['threats']): SecurityPrediction['recommendations'] {
    const recommendations: SecurityPrediction['recommendations'] = [];

    for (const threat of threats) {
      if (threat.probability > 0.7) {
        recommendations.push({
          priority: 'critical',
          action: this.getCriticalAction(threat.type),
          impact: 'Alta reducción de riesgo',
          confidence: threat.probability
        });
      } else if (threat.probability > 0.5) {
        recommendations.push({
          priority: 'high',
          action: this.getHighPriorityAction(threat.type),
          impact: 'Media reducción de riesgo',
          confidence: threat.probability
        });
      }
    }

    return recommendations;
  }

  /**
   * Obtiene una acción crítica para un tipo de amenaza
   */
  private getCriticalAction(type: string): string {
    const actions: Record<string, string> = {
      brute_force: 'Bloquear IPs sospechosas y reforzar autenticación',
      xss_attack: 'Implementar sanitización adicional y WAF',
      ddos: 'Activar protección DDoS y limitar conexiones',
      data_exfiltration: 'Implementar monitoreo de datos y cifrado adicional'
    };

    return actions[type] || 'Implementar medidas de seguridad adicionales';
  }

  /**
   * Obtiene una acción de alta prioridad para un tipo de amenaza
   */
  private getHighPriorityAction(type: string): string {
    const actions: Record<string, string> = {
      brute_force: 'Implementar CAPTCHA y límites de intentos',
      xss_attack: 'Revisar y actualizar sanitización de entradas',
      ddos: 'Configurar rate limiting y monitoreo de tráfico',
      data_exfiltration: 'Mejorar logging y monitoreo de acceso'
    };

    return actions[type] || 'Implementar medidas de seguridad preventivas';
  }

  /**
   * Calcula el nivel de riesgo general
   */
  private calculateRiskLevel(threats: SecurityPrediction['threats']): SecurityPrediction['riskLevel'] {
    const criticalThreats = threats.filter(t => t.impact === 'critical').length;
    const highThreats = threats.filter(t => t.impact === 'high').length;

    if (criticalThreats > 0) return 'critical';
    if (highThreats > 1) return 'high';
    if (highThreats > 0 || threats.length > 2) return 'medium';
    return 'low';
  }

  /**
   * Calcula el nivel de confianza de las predicciones
   */
  private calculateConfidence(threats: SecurityPrediction['threats']): number {
    if (threats.length === 0) return 1;

    const totalProbability = threats.reduce((sum, t) => sum + t.probability, 0);
    const averageProbability = totalProbability / threats.length;
    return Math.max(0.5, 1 - averageProbability);
  }

  /**
   * Actualiza las métricas de seguridad
   */
  private updateMetrics(): void {
    const currentMetrics = this.metrics.value;
    const predictions = this.predictions.value;

    this.metrics.next({
      totalThreats: currentMetrics.totalThreats + predictions.threats.length,
      activeThreats: predictions.threats.filter(t => t.probability > 0.7).length,
      blockedThreats: currentMetrics.blockedThreats + predictions.threats.filter(t => t.probability < 0.3).length,
      riskScore: this.calculateRiskScore(predictions),
      lastAnalysis: Date.now()
    });
  }

  /**
   * Calcula el puntaje de riesgo
   */
  private calculateRiskScore(predictions: SecurityPrediction): number {
    const weights = {
      critical: 0.4,
      high: 0.3,
      medium: 0.2,
      low: 0.1
    };

    const threatScore = predictions.threats.reduce((score, threat) => {
      return score + (threat.probability * weights[threat.impact]);
    }, 0);

    return Math.max(0, 100 - (threatScore * 100));
  }

  /**
   * Obtiene las predicciones actuales
   */
  getPredictions(): Observable<SecurityPrediction> {
    return this.predictions.asObservable();
  }

  /**
   * Obtiene las métricas de seguridad
   */
  getMetrics(): Observable<SecurityMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de seguridad predictivo
   */
  generateReport(): {
    predictions: SecurityPrediction;
    metrics: SecurityMetrics;
    summary: {
      riskLevel: SecurityPrediction['riskLevel'];
      activeThreats: number;
      criticalRecommendations: number;
      confidence: number;
    };
  } {
    const predictions = this.predictions.value;
    const metrics = this.metrics.value;

    return {
      predictions,
      metrics,
      summary: {
        riskLevel: predictions.riskLevel,
        activeThreats: predictions.threats.filter(t => t.probability > 0.7).length,
        criticalRecommendations: predictions.recommendations.filter(r => r.priority === 'critical').length,
        confidence: predictions.confidence
      }
    };
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.predictions.next({
      timestamp: Date.now(),
      riskLevel: 'low',
      threats: [],
      recommendations: [],
      confidence: 0
    });
    this.metrics.next({
      totalThreats: 0,
      activeThreats: 0,
      blockedThreats: 0,
      riskScore: 100,
      lastAnalysis: Date.now()
    });
  }
}
