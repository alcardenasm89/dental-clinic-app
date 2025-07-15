import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoDarkMode: boolean;
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
    autoDarkMode: true,
    language: 'es',
    fontSize: 'medium'
  };

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    // Cargar configuración guardada
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      // Usar localStorage directamente
      const savedSettings = localStorage.getItem('app_settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
      
      // Cargar configuración del tema
      this.settings.darkMode = this.themeService.getManualDarkMode();
      this.settings.autoDarkMode = this.themeService.getAutoDarkMode();
    } catch (error) {
      console.error('Error loading settings:', error);
      
      // Cargar configuración del tema
      this.settings.darkMode = this.themeService.getManualDarkMode();
      this.settings.autoDarkMode = this.themeService.getAutoDarkMode();
    }
  }

  onDarkModeChange() {
    this.themeService.setDarkMode(this.settings.darkMode);
    this.saveSettings();
  }

  onAutoDarkModeChange() {
    this.themeService.setAutoDarkMode(this.settings.autoDarkMode);
    this.saveSettings();
  }

  async saveSettings() {
    try {
      // Usar localStorage directamente
      localStorage.setItem('app_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    console.log('Configuraciones guardadas:', this.settings);
  }

  // Método para mostrar el modal de cambio de contraseña
  async showChangePasswordModal() {
    const alert = await this.createChangePasswordAlert();
    alert.present();
  }

  private async createChangePasswordAlert() {
    const { AlertController } = await import('@ionic/angular');
    const alertController = new AlertController();
    
    return await alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Contraseña actual',
          attributes: {
            required: true
          }
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva contraseña',
          attributes: {
            required: true
          }
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña',
          attributes: {
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: async (data) => {
            await this.handlePasswordChange(data);
          }
        }
      ]
    });
  }

  private async handlePasswordChange(data: any) {
    const { currentPassword, newPassword, confirmPassword } = data;
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showError('Todos los campos son requeridos');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      this.showError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      this.showError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Intentar cambiar la contraseña
    const success = await this.authService.changePassword(currentPassword, newPassword);
    
    if (success) {
      this.showSuccess('Contraseña cambiada exitosamente');
    } else {
      this.showError('La contraseña actual es incorrecta');
    }
  }

  private async showError(message: string) {
    const { ToastController } = await import('@ionic/angular');
    const toastController = new ToastController();
    
    const toast = await toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  private async showSuccess(message: string) {
    const { ToastController } = await import('@ionic/angular');
    const toastController = new ToastController();
    
    const toast = await toastController.create({
      message: message,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }
} 