import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.renewTokenIfNeeded().subscribe(
      () => {
        // Realizar la solicitud una vez que se haya renovado el token (o si no es necesario renovarlo)
      },
      (error) => {
        console.error('Error renewing token:', error);
        // Opcional: manejar el error (por ejemplo, redirigir al usuario a una página de error)
      }
    );
  }
}
