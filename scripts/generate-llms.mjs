#!/usr/bin/env node
/**
 * scripts/generate-llms.mjs
 *
 * Auto-generates README.md from the KeepUI source code.
 * The single source of truth is the JSDoc in the TypeScript source files.
 *
 * Usage:
 *   node scripts/generate-llms.mjs
 *   npm run docs:generate
 */

import { Project, SyntaxKind } from 'ts-morph';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LIB_SRC = resolve(ROOT, 'projects/keep-ui/src/lib');

// ─── Project setup ────────────────────────────────────────────────────────────

const project = new Project({
  tsConfigFilePath: resolve(ROOT, 'tsconfig.json'),
  addFilesFromTsConfig: false,
  skipLoadingLibFiles: true,
});

project.addSourceFilesAtPaths([
  `${LIB_SRC}/**/*.ts`,
  `!${LIB_SRC}/**/*.spec.ts`,
]);

/** Normalises a file path to forward slashes for cross-platform matching. */
const normLib = LIB_SRC.replace(/\\/g, '/');

/**
 * Returns only the source files that live inside the core lib folder.
 * Filters out transitively-resolved imports and Capacitor files.
 */
function libFiles() {
  return project
    .getSourceFiles()
    .filter(f => f.getFilePath().replace(/\\/g, '/').startsWith(normLib));
}

// ─── JSDoc helpers ────────────────────────────────────────────────────────────

/**
 * Extracts the description and @tag values from the last JSDoc block of a node.
 * Returns { description: string, tags: Record<string, string> }.
 */
function getJsDoc(node) {
  const docs = node.getJsDocs?.() ?? [];
  if (!docs.length) return { description: '', tags: {} };

  const doc = docs[docs.length - 1];

  // getDescription() returns already-cleaned text (no leading * chars)
  const description = (doc.getDescription() ?? '').trim();

  const tags = {};
  for (const tag of doc.getTags()) {
    const name = tag.getTagName();
    const comment = tag.getComment();
    tags[name] = Array.isArray(comment)
      ? comment.map(c => c.getText?.() ?? String(c)).join('')
      : (comment ?? '').toString().trim();
  }

  return { description, tags };
}

// ─── Component parsing ────────────────────────────────────────────────────────

/**
 * Reads the string value of a property inside an @Component decorator object.
 * Works for string literals and template literals.
 */
function getDecoratorStringProp(decorator, propName) {
  if (!decorator) return '';
  const args = decorator.getArguments();
  if (!args.length) return '';
  const obj = args[0];
  if (obj.getKind() !== SyntaxKind.ObjectLiteralExpression) return '';
  const prop = obj.getProperty(propName);
  if (!prop) return '';
  const init = prop.getInitializer?.();
  if (!init) return '';
  if (
    init.getKind() === SyntaxKind.StringLiteral ||
    init.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral
  ) {
    return init.getLiteralText();
  }
  // Template literal (with expressions) — return raw text without backticks
  return init.getText().replace(/^`|`$/g, '');
}

