import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PerformanceService } from './performance.service';
import { APP_CONSTANTS } from '../_constants/app.constants';

interface ResourceMetrics {
  imageSize: number;
  scriptSize: number;
  styleSize: number;
  totalRequests: number;
  unusedResources: string[];
  optimizationScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceOptimizationService {
  private metrics = new BehaviorSubject<ResourceMetrics>({
    imageSize: 0,
    scriptSize: 0,
    styleSize: 0,
    totalRequests: 0,
    unusedResources: [],
    optimizationScore: 100
  });

  private readonly OPTIMIZATION_THRESHOLDS = {
    maxImageSize: 500 * 1024, // 500KB
    maxScriptSize: 200 * 1024, // 200KB
    maxStyleSize: 100 * 1024, // 100KB
    maxRequests: 50
  };

  constructor(private performanceService: PerformanceService) {
    this.startOptimization();
  }

  /**
   * Inicia el proceso de optimización
   */
  private startOptimization(): void {
    // Monitoreo periódico de recursos
    interval(APP_CONSTANTS.API.CACHE_TIME).pipe(
      tap(() => this.analyzeResources())
    ).subscribe();

    // Optimización basada en rendimiento
    this.performanceService.getMetrics().pipe(
      filter(metrics => metrics.memoryUsage > 300), // 300MB
      tap(() => this.optimizeMemory())
    ).subscribe();
  }

  /**
   * Analiza los recursos de la aplicación
   */
  private analyzeResources(): void {
    const resources = this.getResourceMetrics();
    const unusedResources = this.findUnusedResources();
    const optimizationScore = this.calculateOptimizationScore(resources);

    this.metrics.next({
      ...resources,
      unusedResources,
      optimizationScore
    });

    this.applyOptimizations(resources, unusedResources);
  }

  /**
   * Obtiene métricas de recursos
   */
  private getResourceMetrics(): Omit<ResourceMetrics, 'unusedResources' | 'optimizationScore'> {
    const images = document.getElementsByTagName('img');
    const scripts = document.getElementsByTagName('script');
    const styles = document.getElementsByTagName('link');
    const requests = performance.getEntriesByType('resource');

    return {
      imageSize: this.calculateTotalSize(images),
      scriptSize: this.calculateTotalSize(scripts),
      styleSize: this.calculateTotalSize(styles),
      totalRequests: requests.length
    };
  }

  /**
   * Calcula el tamaño total de un conjunto de elementos
   */
  private calculateTotalSize(elements: HTMLCollectionOf<Element>): number {
    let totalSize = 0;
    for (const element of elements) {
      const resource = element as HTMLElement;
      if (resource.dataset.size) {
        totalSize += parseInt(resource.dataset.size, 10);
      }
    }
    return totalSize;
  }

  /**
   * Encuentra recursos no utilizados
   */
  private findUnusedResources(): string[] {
    const unused: string[] = [];
    const resources = performance.getEntriesByType('resource');

    for (const resource of resources) {
      if (!this.isResourceUsed(resource.name)) {
        unused.push(resource.name);
      }
    }

    return unused;
  }

  /**
   * Verifica si un recurso está siendo utilizado
   */
  private isResourceUsed(resourceName: string): boolean {
    // Implementar lógica de detección de uso
    return true; // Placeholder
  }

  /**
   * Calcula el puntaje de optimización
   */
  private calculateOptimizationScore(resources: Omit<ResourceMetrics, 'unusedResources' | 'optimizationScore'>): number {
    let score = 100;
    const { imageSize, scriptSize, styleSize, totalRequests } = resources;

    if (imageSize > this.OPTIMIZATION_THRESHOLDS.maxImageSize) {
      score -= 20;
    }
    if (scriptSize > this.OPTIMIZATION_THRESHOLDS.maxScriptSize) {
      score -= 15;
    }
    if (styleSize > this.OPTIMIZATION_THRESHOLDS.maxStyleSize) {
      score -= 10;
    }
    if (totalRequests > this.OPTIMIZATION_THRESHOLDS.maxRequests) {
      score -= 25;
    }

    return Math.max(0, score);
  }

  /**
   * Aplica optimizaciones basadas en las métricas
   */
  private applyOptimizations(resources: Omit<ResourceMetrics, 'unusedResources' | 'optimizationScore'>, unusedResources: string[]): void {
    // Optimización de imágenes
    if (resources.imageSize > this.OPTIMIZATION_THRESHOLDS.maxImageSize) {
      this.optimizeImages();
    }

    // Optimización de scripts
    if (resources.scriptSize > this.OPTIMIZATION_THRESHOLDS.maxScriptSize) {
      this.optimizeScripts();
    }

    // Optimización de estilos
    if (resources.styleSize > this.OPTIMIZATION_THRESHOLDS.maxStyleSize) {
      this.optimizeStyles();
    }

    // Limpieza de recursos no utilizados
    if (unusedResources.length > 0) {
      this.cleanupUnusedResources(unusedResources);
    }
  }

  /**
   * Optimiza imágenes
   */
  private optimizeImages(): void {
    const images = document.getElementsByTagName('img');
    for (const img of images) {
      if (img instanceof HTMLImageElement) {
        // Implementar optimización de imágenes
        this.lazyLoadImage(img);
        this.compressImage(img);
      }
    }
  }

  /**
   * Optimiza scripts
   */
  private optimizeScripts(): void {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      if (script instanceof HTMLScriptElement) {
        // Implementar optimización de scripts
        this.deferScript(script);
        this.minifyScript(script);
      }
    }
  }

