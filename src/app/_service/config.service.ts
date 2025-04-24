import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppConfig {
  theme: 'light' | 'dark';
  language: string;
  autoPlay: boolean;
  quality: 'low' | 'medium' | 'high';
  notifications: boolean;
  maxHistorySize: number;
  maxFavoritesSize: number;
}

const DEFAULT_CONFIG: AppConfig = {
  theme: 'dark',
  language: 'es-ES',
  autoPlay: false,
  quality: 'high',
  notifications: true,
  maxHistorySize: 50,
  maxFavoritesSize: 100
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly configKey = 'app_config';
  private readonly configSubject = new BehaviorSubject<AppConfig>(DEFAULT_CONFIG);

  // Observable público
  readonly config$ = this.configSubject.asObservable();

  constructor() {
    this.loadConfig();
  }

  /**
   * Obtiene la configuración actual
   * @returns Observable con la configuración
   */
  getConfig(): Observable<AppConfig> {
    return this.config$;
  }

  /**
   * Actualiza la configuración
   * @param config Nueva configuración
   */
  updateConfig(config: Partial<AppConfig>): void {
    const currentConfig = this.configSubject.value;
    const newConfig = { ...currentConfig, ...config };
    this.updateConfigAndStore(newConfig);
  }

  /**
   * Restablece la configuración a los valores por defecto
   */
  resetConfig(): void {
    this.updateConfigAndStore(DEFAULT_CONFIG);
  }

  /**
   * Obtiene un valor específico de la configuración
   * @param key Clave de la configuración
   * @returns Valor de la configuración
   */
  getValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.configSubject.value[key];
  }

  /**
   * Actualiza un valor específico de la configuración
   * @param key Clave de la configuración
   * @param value Nuevo valor
   */
  setValue<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.updateConfig({ [key]: value });
  }

  /**
   * Carga la configuración almacenada
   */
  private loadConfig(): void {
    const storedConfig = localStorage.getItem(this.configKey);
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      this.configSubject.next({ ...DEFAULT_CONFIG, ...parsedConfig });
    }
  }

  /**
   * Actualiza la configuración y la almacena
   * @param config Nueva configuración
   */
  private updateConfigAndStore(config: AppConfig): void {
    this.configSubject.next(config);
    localStorage.setItem(this.configKey, JSON.stringify(config));
  }
}