/** Parses `input<Type>(defaultVal)` or `input(defaultVal)` initializer text. */
function parseInputInitializer(initText) {
  if (!initText.startsWith('input')) return null;

  // Type generic: input<ButtonVariant>(...) → 'ButtonVariant'
  const typeMatch = initText.match(/^input<([^>]+)>/);
  let type = typeMatch ? typeMatch[1].trim() : '';

  // First argument as default value text
  const argMatch = initText.match(/input(?:<[^>]+>)?\(([^)]*)\)/);
  const rawDefault = argMatch ? argMatch[1].trim() : '';

  // Infer type from default if no generic was found
  if (!type) {
    if (rawDefault === 'true' || rawDefault === 'false') type = 'boolean';
    else if (/^['"]/.test(rawDefault)) type = 'string';
    else if (/^\d/.test(rawDefault)) type = 'number';
    else type = 'unknown';
  }

  return { type, rawDefault };
}

/** Parses `output<Type>()` initializer text. */
function parseOutputInitializer(initText) {
  if (!initText.startsWith('output')) return null;
  const typeMatch = initText.match(/^output<([^>]+)>/);
  return { emitterType: typeMatch ? typeMatch[1].trim() : 'void' };
}

/** Parses `signal<Type>(val)` or `signal(val)` and infers the type. */
function parseSignalType(initText) {
  const typeMatch = initText.match(/^signal<([^>]+)>/);
  if (typeMatch) return typeMatch[1].trim();
  const argMatch = initText.match(/^signal\(([^)]*)\)/);
  const raw = argMatch ? argMatch[1].trim() : '';
  if (raw === 'true' || raw === 'false') return 'boolean';
  if (raw === 'null') return 'null';
  if (/^['"]/.test(raw)) return 'string';
  if (/^\d/.test(raw)) return 'number';
  return 'unknown';
}

/** Extracts [slot='name'] selectors from a template string. */
function extractSlots(template) {
  const slots = [];
  const re = /select=["']\[slot=['"]([^'"]+)['"]\]["']/g;
  let m;
  while ((m = re.exec(template)) !== null) {
    slots.push(m[1]);
  }
  return [...new Set(slots)];
}

function parseComponents() {
  const components = [];

  const files = libFiles().filter(
    f =>
      f.getFilePath().includes('/components/') &&
      f.getFilePath().endsWith('.component.ts'),
  );

  for (const file of files) {
    const cls = file.getClasses().find(c => c.isExported() && c.getDecorator('Component'));
    if (!cls) continue;

    const decorator = cls.getDecorator('Component');
    const selector = getDecoratorStringProp(decorator, 'selector');
    const template = getDecoratorStringProp(decorator, 'template');
    const slots = extractSlots(template);

    const { description, tags: classTags } = getJsDoc(cls);

    const inputs = [];
    const outputs = [];

    for (const prop of cls.getProperties()) {
      const initText = prop.getInitializer()?.getText() ?? '';
      const propName = prop.getName();
      const { description: propDesc, tags: propTags } = getJsDoc(prop);

      if (initText.startsWith('input')) {
        const parsed = parseInputInitializer(initText);
        if (!parsed) continue;
        inputs.push({
          name: propName,
          type: parsed.type,
          // @default tag in JSDoc takes priority over extracted value
          default: propTags['default'] ?? parsed.rawDefault,
          description: propDesc,
        });
      } else if (initText.startsWith('output')) {
        const parsed = parseOutputInitializer(initText);
        if (!parsed) continue;
        outputs.push({
          name: propName,
          emitterType: parsed.emitterType,
          description: propDesc,
        });
      }
    }

    // Public signals (non-input, non-protected/private, signal-based)
    const publicSignals = [];
    for (const prop of cls.getProperties()) {
      if (prop.hasModifier(SyntaxKind.ProtectedKeyword)) continue;
      if (prop.hasModifier(SyntaxKind.PrivateKeyword)) continue;
      const initText = prop.getInitializer()?.getText() ?? '';
      if (initText.startsWith('signal')) {
        const { description: propDesc } = getJsDoc(prop);
        const type = parseSignalType(initText);
        publicSignals.push({ name: prop.getName(), type, description: propDesc });
      }
    }

    components.push({
      name: cls.getName() ?? '',
      selector,
      description,
      slots,
      inputs,
      outputs,
      publicSignals,
    });
  }

  return components.sort((a, b) => a.name.localeCompare(b.name));
}

// ─── Type definitions parsing ─────────────────────────────────────────────────

function parseTypes() {
  const types = [];

  const files = libFiles().filter(
    f =>
      f.getFilePath().includes('/components/') &&
      f.getFilePath().endsWith('.types.ts'),
  );

  for (const file of files) {
    for (const alias of file.getTypeAliases()) {
      if (!alias.isExported()) continue;
      const { description } = getJsDoc(alias);
      const typeNode = alias.getTypeNode();
      types.push({
        name: alias.getName(),
        definition: typeNode?.getText() ?? '',
        description,
      });
    }
  }

  return types;
}

// ─── Provider functions parsing ───────────────────────────────────────────────

function parseProviders() {
  const providers = [];
  const seen = new Set();

  const files = libFiles().filter(f => f.getFilePath().includes('/providers/'));

  for (const file of files) {
    for (const fn of file.getFunctions()) {
      if (!fn.isExported()) continue;
      const name = fn.getName() ?? '';
      if (seen.has(name)) continue;
      seen.add(name);

      const { description } = getJsDoc(fn);
      const params = fn.getParameters().map(p => {
        const typeNode = p.getTypeNode();
        const typeTxt = typeNode ? typeNode.getText() : '';
        const optional = p.isOptional() ? '?' : '';
        const defaultVal = p.getInitializer()?.getText();
        const suffix = defaultVal ? ` = ${defaultVal}` : '';
        return `${p.getName()}${optional}${typeTxt ? `: ${typeTxt}` : ''}${suffix}`;
      });

      const returnTypeNode = fn.getReturnTypeNode();
      const returnType = returnTypeNode ? returnTypeNode.getText() : '';

      providers.push({
        name,
        signature: `${name}(${params.join(', ')})${returnType ? `: ${returnType}` : ''}`,
        description,
      });
    }
  }

  return providers;
}

// ─── Interfaces & models parsing ──────────────────────────────────────────────

function parseInterfaces() {
  const models = [];
  const seen = new Set();

  const files = libFiles().filter(
    f =>
      f.getFilePath().includes('/models/') || f.getFilePath().includes('/ports/'),
  );

  for (const file of files) {
    for (const iface of file.getInterfaces()) {
      if (!iface.isExported()) continue;
      if (seen.has(iface.getName())) continue;
      seen.add(iface.getName());

      const { description } = getJsDoc(iface);
      const members = [];

      for (const prop of iface.getProperties()) {
        const { description: propDesc } = getJsDoc(prop);
        members.push({
          kind: 'property',
          name: prop.getName(),
          type: prop.getTypeNode()?.getText() ?? '',
          optional: prop.hasQuestionToken(),
          description: propDesc,
        });
      }

      for (const method of iface.getMethods()) {
        const { description: methodDesc } = getJsDoc(method);
        const params = method.getParameters().map(p => {
          const typeTxt = p.getTypeNode()?.getText() ?? '';
          return `${p.getName()}${typeTxt ? `: ${typeTxt}` : ''}`;
        });
        const returnType = method.getReturnTypeNode()?.getText() ?? 'void';
        members.push({
          kind: 'method',
          name: method.getName(),
          signature: `${method.getName()}(${params.join(', ')}): ${returnType}`,
          description: methodDesc,
        });
      }

      models.push({ name: iface.getName(), description, members });
    }
  }

  return models;
}

// ─── Services parsing ─────────────────────────────────────────────────────────

function parseServices() {
  const services = [];
  const seen = new Set();

  const files = libFiles().filter(
    f =>
      f.getFilePath().includes('/services/') &&
      !f.getFilePath().endsWith('.spec.ts') &&
      !f.getFilePath().includes('transloco-loader'),
  );

  for (const file of files) {
    const cls = file
      .getClasses()
      .find(c => c.isExported() && c.getDecorator('Injectable'));
    if (!cls) continue;
    const name = cls.getName() ?? '';
    if (seen.has(name)) continue;
    seen.add(name);

    const { description } = getJsDoc(cls);
    const publicMethods = [];
    const publicProps = [];

    for (const method of cls.getMethods()) {
      if (method.hasModifier(SyntaxKind.PrivateKeyword)) continue;
      if (method.hasModifier(SyntaxKind.ProtectedKeyword)) continue;
      const { description: mDesc } = getJsDoc(method);
      const params = method.getParameters().map(p => {
        const typeTxt = p.getTypeNode()?.getText() ?? '';
        return `${p.getName()}${typeTxt ? `: ${typeTxt}` : ''}`;
      });
      const returnType = method.getReturnTypeNode()?.getText() ?? 'void';
      publicMethods.push({
        name: method.getName(),
        signature: `${method.getName()}(${params.join(', ')}): ${returnType}`,
        description: mDesc,
      });
    }

    for (const prop of cls.getProperties()) {
      if (prop.hasModifier(SyntaxKind.PrivateKeyword)) continue;
      if (prop.hasModifier(SyntaxKind.ProtectedKeyword)) continue;
      const { description: pDesc } = getJsDoc(prop);
      const typeTxt = prop.getTypeNode()?.getText() ?? '';
      publicProps.push({
        name: prop.getName(),
        type: typeTxt,
        description: pDesc,
      });
    }

    services.push({
      name: cls.getName() ?? '',
      description,
      publicMethods,
      publicProps,
    });
  }

  return services;
}

// ─── Translation keys parsing ─────────────────────────────────────────────────

function parseTranslationKeys() {
  const file = libFiles().find(f => f.getFilePath().endsWith('translation-keys.ts'));
  if (!file) return [];

  const varDecl = file.getVariableDeclaration('KEEPUI_TRANSLATION_KEYS');
  if (!varDecl) return [];

  let init = varDecl.getInitializer();
  if (!init) return [];

  // `as const` wraps the object in an AsExpression — unwrap it
  if (init.getKind() === SyntaxKind.AsExpression) {
    init = init.getExpression();
  }

  if (init.getKind() !== SyntaxKind.ObjectLiteralExpression) return [];

  const keys = [];

  function walk(obj, prefix) {
    for (const prop of obj.getProperties()) {
      const name = prop.getName?.() ?? '';
      const value = prop.getInitializer?.();
      if (!value) continue;

      if (value.getKind() === SyntaxKind.ObjectLiteralExpression) {
        walk(value, prefix ? `${prefix}.${name}` : name);
      } else if (
        value.getKind() === SyntaxKind.StringLiteral ||
        value.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral
      ) {
        keys.push({
          constant: prefix ? `${prefix}.${name}` : name,
          key: value.getLiteralText(),
        });
      }
    }
  }

  walk(init, '');
  return keys;
}

// ─── Markdown generation ──────────────────────────────────────────────────────

function md(...lines) {
  return lines.join('\n');
}

function tableRow(...cells) {
  return `| ${cells.join(' | ')} |`;
}

function codeFence(lang, ...lines) {
  return ['```' + lang, ...lines, '```'].join('\n');
}

function generateMarkdown({ components, types, providers, models, services, translationKeys }) {
  const sections = [];

  // ── Header ──
  sections.push(md(
    '# KeepUI',
    '',
    '> Component library for Angular with multi-platform support (web and Angular + Capacitor).',
    '> Built on **Tailwind CSS v4** with full **light/dark** theming and **i18n** via `@jsverse/transloco`.',
    '>',
    '> **Auto-generated** from JSDoc in the source files.',
    '> Do **not** edit manually — run `npm run docs:generate` to update.',
    '',
    '---',
  ));

  // ── 1. Package identity ──
  sections.push(md(
    '## 1. Package identity',
    '',
    '| Field | Value |',
    '|---|---|',
    '| Package name | `@keepui/ui` |',
    '| Angular compat | `>= 19` |',
    '| Style engine | Tailwind CSS v4 |',
    '| i18n engine | `@jsverse/transloco` |',
    '',
    '---',
  ));

  // ── 2. Installation ──
  sections.push(md(
    '## 2. Installation',
    '',
    '### Option A — local build (development)',
    '',
    codeFence('bash',
      'npm run build         # outputs to dist/keep-ui',
      'npm install /absolute/path/to/dist/keep-ui',
    ),
    '',
    '### Option B — npm registry',
    '',
    codeFence('bash', 'npm install @keepui/ui'),
    '',
    '### Required peer dependencies',
    '',
    codeFence('bash', 'npm install @angular/common @angular/core @jsverse/transloco'),
    '',
    '---',
  ));

  // ── 3. Global styles ──
  sections.push(md(
    '## 3. Global styles (required)',
    '',
    'Add once to the host application\'s global stylesheet (e.g. `src/styles.css`):',
    '',
    codeFence('css', '@import "@keepui/ui/styles";'),
    '',
    'Provides:',
    '- Light theme CSS custom properties (default)',
    '- Dark theme via `[data-theme="dark"]`',
    '- Auto dark via `@media (prefers-color-scheme: dark)`',
    '- Tailwind v4 `@theme inline` mappings for all `bg-keepui-*`, `text-keepui-*`, `border-keepui-*`, `shadow-keepui-*` utilities',
    '',
    '#### Theme switching at runtime',
    '',
    codeFence('ts',
      "document.documentElement.setAttribute('data-theme', 'dark');   // force dark",
      "document.documentElement.setAttribute('data-theme', 'light');  // force light",
      "document.documentElement.removeAttribute('data-theme');         // follow OS",
    ),
    '',
    '---',
  ));

  // ── 4. Provider setup ──
  sections.push(md(
    '## 4. Provider setup (`app.config.ts`)',
    '',
    '### Web application',
    '',
    codeFence('ts',
      "import { provideKeepUi, provideKeepUiI18n } from '@keepui/ui';",
      '',
      'export const appConfig: ApplicationConfig = {',
      '  providers: [',
      '    provideKeepUi(),              // registers WebFileService for FILE_PORT',
      "    provideKeepUiI18n(),          // default language: 'en'",
      "    // provideKeepUiI18n({ defaultLang: 'es' }),",
      '  ],',
      '};',
    ),
    '',
    '### Angular + Capacitor application',
    '',
    codeFence('ts',
      "import { provideKeepUiCapacitor } from '@keepui/ui/capacitor';",
      "import { provideKeepUiI18n } from '@keepui/ui';",
      '',
      'export const appConfig: ApplicationConfig = {',
      '  providers: [provideKeepUiCapacitor(), provideKeepUiI18n()],',
      '};',
    ),
    '',
    '> **Rule:** Never register both `provideKeepUi()` and `provideKeepUiCapacitor()` at the same time.',
    '',
  ));

  if (providers.length) {
    sections.push(md('### Available provider functions', ''));
    for (const p of providers) {
      const lines = [`#### \`${p.signature}\``];
      if (p.description) lines.push('', p.description);
      lines.push('');
      sections.push(lines.join('\n'));
    }
  }

  sections.push('---');

  // ── 5. Components ──
  sections.push(md(
    '',
    '## 5. Component API reference',
    '',
    'All components are **standalone**. Import directly from `@keepui/ui`.',
    '',
  ));

  for (let i = 0; i < components.length; i++) {
    const c = components[i];
    const lines = [];

    lines.push(`### 5.${i + 1} \`${c.name}\``);
    lines.push('');
    lines.push(`**Selector:** \`${c.selector}\``);
    lines.push(`**Import:** \`import { ${c.name} } from '@keepui/ui';\``);
    lines.push('');

    if (c.description) {
      lines.push(c.description);
      lines.push('');
    }

    if (c.inputs.length) {
      lines.push('#### Inputs');
      lines.push('');
      lines.push('| Input | Type | Default | Description |');
      lines.push('|---|---|---|---|');
      for (const inp of c.inputs) {
        const desc = inp.description.replace(/\n/g, ' ').replace(/\|/g, '\\|');
        const def = inp.default ? `\`${inp.default}\`` : '—';
        const type = inp.type ? `\`${inp.type}\`` : '—';
        lines.push(tableRow(`\`${inp.name}\``, type, def, desc));
      }
      lines.push('');
    }

    if (c.outputs.length) {
      lines.push('#### Outputs');
      lines.push('');
      lines.push('| Output | Emitter type | Description |');
      lines.push('|---|---|---|');
      for (const out of c.outputs) {
        const desc = out.description.replace(/\n/g, ' ').replace(/\|/g, '\\|');
        lines.push(tableRow(`\`${out.name}\``, `\`OutputEmitterRef<${out.emitterType}>\``, desc));
      }
      lines.push('');
    }

    if (c.slots.length) {
      lines.push('#### Content slots (`ng-content`)');
      lines.push('');
      lines.push('| Slot | Description |');
      lines.push('|---|---|');
      lines.push('| *(default)* | Main projected content |');
      for (const slot of c.slots) {
        const label = slot.charAt(0).toUpperCase() + slot.slice(1);
        lines.push(tableRow(`\`[slot='${slot}']\``, `${label} icon/element. Hidden while \`loading\`.`));
      }
      lines.push('');
    }

    if (c.publicSignals.length) {
      lines.push('#### Public signals (readable from outside)');
      lines.push('');
      lines.push('| Signal | Type | Description |');
      lines.push('|---|---|---|');
      for (const s of c.publicSignals) {
        const desc = s.description.replace(/\n/g, ' ').replace(/\|/g, '\\|');
        lines.push(tableRow(`\`${s.name}\``, `\`Signal<${s.type}>\``, desc));
      }
      lines.push('');
    }

    lines.push('---');
    sections.push(lines.join('\n'));
  }

  // ── 6. Type definitions ──
  if (types.length) {
    const lines = ['', '## 6. Type definitions', ''];
    for (const t of types) {
      if (t.description) lines.push(`> ${t.description}`, '');
      lines.push(codeFence('ts', `type ${t.name} = ${t.definition};`), '');
    }
    lines.push('---');
    sections.push(lines.join('\n'));
  }

  // ── 7. Interfaces & models ──
  if (models.length) {
    const lines = ['', '## 7. Interfaces & models', ''];
    for (const model of models) {
      lines.push(`### \`${model.name}\``);
      if (model.description) lines.push('', model.description, '');

      const body = [];
      for (const m of model.members) {
        if (m.description) body.push(`  /** ${m.description} */`);
        if (m.kind === 'property') {
          body.push(`  ${m.name}${m.optional ? '?' : ''}: ${m.type};`);
        } else {
          body.push(`  ${m.signature};`);
        }
      }
      lines.push(codeFence('ts', `interface ${model.name} {`, ...body, '}'), '');
    }
    lines.push('---');
    sections.push(lines.join('\n'));
  }

  // ── 8. Services ──
  if (services.length) {
    const lines = ['', '## 8. Services', ''];
    for (const svc of services) {
      lines.push(`### \`${svc.name}\``);
      if (svc.description) lines.push('', svc.description, '');

      if (svc.publicProps.length) {
        lines.push('**Public properties:**', '');
        lines.push('| Property | Type | Description |');
        lines.push('|---|---|---|');
        for (const p of svc.publicProps) {
          const desc = p.description.replace(/\n/g, ' ').replace(/\|/g, '\\|');
          lines.push(tableRow(`\`${p.name}\``, p.type ? `\`${p.type}\`` : '—', desc));
        }
        lines.push('');
      }

      if (svc.publicMethods.length) {
        lines.push('**Public methods:**', '');
        for (const m of svc.publicMethods) {
          lines.push(`- \`${m.signature}\` — ${m.description.replace(/\n/g, ' ')}`);
        }
        lines.push('');
      }
    }
    lines.push('---');
    sections.push(lines.join('\n'));
  }

  // ── 9. i18n ──
  if (translationKeys.length) {
    const lines = [
      '',
      '## 9. Internationalisation (i18n)',
      '',
      'Use typed constants instead of raw strings:',
      '',
      codeFence('ts',
        "import { KEEPUI_TRANSLATION_KEYS as T } from '@keepui/ui';",
        '',
        '// Example',
        'translocoService.translate(T.IMAGE_PREVIEW.SELECT_IMAGE);',
      ),
      '',
      '**Supported languages:** `en` (English), `es` (Spanish), `de` (German)',
      '',
      '**Translation keys:**',
      '',
      '| Constant path | Translation key |',
      '|---|---|',
      ...translationKeys.map(k => tableRow(`\`${k.constant}\``, `\`${k.key}\``)),
      '',
      '**Changing language at runtime:**',
      '',
      codeFence('ts',
        "import { KeepUiLanguageService } from '@keepui/ui';",
        '',
        "const lang = inject(KeepUiLanguageService);",
        "lang.setLanguage('es');  // 'en' | 'es' | 'de'",
      ),
      '',
      '---',
    ];
    sections.push(lines.join('\n'));
  }

  // ── 10. CSS tokens ──
  sections.push(md(
    '',
    '## 10. CSS design tokens',
    '',
    'Override any variable in your CSS to customise the theme:',
    '',
    codeFence('css',
      ':root {',
      '  --keepui-primary:            #3b82f6;',
      '  --keepui-primary-hover:      #2563eb;',
      '  --keepui-primary-active:     #1d4ed8;',
      '  --keepui-primary-foreground: #ffffff;',
      '  --keepui-background:         #f5f5f5;',
      '  --keepui-surface:            #ffffff;',
      '  --keepui-surface-hover:      #f0f0f0;',
      '  --keepui-border:             #e0e0e0;',
      '  --keepui-border-strong:      #cccccc;',
      '  --keepui-text:               #1f2937;',
      '  --keepui-text-muted:         #6b7280;',
      '  --keepui-text-disabled:      #9ca3af;',
      '  --keepui-error:              #dc2626;',
      '  --keepui-error-foreground:   #ffffff;',
      '  --keepui-success:            #16a34a;',
      '  --keepui-warning:            #f59e0b;',
      '  --keepui-shadow-sm:          0 1px 3px rgba(0,0,0,.12);',
      '  --keepui-shadow-md:          0 3px 6px rgba(0,0,0,.15);',
      '  --keepui-shadow-lg:          0 6px 12px rgba(0,0,0,.18);',
      '}',
      '',
      '[data-theme="dark"] {',
      '  --keepui-primary:            #60a5fa;',
      '  --keepui-primary-foreground: #0f172a;',
      '  --keepui-background:         #0f172a;',
      '  --keepui-surface:            #1e293b;',
      '  --keepui-surface-hover:      #334155;',
      '  --keepui-border:             #334155;',
      '  --keepui-border-strong:      #475569;',
      '  --keepui-text:               #f1f5f9;',
      '  --keepui-text-muted:         #94a3b8;',
      '  --keepui-text-disabled:      #64748b;',
      '  --keepui-error:              #f87171;',
      '  --keepui-error-foreground:   #0f172a;',
      '  --keepui-success:            #4ade80;',
      '  --keepui-warning:            #fbbf24;',
      '}',
    ),
    '',
    '---',
  ));

  // ── 11. Tailwind utilities ──
  sections.push(md(
    '',
    '## 11. Tailwind utility classes',
    '',
    'Generated automatically after `@import "@keepui/ui/styles"` with Tailwind v4:',
    '',
    '```',
    'bg-keepui-background      bg-keepui-surface        bg-keepui-surface-hover',
    'bg-keepui-primary         bg-keepui-primary-hover  bg-keepui-primary-active',
    'bg-keepui-error           bg-keepui-success        bg-keepui-warning',
    '',
    'text-keepui-text          text-keepui-text-muted   text-keepui-text-disabled',
    'text-keepui-primary       text-keepui-primary-fg   text-keepui-error',
    '',
    'border-keepui-border      border-keepui-border-strong  border-keepui-primary',
    '',
    'shadow-keepui-sm          shadow-keepui-md         shadow-keepui-lg',
    '',
    'focus-visible:ring-keepui-primary',
    '```',
    '',
    '---',
  ));

  // ── 12. Checklist ──
  sections.push(md(
    '',
    '## 12. Integration checklist',
    '',
    '- [ ] `@keepui/ui` installed in `package.json`',
    '- [ ] `@import "@keepui/ui/styles"` in global stylesheet',
    '- [ ] Tailwind v4 configured (via `@tailwindcss/postcss` or `@tailwindcss/vite`)',
    '- [ ] `provideKeepUi()` **or** `provideKeepUiCapacitor()` registered in `app.config.ts`',
    '- [ ] `provideKeepUiI18n()` registered in `app.config.ts`',
    '- [ ] Components imported individually in each standalone component or NgModule',
    '- [ ] `[data-theme="dark"]` toggle wired if dark mode switching is needed',
    '- [ ] `KeepUiLanguageService.setLanguage()` called if runtime i18n is needed',
    '',
    '---',
  ));

  // ── 13. What NOT to do ──
  sections.push(md(
    '',
    '## 13. What NOT to do',
    '',
    '- Do **not** import from `@keepui/ui/src/lib/...` — only from `@keepui/ui` or `@keepui/ui/capacitor`.',
    '- Do **not** call both `provideKeepUi()` and `provideKeepUiCapacitor()`.',
    '- Do **not** hardcode `FILE_PORT` implementations inside components — always use the token.',
    "- Do **not** skip `@import \"@keepui/ui/styles\"` — without it, all theme utility classes are missing.",
    '- Do **not** import `@capacitor/*` in code that also imports `@keepui/ui` core.',
  ));

  return sections.join('\n') + '\n';
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const components = parseComponents();
const types = parseTypes();
const providers = parseProviders();
const models = parseInterfaces();
const services = parseServices();
const translationKeys = parseTranslationKeys();

const markdown = generateMarkdown({ components, types, providers, models, services, translationKeys });

const outputPath = resolve(ROOT, 'README.md');
writeFileSync(outputPath, markdown, 'utf-8');

console.log(`✅  README.md generated`);
console.log(`   Components : ${components.length}`);
console.log(`   Types      : ${types.length}`);
console.log(`   Providers  : ${providers.length}`);
console.log(`   Interfaces : ${models.length}`);
console.log(`   Services   : ${services.length}`);
console.log(`   i18n keys  : ${translationKeys.length}`);

