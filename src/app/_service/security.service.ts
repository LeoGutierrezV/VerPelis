import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { APP_CONSTANTS } from '../_constants/app.constants';
import { CryptoJS } from 'crypto-js';

interface SecurityMetrics {
  failedAttempts: number;
  blockedIPs: string[];
  suspiciousActivities: string[];
  lastSecurityScan: number;
  securityScore: number;
}

interface SecurityEvent {
  type: 'auth' | 'api' | 'xss' | 'csrf' | 'injection' | 'ddos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  details: string;
  ip?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private metrics = new BehaviorSubject<SecurityMetrics>({
    failedAttempts: 0,
    blockedIPs: [],
    suspiciousActivities: [],
    lastSecurityScan: Date.now(),
    securityScore: 100
  });

  private events = new BehaviorSubject<SecurityEvent[]>([]);
  private readonly MAX_EVENTS = 1000;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 3600000; // 1 hora

  constructor() {
    this.startSecurityMonitoring();
  }

  /**
   * Inicia el monitoreo de seguridad
   */
  private startSecurityMonitoring(): void {
    // Escaneo periódico de seguridad
    interval(APP_CONSTANTS.API.CACHE_TIME).pipe(
      tap(() => this.performSecurityScan())
    ).subscribe();

    // Limpieza de eventos antiguos
    interval(3600000).pipe( // Cada hora
      tap(() => this.cleanupOldEvents())
    ).subscribe();
  }

  /**
   * Realiza un escaneo de seguridad
   */
  private performSecurityScan(): void {
    this.checkXSSVulnerabilities();
    this.checkCSRFProtection();
    this.checkInjectionVulnerabilities();
    this.checkDDoSProtection();
    this.updateSecurityScore();
  }

  /**
   * Verifica vulnerabilidades XSS
   */
  private checkXSSVulnerabilities(): void {
    const inputs = document.querySelectorAll('input, textarea');
    for (const input of inputs) {
      if (!this.isXSSProtected(input)) {
        this.recordSecurityEvent({
          type: 'xss',
          severity: 'high',
          timestamp: Date.now(),
          details: `Vulnerabilidad XSS detectada en ${input.id || 'elemento sin ID'}`
        });
      }
    }
  }

  /**
   * Verifica si un elemento está protegido contra XSS
   */
  private isXSSProtected(element: Element): boolean {
    const sanitized = this.sanitizeInput(element.innerHTML);
    return sanitized === element.innerHTML;
  }

