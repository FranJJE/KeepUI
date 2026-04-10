import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/button/button-page.component').then(m => m.ButtonPageComponent),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./pages/card/card-page.component').then(m => m.CardPageComponent),
  },
  {
    path: 'image-preview',
    loadComponent: () =>
      import('./pages/image-preview/image-preview-page.component').then(
        m => m.ImagePreviewPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];

