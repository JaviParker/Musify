import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-playlist-selection-modal',
  templateUrl: './playlist-selection-modal.component.html',
  styleUrls: ['./playlist-selection-modal.component.scss'],
})
export class PlaylistSelectionModalComponent {
  playlists = [] as any[] ;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  selectPlaylist(playlistId: string) {
    this.modalController.dismiss(playlistId);
  }
}
