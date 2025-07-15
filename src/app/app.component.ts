import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { addIcons } from 'ionicons';
import { ThemeService } from './core/services/theme.service';
import { 
  add, 
  person, 
  calendar, 
  medical, 
  settings, 
  logOut, 
  camera, 
  location, 
  refresh,
  chevronForward,
  close,
  checkmark,
  cloudDownloadOutline,
  checkmarkCircle,
  lockClosed,
  mailOutline,
  callOutline,
  logOutOutline,
  map,
  addCircleOutline,
  arrowDownCircleOutline,
  image
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <router-outlet></router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [CommonModule, IonicModule, RouterOutlet]
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    // Registrar iconos utilizados en la aplicación
    addIcons({
      add,
      person,
      calendar,
      medical,
      settings,
      logOut,
      camera,
      location,
      refresh,
      chevronForward,
      close,
      checkmark,
      cloudDownloadOutline,
      checkmarkCircle,
      lockClosed,
      mailOutline,
      callOutline,
      logOutOutline,
      map,
      addCircleOutline,
      arrowDownCircleOutline,
      image
    });

    // Configuración global de accesibilidad
    this.setupGlobalAccessibility();
  }

  private setupGlobalAccessibility() {
    // Agregar atributos ARIA al elemento raíz
    document.documentElement.setAttribute('lang', 'es');
    document.documentElement.setAttribute('dir', 'ltr');

    // Configurar el manejo de foco global
    document.addEventListener('keydown', (event) => {
      // Mejorar la navegación por teclado
      if (event.key === 'Tab') {
        // Asegurar que los elementos enfocables sean visibles
        const focusedElement = document.activeElement as HTMLElement;
        if (focusedElement && focusedElement.scrollIntoView) {
          focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    // Configurar el manejo de contraste
    this.setupContrastMode();
  }

  private setupContrastMode() {
    // Detectar preferencias de contraste del usuario
    const prefersContrast = window.matchMedia('(prefers-contrast: high)');
    
    if (prefersContrast.matches) {
      document.body.classList.add('high-contrast');
    }

    // Escuchar cambios en las preferencias
    prefersContrast.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    });
  }
}
