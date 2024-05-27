import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PlaylistDetailsPage } from './playlist-details/playlist-details.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'playlist-details',
    loadChildren: () => import('./playlist-details/playlist-details.module').then( m => m.PlaylistDetailsPageModule)
  },
  {
    path: 'playlist-details/:id', // Ruta con parámetro ':id'
    component: PlaylistDetailsPage // Componente asociado a la ruta
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
