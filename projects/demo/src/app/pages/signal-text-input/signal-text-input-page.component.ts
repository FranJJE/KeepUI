import { Component, signal } from '@angular/core';
import { SignalTextInputComponent } from '@keepui/ui';

interface ApiRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  selector: 'app-signal-text-input-page',
  standalone: true,
  imports: [SignalTextInputComponent],
  template: `
    <!-- SVG sprite: icons used by SignalTextInputComponent -->
    <svg aria-hidden="true" style="display:none">
      <symbol id="eye-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </symbol>
      <symbol id="eye-off-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </symbol>
      <symbol id="mail-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </symbol>
      <symbol id="search-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </symbol>
      <symbol id="lock-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </symbol>
    </svg>

    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <!-- Header -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Signal Text Input</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Input de texto accesible basado en signals. Soporta todos los tipos HTML comunes,
          iconos leading/trailing, slot de contenido trailing, toggle de contraseña integrado
          y validación con mensajes de error. Los atributos ARIA (<code>aria-invalid</code>,
          <code>aria-describedby</code>, <code>aria-required</code>) se gestionan
          automáticamente.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-signal-text-input&gt;</code>
      </div>

      <!-- Base -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Base
        </h2>
        <div class="flex flex-col gap-4 max-w-sm">
          <keepui-signal-text-input
            label="Nombre"
            placeholder="Escribe tu nombre"
            [(value)]="name"
          />
          <p class="text-sm text-ku-gray-text mt-0 mb-0">
            Valor: <strong class="text-ku-primary-text">{{ name() || '—' }}</strong>
          </p>
        </div>
      </section>

      <!-- Tipos -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Tipos de input
        </h2>
        <div class="flex flex-col gap-4 max-w-sm">
          <keepui-signal-text-input label="Email" type="email" placeholder="usuario@email.com" leadingIcon="mail-icon" [(value)]="email" />
          <keepui-signal-text-input label="Búsqueda" type="search" placeholder="Buscar…" leadingIcon="search-icon" [(value)]="search" />
          <keepui-signal-text-input label="Teléfono" type="tel" placeholder="+34 600 000 000" [(value)]="phone" />
          <keepui-signal-text-input label="Número" type="number" placeholder="0" [(value)]="numberVal" />
          <keepui-signal-text-input label="Fecha" type="date" [(value)]="dateVal" />
        </div>
      </section>

      <!-- Contraseña -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-1">
          Contraseña con toggle
        </h2>
        <p class="text-sm text-ku-gray-text mt-0 mb-4">
          Cuando <code class="text-ku-brand-text">type="password"</code> se muestra el botón
          de mostrar/ocultar con etiquetas accesibles traducidas vía Transloco.
        </p>
        <div class="max-w-sm">
          <keepui-signal-text-input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            leadingIcon="lock-icon"
            [(value)]="password"
          />
        </div>
      </section>

      <!-- Error -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Estado de error
        </h2>
        <div class="flex flex-col gap-4 max-w-sm">
          <keepui-signal-text-input
            label="Email (obligatorio)"
            type="email"
            placeholder="usuario@email.com"
            leadingIcon="mail-icon"
            [required]="true"
            [invalid]="true"
            [(touched)]="errorTouched"
            errorMessage="Introduce un email válido"
            [(value)]="errorEmail"
          />
        </div>
      </section>

      <!-- Deshabilitado -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Estado deshabilitado
        </h2>
        <div class="max-w-sm">
          <keepui-signal-text-input
            label="Campo bloqueado"
            placeholder="No editable"
            [disabled]="true"
            value="Valor fijo"
          />
        </div>
      </section>

      <!-- Anchos -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Variantes de ancho
        </h2>
        <div class="flex flex-col gap-4">
          <keepui-signal-text-input label="width='full' (defecto)" placeholder="Ancho completo" width="full" [(value)]="name" />
          <keepui-signal-text-input label="width='half'" placeholder="Mitad" width="half" [(value)]="name" />
          <keepui-signal-text-input label="width='auto'" placeholder="Auto" width="auto" [(value)]="name" />
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
export class SignalTextInputPageComponent {

  readonly name = signal('');
  readonly email = signal('');
  readonly search = signal('');
  readonly phone = signal('');
  readonly numberVal = signal('');
  readonly dateVal = signal('');
  readonly password = signal('');
  readonly errorEmail = signal('');
  readonly errorTouched = signal(true);

  readonly apiRows: ApiRow[] = [
    { name: '[label]', type: 'string', default: "''", description: 'Texto del label.' },
    { name: '[placeholder]', type: 'string', default: "''", description: 'Placeholder del input.' },
    { name: '[type]', type: 'SignalTextInputType', default: "'text'", description: 'Tipo HTML del input.' },
    { name: '[width]', type: "'full' | 'half' | 'auto'", default: "'full'", description: 'Ancho del wrapper.' },
    { name: '[leadingIcon]', type: 'string', default: "''", description: 'ID del símbolo SVG leading.' },
    { name: '[trailingIcon]', type: 'string', default: "''", description: 'ID del símbolo SVG trailing.' },
    { name: '[hasTrailingSlot]', type: 'boolean', default: 'false', description: 'Activa el slot [trailingSlot].' },
    { name: '[required]', type: 'boolean', default: 'false', description: 'Campo obligatorio.' },
    { name: '[showRequiredIndicator]', type: 'boolean', default: 'true', description: 'Muestra el asterisco visual.' },
    { name: '[disabled]', type: 'boolean', default: 'false', description: 'Deshabilita el input.' },
    { name: '[invalid]', type: 'boolean', default: 'false', description: 'Fuerza el estado de error.' },
    { name: '[errorMessage]', type: 'string', default: "''", description: 'Mensaje de error principal.' },
    { name: '[errors]', type: 'string[]', default: '[]', description: 'Mensajes de error alternativos.' },
    { name: '[inputId]', type: 'string', default: 'auto', description: 'id del elemento input.' },
    { name: '[(value)]', type: 'string', default: "''", description: 'Valor del input (two-way).' },
    { name: '[(touched)]', type: 'boolean', default: 'false', description: 'Estado touched (two-way).' },
  ];
}

