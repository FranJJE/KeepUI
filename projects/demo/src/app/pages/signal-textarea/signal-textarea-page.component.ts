import { Component, signal } from '@angular/core';
import { SignalTextareaComponent } from '@keepui/ui';

interface ApiRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  selector: 'app-signal-textarea-page',
  standalone: true,
  imports: [SignalTextareaComponent],
  template: `
    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">

      <!-- Header -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Signal Textarea</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Textarea accesible basado en signals con contador de caracteres, control de
          redimensionado y mensajes de error integrados. Los atributos ARIA
          (<code>aria-invalid</code>, <code>aria-describedby</code>,
          <code>aria-required</code>) se gestionan automáticamente.
          El contador usa <code>aria-live="polite"</code> para anunciar
          los cambios a lectores de pantalla.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-signal-textarea&gt;</code>
      </div>

      <!-- Base -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Base
        </h2>
        <keepui-signal-textarea
          label="Descripción"
          placeholder="Escribe aquí tu descripción…"
          [(value)]="description"
        />
        <p class="text-sm text-ku-gray-text mt-4 mb-0">
          Caracteres: <strong class="text-ku-primary-text">{{ description().length }}</strong>
        </p>
      </section>

      <!-- Con contador -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-1">
          Con contador de caracteres
        </h2>
        <p class="text-sm text-ku-gray-text mt-0 mb-4">
          Proporciona <code class="text-ku-brand-text">[maxLength]</code> para mostrar el
          contador y limitar la entrada.
        </p>
        <keepui-signal-textarea
          label="Comentario"
          placeholder="Máximo 200 caracteres…"
          [rows]="5"
          [maxLength]="200"
          [(value)]="comment"
        />
      </section>

      <!-- Resize -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Modos de redimensionado
        </h2>
        <div class="flex flex-col gap-4">
          <keepui-signal-textarea label="resize='none' (defecto)" resize="none" [rows]="3" [(value)]="description" />
          <keepui-signal-textarea label="resize='vertical'" resize="vertical" [rows]="3" [(value)]="description" />
          <keepui-signal-textarea label="resize='both'" resize="both" [rows]="3" [(value)]="description" />
        </div>
      </section>

      <!-- Requerido + error -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Estado requerido y error
        </h2>
        <keepui-signal-textarea
          label="Motivo (obligatorio)"
          placeholder="Explica el motivo…"
          [required]="true"
          [invalid]="true"
          [(touched)]="errorTouched"
          errorMessage="El motivo no puede estar vacío"
          [(value)]="errorVal"
        />
      </section>

      <!-- Deshabilitado -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Estado deshabilitado
        </h2>
        <keepui-signal-textarea
          label="Campo bloqueado"
          placeholder="No editable"
          [disabled]="true"
          value="Contenido de solo lectura"
        />
      </section>

      <!-- Anchos -->
      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Variantes de ancho
        </h2>
        <div class="flex flex-col gap-4">
          <keepui-signal-textarea label="width='full' (defecto)" width="full" [rows]="2" [(value)]="description" />
          <keepui-signal-textarea label="width='half'" width="half" [rows]="2" [(value)]="description" />
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
export class SignalTextareaPageComponent {

  readonly description = signal('');
  readonly comment = signal('');
  readonly errorVal = signal('');
  readonly errorTouched = signal(true);

  readonly apiRows: ApiRow[] = [
    { name: '[label]', type: 'string', default: "''", description: 'Texto del label.' },
    { name: '[placeholder]', type: 'string', default: "''", description: 'Placeholder del textarea.' },
    { name: '[rows]', type: 'number', default: '4', description: 'Número de filas visibles.' },
    { name: '[width]', type: "'full' | 'half' | 'auto'", default: "'full'", description: 'Ancho del wrapper.' },
    { name: '[resize]', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'none'", description: 'Comportamiento de redimensionado CSS.' },
    { name: '[required]', type: 'boolean', default: 'false', description: 'Campo obligatorio.' },
    { name: '[disabled]', type: 'boolean', default: 'false', description: 'Deshabilita el textarea.' },
    { name: '[invalid]', type: 'boolean', default: 'false', description: 'Fuerza el estado de error.' },
    { name: '[maxLength]', type: 'number | undefined', default: 'undefined', description: 'Límite de caracteres. Muestra el contador.' },
    { name: '[errorMessage]', type: 'string', default: "''", description: 'Mensaje de error principal.' },
    { name: '[errors]', type: 'string[]', default: '[]', description: 'Mensajes de error alternativos.' },
    { name: '[textareaId]', type: 'string', default: 'auto', description: 'id del elemento textarea.' },
    { name: '[(value)]', type: 'string', default: "''", description: 'Valor del textarea (two-way).' },
    { name: '[(touched)]', type: 'boolean', default: 'false', description: 'Estado touched (two-way).' },
  ];
}

