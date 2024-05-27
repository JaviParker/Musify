// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.handleAuthentication();
      if (!this.authService.getToken()) {
        this.authService.authenticate();
      }
    });
  }

  ngOnInit() {
    if (!this.authService.getToken()) {
      this.authService.authenticate();
    }
  }
}
