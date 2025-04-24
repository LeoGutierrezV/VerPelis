export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SearchParams extends PaginationParams {
  query: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

export interface MovieFilters {
  genre?: number[];
  year?: number;
  rating?: number;
  sortBy?: 'popularity' | 'rating' | 'release_date';
}

export interface MovieStats {
  totalMovies: number;
  totalGenres: number;
  averageRating: number;
  lastUpdated: Date;
}

export interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export interface SuccessResponse<T> {
  status: number;
  data: T;
  message?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateModel {
  state: LoadingState;
  error?: string;
  timestamp?: number;
}
