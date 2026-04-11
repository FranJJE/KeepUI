import { Component } from '@angular/core';
import { ImagePreviewComponent } from '@keepui/ui';

@Component({
  selector: 'app-image-preview-page',
  standalone: true,
  imports: [ImagePreviewComponent],
  template: `
    <div class="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mb-1 mt-0">
          Componente
        </p>
        <h1 class="text-3xl font-bold mt-0 mb-2">Image Preview</h1>
        <p class="text-ku-gray-text leading-relaxed mb-3">
          Selector y previsualización de imágenes completamente agnóstico de plataforma.
          Delega la selección de archivo a la implementación registrada vía
          <code>FILE_PORT</code>, permitiendo usar la misma interfaz en web y en
          Angular&nbsp;+&nbsp;Capacitor.
        </p>
        <code class="text-sm text-ku-brand-text">&lt;keepui-image-preview /&gt;</code>
      </div>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          Demo interactivo
        </h2>
        <keepui-image-preview />
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-3">
          Cómo funciona
        </h2>
        <ol class="text-sm text-ku-gray-text m-0 pl-5 flex flex-col gap-2 leading-relaxed">
          <li>El componente inyecta el token <code>FILE_PORT</code>.</li>
          <li>
            Al pulsar el botón, llama a <code>filePort.pickImage()</code> y espera la
            respuesta.
          </li>
          <li>
            Si tiene éxito, muestra la imagen con la URL devuelta. Si falla, muestra
            el mensaje de error.
          </li>
          <li>
            La implementación de <code>FILE_PORT</code> varía según la plataforma,
            pero la interfaz del componente es siempre la misma.
          </li>
        </ol>
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-3">
          Configuración del provider
        </h2>
        <p class="text-sm text-ku-gray-text mb-4">
          Registra un provider en <code>app.config.ts</code> según la plataforma de destino:
        </p>

        <div class="flex flex-col gap-3">
          <div>
            <p class="text-xs font-semibold text-ku-gray-text mb-1.5 mt-0">🌐 Web</p>
            <pre class="text-xs rounded-md p-4 overflow-x-auto m-0
                        bg-ku-primary border border-ku-primary-border"><code>import {{ '{' }} provideKeepUi {{ '}' }} from '&#64;keepui/ui';

export const appConfig: ApplicationConfig = {{ '{' }}
  providers: [provideKeepUi()]
{{ '}' }};</code></pre>
          </div>

          <div>
            <p class="text-xs font-semibold text-ku-gray-text mb-1.5 mt-0">📱 Capacitor</p>
            <pre class="text-xs rounded-md p-4 overflow-x-auto m-0
                        bg-ku-primary border border-ku-primary-border"><code>import {{ '{' }} provideKeepUiCapacitor {{ '}' }} from '&#64;keepui/capacitor';

export const appConfig: ApplicationConfig = {{ '{' }}
  providers: [provideKeepUiCapacitor()]
{{ '}' }};</code></pre>
          </div>
        </div>
      </section>

      <section class="rounded-lg border bg-ku-secondary border-ku-secondary-border p-6">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-ku-gray-text mt-0 mb-4">
          API pública (signals)
        </h2>
        <div class="overflow-x-auto -mx-2">
          <table class="w-full text-sm text-left border-collapse min-w-max">
            <thead>
              <tr class="border-b border-ku-secondary-border">
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Signal</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Tipo</th>
                <th class="py-2 px-2 font-semibold text-ku-gray-text">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">imageUrl()</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string | null</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">URL de la imagen seleccionada.</td>
              </tr>
              <tr class="border-b border-ku-secondary-border">
                <td class="py-2 px-2"><code class="text-ku-brand-text">error()</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">string | null</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">Mensaje de error si la selección falla.</td>
              </tr>
              <tr>
                <td class="py-2 px-2"><code class="text-ku-brand-text">loading()</code></td>
                <td class="py-2 px-2 font-mono text-xs text-ku-gray-text">boolean</td>
                <td class="py-2 px-2 text-xs text-ku-gray-text">
                  <code>true</code> mientras la selección está en curso.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
})
export class ImagePreviewPageComponent {}

