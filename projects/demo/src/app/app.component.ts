import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeepUiLanguageService, KeepUiLanguage } from '@keepui/ui';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden bg-ku-primary text-ku-primary-text">

      <!-- ── Mobile backdrop ── -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 z-30 bg-black/50 md:hidden"
          (click)="closeSidebar()"
          aria-hidden="true"
        ></div>
      }

      <!-- ══════════════════════════════════
           SIDEBAR
      ════════════════════════════════════ -->
      <aside [class]="sidebarClass()">

        <!-- Sidebar header -->
        <div class="flex items-center justify-between px-4 h-14 shrink-0
                    border-b border-ku-secondary-border">
          <div class="flex items-center gap-2">
            <span class="text-xl leading-none select-none">⬡</span>
            <span class="font-bold text-base tracking-tight">KeepUI</span>
            <span class="text-xs text-ku-gray-text font-normal">Demo</span>
          </div>
          <!-- Close btn — visible only on mobile -->
          <button
            class="md:hidden w-8 h-8 flex items-center justify-center rounded
                   text-ku-gray-text hover:bg-ku-secondary-hover
                   hover:text-ku-primary-text transition-colors"
            (click)="closeSidebar()"
            aria-label="Cerrar menú"
          >✕</button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-3" aria-label="Navegación de componentes">
          @for (group of navGroups; track group.label) {
            <p class="text-xs font-semibold uppercase tracking-widest
                      text-ku-gray-text px-3 pb-1.5 mb-0 mt-4 first:mt-1.5">
              {{ group.label }}
            </p>
            @for (item of group.items; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="!bg-ku-primary-hover !text-ku-primary-text"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium
                       transition-colors duration-150
                       text-ku-primary-text hover:bg-ku-secondary-hover"
                (click)="closeSidebar()"
              >
                <span class="text-base leading-none">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            }
          }
        </nav>

        <!-- Footer: language selector + theme toggle -->
        <div class="p-4 shrink-0 border-t border-ku-secondary-border flex flex-col gap-2">

          <!-- Language selector -->
          <div class="flex items-center gap-1" role="group" aria-label="Idioma de KeepUI">
            <span class="text-xs text-ku-gray-text mr-1">🌐</span>
            @for (lang of availableLangs; track lang) {
              <button
                (click)="setLanguage(lang)"
                [class]="langBtnClass(lang)"
                [attr.aria-pressed]="activeLang() === lang"
              >{{ lang.toUpperCase() }}</button>
            }
          </div>

          <!-- Theme toggle -->
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-sm
                   border border-ku-secondary-border bg-ku-secondary text-ku-secondary-text
                   hover:bg-ku-secondary-hover transition-colors duration-150"
            (click)="toggleTheme()"
            aria-label="Cambiar tema"
          >
            {{ isDark() ? '☀️ Light mode' : '🌙 Dark mode' }}
          </button>
        </div>

      </aside>

      <!-- ══════════════════════════════════
           MAIN CONTENT AREA
      ════════════════════════════════════ -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

        <!-- Mobile top header (hidden on md+) -->
        <header
          class="md:hidden flex items-center justify-between px-3 h-14 shrink-0
                 border-b border-ku-secondary-border bg-ku-secondary"
        >
          <button
            class="w-9 h-9 flex items-center justify-center rounded
                   text-ku-primary-text hover:bg-ku-secondary-hover transition-colors"
            (click)="openSidebar()"
            aria-label="Abrir menú"
          >
            <span class="text-xl leading-none">☰</span>
          </button>

          <div class="flex items-center gap-1.5">
            <span class="text-base leading-none">⬡</span>
            <span class="font-bold text-sm">KeepUI</span>
          </div>

          <button
            class="w-9 h-9 flex items-center justify-center rounded
                   text-ku-primary-text hover:bg-ku-secondary-hover transition-colors"
            (click)="toggleTheme()"
            aria-label="Cambiar tema"
          >
            <span class="text-base leading-none">{{ isDark() ? '☀️' : '🌙' }}</span>
          </button>
        </header>

        <!-- Scrollable page content -->
        <main class="flex-1 overflow-y-auto">
          <router-outlet />
        </main>

      </div>
    </div>
  `,
})
export class AppComponent {
  private readonly langService = inject(KeepUiLanguageService);

  sidebarOpen = signal(false);
  isDark = signal(false);

  /** Reactive signal with the active KeepUI locale. */
  readonly activeLang = this.langService.activeLanguage;

  /** All supported KeepUI locales. */
  readonly availableLangs: readonly KeepUiLanguage[] = this.langService.availableLanguages;

  navGroups: NavGroup[] = [
    {
      label: 'General',
      items: [
        { path: '', label: 'Inicio', icon: '🏠', exact: true },
      ],
    },
    {
      label: 'Componentes',
      items: [
        { path: 'button', label: 'Button', icon: '🔘', exact: false },
        { path: 'card', label: 'Card', icon: '🃏', exact: false },
        { path: 'image-preview', label: 'Image Preview', icon: '🖼️', exact: false },
      ],
    },
  ];

  /** Clases del sidebar: fixed drawer en mobile, in-flow en desktop. */
  readonly sidebarClass = computed(() =>
    [
      'flex flex-col w-64 shrink-0',
      'bg-ku-secondary border-r border-ku-secondary-border',
      'fixed md:static inset-y-0 left-0 md:inset-auto',
      'z-40 md:z-auto',
      'transition-transform duration-300 ease-in-out',
      this.sidebarOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    ].join(' '),
  );

  /** Clases del botón de idioma según si está activo o no. */
  langBtnClass(lang: KeepUiLanguage): string {
    const base =
      'flex-1 py-1 rounded text-xs font-semibold transition-colors duration-150';
    return this.activeLang() === lang
      ? `${base} bg-ku-primary-hover text-ku-primary-text`
      : `${base} border border-ku-secondary-border text-ku-gray-text hover:bg-ku-secondary-hover`;
  }

  setLanguage(lang: KeepUiLanguage): void {
    this.langService.setLanguage(lang);
  }

  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }
}
