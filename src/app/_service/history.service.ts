import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../_model/movie.interface';

interface HistoryEntry {
  movie: Movie;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly historyKey = 'movie_history';
  private readonly maxHistorySize = 50;
  private readonly historySubject = new BehaviorSubject<HistoryEntry[]>([]);

  // Observable público
  readonly history$ = this.historySubject.asObservable();

  constructor() {
    this.loadHistory();
  }

  /**
   * Obtiene el historial de películas
   * @returns Observable con el array de entradas del historial
   */
  getHistory(): Observable<HistoryEntry[]> {
    return this.history$;
  }

  /**
   * Añade una película al historial
   * @param movie Película a añadir
   */
  addToHistory(movie: Movie): void {
    const entry: HistoryEntry = {
      movie,
      timestamp: Date.now()
    };

    const history = [entry, ...this.historySubject.value];
    const uniqueHistory = this.removeDuplicates(history);
    const limitedHistory = uniqueHistory.slice(0, this.maxHistorySize);

    this.updateHistory(limitedHistory);
  }

  /**
   * Limpia el historial
   */
  clearHistory(): void {
    this.updateHistory([]);
  }

  /**
   * Elimina una entrada del historial
   * @param movieId ID de la película
   */
  removeFromHistory(movieId: number): void {
    const history = this.historySubject.value.filter(entry => entry.movie.id !== movieId);
    this.updateHistory(history);
  }

  /**
   * Carga el historial almacenado
   */
  private loadHistory(): void {
    const storedHistory = localStorage.getItem(this.historyKey);
    if (storedHistory) {
      this.historySubject.next(JSON.parse(storedHistory));
    }
  }

  /**
   * Actualiza el historial y lo almacena
   * @param history Array de entradas del historial
   */
  private updateHistory(history: HistoryEntry[]): void {
    this.historySubject.next(history);
    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  /**
   * Elimina duplicados del historial manteniendo la entrada más reciente
   * @param history Array de entradas del historial
   * @returns Array de entradas sin duplicados
   */
  private removeDuplicates(history: HistoryEntry[]): HistoryEntry[] {
    const seen = new Set<number>();
    return history.filter(entry => {
      if (seen.has(entry.movie.id)) {
        return false;
      }
      seen.add(entry.movie.id);
      return true;
    });
  }
}
