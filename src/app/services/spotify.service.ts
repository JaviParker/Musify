// src/app/services/spotify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.services';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SpotifyPlaylistsResponse, SpotifyPlaylist, SpotifyCurrentlyPlaying } from '../models/spotify.models';

declare const Spotify: any;

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private readonly apiUrl = 'https://api.spotify.com/v1';
  private player: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTopPlaylists(): Observable<SpotifyPlaylist[]> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.get<{ playlists: SpotifyPlaylistsResponse }>(`${this.apiUrl}/browse/featured-playlists`, { headers })
      .pipe(map(response => response.playlists.items));
  }

  getUserPlaylists(): Observable<SpotifyPlaylist[]> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.get<SpotifyPlaylistsResponse>(`${this.apiUrl}/me/playlists`, { headers })
      .pipe(map(response => response.items));
  }

  getUserProfile(): Observable<any> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  getPlaylistTracks(playlistId: string): Observable<any> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get(`${this.apiUrl}/playlists/${playlistId}/tracks`, { headers });
  }

  getDevices(): Observable<any> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get<any>(`${this.apiUrl}/me/player/devices`, { headers }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getCurrentlyPlaying(): Observable<SpotifyCurrentlyPlaying> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.get<SpotifyCurrentlyPlaying>(`${this.apiUrl}/me/player/currently-playing`, { headers });
  }

  play(): Observable<void> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.put<void>(`${this.apiUrl}/me/player/play`, null, { headers });
  }

  pause(): Observable<void> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.put<void>(`${this.apiUrl}/me/player/pause`, null, { headers });
  }

  nextTrack(): Observable<void> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.post<void>(`${this.apiUrl}/me/player/next`, null, { headers });
  }

  previousTrack(): Observable<void> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.post<void>(`${this.apiUrl}/me/player/previous`, null, { headers });
  }

  playTrack(trackUri: string, contextUri: string): Observable<void> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
  
    const body = {
      context_uri: contextUri,
      offset: {
        uri: trackUri
      }
    };
  
    return this.http.put<void>(`${this.apiUrl}/me/player/play`, body, { headers });
  }

  addTrackToPlaylist(playlistId: string, trackUri: string): Observable<void> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    const body = {
      uris: [trackUri]
    };

    return this.http.post<void>(`${this.apiUrl}/playlists/${playlistId}/tracks`, body, { headers });
  }

  removeTrackFromPlaylist(playlistId: string, trackId: string): Observable<any> {
    const url = `${this.apiUrl}/playlists/${playlistId}/tracks`;
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    const body = {
      tracks: [{ uri: `spotify:track:${trackId}` }]
    };
    return this.http.request('delete', url, { headers, body });
  }

  getPlaylist(playlistId: string): Observable<SpotifyPlaylist> {
    const accessToken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.get<SpotifyPlaylist>(`${this.apiUrl}/playlists/${playlistId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching playlist:', error);
          return throwError(error);
        })
      );
  }
}
