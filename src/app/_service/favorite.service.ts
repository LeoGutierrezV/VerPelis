import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Movie } from '../_model/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly favoritesKey = 'favorite_movies';
  private readonly favoritesSubject = new BehaviorSubject<Movie[]>([]);

  // Observable público
  readonly favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  /**
   * Obtiene todas las películas favoritas
   * @returns Observable con el array de películas favoritas
   */
  getFavorites(): Observable<Movie[]> {
    return this.favorites$;
  }

  /**
   * Verifica si una película es favorita
   * @param movieId ID de la película
   * @returns true si la película es favorita
   */
  isFavorite(movieId: number): boolean {
    return this.favoritesSubject.value.some(movie => movie.id === movieId);
  }

  /**
   * Añade una película a favoritos
   * @param movie Película a añadir
   * @returns Observable con el array actualizado de favoritos
   */
  addFavorite(movie: Movie): Observable<Movie[]> {
    if (this.isFavorite(movie.id)) {
      return this.favorites$;
    }

    const favorites = [...this.favoritesSubject.value, movie];
    this.updateFavorites(favorites);
    return this.favorites$;
  }

  /**
   * Elimina una película de favoritos
   * @param movieId ID de la película
   * @returns Observable con el array actualizado de favoritos
   */
  removeFavorite(movieId: number): Observable<Movie[]> {
    const favorites = this.favoritesSubject.value.filter(movie => movie.id !== movieId);
    this.updateFavorites(favorites);
    return this.favorites$;
  }

  /**
   * Alterna el estado de favorito de una película
   * @param movie Película a alternar
   * @returns Observable con el array actualizado de favoritos
   */
  toggleFavorite(movie: Movie): Observable<Movie[]> {
    return this.isFavorite(movie.id)
      ? this.removeFavorite(movie.id)
      : this.addFavorite(movie);
  }

  /**
   * Limpia todos los favoritos
   */
  clearFavorites(): void {
    this.updateFavorites([]);
  }

  /**
   * Carga los favoritos almacenados
   */
  private loadFavorites(): void {
    const storedFavorites = localStorage.getItem(this.favoritesKey);
    if (storedFavorites) {
      this.favoritesSubject.next(JSON.parse(storedFavorites));
    }
  }

  /**
   * Actualiza los favoritos y los almacena
   * @param favorites Array de películas favoritas
   */
  private updateFavorites(favorites: Movie[]): void {
    this.favoritesSubject.next(favorites);
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }
}
