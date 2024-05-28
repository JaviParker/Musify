import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { authConfig, getRedirectUri } from '../auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'spotify_token';
  private tokenExpirationKey = 'token_expiration';
  private accessToken: string | null = null;
  private tokenExpirationTime: Date | null = null;
  private redirectUri = getRedirectUri();

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem(this.tokenKey);
    this.tokenExpirationTime = localStorage.getItem(this.tokenExpirationKey)
      ? new Date(localStorage.getItem(this.tokenExpirationKey) as string)
      : null;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  setToken(token: string, expiresIn: number): void {
    this.accessToken = token;
    localStorage.setItem(this.tokenKey, token);

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + expiresIn);
    this.tokenExpirationTime = expirationTime;
    localStorage.setItem(this.tokenExpirationKey, expirationTime.toISOString());
  }

  clearToken(): void {
    this.accessToken = null;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
  }

  authenticate(): void {
    const params = new HttpParams()
      .set('response_type', 'token')
      .set('client_id', authConfig.clientId)
      .set('redirect_uri', this.redirectUri)
      .set('scope', 'user-read-private user-read-email user-modify-playback-state user-read-playback-state playlist-modify-public playlist-modify-private')
      .set('show_dialog', 'true');

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
      window.location.hash = '';
    }
  }

  isTokenExpired(): boolean {
    return !this.accessToken || !this.tokenExpirationTime || new Date() >= this.tokenExpirationTime;
  }

  renewTokenIfNeeded(): Observable<void> {
    if (this.isTokenExpired()) {
      this.clearToken();
      this.authenticate();
      return throwError('Token expired, redirecting to authenticate');
    } else {
      return of();
    }
  }
}
