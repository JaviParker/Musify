// src/app/app.module.ts
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule, OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    OAuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: OAuthService) => () => authService.configure(authConfig),
      deps: [OAuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
