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
  {
    path: 'icon',
    loadComponent: () =>
      import('./pages/icon/icon-page.component').then(m => m.IconPageComponent),
  },
  {
    path: 'icon-action-button',
    loadComponent: () =>
      import('./pages/icon-action-button/icon-action-button-page.component').then(
        m => m.IconActionButtonPageComponent,
      ),
  },
  {
    path: 'signal-dropdown',
    loadComponent: () =>
      import('./pages/signal-dropdown/signal-dropdown-page.component').then(
        m => m.SignalDropdownPageComponent,
      ),
  },
  {
    path: 'signal-text-input',
    loadComponent: () =>
      import('./pages/signal-text-input/signal-text-input-page.component').then(
        m => m.SignalTextInputPageComponent,
      ),
  },
  {
    path: 'signal-textarea',
    loadComponent: () =>
      import('./pages/signal-textarea/signal-textarea-page.component').then(
        m => m.SignalTextareaPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];



