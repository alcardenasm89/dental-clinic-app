import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DashboardPage {
  public stats = {
    todayAppointments: 8,
    pendingTreatments: 12,
    activePatients: 45
  };

  public recentAppointments = [
    { time: '09:00', patient: 'Juan Pérez', treatment: 'Limpieza dental' },
    { time: '10:30', patient: 'María García', treatment: 'Ortodoncia' },
    { time: '11:45', patient: 'Carlos López', treatment: 'Extracción' }
  ];
} 