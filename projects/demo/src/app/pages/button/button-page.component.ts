import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@keepui/ui';

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
          Botón accesible con soporte de variantes, estados deshabilitados y tipos HTML.
          Diseñado para integrarse con el sistema de temas de KeepUI.
        </p>
        <code class="text-sm text-keepui-primary">&lt;keepui-button&gt;</code>
      </div>

      <!-- Variantes -->
      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Variantes
        </h2>
        <div class="flex flex-wrap gap-3 items-center">
          <keepui-button (clicked)="onClicked('default')">Default</keepui-button>
          <keepui-button variant="primary" (clicked)="onClicked('primary')">Primary</keepui-button>
        </div>
        <p class="mt-4 mb-0 text-sm text-keepui-text-muted">
          Último click: <strong class="text-keepui-text">{{ lastClicked() }}</strong>
        </p>
      </section>

      <!-- Estado deshabilitado -->
      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Estado deshabilitado
        </h2>
        <div class="flex flex-wrap gap-3">
          <keepui-button [disabled]="true">Default Disabled</keepui-button>
          <keepui-button variant="primary" [disabled]="true">Primary Disabled</keepui-button>
        </div>
      </section>

      <!-- Estado dinámico -->
      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-1">
          Estado dinámico
        </h2>
        <p class="text-sm text-keepui-text-muted mt-0 mb-4">
          Alterna el estado deshabilitado en tiempo de ejecución.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <keepui-button (clicked)="toggleDisabled()">
            {{ isDisabled() ? '✅ Habilitar' : '🚫 Deshabilitar' }}
          </keepui-button>
          <keepui-button
            variant="primary"
            [disabled]="isDisabled()"
            (clicked)="onClicked('dinámico')"
          >
            Botón dinámico
          </keepui-button>
        </div>
      </section>

      <!-- Tipos HTML -->
      <section class="rounded-lg border bg-keepui-surface border-keepui-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-keepui-text-muted mt-0 mb-4">
          Tipos HTML
        </h2>
        <div class="flex flex-wrap gap-3">
          <keepui-button type="button">type="button"</keepui-button>
          <keepui-button type="submit">type="submit"</keepui-button>
          <keepui-button type="reset">type="reset"</keepui-button>
        </div>
      </section>

      <!-- API -->
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

  apiRows: ApiRow[] = [
    {
      name: '[variant]',
      type: "'default' | 'primary'",
      default: "'default'",
      description: 'Estilo visual del botón.',
    },
    {
      name: '[disabled]',
      type: 'boolean',
      default: 'false',
      description: 'Deshabilita el botón.',
    },
    {
      name: '[type]',
      type: "'button' | 'submit' | 'reset'",
      default: "'button'",
      description: 'Tipo HTML nativo.',
    },
    {
      name: '(clicked)',
      type: 'void',
      default: '—',
      description: 'Se emite al hacer click (solo si está habilitado).',
    },
  ];

  onClicked(label: string): void {
    this.lastClicked.set(label);
  }

  toggleDisabled(): void {
    this.isDisabled.update(v => !v);
  }
}

