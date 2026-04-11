import { Component, signal } from '@angular/core';
import { CardComponent } from '@keepui/ui';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [CardComponent],
  template: `
    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Card</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Contenedor versátil con soporte de variante, padding, color, estado clickable,
          seleccionado y scrollable. Acepta cualquier contenido vía
          <code>&lt;ng-content&gt;</code> y se adapta automáticamente al tema activo.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-card&gt;</code>
      </div>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Variantes
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-ku-gray-text mb-2 mt-0">
              <code>[variant]="'outlined'"</code> (por defecto)
            </p>
            <keepui-card variant="outlined">
              <p class="m-0 text-sm">Borde sutil con el color del tema. Uso general.</p>
            </keepui-card>
          </div>
          <div>
            <p class="text-xs text-ku-gray-text mb-2 mt-0">
              <code>[variant]="'flat'"</code>
            </p>
            <keepui-card variant="flat">
              <p class="m-0 text-sm">Sin borde. Ideal como contenedor anidado.</p>
            </keepui-card>
          </div>
        </div>
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Colores
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-ku-gray-text mb-2 mt-0">
              <code>[colors]="'primary'"</code> (por defecto)
            </p>
            <keepui-card colors="primary">
              <p class="m-0 text-sm">Fondo de superficie primaria.</p>
            </keepui-card>
          </div>
          <div>
            <p class="text-xs text-ku-gray-text mb-2 mt-0">
              <code>[colors]="'secondary'"</code>
            </p>
            <keepui-card colors="secondary">
              <p class="m-0 text-sm">Fondo de superficie secundaria.</p>
            </keepui-card>
          </div>
        </div>
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-5">
          Padding
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          @for (p of paddingOptions; track p) {
            <div>
              <p class="text-xs text-ku-gray-text mb-2 mt-0">
                <code>"{{ p }}"</code>
              </p>
              <keepui-card [padding]="p">
                <div class="text-xs text-center text-ku-gray-text">contenido</div>
              </keepui-card>
            </div>
          }
        </div>
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-2">
          Clickable y seleccionado
        </h2>
        <p class="text-sm text-ku-gray-text mb-5 mt-0">
          Pulsa una card para seleccionarla. El output <code>(clicked)</code> emite
          al hacer clic o al pulsar <kbd>Enter</kbd> / <kbd>Space</kbd>.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          @for (item of clickableItems; track item.id) {
            <keepui-card
              [clickable]="true"
              [selected]="selectedId() === item.id"
              (clicked)="selectedId.set(item.id)"
            >
              <p class="m-0 text-sm font-medium">{{ item.label }}</p>
              <p class="m-0 text-xs text-ku-gray-text mt-1">{{ item.description }}</p>
            </keepui-card>
          }
        </div>
        <p class="text-xs text-ku-gray-text mt-4 mb-0">
          Seleccionado: <code class="text-ku-brand-text">{{ selectedId() ?? 'ninguno' }}</code>
        </p>
      </section>

      <!-- Screen padding + scroll -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-2">
          Padding screen con scroll automático
        </h2>
        <p class="text-sm text-ku-gray-text mb-1 mt-0">
          <code>padding="screen"</code> aplica padding lateral y superior pero omite el
          inferior, de modo que el contenido parece continuar hacia abajo y el usuario
          percibe que puede hacer scroll.
        </p>
        <p class="text-sm text-ku-gray-text mb-5 mt-0">
          Un <strong>espaciador invisible</strong> se inserta automáticamente al final del
          contenido proyectado. Cuando el usuario llega al fondo, ve el gap correcto
          <em>sin que el consumidor tenga que añadir ningún padding-bottom</em>.
        </p>
        <div class="h-52 rounded-xl overflow-hidden border border-ku-secondary-border">
          <keepui-card padding="screen" [scrollable]="true" [fullHeight]="true">
            @for (item of scrollItems; track item) {
              <div
                class="py-3 border-b border-ku-secondary-border last:border-0 text-sm flex items-center justify-between"
              >
                <span>{{ item }}</span>
                <span class="text-xs text-ku-gray-text">→</span>
              </div>
            }
          </keepui-card>
        </div>
        <p class="text-xs text-ku-gray-text mt-3 mb-0">
          ☝️ Haz scroll hasta el fondo: el padding inferior aparece solo, sin declararlo en
          el contenido.
        </p>
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
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Input / Output</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Tipo</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Default</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[variant]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'flat' | 'outlined'</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'outlined'</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Con o sin borde.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[padding]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'none' | 'sm' | 'md' | 'lg' | 'screen'</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'md'</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  <code>screen</code>: lateral + top; el espaciador inferior es automático.
                </td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[colors]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'primary' | 'secondary'</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">'primary'</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Superficie de fondo.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[clickable]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">false</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  Habilita hover, focus ring y accesibilidad de botón.
                </td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[selected]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">false</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Borde de marca al estar seleccionado.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[scrollable]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">false</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  Activa <code>overflow-y-auto</code>. Usar con <code>fullHeight</code> para scroll real.
                </td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">[fullHeight]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">false</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  Aplica <code>h-full</code> al host y al contenedor interno.
                </td>
              </tr>
              <tr>
                <td class="py-2 px-2"><code class="text-ku-brand-text">(clicked)</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">void</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">—</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  Emite al hacer clic o pulsar Enter / Space (requiere <code>clickable</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
})
export class CardPageComponent {
  readonly paddingOptions: Array<'none' | 'sm' | 'md' | 'lg'> = ['none', 'sm', 'md', 'lg'];

  readonly clickableItems = [
    { id: 1, label: 'Opción A', description: 'Primera alternativa disponible.' },
    { id: 2, label: 'Opción B', description: 'Segunda alternativa disponible.' },
    { id: 3, label: 'Opción C', description: 'Tercera alternativa disponible.' },
  ];

  readonly scrollItems = Array.from(
    { length: 10 },
    (_, i) => `Elemento ${i + 1} — contenido de lista scrollable`
  );

  readonly selectedId = signal<number | null>(null);
}
