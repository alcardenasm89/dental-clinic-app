import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
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

  constructor() {}
} 