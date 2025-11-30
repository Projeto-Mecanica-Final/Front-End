import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'access';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app_theme';

  currentTheme = signal<AppTheme>('light');

  constructor() {
    const saved =
      (localStorage.getItem(this.STORAGE_KEY) as AppTheme) || 'light';
    this.setTheme(saved); // Aplica imediatamente ao iniciar
  }

  setTheme(theme: AppTheme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.currentTheme.set(theme);
  }

  toggleTheme(): void {
    const next = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  getTheme(): AppTheme {
    return this.currentTheme();
  }
}
