import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ComponentCard {
  path: string;
  name: string;
  tag: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-6 md:p-10">

      <!-- Hero -->
      <div class="mb-10">
        <h1 class="text-4xl font-bold mb-2 mt-0">KeepUI</h1>
        <p class="text-lg text-ku-gray-text leading-relaxed max-w-2xl m-0">
          Biblioteca de componentes Angular con soporte nativo para web y
          Angular&nbsp;+&nbsp;Capacitor. Diseñada para ser accesible, personalizable
          y compatible con temas claro y oscuro.
        </p>
      </div>

      <!-- Grid de componentes -->
      <section>
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-4 mt-0">
          Componentes disponibles
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (comp of components; track comp.path) {
            <a
              [routerLink]="comp.path"
              class="group flex flex-col gap-3 p-5 rounded-lg border no-underline
                     bg-ku-secondary border-ku-secondary-border text-ku-secondary-text
                     hover:border-ku-primary-border hover:shadow-sm
                     transition-all duration-200"
            >
              <div class="flex items-start justify-between gap-2">
                <span class="text-3xl leading-none">{{ comp.icon }}</span>
                <code class="text-xs px-2 py-0.5 rounded shrink-0
                             bg-ku-primary border border-ku-primary-border
                             text-ku-gray-text">
                  {{ comp.tag }}
                </code>
              </div>

              <div class="flex-1">
                <h3 class="font-semibold text-base mt-0 mb-1">{{ comp.name }}</h3>
                <p class="text-sm text-ku-gray-text m-0 leading-relaxed">
                  {{ comp.description }}
                </p>
              </div>

              <span class="text-xs font-semibold text-ku-brand-text
                           inline-flex items-center gap-1
                           group-hover:gap-2 transition-all duration-150">
                Ver componente <span>→</span>
              </span>
            </a>
          }
        </div>
      </section>

      <!-- Info de temas -->
      <section class="mt-10 rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-3 mt-0">
          Personalización de temas
        </h2>
        <p class="text-sm text-ku-gray-text mb-3">
          Todos los colores se pueden sobreescribir con CSS custom properties en tu proyecto:
        </p>
        <pre class="text-xs rounded-md p-4 overflow-x-auto m-0
                    bg-ku-primary border border-ku-primary-border"><code>:root {{ '{' }}
  --ku-primary:       #f0f4ff;
  --ku-primary-hover: #e0e8ff;
  --ku-secondary:     #fefce8;
{{ '}' }}

[data-theme="dark"] {{ '{' }}
  --ku-primary:       #0f172a;
  --ku-secondary:     #1e293b;
{{ '}' }}</code></pre>
      </section>

    </div>
  `,
})
export class HomePageComponent {
  components: ComponentCard[] = [
    {
      path: 'button',
      name: 'Button',
      tag: 'keepui-button',
      icon: '🔘',
      description:
        'Botón accesible con variantes default y primary, estados deshabilitados y tipos HTML.',
    },
    {
      path: 'card',
      name: 'Card',
      tag: 'keepui-card',
      icon: '🃏',
      description:
        'Contenedor versátil con cuatro niveles de elevación y proyección de contenido libre.',
    },
    {
      path: 'image-preview',
      name: 'Image Preview',
      tag: 'keepui-image-preview',
      icon: '🖼️',
      description:
        'Selector y previsualización de imágenes. Agnóstico de plataforma: funciona en web y Capacitor.',
    },
  ];
}

