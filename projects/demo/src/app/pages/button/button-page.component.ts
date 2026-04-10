import { Component, signal } from '@angular/core';
import { ButtonComponent, ButtonVariant, ButtonShape, ButtonSize } from '@keepui/ui';

interface ApiRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  selector: 'app-button-page',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <!-- Page header -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Button</h1>
        <p class="text-keepui-text-muted leading-relaxed mb-3">
          Botón accesible con soporte de variantes, formas, tamaños, estado de carga,
          ancho completo, iconos vía slots y atributos ARIA. Compatible con web y
          Angular&nbsp;+&nbsp;Capacitor sin ninguna dependencia nativa.
        </p>
        <code class="text-sm text-keepui-primary">&lt;keepui-button&gt;</code>
      </div>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Variantes
        </h2>
        <div class="flex flex-wrap gap-3 items-center">
          <keepui-button variant="primary" size="auto" (clicked)="onClicked('primary')">Primary</keepui-button>
          <keepui-button variant="secondary" size="auto" (clicked)="onClicked('secondary')">Secondary</keepui-button>
          <keepui-button variant="outline" size="auto" (clicked)="onClicked('outline')">Outline</keepui-button>
          <keepui-button variant="ghost" size="auto" (clicked)="onClicked('ghost')">Ghost</keepui-button>
          <keepui-button variant="danger" size="auto" (clicked)="onClicked('danger')">Danger</keepui-button>
        </div>
        <p class="mt-4 mb-0 text-sm text-keepui-text-muted">
          Último click: <strong class="text-keepui-text">{{ lastClicked() }}</strong>
        </p>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Formas
        </h2>
        <div class="flex flex-wrap gap-3 items-center">
          <keepui-button variant="primary" shape="pill" size="auto">Pill</keepui-button>
          <keepui-button variant="primary" shape="rounded" size="auto">Rounded</keepui-button>
          <keepui-button variant="secondary" shape="pill" size="auto">Secondary Pill</keepui-button>
          <keepui-button variant="secondary" shape="rounded" size="auto">Secondary Rounded</keepui-button>
        </div>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Tamaños
        </h2>
        <div class="flex flex-wrap gap-3 items-center">
          <keepui-button variant="primary" size="md">size="md" (160 px)</keepui-button>
          <keepui-button variant="primary" size="auto">size="auto" (contenido)</keepui-button>
        </div>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-1">
          Estado de carga
        </h2>
        <p class="text-sm text-keepui-text-muted mt-0 mb-4">
          Cuando <code class="text-keepui-primary">loading=true</code> el botón se deshabilita,
          muestra un spinner animado y expone <code class="text-keepui-primary">aria-busy="true"</code>.
        </p>
        <div class="flex flex-wrap gap-3 items-center mb-4">
          @for (v of variants; track v) {
            <keepui-button
              [variant]="v"
              size="auto"
              [loading]="isLoading()"
              (clicked)="onClicked(v)"
            >{{ v }}</keepui-button>
          }
        </div>
        <keepui-button variant="secondary" size="auto" (clicked)="toggleLoading()">
          {{ isLoading() ? '⏹ Detener carga' : '▶ Simular carga' }}
        </keepui-button>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Ancho completo
        </h2>
        <div class="flex flex-col gap-3">
          <keepui-button variant="primary" [fullWidth]="true">Primary full-width</keepui-button>
          <keepui-button variant="outline" shape="rounded" [fullWidth]="true">Outline rounded full-width</keepui-button>
        </div>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-1">
          Con iconos (slots)
        </h2>
        <p class="text-sm text-keepui-text-muted mt-0 mb-4">
          Usa los atributos <code class="text-keepui-primary">slot="leading"</code> y
          <code class="text-keepui-primary">slot="trailing"</code> para colocar iconos inline.
        </p>
        <div class="flex flex-wrap gap-3 items-center">
          <keepui-button variant="primary" size="auto">
            <svg slot="leading" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo
          </keepui-button>

          <keepui-button variant="outline" size="auto">
            Guardar
            <svg slot="trailing" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </keepui-button>

          <keepui-button variant="danger" size="auto">
            <svg slot="leading" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path>
            </svg>
            Eliminar
          </keepui-button>

          <keepui-button variant="ghost" size="auto" ariaLabel="Configuración">
            <svg slot="leading" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83
                       2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33
                       1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09
                       A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06
                       a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15
                       a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09
                       A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06
                       a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68
                       a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09
                       a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06
                       a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9
                       a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09
                       a1.65 1.65 0 00-1.51 1z"></path>
            </svg>
          </keepui-button>
        </div>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Estado deshabilitado
        </h2>
        <div class="flex flex-wrap gap-3 items-center mb-4">
          @for (v of variants; track v) {
            <keepui-button [variant]="v" size="auto" [disabled]="true">{{ v }}</keepui-button>
          }
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <keepui-button variant="secondary" size="auto" (clicked)="toggleDisabled()">
            {{ isDisabled() ? '✅ Habilitar' : '🚫 Deshabilitar' }}
          </keepui-button>
          <keepui-button
            variant="primary"
            size="auto"
            [disabled]="isDisabled()"
            (clicked)="onClicked('dinámico')"
          >
            Botón dinámico
          </keepui-button>
        </div>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Tipos HTML
        </h2>
        <div class="flex flex-wrap gap-3">
          <keepui-button variant="secondary" size="auto" type="button">type="button"</keepui-button>
          <keepui-button variant="secondary" size="auto" type="submit">type="submit"</keepui-button>
          <keepui-button variant="secondary" size="auto" type="reset">type="reset"</keepui-button>
        </div>
      </section>

      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          API
        </h2>
        <div class="overflow-x-auto -mx-2">
          <table class="w-full text-sm text-left border-collapse min-w-max">
            <thead>
              <tr class="border-b border-keepui-border">
                <th class="py-2 px-2 font-semibold text-keepui-text-muted">Propiedad</th>
                <th class="py-2 px-2 font-semibold text-keepui-text-muted">Tipo</th>
                <th class="py-2 px-2 font-semibold text-keepui-text-muted">Default</th>
                <th class="py-2 px-2 font-semibold text-keepui-text-muted">Descripción</th>
              </tr>
            </thead>
            <tbody>
              @for (row of apiRows; track row.name) {
                <tr class="border-b border-keepui-border last:border-0">
                  <td class="py-2 px-2">
                    <code class="text-keepui-primary">{{ row.name }}</code>
                  </td>
                  <td class="py-2 px-2 font-mono text-xs text-keepui-text-muted">{{ row.type }}</td>
                  <td class="py-2 px-2 font-mono text-xs text-keepui-text-muted">{{ row.default }}</td>
                  <td class="py-2 px-2 text-xs text-keepui-text-muted">{{ row.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
})
export class ButtonPageComponent {
  lastClicked = signal('—');
  isDisabled = signal(false);
  isLoading = signal(false);

  readonly variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

  apiRows: ApiRow[] = [
    {
      name: '[variant]',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
      default: "'primary'",
      description: 'Estilo visual del botón.',
    },
    {
      name: '[size]',
      type: "'md' | 'auto'",
      default: "'md'",
      description: "md: 160 px fijo. auto: ancho dinámico con padding.",
    },
    {
      name: '[shape]',
      type: "'pill' | 'rounded'",
      default: "'pill'",
      description: 'Forma de los bordes del botón.',
    },
    {
      name: '[type]',
      type: "'button' | 'submit' | 'reset'",
      default: "'button'",
      description: 'Tipo HTML nativo.',
    },
    {
      name: '[disabled]',
      type: 'boolean',
      default: 'false',
      description: 'Deshabilita el botón.',
    },
    {
      name: '[loading]',
      type: 'boolean',
      default: 'false',
      description: 'Muestra spinner, desactiva el botón y expone aria-busy.',
    },
    {
      name: '[fullWidth]',
      type: 'boolean',
      default: 'false',
      description: 'Expande el botón al 100% del contenedor.',
    },
    {
      name: '[ariaLabel]',
      type: 'string',
      default: "''",
      description: 'Etiqueta accesible. Obligatoria en botones solo icono.',
    },
    {
      name: '(clicked)',
      type: 'void',
      default: '—',
      description: 'Se emite al hacer click (solo si está habilitado y no cargando).',
    },
    {
      name: "slot='leading'",
      type: 'ng-content',
      default: '—',
      description: 'Slot para icono o elemento antes del texto.',
    },
    {
      name: "slot='trailing'",
      type: 'ng-content',
      default: '—',
      description: 'Slot para icono o elemento después del texto.',
    },
  ];

  onClicked(label: string): void {
    this.lastClicked.set(label);
  }

  toggleDisabled(): void {
    this.isDisabled.update(v => !v);
  }

  toggleLoading(): void {
    this.isLoading.update(v => !v);
  }
}

