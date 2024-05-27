import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { SpotifyCurrentlyPlaying } from '../models/spotify.models';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  userProfile: any;
  currentTrack: any = {};

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getUserProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );

    this.getCurrentlyPlaying();
  }

  ionViewWillEnter() {
    this.getCurrentlyPlaying();
  }

  play() {
    this.spotifyService.play().pipe(
      switchMap(async () => this.getCurrentlyPlaying())
    ).subscribe(
      () => {},
      (error) => {
        console.error('Error playing track:', error);
      }
    );
  }

  pause() {
    this.spotifyService.pause().pipe(
      switchMap(async () => this.getCurrentlyPlaying())
    ).subscribe(
      () => {},
      (error) => {
        console.error('Error pausing track:', error);
      }
    );
  }

  nextTrack() {
  this.spotifyService.nextTrack().pipe(
    switchMap(() => this.spotifyService.getCurrentlyPlaying())
  ).subscribe(
    (currentlyPlaying) => {
      this.currentTrack = currentlyPlaying;
    },
    (error) => {
      console.error('Error playing next track:', error);
    }
  );
  setTimeout(() => {
    this.getCurrentlyPlaying();
  }, 1000);
}

previousTrack() {
  this.spotifyService.previousTrack().pipe(
    switchMap(() => this.spotifyService.getCurrentlyPlaying())
  ).subscribe(
    (currentlyPlaying) => {
      this.currentTrack = currentlyPlaying;
    },
    (error) => {
      console.error('Error playing previous track:', error);
    }
  );
  setTimeout(() => {
    this.getCurrentlyPlaying();
  }, 1000);
}

  private getCurrentlyPlaying() {
    return this.spotifyService.getCurrentlyPlaying().subscribe(
      (currentlyPlaying) => {
        this.currentTrack = currentlyPlaying;
      },
      (error) => {
        console.error('Error fetching currently playing track:', error);
      }
    );
  }
}
