import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  experience: number;
  profileImage: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProfilePage implements OnInit {
  public professional: Professional = {
    id: 1,
    name: 'Dra. María Rodríguez',
    specialty: 'Ortodoncista',
    email: 'doctor@clinicadental.com',
    phone: '+56 9 8765 4321',
    experience: 8,
    profileImage: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  logout() {
    // Aquí iría la lógica de cierre de sesión
    // Por ahora solo redirigimos al login
    this.router.navigate(['/auth/login']);
  }

  getExperienceText(years: number): string {
    return years === 1 ? 'año de experiencia' : 'años de experiencia';
  }
} 