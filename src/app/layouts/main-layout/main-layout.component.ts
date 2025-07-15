import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class MainLayoutComponent {
  public appPages: MenuItem[] = [
    {
      title: 'Agenda',
      url: '/app/agenda',
      icon: 'calendar'
    },
    {
      title: 'Pacientes',
      url: '/app/pacientes',
      icon: 'person'
    },
    {
      title: 'Tratamientos',
      url: '/app/tratamientos',
      icon: 'medical'
    },
    {
      title: 'Perfil',
      url: '/app/perfil',
      icon: 'person'
    },
    {
      title: 'Ajustes',
      url: '/app/ajustes',
      icon: 'settings'
    }
  ];

  constructor(private menuCtrl: MenuController) {}

  ionViewDidEnter() {
    // Mejorar la accesibilidad del menú
    this.setupMenuAccessibility();
  }

  private setupMenuAccessibility() {
    // Agregar atributos ARIA apropiados al menú
    const menuElement = document.querySelector('ion-menu');
    if (menuElement) {
      menuElement.setAttribute('aria-label', 'Menú principal de navegación');
    }

    // Configurar el manejo de foco
    this.menuCtrl.enable(true);
  }

  async onMenuOpen() {
    // Cuando el menú se abre, asegurar que el foco esté en el primer elemento
    setTimeout(() => {
      const firstMenuItem = document.querySelector('ion-menu ion-item');
      if (firstMenuItem) {
        (firstMenuItem as HTMLElement).focus();
      }
    }, 100);
  }
} 