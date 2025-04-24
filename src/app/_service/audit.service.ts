import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface AuditEvent {
  id: string;
  type: 'auth' | 'api' | 'user' | 'system' | 'security' | 'performance';
  action: string;
  timestamp: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface AuditMetrics {
  totalEvents: number;
  eventsByType: Record<AuditEvent['type'], number>;
  eventsBySeverity: Record<AuditEvent['severity'], number>;
  lastCleanup: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private events = new BehaviorSubject<AuditEvent[]>([]);
  private metrics = new BehaviorSubject<AuditMetrics>({
    totalEvents: 0,
    eventsByType: {
      auth: 0,
      api: 0,
      user: 0,
      system: 0,
      security: 0,
      performance: 0
    },
    eventsBySeverity: {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    },
    lastCleanup: Date.now()
  });

  private readonly MAX_EVENTS = 10000;
  private readonly RETENTION_PERIOD = 30 * 24 * 60 * 60 * 1000; // 30 días

  constructor() {
    this.startAuditMonitoring();
  }

  /**
   * Inicia el monitoreo de auditoría
   */
  private startAuditMonitoring(): void {
    // Limpieza periódica de eventos antiguos
    interval(24 * 60 * 60 * 1000).pipe( // Cada 24 horas
      tap(() => this.cleanupOldEvents())
    ).subscribe();

    // Actualización de métricas
    interval(5 * 60 * 1000).pipe( // Cada 5 minutos
      tap(() => this.updateMetrics())
    ).subscribe();
  }

  /**
   * Registra un evento de auditoría
   */
  recordEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const newEvent: AuditEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now()
    };

    const currentEvents = this.events.value;
    this.events.next([...currentEvents, newEvent]);

    if (currentEvents.length >= this.MAX_EVENTS) {
      this.events.next(currentEvents.slice(1));
    }

    this.updateMetrics();
  }

  /**
   * Genera un ID único para el evento
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limpia eventos antiguos
   */
  private cleanupOldEvents(): void {
    const cutoffDate = Date.now() - this.RETENTION_PERIOD;
    const recentEvents = this.events.value.filter(e => e.timestamp > cutoffDate);

    this.events.next(recentEvents);
    this.metrics.next({
      ...this.metrics.value,
      lastCleanup: Date.now()
    });
  }

  /**
   * Actualiza las métricas de auditoría
   */
  private updateMetrics(): void {
    const events = this.events.value;
    const metrics: AuditMetrics = {
      totalEvents: events.length,
      eventsByType: {
        auth: 0,
        api: 0,
        user: 0,
        system: 0,
        security: 0,
        performance: 0
      },
      eventsBySeverity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0
      },
      lastCleanup: this.metrics.value.lastCleanup
    };

    events.forEach(event => {
      metrics.eventsByType[event.type]++;
      metrics.eventsBySeverity[event.severity]++;
    });

    this.metrics.next(metrics);
  }

  /**
   * Obtiene eventos por tipo
   */
  getEventsByType(type: AuditEvent['type']): Observable<AuditEvent[]> {
    return this.events.pipe(
      map(events => events.filter(e => e.type === type)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene eventos por severidad
   */
  getEventsBySeverity(severity: AuditEvent['severity']): Observable<AuditEvent[]> {
    return this.events.pipe(
      map(events => events.filter(e => e.severity === severity)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene eventos por usuario
   */
  getEventsByUser(userId: string): Observable<AuditEvent[]> {
    return this.events.pipe(
      map(events => events.filter(e => e.userId === userId)),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene eventos por rango de fechas
   */
  getEventsByDateRange(startDate: number, endDate: number): Observable<AuditEvent[]> {
    return this.events.pipe(
      map(events => events.filter(e =>
        e.timestamp >= startDate && e.timestamp <= endDate
      )),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene las métricas de auditoría
   */
  getMetrics(): Observable<AuditMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Genera un reporte de auditoría
   */
  generateReport(startDate?: number, endDate?: number): {
    events: AuditEvent[];
    metrics: AuditMetrics;
    summary: {
      totalEvents: number;
      eventsByType: Record<AuditEvent['type'], number>;
      eventsBySeverity: Record<AuditEvent['severity'], number>;
      criticalEvents: AuditEvent[];
    };
  } {
    const events = startDate && endDate
      ? this.events.value.filter(e =>
          e.timestamp >= startDate && e.timestamp <= endDate
        )
      : this.events.value;

    const summary = {
      totalEvents: events.length,
      eventsByType: {
        auth: 0,
        api: 0,
        user: 0,
        system: 0,
        security: 0,
        performance: 0
      },
      eventsBySeverity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0
      },
      criticalEvents: events.filter(e => e.severity === 'critical')
    };

    events.forEach(event => {
      summary.eventsByType[event.type]++;
      summary.eventsBySeverity[event.severity]++;
    });

    return {
      events,
      metrics: this.metrics.value,
      summary
    };
  }

  /**
   * Exporta eventos a formato JSON
   */
  exportEvents(startDate?: number, endDate?: number): string {
    const events = startDate && endDate
      ? this.events.value.filter(e =>
          e.timestamp >= startDate && e.timestamp <= endDate
        )
      : this.events.value;

    return JSON.stringify(events, null, 2);
  }

  /**
   * Reinicia el servicio
   */
  reset(): void {
    this.events.next([]);
    this.metrics.next({
      totalEvents: 0,
      eventsByType: {
        auth: 0,
        api: 0,
        user: 0,
        system: 0,
        security: 0,
        performance: 0
      },
      eventsBySeverity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0
      },
      lastCleanup: Date.now()
    });
  }
}
