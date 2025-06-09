import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  fontSize: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SettingsPage {
  settings: Settings = {
    notifications: true,
    darkMode: false,
    language: 'es',
    fontSize: 'medium'
  };

  constructor() {
    // Cargar configuración guardada
    this.loadSettings();
  }

  private loadSettings() {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
      this.applyDarkMode();
    }
  }

  private applyDarkMode() {
    document.body.classList.toggle('dark', this.settings.darkMode);
  }

  onDarkModeChange() {
    this.applyDarkMode();
    this.saveSettings();
  }

  saveSettings() {
    localStorage.setItem('app_settings', JSON.stringify(this.settings));
    // Aquí iría la lógica adicional para guardar las configuraciones
    console.log('Configuraciones guardadas:', this.settings);
  }
} 