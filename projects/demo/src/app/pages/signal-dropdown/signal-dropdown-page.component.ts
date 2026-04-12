import { Component, signal } from '@angular/core';
import {
  SignalDropdownComponent,
  SignalDropdownOption,
} from '@keepui/ui';

interface ApiRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  selector: 'app-signal-dropdown-page',
  standalone: true,
  imports: [SignalDropdownComponent],
  template: `
    <!-- SVG sprite: icons used by SignalDropdownComponent -->
    <svg aria-hidden="true" style="display:none">
      <symbol id="chevron-down-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </symbol>
      <symbol id="check-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </symbol>
    </svg>

    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <!-- Header -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Signal Dropdown</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Dropdown accesible basado en signals. El panel se posiciona en
          <code>fixed</code> para no ser recortado por contenedores con
          <code>overflow: hidden</code>. Compatible con teclado (↑↓ Enter Escape)
          y con los atributos ARIA correctos (<code>role="listbox"</code>,
          <code>aria-expanded</code>, <code>aria-selected</code>).
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-signal-dropdown&gt;</code>
      </div>

      <!-- Base -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Base
        </h2>
        <div class="max-w-xs">
          <keepui-signal-dropdown
            label="País"
            placeholder="Selecciona un país"
            [options]="countries"
            [(value)]="selectedCountry"
          />
        </div>
        <p class="text-sm text-ku-gray-text mt-4 mb-0">
          Valor: <strong class="text-ku-primary-text">{{ selectedCountry() ?? '—' }}</strong>
        </p>
      </section>

      <!-- Con badges -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Con badges
        </h2>
        <div class="max-w-xs">
          <keepui-signal-dropdown
            label="Rol de usuario"
            placeholder="Selecciona un rol"
            [options]="roles"
            [(value)]="selectedRole"
          />
        </div>
      </section>

      <!-- Ancho -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Variantes de ancho
        </h2>
        <div class="flex flex-col gap-4">
          <keepui-signal-dropdown
            label="width='full' (defecto)"
            placeholder="Selecciona…"
            width="full"
            [options]="countries"
            [(value)]="selectedCountry"
          />
          <keepui-signal-dropdown
            label="width='half'"
            placeholder="Selecciona…"
            width="half"
            [options]="countries"
            [(value)]="selectedCountry"
          />
          <keepui-signal-dropdown
            label="width='auto'"
            placeholder="Selecciona…"
            width="auto"
            [options]="countries"
            [(value)]="selectedCountry"
          />
        </div>
      </section>

      <!-- Requerido + error -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Estado requerido y error
        </h2>
        <div class="max-w-xs">
          <keepui-signal-dropdown
            label="Categoría"
            placeholder="Elige una categoría"
            [required]="true"
            [invalid]="true"
            errorMessage="Este campo es obligatorio"
            [(touched)]="errorTouched"
            [options]="countries"
            [(value)]="selectedError"
          />
        </div>
      </section>

      <!-- Deshabilitado -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Estado deshabilitado
        </h2>
        <div class="max-w-xs">
          <keepui-signal-dropdown
            label="Opción bloqueada"
            placeholder="No disponible"
            [disabled]="true"
            [options]="countries"
          />
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
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Propiedad</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Tipo</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Default</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Descripción</th>
              </tr>
            </thead>
            <tbody>
              @for (row of apiRows; track row.name) {
                <tr class="border-b border-ku-secondary-border last:border-0">
                  <td class="py-2 px-2">
                    <code class="text-ku-brand-text">{{ row.name }}</code>
                  </td>
                  <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">{{ row.type }}</td>
                  <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">{{ row.default }}</td>
                  <td class="py-2 px-2 text-xs text-ku-gray-text">{{ row.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
})
export class SignalDropdownPageComponent {

  readonly selectedCountry = signal<string | null>(null);
  readonly selectedRole = signal<string | null>(null);
  readonly selectedError = signal<string | null>(null);
  readonly errorTouched = signal(true);

  readonly countries: SignalDropdownOption<string>[] = [
    { label: 'España', value: 'es' },
    { label: 'México', value: 'mx' },
    { label: 'Argentina', value: 'ar' },
    { label: 'Colombia', value: 'co' },
    { label: 'Chile', value: 'cl' },
  ];

  readonly roles: SignalDropdownOption<string>[] = [
    { label: 'Administrador', value: 'admin', badges: ['Acceso total'] },
    { label: 'Editor', value: 'editor', badges: ['Contenido'] },
    { label: 'Visualizador', value: 'viewer', badges: ['Solo lectura'] },
  ];

  readonly apiRows: ApiRow[] = [
    { name: '[options]', type: 'SignalDropdownOption<T>[]', default: '—', description: 'Array de opciones (required).' },
    { name: '[label]', type: 'string', default: "''", description: 'Texto del label.' },
    { name: '[placeholder]', type: 'string', default: "''", description: 'Texto cuando no hay selección.' },
    { name: '[width]', type: "'full' | 'half' | 'auto'", default: "'full'", description: 'Ancho del wrapper.' },
    { name: '[required]', type: 'boolean', default: 'false', description: 'Marca el campo como obligatorio.' },
    { name: '[disabled]', type: 'boolean', default: 'false', description: 'Deshabilita el control.' },
    { name: '[invalid]', type: 'boolean', default: 'false', description: 'Fuerza el estado de error.' },
    { name: '[errorMessage]', type: 'string', default: "''", description: 'Mensaje de error principal.' },
    { name: '[errors]', type: 'string[]', default: '[]', description: 'Mensajes de error alternativos.' },
    { name: '[selectId]', type: 'string', default: 'auto', description: 'id del botón trigger.' },
    { name: '[(value)]', type: 'T | null', default: 'null', description: 'Valor seleccionado (two-way).' },
    { name: '[(touched)]', type: 'boolean', default: 'false', description: 'Estado touched (two-way).' },
    { name: '(valueChange)', type: 'T | null', default: '—', description: 'Emitido al cambiar la selección.' },
  ];
}

