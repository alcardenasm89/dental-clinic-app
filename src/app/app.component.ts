import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';

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
  constructor() {}
}
