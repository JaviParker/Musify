// src/app/tab1/tab1.page.ts
import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { SpotifyPlaylist } from '../models/spotify.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  playlists: SpotifyPlaylist[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.spotifyService.getTopPlaylists().subscribe(
      playlists => this.playlists = playlists,
      error => console.error('Error fetching playlists', error)
    );
  }

  goToPlaylistDetails(playlistId: string) {
    this.router.navigate(['/playlist-details', playlistId]);
  }
}