  /**
   * Optimiza estilos
   */
  private optimizeStyles(): void {
    const styles = document.getElementsByTagName('link');
    for (const style of styles) {
      if (style instanceof HTMLLinkElement) {
        // Implementar optimización de estilos
        this.criticalCSS(style);
        this.minifyStyles(style);
      }
    }
  }

  /**
   * Limpia recursos no utilizados
   */
  private cleanupUnusedResources(resources: string[]): void {
    for (const resource of resources) {
      // Implementar limpieza de recursos
      console.log(`Limpiando recurso no utilizado: ${resource}`);
    }
  }

  /**
   * Optimiza el uso de memoria
   */
  private optimizeMemory(): void {
    // Implementar optimización de memoria
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * Carga perezosa de imágenes
   */
  private lazyLoadImage(img: HTMLImageElement): void {
    if (!img.loading) {
      img.loading = 'lazy';
    }
  }

  /**
   * Comprime una imagen
   */
  private compressImage(img: HTMLImageElement): void {
    // Implementar compresión de imágenes
    console.log(`Comprimiendo imagen: ${img.src}`);
  }

  /**
   * Diferir carga de script
   */
  private deferScript(script: HTMLScriptElement): void {
    if (!script.defer) {
      script.defer = true;
    }
  }

  /**
   * Minifica un script
   */
  private minifyScript(script: HTMLScriptElement): void {
    // Implementar minificación de scripts
    console.log(`Minificando script: ${script.src}`);
  }

  /**
   * Extrae CSS crítico
   */
  private criticalCSS(style: HTMLLinkElement): void {
    // Implementar extracción de CSS crítico
    console.log(`Extrayendo CSS crítico de: ${style.href}`);
  }

  /**
   * Minifica estilos
   */
  private minifyStyles(style: HTMLLinkElement): void {
    // Implementar minificación de estilos
    console.log(`Minificando estilos: ${style.href}`);
  }

  /**
   * Obtiene las métricas actuales
   */
  getMetrics(): Observable<ResourceMetrics> {
    return this.metrics.asObservable();
  }

  /**
   * Obtiene el puntaje de optimización
   */
  getOptimizationScore(): Observable<number> {
    return this.metrics.pipe(
      map(m => m.optimizationScore),
      distinctUntilChanged()
    );
  }

  /**
   * Obtiene recursos no utilizados
   */
  getUnusedResources(): Observable<string[]> {
    return this.metrics.pipe(
      map(m => m.unusedResources),
      distinctUntilChanged()
    );
  }

  /**
   * Genera un reporte de optimización
   */
  generateReport(): ResourceMetrics {
    return this.metrics.value;
  }

  /**
   * Reinicia las métricas
   */
  resetMetrics(): void {
    this.metrics.next({
      imageSize: 0,
      scriptSize: 0,
      styleSize: 0,
      totalRequests: 0,
      unusedResources: [],
      optimizationScore: 100
    });
  }
}
