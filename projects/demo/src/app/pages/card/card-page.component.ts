import { Component } from '@angular/core';
import { CardComponent } from '@keepui/ui';

interface ElevationLevel {
  value: 0 | 1 | 2 | 3;
  label: string;
  shadowClass: string;
  description: string;
}

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
          Contenedor versátil con cuatro niveles de elevación y proyección de contenido libre
          vía <code>&lt;ng-content&gt;</code>. Se adapta automáticamente al tema activo.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-card&gt;</code>
      </div>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-6">
          Niveles de elevación
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          @for (level of elevations; track level.value) {
            <keepui-card [elevation]="level.value">
              <div class="flex items-center justify-between mb-2">
                <h3 class="mt-0 mb-0 text-base font-semibold">{{ level.label }}</h3>
                <code class="text-xs text-ku-gray-text font-mono"
                  >[elevation]="{{ level.value }}"</code
                >
              </div>
              <p class="mb-2 mt-0 text-sm text-ku-gray-text leading-relaxed">
                {{ level.description }}
              </p>
              <code class="text-xs text-ku-gray-text">{{ level.shadowClass }}</code>
            </keepui-card>
          }
        </div>
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-6">
          Con contenido real
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <keepui-card [elevation]="1">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl leading-none">🚀</span>
              <div>
                <h3 class="m-0 text-base font-semibold">Proyecto Alpha</h3>
                <p class="m-0 text-xs text-ku-gray-text">Actualizado hace 2h</p>
              </div>
            </div>
            <p class="text-sm text-ku-gray-text m-0 leading-relaxed">
              Una card con contenido complejo: icono, título, metadata y descripción.
            </p>
          </keepui-card>

          <keepui-card [elevation]="2">
            <p class="text-xs uppercase tracking-widest font-semibold text-ku-gray-text mt-0 mb-2">
              Estadística
            </p>
            <p class="text-4xl font-bold m-0 mb-1 text-ku-primary-text">2,480</p>
            <p class="text-sm text-ku-green-text m-0">↑ 12% respecto al mes anterior</p>
            <p class="text-xs text-ku-gray-text mt-1 mb-0">Usuarios activos</p>
          </keepui-card>

          <keepui-card [elevation]="0">
            <p class="text-xs uppercase tracking-widest font-semibold text-ku-gray-text mt-0 mb-3">
              Sin elevación
            </p>
            <p class="text-sm text-ku-gray-text m-0">
              Ideal como contenedor secundario dentro de otra card o sección ya elevadora.
            </p>
          </keepui-card>

          <keepui-card [elevation]="3">
            <p class="text-xs uppercase tracking-widest font-semibold text-ku-gray-text mt-0 mb-2">
              Elevación máxima
            </p>
            <p class="text-sm text-ku-gray-text m-0 leading-relaxed">
              Sombra pronunciada. Recomendada para modales, tooltips o paneles flotantes.
            </p>
          </keepui-card>

        </div>
      </section>

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
              <tr>
                <td class="py-2 px-2"><code class="text-ku-brand-text">[elevation]</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">0 | 1 | 2 | 3</td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">1</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  Nivel de sombra. 0 = sin sombra, 3 = máxima.
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
  elevations: ElevationLevel[] = [
    {
      value: 0,
      label: 'Elevation 0',
      shadowClass: 'shadow: none',
      description: 'Sin sombra. Para contenedores secundarios o áreas ya elevadas.',
    },
    {
      value: 1,
      label: 'Elevation 1',
      shadowClass: 'shadow-sm',
      description: 'Sombra sutil. Valor por defecto. Uso general en listados y grids.',
    },
    {
      value: 2,
      label: 'Elevation 2',
      shadowClass: 'shadow',
      description: 'Sombra media. Para tarjetas destacadas o paneles laterales.',
    },
    {
      value: 3,
      label: 'Elevation 3',
      shadowClass: 'shadow-lg',
      description: 'Sombra pronunciada. Para modales, drawers o contenido flotante.',
    },
  ];
}

