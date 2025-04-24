import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_CONSTANTS } from '../_constants/app.constants';

export interface Translation {
  [key: string]: string;
}

const TRANSLATIONS: { [key: string]: Translation } = {
  'es-ES': {
    // General
    'app.title': 'VerPelis',
    'app.loading': 'Cargando...',
    'app.error': 'Error',
    'app.success': 'Éxito',
    'app.save': 'Guardar',
    'app.cancel': 'Cancelar',
    'app.delete': 'Eliminar',
    'app.edit': 'Editar',
    'app.search': 'Buscar',
    'app.noResults': 'No se encontraron resultados',

    // Movies
    'movies.title': 'Películas',
    'movies.popular': 'Populares',
    'movies.topRated': 'Mejor Valoradas',
    'movies.upcoming': 'Próximamente',
    'movies.nowPlaying': 'En Cartelera',
    'movies.similar': 'Películas Similares',
    'movies.duration': 'Duración',
    'movies.rating': 'Valoración',
    'movies.releaseDate': 'Fecha de Estreno',
    'movies.overview': 'Sinopsis',
    'movies.addToFavorites': 'Añadir a Favoritos',
    'movies.removeFromFavorites': 'Quitar de Favoritos',

    // Search
    'search.title': 'Buscar Películas',
    'search.placeholder': 'Buscar por título...',
    'search.minLength': 'Introduce al menos 3 caracteres',
    'search.noResults': 'No se encontraron películas',

    // Favorites
    'favorites.title': 'Mis Favoritos',
    'favorites.empty': 'No tienes películas favoritas',
    'favorites.added': 'Película añadida a favoritos',
    'favorites.removed': 'Película eliminada de favoritos',

    // History
    'history.title': 'Historial',
    'history.empty': 'No hay historial de visualización',
    'history.cleared': 'Historial limpiado',

    // Settings
    'settings.title': 'Configuración',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificaciones',
    'settings.autoPlay': 'Reproducción Automática',
    'settings.quality': 'Calidad de Video',

    // Errors
    'error.loading': 'Error al cargar los datos',
    'error.saving': 'Error al guardar los datos',
    'error.deleting': 'Error al eliminar los datos',
    'error.network': 'Error de conexión',
    'error.unauthorized': 'No autorizado',
    'error.notFound': 'No encontrado',

    // Success
    'success.saving': 'Datos guardados correctamente',
    'success.deleting': 'Datos eliminados correctamente',
    'success.updating': 'Datos actualizados correctamente'
  },
  'en-US': {
    // General
    'app.title': 'WatchMovies',
    'app.loading': 'Loading...',
    'app.error': 'Error',
    'app.success': 'Success',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.search': 'Search',
    'app.noResults': 'No results found',

    // Movies
    'movies.title': 'Movies',
    'movies.popular': 'Popular',
    'movies.topRated': 'Top Rated',
    'movies.upcoming': 'Upcoming',
    'movies.nowPlaying': 'Now Playing',
    'movies.similar': 'Similar Movies',
    'movies.duration': 'Duration',
    'movies.rating': 'Rating',
    'movies.releaseDate': 'Release Date',
    'movies.overview': 'Overview',
    'movies.addToFavorites': 'Add to Favorites',
    'movies.removeFromFavorites': 'Remove from Favorites',

    // Search
    'search.title': 'Search Movies',
    'search.placeholder': 'Search by title...',
    'search.minLength': 'Enter at least 3 characters',
    'search.noResults': 'No movies found',

    // Favorites
    'favorites.title': 'My Favorites',
    'favorites.empty': 'You have no favorite movies',
    'favorites.added': 'Movie added to favorites',
    'favorites.removed': 'Movie removed from favorites',

    // History
    'history.title': 'History',
    'history.empty': 'No viewing history',
    'history.cleared': 'History cleared',

    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.autoPlay': 'Auto Play',
    'settings.quality': 'Video Quality',

    // Errors
    'error.loading': 'Error loading data',
    'error.saving': 'Error saving data',
    'error.deleting': 'Error deleting data',
    'error.network': 'Network error',
    'error.unauthorized': 'Unauthorized',
    'error.notFound': 'Not found',

    // Success
    'success.saving': 'Data saved successfully',
    'success.deleting': 'Data deleted successfully',
    'success.updating': 'Data updated successfully'
  }
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLang = new BehaviorSubject<string>(APP_CONSTANTS.API.DEFAULT_LANGUAGE);
  private translations = new BehaviorSubject<Translation>(TRANSLATIONS[APP_CONSTANTS.API.DEFAULT_LANGUAGE]);

  constructor() {
    this.loadSavedLanguage();
  }

  /**
   * Carga el idioma guardado
   */
  private loadSavedLanguage(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang && TRANSLATIONS[savedLang]) {
      this.setLanguage(savedLang);
    }
  }

  /**
   * Establece el idioma actual
   * @param lang Código del idioma
   */
  setLanguage(lang: string): void {
    if (TRANSLATIONS[lang]) {
      this.currentLang.next(lang);
      this.translations.next(TRANSLATIONS[lang]);
      localStorage.setItem('language', lang);
    }
  }

  /**
   * Obtiene la traducción de una clave
   * @param key Clave de traducción
   * @returns Texto traducido
   */
  translate(key: string): string {
    return this.translations.value[key] || key;
  }

  /**
   * Obtiene el idioma actual
   * @returns Código del idioma
   */
  getCurrentLang(): string {
    return this.currentLang.value;
  }

  /**
   * Obtiene la lista de idiomas disponibles
   * @returns Array de códigos de idioma
   */
  getAvailableLanguages(): string[] {
    return Object.keys(TRANSLATIONS);
  }
}
