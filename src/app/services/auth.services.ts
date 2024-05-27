import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { authConfig } from '../auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'spotify_token';
  private apiUrl = '...'; // URL del servidor de autenticación
  private accessToken: string | null = null;
  private tokenExpirationTime: Date | null = null;

  constructor(private http: HttpClient) {
    // Al inicializar el servicio, cargar el token y el tiempo de expiración si están presentes
    this.accessToken = localStorage.getItem(this.tokenKey);
    this.tokenExpirationTime = localStorage.getItem('token_expiration')
      ? new Date(localStorage.getItem('token_expiration') as string)
      : null;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  setToken(token: string, expiresIn: number): void {
    this.accessToken = token;
    localStorage.setItem(this.tokenKey, token);

    // Calcular y guardar el tiempo de expiración del token
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + expiresIn);
    this.tokenExpirationTime = expirationTime;
    localStorage.setItem('token_expiration', expirationTime.toISOString());
  }

  clearToken(): void {
    this.accessToken = null;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('token_expiration');
  }

  authenticate(): void {
    const params = new HttpParams()
      .set('response_type', 'token')
      .set('client_id', authConfig.clientId)
      .set('redirect_uri', authConfig.redirectUri)
      .set('scope', 'user-read-private user-read-email user-modify-playback-state user-read-playback-state playlist-modify-public playlist-modify-private') // Agrega 'user-modify-playback-state' al scope
      .set('show_dialog', 'true'); // Opcional: para forzar al usuario a aprobar la aplicación nuevamente si es necesario
  
    window.location.href = `${authConfig.authorizationEndpoint}?${params.toString()}`;
  }
  
  

  handleAuthentication(): void {
    const hash = window.location.hash.substr(1);
    const result: { [key: string]: string } = hash.split('&').reduce((res: { [key: string]: string }, item: string) => {
      const parts = item.split('=');
      res[parts[0]] = parts[1];
      return res;
    }, {});

    if (result['access_token']) {
      const expiresIn = parseInt(result['expires_in'], 10);
      this.setToken(result['access_token'], expiresIn);
      // Limpiar el hash de la URL
      window.location.hash = '';
    }
  }

  isTokenExpired(): boolean {
    return !this.accessToken || !this.tokenExpirationTime || new Date() >= this.tokenExpirationTime;
  }

  renewToken(): Observable<any> {
    const params = new HttpParams()
      .set('refresh_token', localStorage.getItem('refresh_token') || '');

    return this.http.post<any>(`${this.apiUrl}/refresh-token`, params).pipe(
      tap((response) => {
        this.setToken(response.access_token, response.expires_in);
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = 'spotify_token'; // Obtener el refresh token almacenado previamente

    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);
    params.set('client_id', authConfig.clientId);
    params.set('client_secret', authConfig.clientSecret);

    return this.http.post<any>(authConfig.tokenEndpoint, params.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      catchError(error => {
        this.clearToken(); // Limpiar el token almacenado si hay un error
        return throwError(error);
      })
    );
  }
  renewTokenIfNeeded(): Observable<void> {
    if (this.isTokenExpired()) {
      // Si el token está expirado, renovarlo
      return this.renewToken().pipe(
        catchError(() => {
          // Si no se puede renovar el token, redirigir al usuario para que inicie sesión nuevamente
          this.clearToken();
          this.authenticate();
          return throwError('Error renovando el token');
        })
      );
    } else {
      // Si el token no está expirado, no hacer nada
      return of();
    }
  }
  renewTokenNow(): Observable<void> {
      // Si el token está expirado, renovarlo
      return this.renewToken().pipe(
        catchError(() => {
          // Si no se puede renovar el token, redirigir al usuario para que inicie sesión nuevamente
          this.clearToken();
          this.authenticate();
          return throwError('Error renovando el token');
        })
      );
  }
}
