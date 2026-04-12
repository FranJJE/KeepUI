import { Component, signal } from '@angular/core';
import { IconActionButtonComponent, IconActionButtonVariant } from '@keepui/ui';

@Component({
  selector: 'app-icon-action-button-page',
  standalone: true,
  imports: [IconActionButtonComponent],
  template: `
    <!-- SVG sprite inline para la demo -->
    <svg aria-hidden="true" style="display:none">
      <symbol id="demo-edit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </symbol>
      <symbol id="demo-trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </symbol>
      <symbol id="demo-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </symbol>
      <symbol id="demo-share" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </symbol>
    </svg>

    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <!-- Page header -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Icon Action Button</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Botón circular de acción icónica con variantes <code>default</code> y
          <code>danger</code>, estado de carga y accesibilidad completa.
          El <code>ariaLabel</code> es <strong>obligatorio</strong> porque el botón
          no contiene texto visible.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-icon-action-button&gt;</code>
      </div>

      <!-- Variantes -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Variantes
        </h2>
        <div class="flex flex-wrap gap-4 items-center">
          @for (v of variants; track v) {
            <div class="flex flex-col items-center gap-2">
              <keepui-icon-action-button
                icon="demo-edit"
                [variant]="v"
                [ariaLabel]="'Editar (' + v + ')'"
                (click)="onClicked(v)"
              />
              <span class="text-xs text-ku-gray-text">{{ v }}</span>
            </div>
          }
        </div>
        <p class="mt-4 mb-0 text-sm text-ku-gray-text">
          Último click: <strong class="text-ku-primary-text">{{ lastClicked() }}</strong>
        </p>
      </section>

      <!-- Iconos distintos -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Con distintos iconos
        </h2>
        <div class="flex flex-wrap gap-4 items-center">
          <keepui-icon-action-button icon="demo-edit" ariaLabel="Editar" />
          <keepui-icon-action-button icon="demo-download" ariaLabel="Descargar" />
          <keepui-icon-action-button icon="demo-share" ariaLabel="Compartir" />
          <keepui-icon-action-button icon="demo-trash" variant="danger" ariaLabel="Eliminar" />
        </div>
      </section>

      <!-- Estado de carga -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-2">
          Estado de carga
        </h2>
        <p class="text-sm text-ku-gray-text mt-0 mb-5">
          Cuando <code class="text-ku-brand-text">loading=true</code> el botón muestra
          un spinner animado, se deshabilita y expone
          <code class="text-ku-brand-text">aria-busy="true"</code>.
        </p>
        <div class="flex flex-wrap gap-4 items-center mb-4">
          @for (v of variants; track v) {
            <div class="flex flex-col items-center gap-2">
              <keepui-icon-action-button
                icon="demo-edit"
                [variant]="v"
                [loading]="isLoading()"
                [ariaLabel]="'Cargando (' + v + ')'"
              />
              <span class="text-xs text-ku-gray-text">{{ v }}</span>
            </div>
          }
        </div>
        <button
          class="px-4 py-2 rounded text-sm border border-ku-secondary-border
                 bg-ku-secondary text-ku-primary-text hover:bg-ku-secondary-hover transition-colors"
          (click)="toggleLoading()"
        >
          {{ isLoading() ? '⏹ Detener carga' : '▶ Simular carga' }}
        </button>
      </section>

      <!-- Estado deshabilitado -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Estado deshabilitado
        </h2>
        <div class="flex flex-wrap gap-4 items-center">
          @for (v of variants; track v) {
            <div class="flex flex-col items-center gap-2">
              <keepui-icon-action-button
                icon="demo-edit"
                [variant]="v"
                [disabled]="true"
                [ariaLabel]="'Deshabilitado (' + v + ')'"
              />
              <span class="text-xs text-ku-gray-text">{{ v }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Tamaños de icono -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Tamaños de icono
        </h2>
        <div class="flex flex-wrap gap-6 items-center">
          @for (s of iconSizes; track s) {
            <div class="flex flex-col items-center gap-2">
              <keepui-icon-action-button icon="demo-edit" [iconSize]="s" ariaLabel="Editar" />
              <span class="text-xs text-ku-gray-text">{{ s }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- API -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          API
        </h2>
        <div class="overflow-x-auto -mx-2">
          <table class="w-full text-sm text-left border-collapse min-w-max">
            <thead>
              <tr class="border-b border-ku-secondary-border">
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Input</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Tipo</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Default</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[icon]</code> *</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">—</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">ID del símbolo SVG. Requerido.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[ariaLabel]</code> *</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">—</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Etiqueta accesible. Requerida (botón sin texto visible).</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[variant]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'default' | 'danger'</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'default'</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Estilo visual del botón.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[iconSize]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">number</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">20</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Tamaño del icono interior en píxeles.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[type]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'button' | 'submit' | 'reset'</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'button'</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Tipo HTML nativo del botón.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[disabled]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">false</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Deshabilita el botón.</td>
              </tr>
              <tr>
                <td class="py-2 px-2"><code class="text-ku-brand-text">[loading]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">false</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Muestra spinner, desactiva el botón y expone <code>aria-busy</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
})
export class IconActionButtonPageComponent {
  readonly variants: IconActionButtonVariant[] = ['default', 'danger'];
  readonly iconSizes = [14, 16, 20, 24];

  lastClicked = signal('—');
  isLoading = signal(false);

  onClicked(label: string): void {
    this.lastClicked.set(label);
  }

  toggleLoading(): void {
    this.isLoading.update(v => !v);
  }
}

