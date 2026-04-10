import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
    <div class="flex h-screen overflow-hidden bg-keepui-background text-keepui-text">

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
           Desktop: in-flow (w-64)
           Mobile: fixed drawer, slides from left
      ════════════════════════════════════ -->
      <aside [class]="sidebarClass()">

        <!-- Sidebar header -->
        <div class="flex items-center justify-between px-4 h-14 shrink-0
                    border-b border-keepui-border">
          <div class="flex items-center gap-2">
            <span class="text-xl leading-none select-none">⬡</span>
            <span class="font-bold text-base tracking-tight">KeepUI</span>
            <span class="text-xs text-keepui-text-muted font-normal">Demo</span>
          </div>
          <!-- Close btn — visible only on mobile -->
          <button
            class="md:hidden w-8 h-8 flex items-center justify-center rounded
                   text-keepui-text-muted hover:bg-keepui-surface-hover
                   hover:text-keepui-text transition-colors"
            (click)="closeSidebar()"
            aria-label="Cerrar menú"
          >✕</button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-3" aria-label="Navegación de componentes">
          @for (group of navGroups; track group.label) {
            <p class="text-xs font-semibold uppercase tracking-widest
                      text-keepui-text-muted px-3 pb-1.5 mb-0 mt-4 first:mt-1.5">
              {{ group.label }}
            </p>
            @for (item of group.items; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="!bg-keepui-primary !text-keepui-primary-fg"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium
                       transition-colors duration-150
                       text-keepui-text hover:bg-keepui-surface-hover"
                (click)="closeSidebar()"
              >
                <span class="text-base leading-none">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            }
          }
        </nav>

        <!-- Footer: theme toggle -->
        <div class="p-4 shrink-0 border-t border-keepui-border">
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-sm
                   border border-keepui-border bg-keepui-surface text-keepui-text
                   hover:bg-keepui-surface-hover transition-colors duration-150"
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
                 border-b border-keepui-border bg-keepui-surface"
        >
          <button
            class="w-9 h-9 flex items-center justify-center rounded
                   text-keepui-text hover:bg-keepui-surface-hover transition-colors"
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
                   text-keepui-text hover:bg-keepui-surface-hover transition-colors"
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
  sidebarOpen = signal(false);
  isDark = signal(false);

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
      // Estructura
      'flex flex-col w-64 shrink-0',
      'bg-keepui-surface border-r border-keepui-border',
      // Mobile: drawer fixed fuera de pantalla
      'fixed md:static inset-y-0 left-0 md:inset-auto',
      'z-40 md:z-auto',
      // Animación de apertura/cierre
      'transition-transform duration-300 ease-in-out',
      this.sidebarOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    ].join(' '),
  );

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
