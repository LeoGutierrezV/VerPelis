import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_CONSTANTS } from '../_constants/app.constants';

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private settings = new BehaviorSubject<AccessibilitySettings>({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  });

  constructor() {
    this.loadSettings();
  }

  /**
   * Carga la configuración guardada
   */
  private loadSettings(): void {
    const savedSettings = localStorage.getItem('accessibility');
    if (savedSettings) {
      this.settings.next(JSON.parse(savedSettings));
      this.applySettings();
    }
  }

  /**
   * Guarda la configuración actual
   */
  private saveSettings(): void {
    localStorage.setItem('accessibility', JSON.stringify(this.settings.value));
  }

  /**
   * Aplica la configuración al DOM
   */
  private applySettings(): void {
    const { fontSize, highContrast, reducedMotion } = this.settings.value;

    // Aplicar tamaño de fuente
    document.documentElement.style.fontSize = this.getFontSize(fontSize);

    // Aplicar contraste alto
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Aplicar reducción de movimiento
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  /**
   * Obtiene el tamaño de fuente correspondiente
   * @param size Tamaño seleccionado
   * @returns Tamaño de fuente en rem
   */
  private getFontSize(size: 'small' | 'medium' | 'large'): string {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.25rem';
      default:
        return '1rem';
    }
  }

  /**
   * Actualiza la configuración
   * @param settings Nueva configuración
   */
  updateSettings(settings: Partial<AccessibilitySettings>): void {
    this.settings.next({
      ...this.settings.value,
      ...settings
    });
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Obtiene la configuración actual
   * @returns Configuración actual
   */
  getSettings(): AccessibilitySettings {
    return this.settings.value;
  }

  /**
   * Añade atributos ARIA a un elemento
   * @param element Elemento HTML
   * @param attributes Atributos ARIA
   */
  addAriaAttributes(element: HTMLElement, attributes: { [key: string]: string }): void {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`aria-${key}`, value);
    });
  }

  /**
   * Añade un mensaje para lectores de pantalla
   * @param message Mensaje a anunciar
   */
  announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  /**
   * Maneja la navegación por teclado
   * @param event Evento de teclado
   * @param elements Elementos navegables
   */
  handleKeyboardNavigation(event: KeyboardEvent, elements: HTMLElement[]): void {
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % elements.length;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = elements.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    elements[nextIndex].focus();
  }

  /**
   * Verifica si el contraste es suficiente
   * @param foregroundColor Color de primer plano
   * @param backgroundColor Color de fondo
   * @returns true si el contraste es suficiente
   */
  checkContrast(foregroundColor: string, backgroundColor: string): boolean {
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const getRGB = (color: string): [number, number, number] => {
      const hex = color.replace('#', '');
      return [
        parseInt(hex.substr(0, 2), 16),
        parseInt(hex.substr(2, 2), 16),
        parseInt(hex.substr(4, 2), 16)
      ];
    };

    const [r1, g1, b1] = getRGB(foregroundColor);
    const [r2, g2, b2] = getRGB(backgroundColor);
    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio >= 4.5; // WCAG AA standard
  }
}
