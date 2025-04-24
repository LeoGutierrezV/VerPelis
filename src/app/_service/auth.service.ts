import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.tmdbApiUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'user_data';

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  readonly user$ = this.userSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  /**
   * Inicia sesión con usuario y contraseña
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con el usuario
   */
  login(username: string, password: string): Observable<User> {
    this.setLoading(true);
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
        this.setLoading(false);
      }),
      map(response => response.user),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Registra un nuevo usuario
   * @param user Datos del usuario
   * @returns Observable con el usuario
   */
  register(user: Partial<User>): Observable<User> {
    this.setLoading(true);
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/auth/register`, user).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response.user);
        this.setLoading(false);
      }),
      map(response => response.user),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.clearAuth();
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token de autenticación
   * @returns Token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Establece el token de autenticación
   * @param token Token de autenticación
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Establece los datos del usuario
   * @param user Datos del usuario
   */
  private setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Carga los datos del usuario almacenados
   */
  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.userKey);
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Limpia los datos de autenticación
   */
  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param error Error de la petición
   * @returns Observable con el error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 401:
          errorMessage = 'Credenciales inválidas';
          this.clearAuth();
          break;
        case 403:
          errorMessage = 'No tienes autorización para realizar esta acción';
          break;
        case 409:
          errorMessage = 'El usuario ya existe';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    this.setError(errorMessage);
    this.setLoading(false);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Establece el estado de carga
   * @param loading Estado de carga
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Establece el mensaje de error
   * @param message Mensaje de error
   */
  private setError(message: string | null): void {
    this.errorSubject.next(message);
  }
}
