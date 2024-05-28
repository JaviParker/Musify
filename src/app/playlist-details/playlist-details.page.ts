import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { AuthService } from '../services/auth.services';
import { switchMap } from 'rxjs';
import { AlertController, ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { SpotifyPlaylist } from '../models/spotify.models';
import { PlaylistSelectionModalComponent } from '../playlist-selection-modal/playlist-selection-modal.component';

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
  playlistImage: string = "";
  playlistName: any;
  userPlaylists: any[] = []; // Inicializar como un array vacío
  tracks: any[] = []; // Asegurarse de declarar la propiedad tracks
  playlists: SpotifyPlaylist[] = [];
  playlistsLoaded: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      this.getPlaylistDetails(this.playlistId);
    });
    this.getAvailableDevices();
    this.loadUserPlaylists();
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

  // async loadUserPlaylists() {
  //   this.spotifyService.getUserPlaylists().subscribe(
  //     (playlists: any) => {
  //       this.userPlaylists = playlists.items || []; // Asegurarse de que sea un array
  //     },
  //     (error) => {
  //       console.error('Error fetching user playlists:', error);
  //       this.userPlaylists = []; // Asegurarse de que sea un array
  //     }
  //   );
  // }

  
  getUserPlaylists(){
    this.spotifyService.getUserPlaylists().subscribe(
      playlists => this.playlists = playlists,
      error => console.error('Error fetching user playlists', error),
    );
  }

  async loadUserPlaylists() {
    this.spotifyService.getUserPlaylists().subscribe(
      (playlists: any) => {
        this.userPlaylists = playlists.items || [];
        this.playlistsLoaded = true; // Marcar como cargado una vez que se obtienen las listas de reproducción
      },
      (error) => {
        console.error('Error fetching user playlists:', error);
        this.userPlaylists = [];
        this.playlistsLoaded = true; // Marcar como cargado incluso si hay un error
      }
    );
  }

  async openPlaylistSelection(trackUri: string) {

    let privatePlaylists: SpotifyPlaylist[] = [];

    this.spotifyService.getUserPlaylists().subscribe(
      async playlists => {
        const modal = await this.modalController.create({
          component: PlaylistSelectionModalComponent,
          componentProps: {
            playlists: playlists
          },
        });
    
        modal.onDidDismiss().then((data) => {
          const playlistId = data?.data;
          if (playlistId) {
            this.addTrackToSelectedPlaylist(trackUri, playlistId);
          }
        });
    
        await modal.present();
      },
      error => console.error('Error fetching user playlists', error)
    );
  }


  async addTrackToSelectedPlaylist(trackUri: string, playlistId: string) {
    this.spotifyService.addTrackToPlaylist(playlistId, trackUri).subscribe(
      async () => {
        const toast = await this.toastController.create({
          message: `Track added to ${playlistId}`,
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
                this.route.params.subscribe(params => {
                  this.playlistId = params['id'];
                  this.getPlaylistDetails(this.playlistId);
                });
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
      message: 'You should open and play something in Spotify first',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            console.log('Open your Spotify and play something, then try it again');
          }
        }
      ]
    });

    await alert.present();
  }
}
