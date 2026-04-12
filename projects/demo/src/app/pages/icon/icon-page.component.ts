import { Component } from '@angular/core';
import { IconComponent } from '@keepui/ui';

@Component({
  selector: 'app-icon-page',
  standalone: true,
  imports: [IconComponent],
  template: `
    <!-- SVG sprite embebido para la demo (en producción lo gestiona IconRegistryService) -->
    <svg aria-hidden="true" style="display:none">
      <symbol id="demo-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </symbol>
      <symbol id="demo-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </symbol>
      <symbol id="demo-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </symbol>
      <symbol id="demo-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </symbol>
      <symbol id="demo-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </symbol>
      <symbol id="demo-settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </symbol>
    </svg>

    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <!-- Page header -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Icon</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Renderizador de iconos SVG mediante la técnica de <em>sprite</em>
          (<code>&lt;use href="#id"&gt;</code>). La aplicación consumidora registra los
          símbolos SVG en el DOM (p.&nbsp;ej. con un <code>IconRegistryService</code>) y
          <code>keepui-icon</code> los referencia por nombre.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-icon&gt;</code>
      </div>

      <!-- Iconos base -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Iconos disponibles (demo)
        </h2>
        <div class="flex flex-wrap gap-6 items-center">
          @for (icon of demoIcons; track icon.name) {
            <div class="flex flex-col items-center gap-2">
              <keepui-icon [name]="icon.name" [size]="24" class="text-ku-primary-text" />
              <span class="text-xs text-ku-gray-text">{{ icon.label }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Tamaños -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Tamaños
        </h2>
        <div class="flex flex-wrap gap-6 items-end">
          @for (s of sizes; track s) {
            <div class="flex flex-col items-center gap-2">
              <keepui-icon name="demo-star" [size]="s" class="text-ku-primary-text" />
              <span class="text-xs text-ku-gray-text">{{ s }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- Color (hereda currentColor) -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-2">
          Color — hereda <code>currentColor</code>
        </h2>
        <p class="text-sm text-ku-gray-text mt-0 mb-5">
          El icono hereda el color de texto del elemento contenedor. Aplica cualquier
          clase de color de Tailwind al propio <code>keepui-icon</code> o a su padre.
        </p>
        <div class="flex flex-wrap gap-6 items-center">
          <div class="flex flex-col items-center gap-2">
            <keepui-icon name="demo-check" [size]="28" class="text-ku-action-primary" />
            <span class="text-xs text-ku-gray-text">action-primary</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <keepui-icon name="demo-close" [size]="28" class="text-ku-error-primary" />
            <span class="text-xs text-ku-gray-text">error-primary</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <keepui-icon name="demo-star" [size]="28" class="text-ku-gray-text" />
            <span class="text-xs text-ku-gray-text">gray-text</span>
          </div>
        </div>
      </section>

      <!-- Accesibilidad -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-2">
          Accesibilidad
        </h2>
        <p class="text-sm text-ku-gray-text mt-0 mb-5">
          Sin <code>ariaLabel</code> el SVG lleva <code>aria-hidden="true"</code> (decorativo).
          Con <code>ariaLabel</code> expone <code>role="img"</code> y el label para lectores
          de pantalla.
        </p>
        <div class="flex flex-wrap gap-8 items-start">
          <div>
            <p class="text-xs text-ku-gray-text mb-2 mt-0">Decorativo — <code>aria-hidden="true"</code></p>
            <div class="flex items-center gap-2">
              <keepui-icon name="demo-check" [size]="20" class="text-ku-action-primary" />
              <span class="text-sm">Tarea completada</span>
            </div>
          </div>
          <div>
            <p class="text-xs text-ku-gray-text mb-2 mt-0">Semántico — <code>role="img"</code> + <code>aria-label</code></p>
            <keepui-icon name="demo-star" [size]="28" ariaLabel="Favorito" class="text-ku-action-primary" />
          </div>
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
                <td class="py-2 px-2"><code class="text-ku-brand-text">[name]</code> *</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">—</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">ID del símbolo SVG (sin <code>#</code>). Requerido.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[size]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">number</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">24</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Ancho y alto del icono en píxeles.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[viewBox]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'0 0 24 24'</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Atributo <code>viewBox</code> del SVG.</td>
              </tr>
              <tr>
                <td class="py-2 px-2"><code class="text-ku-brand-text">[ariaLabel]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">''</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  Etiqueta accesible. Si se omite, el SVG lleva <code>aria-hidden="true"</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
})
export class IconPageComponent {
  readonly demoIcons = [
    { name: 'demo-check', label: 'check' },
    { name: 'demo-close', label: 'close' },
    { name: 'demo-star', label: 'star' },
    { name: 'demo-home', label: 'home' },
    { name: 'demo-user', label: 'user' },
    { name: 'demo-settings', label: 'settings' },
  ];

  readonly sizes = [16, 20, 24, 32, 40, 48];
}

