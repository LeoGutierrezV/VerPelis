export const APP_CONSTANTS = {
  API: {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    DEFAULT_LANGUAGE: 'es-ES',
    CACHE_TIME: 5 * 60 * 1000, // 5 minutes
    IMAGE_SIZES: {
      SMALL: 'w185',
      MEDIUM: 'w342',
      LARGE: 'w500',
      ORIGINAL: 'original'
    }
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    PAGE_SIZE: 20,
    MAX_PAGES: 500
  },
  SEARCH: {
    MIN_LENGTH: 3,
    DEBOUNCE_TIME: 300
  },
  ROUTES: {
    HOME: '/',
    MOVIES: '/movies',
    MOVIE_DETAIL: '/movie/:id',
    SEARCH: '/search',
    FAVORITES: '/favorites',
    HISTORY: '/history',
    SETTINGS: '/settings'
  },
  STORAGE_KEYS: {
    FAVORITES: 'favorites',
    HISTORY: 'history',
    USER: 'user',
    THEME: 'theme'
  },
  ERROR_MESSAGES: {
    LOAD_ERROR: 'Error al cargar los datos',
    SAVE_ERROR: 'Error al guardar los datos',
    DELETE_ERROR: 'Error al eliminar los datos',
    NETWORK_ERROR: 'Error de conexión',
    UNAUTHORIZED: 'No autorizado',
    NOT_FOUND: 'No encontrado'
  },
  SUCCESS_MESSAGES: {
    SAVE_SUCCESS: 'Datos guardados correctamente',
    DELETE_SUCCESS: 'Datos eliminados correctamente',
    UPDATE_SUCCESS: 'Datos actualizados correctamente'
  }
};