  /**
   * Verifica protección CSRF
   */
  private checkCSRFProtection(): void {
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      if (!this.hasCSRFToken(form)) {
        this.recordSecurityEvent({
          type: 'csrf',
          severity: 'critical',
          timestamp: Date.now(),
          details: `Formulario sin token CSRF: ${form.id || 'formulario sin ID'}`
        });
      }
    }
  }

  /**
   * Verifica si un formulario tiene token CSRF
   */
  private hasCSRFToken(form: HTMLFormElement): boolean {
    return form.querySelector('input[name="_csrf"]') !== null;
  }

  /**
   * Verifica vulnerabilidades de inyección
   */
  private checkInjectionVulnerabilities(): void {
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
      if (this.isInjectionVulnerable(value)) {
        this.recordSecurityEvent({
          type: 'injection',
          severity: 'high',
          timestamp: Date.now(),
          details: `Posible inyección detectada en parámetro: ${key}`
        });
      }
    }
  }

  /**
   * Verifica si un valor es vulnerable a inyección
   */
  private isInjectionVulnerable(value: string): boolean {
    const injectionPatterns = [
      /<script>/i,
      /javascript:/i,
      /on\w+=/i,
      /eval\(/i,
      /exec\(/i
    ];

    return injectionPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Verifica protección contra DDoS
   */
  private checkDDoSProtection(): void {
    const recentEvents = this.events.value.filter(
      e => e.timestamp > Date.now() - 60000 // Último minuto
    );

    if (recentEvents.length > 100) {
      this.recordSecurityEvent({
        type: 'ddos',
        severity: 'critical',
        timestamp: Date.now(),
        details: 'Posible ataque DDoS detectado'
      });
    }
  }

  /**
   * Registra un evento de seguridad
   */
  private recordSecurityEvent(event: SecurityEvent): void {
    const currentEvents = this.events.value;
    this.events.next([...currentEvents, event]);

    if (currentEvents.length >= this.MAX_EVENTS) {
      this.events.next(currentEvents.slice(1));
    }

    this.updateMetrics(event);
  }

  /**
   * Actualiza las métricas de seguridad
   */
  private updateMetrics(event: SecurityEvent): void {
    const currentMetrics = this.metrics.value;
    const newMetrics: SecurityMetrics = {
      ...currentMetrics,
      lastSecurityScan: Date.now()
    };

    if (event.severity === 'critical') {
      newMetrics.securityScore = Math.max(0, newMetrics.securityScore - 20);
    } else if (event.severity === 'high') {
      newMetrics.securityScore = Math.max(0, newMetrics.securityScore - 10);
    }

    this.metrics.next(newMetrics);
  }

  /**
   * Actualiza el puntaje de seguridad
   */
  private updateSecurityScore(): void {
    const currentMetrics = this.metrics.value;
    const recentEvents = this.events.value.filter(
      e => e.timestamp > Date.now() - 3600000 // Última hora
    );

    const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length;
    const highEvents = recentEvents.filter(e => e.severity === 'high').length;

    let score = 100;
    score -= criticalEvents * 20;
    score -= highEvents * 10;

    this.metrics.next({
      ...currentMetrics,
      securityScore: Math.max(0, score)
    });
  }

  /**
   * Limpia eventos antiguos
   */
  private cleanupOldEvents(): void {
    const oneDayAgo = Date.now() - 86400000;
    const recentEvents = this.events.value.filter(e => e.timestamp > oneDayAgo);
    this.events.next(recentEvents);
  }

  /**
   * Sanitiza una entrada de usuario
   */
  private sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Genera un token CSRF
   */
  generateCSRFToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Verifica un token CSRF
   */
  validateCSRFToken(token: string): boolean {
    return token.length === 64 && /^[a-f0-9]+$/.test(token);
  }

  /**
   * Bloquea una IP
   */
  blockIP(ip: string): void {
    const currentMetrics = this.metrics.value;
    if (!currentMetrics.blockedIPs.includes(ip)) {
      this.metrics.next({
        ...currentMetrics,
        blockedIPs: [...currentMetrics.blockedIPs, ip]
      });

      setTimeout(() => {
        this.unblockIP(ip);
      }, this.BLOCK_DURATION);
    }
  }

  /**
   * Desbloquea una IP
   */
  private unblockIP(ip: string): void {
    const currentMetrics = this.metrics.value;
    this.metrics.next({
      ...currentMetrics,
      blockedIPs: currentMetrics.blockedIPs.filter(i => i !== ip)
    });
  }

  /**
   * Registra un intento fallido de autenticación
   */
  recordFailedAttempt(ip: string): void {
    const currentMetrics = this.metrics.value;
    const newAttempts = currentMetrics.failedAttempts + 1;

    this.metrics.next({
      ...currentMetrics,
      failedAttempts: newAttempts
    });

    if (newAttempts >= this.MAX_FAILED_ATTEMPTS) {
      this.blockIP(ip);
      this.recordSecurityEvent({
        type: 'auth',
        severity: 'high',
        timestamp: Date.now(),
        details: `Múltiples intentos fallidos desde IP: ${ip}`,
        ip
      });
    }
  }

  /**
   * Obtiene las métricas de seguridad
   */
  getMetrics(): Observable<SecurityMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Obtiene los eventos de seguridad
   */
  getEvents(): Observable<SecurityEvent[]> {
    return this.events.asObservable();
  }

  /**
   * Obtiene eventos por tipo
   */
  getEventsByType(type: SecurityEvent['type']): Observable<SecurityEvent[]> {
    return this.events.pipe(
      map(events => events.filter(e => e.type === type)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene eventos por severidad
   */
  getEventsBySeverity(severity: SecurityEvent['severity']): Observable<SecurityEvent[]> {
    return this.events.pipe(
      map(events => events.filter(e => e.severity === severity)),
      distinctUntilChanged()
    );
  }

  /**
   * Genera un reporte de seguridad
   */
  generateReport(): {
    metrics: SecurityMetrics;
    events: SecurityEvent[];
    recommendations: string[];
  } {
    const recommendations = this.generateSecurityRecommendations();
    return {
      metrics: this.metrics.value,
      events: this.events.value,
      recommendations
    };
  }

  /**
   * Genera recomendaciones de seguridad
   */
  private generateSecurityRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.metrics.value;
    const recentEvents = this.events.value.filter(
      e => e.timestamp > Date.now() - 3600000
    );

    if (metrics.securityScore < 70) {
      recommendations.push('Implementar medidas adicionales de seguridad');
    }

    if (recentEvents.some(e => e.type === 'xss')) {
      recommendations.push('Mejorar sanitización de entradas de usuario');
    }

    if (recentEvents.some(e => e.type === 'csrf')) {
      recommendations.push('Implementar tokens CSRF en todos los formularios');
    }

    if (recentEvents.some(e => e.type === 'ddos')) {
      recommendations.push('Implementar protección contra DDoS');
    }

    return recommendations;
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.metrics.next({
      failedAttempts: 0,
      blockedIPs: [],
      suspiciousActivities: [],
      lastSecurityScan: Date.now(),
      securityScore: 100
    });
    this.events.next([]);
  }
}
