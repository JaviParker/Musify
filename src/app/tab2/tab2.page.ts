// src/app/tab2/tab2.page.ts
import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { SpotifyPlaylist } from '../models/spotify.models';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  playlists: SpotifyPlaylist[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserPlaylists();
  }

  private loadUserPlaylists() {
    this.spotifyService.getUserPlaylists().subscribe(
      playlists => this.playlists = playlists,
      error => {
        console.error('Error fetching user playlists', error);
        if (error === 'Not authenticated') {
          // Authentication will be handled by the service
          return;
        }
      }
    );
  }
  goToPlaylistDetails(playlistId: string) {
    this.router.navigate(['/playlist-details', playlistId]);
  }
}
