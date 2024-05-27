import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  people = [] as any[];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.renewTokenNow();
    // Verificar y renovar el token antes de hacer la solicitud
    // this.authService.renewTokenIfNeeded().subscribe(() => {
    //   // Realizar la solicitud una vez que se haya renovado el token (o si no es necesario renovarlo)
    // });
  }
}
