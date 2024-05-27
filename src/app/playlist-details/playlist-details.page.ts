import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { AuthService } from '../services/auth.services';
import { switchMap } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.page.html',
  styleUrls: ['./playlist-details.page.scss'],
})
export class PlaylistDetailsPage implements OnInit {
  playlistId!: string;
  playlistTracks: any[] = [];
  devices: any[] = [];
  contextUri: string | any;
  fakeLikesId = "247v1Aqw08CAInIxS5gIEe";
  tracks: any[] = [];
  playlistImage: string = "";
  playlistName: any;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      this.getPlaylistDetails(this.playlistId);
    });
    this.getAvailableDevices();
  }

  getPlaylistDetails(playlistId: string) {
    this.spotifyService.getPlaylist(playlistId).subscribe(
      (playlist: any) => {
        this.playlistTracks = playlist.tracks.items;
        this.playlistImage = playlist.images[0]?.url;
        this.playlistName = playlist.name;
        
        this.contextUri = `spotify:playlist:${playlistId}`; // Guardar el context URI
      },
      (error) => {
        console.error('Error fetching playlist details:', error);
      }
    );
  }

  async playTrack(trackUri: string, contextUri: string) {
    await this.getAvailableDevices(); // Asegúrate de tener los dispositivos actualizados

    if (this.devices.length === 0) {
      this.sinDispositivosActivos();
      return;
    }

    this.spotifyService.playTrack(trackUri, contextUri).pipe(
      switchMap(async () => this.spotifyService.getCurrentlyPlaying())
    ).subscribe(
      () => {},
      (error) => {
        console.error('Error playing track:', error);

        if (error.status === 404 || error.error?.reason === 'NO_ACTIVE_DEVICE') {
          this.sinDispositivosActivos();
        }
      }
    );
  }

  getAvailableDevices() {
    return this.spotifyService.getDevices().subscribe(
      (devices) => {
        this.devices = devices.devices;
      },
      (error) => {
        console.error('Error fetching available devices:', error);
      }
    );
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  async addTrackToPlaylist(trackUri: string) {
    this.spotifyService.addTrackToPlaylist("247v1Aqw08CAInIxS5gIEe", trackUri).subscribe(
      async () => {
        const toast = await this.toastController.create({
          message: 'Track added to playlist',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Error adding track to playlist',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
        console.error('Error adding track to playlist:', error);
      }
    );
  }

  async deleteTrack(trackId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this track?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Deletion cancelled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.spotifyService.removeTrackFromPlaylist(this.playlistId, trackId).subscribe(
              response => {
                console.log('Track deleted', response);
                this.loadTracks();
              },
              error => console.error('Error deleting track', error)
            );
          }
        }
      ]
    });

    await alert.present();
  }

  loadTracks() {
    this.spotifyService.getPlaylistTracks(this.playlistId).subscribe(
      tracks => this.tracks = tracks.items,
      error => console.error('Error fetching playlist tracks', error)
    );
  }

  async sinDispositivosActivos(){
    const alert = await this.alertController.create({
      header: 'No active devices',
      message: 'You should open and play something in Spotify firts',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            console.log('Open your Spotify ab play something, then try it again');
          }
        }
      ]
    });

    await alert.present();
  }
}
