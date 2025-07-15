import { Injectable } from '@angular/core';

export interface ThemeSettings {
  darkMode: boolean;
  autoDarkMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private settings: ThemeSettings = {
    darkMode: false,
    autoDarkMode: true
  };

  constructor() {
    this.initializeTheme();
  }

  private async initializeTheme() {
    await this.loadSettings();
    this.applyTheme();
    
    // Escuchar cambios en las preferencias del sistema
    if (this.settings.autoDarkMode) {
      this.watchSystemTheme();
    }
  }

  private async loadSettings() {
    try {
      // Usar localStorage directamente
      const savedSettings = localStorage.getItem('theme_settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  }

  private async saveSettings() {
    try {
      // Usar localStorage directamente
      localStorage.setItem('theme_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  }

  private applyTheme() {
    const isDark = this.shouldUseDarkMode();
    
    // Aplicar clase dark al body
    document.body.classList.toggle('dark', isDark);
    
    // Aplicar clase dark al ion-app
    const ionApp = document.querySelector('ion-app');
    if (ionApp) {
      ionApp.classList.toggle('dark', isDark);
    }
    
    // Aplicar clase dark al html
    document.documentElement.classList.toggle('dark', isDark);
    
    // Establecer variables CSS
    document.documentElement.style.setProperty('--ion-color-scheme', isDark ? 'dark' : 'light');
    
    // Forzar actualización de estilos
    this.forceStyleUpdate();
  }

  private shouldUseDarkMode(): boolean {
    if (!this.settings.autoDarkMode) {
      return this.settings.darkMode;
    }
    
    // Verificar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
  }

  private watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.settings.autoDarkMode) {
        this.applyTheme();
      }
    });
  }

  private forceStyleUpdate() {
    // Forzar la actualización de estilos
    const style = document.createElement('style');
    style.textContent = 'body { transition: background-color 0.3s ease; }';
    document.head.appendChild(style);
    
    setTimeout(() => {
      document.head.removeChild(style);
    }, 100);
  }

  // Métodos públicos
  async setDarkMode(enabled: boolean) {
    this.settings.darkMode = enabled;
    this.settings.autoDarkMode = false; // Desactivar auto cuando se cambia manualmente
    await this.saveSettings();
    this.applyTheme();
  }

  async setAutoDarkMode(enabled: boolean) {
    this.settings.autoDarkMode = enabled;
    await this.saveSettings();
    this.applyTheme();
  }

  getDarkMode(): boolean {
    return this.shouldUseDarkMode();
  }

  getAutoDarkMode(): boolean {
    return this.settings.autoDarkMode;
  }

  getManualDarkMode(): boolean {
    return this.settings.darkMode;
  }

  // Método para alternar el modo oscuro
  async toggleDarkMode() {
    await this.setDarkMode(!this.settings.darkMode);
  }
} 