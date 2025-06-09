import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface Treatment {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'completed';
  date: string;
  patient: string;
}

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.page.html',
  styleUrls: ['./treatments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class TreatmentsPage {
  treatments: Treatment[] = [
    {
      id: 1,
      name: 'Limpieza Dental',
      description: 'Limpieza profesional y eliminación de sarro',
      status: 'pending',
      date: '2024-03-20',
      patient: 'Juan Pérez'
    },
    {
      id: 2,
      name: 'Empaste',
      description: 'Tratamiento de caries en molar superior',
      status: 'pending',
      date: '2024-03-21',
      patient: 'María García'
    },
    {
      id: 3,
      name: 'Ortodoncia',
      description: 'Ajuste de brackets',
      status: 'pending',
      date: '2024-03-22',
      patient: 'Carlos López'
    }
  ];

  constructor(private toastController: ToastController) {}

  async markAsCompleted(treatment: Treatment, event: Event) {
    const target = event.currentTarget as HTMLElement;
    const card = target.closest('ion-card');
    
    if (card) {
      // Aplicar animación de completado
      card.style.transition = 'all 0.3s ease';
      card.style.transform = 'scale(0.95)';
      card.style.opacity = '0.7';

      // Esperar a que termine la animación
      await new Promise(resolve => setTimeout(resolve, 300));

      // Actualizar estado
      treatment.status = 'completed';

      // Restaurar estilo
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';

      // Mostrar mensaje de éxito
      const toast = await this.toastController.create({
        message: `Tratamiento "${treatment.name}" marcado como completado`,
        duration: 2000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle'
      });
      await toast.present();
    }
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? 'success' : 'warning';
  }

  getStatusText(status: string): string {
    return status === 'completed' ? 'Completado' : 'Pendiente';
  }
} 