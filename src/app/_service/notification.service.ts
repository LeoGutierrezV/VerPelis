import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  timestamp: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);

  // Observables públicos
  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  /**
   * Obtiene todas las notificaciones
   * @returns Observable con el array de notificaciones
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  /**
   * Obtiene el contador de notificaciones no leídas
   * @returns Observable con el contador
   */
  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  /**
   * Muestra una notificación de éxito
   * @param message Mensaje de la notificación
   * @param title Título opcional
   * @param duration Duración en milisegundos
   */
  success(message: string, title?: string, duration: number = 5000): void {
    this.show('success', message, title, duration);
  }

  /**
   * Muestra una notificación de error
   * @param message Mensaje de la notificación
   * @param title Título opcional
   * @param duration Duración en milisegundos
   */
  error(message: string, title?: string, duration: number = 7000): void {
    this.show('error', message, title, duration);
  }

  /**
   * Muestra una notificación de advertencia
   * @param message Mensaje de la notificación
   * @param title Título opcional
   * @param duration Duración en milisegundos
   */
  warning(message: string, title?: string, duration: number = 5000): void {
    this.show('warning', message, title, duration);
  }

  /**
   * Muestra una notificación informativa
   * @param message Mensaje de la notificación
   * @param title Título opcional
   * @param duration Duración en milisegundos
   */
  info(message: string, title?: string, duration: number = 5000): void {
    this.show('info', message, title, duration);
  }

  /**
   * Marca una notificación como leída
   * @param id ID de la notificación
   */
  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    this.updateNotifications(notifications);
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(notification =>
      ({ ...notification, read: true })
    );
    this.updateNotifications(notifications);
  }

  /**
   * Elimina una notificación
   * @param id ID de la notificación
   */
  remove(id: string): void {
    const notifications = this.notificationsSubject.value.filter(
      notification => notification.id !== id
    );
    this.updateNotifications(notifications);
  }

  /**
   * Elimina todas las notificaciones
   */
  clear(): void {
    this.updateNotifications([]);
  }

  /**
   * Muestra una notificación
   * @param type Tipo de notificación
   * @param message Mensaje de la notificación
   * @param title Título opcional
   * @param duration Duración en milisegundos
   */
  private show(
    type: NotificationType,
    message: string,
    title?: string,
    duration: number = 5000
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      title,
      duration,
      timestamp: Date.now(),
      read: false
    };

    const notifications = [notification, ...this.notificationsSubject.value];
    this.updateNotifications(notifications);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  /**
   * Actualiza las notificaciones y el contador de no leídas
   * @param notifications Array de notificaciones
   */
  private updateNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount(notifications);
  }

  /**
   * Actualiza el contador de notificaciones no leídas
   * @param notifications Array de notificaciones
   */
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Genera un ID único para una notificación
   * @returns ID único
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
