import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Appointment {
  id: number;
  name: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'pending';
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule]
})
export class AppointmentsPage implements OnInit {
  public selectedDate: string = new Date().toISOString();
  public appointments: Appointment[] = [];
  public isAddingAppointment = false;

  constructor(private animationCtrl: AnimationController, private router: Router) {}

  ngOnInit() {
    this.loadAppointments();
  }

  private loadAppointments() {
    // Simulación de datos de pacientes
    this.appointments = [
      {
        id: 1,
        name: 'Juan Pérez',
        time: '09:00',
        reason: 'Limpieza dental',
        status: 'confirmed'
      },
      {
        id: 2,
        name: 'María García',
        time: '10:30',
        reason: 'Ortodoncia',
        status: 'confirmed'
      },
      {
        id: 3,
        name: 'Carlos López',
        time: '11:45',
        reason: 'Extracción de muela',
        status: 'pending'
      },
      {
        id: 4,
        name: 'Ana Martínez',
        time: '13:00',
        reason: 'Revisión de brackets',
        status: 'confirmed'
      },
      {
        id: 5,
        name: 'Roberto Sánchez',
        time: '14:30',
        reason: 'Blanqueamiento',
        status: 'pending'
      }
    ];
  }

  // Animación para mostrar/ocultar el formulario de nueva cita
  async toggleAddAppointment() {
    this.isAddingAppointment = !this.isAddingAppointment;
    const element = document.querySelector('.appointment-form');
    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(300)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-20px)', 'translateY(0)');

      await animation.play();
    }
  }

  // Animación para las tarjetas de citas
  async animateCard(element: HTMLElement) {
    const animation = this.animationCtrl.create()
      .addElement(element)
      .duration(200)
      .easing('ease-in-out')
      .fromTo('transform', 'scale(0.95)', 'scale(1)');

    await animation.play();
  }

  onAppointmentClick(appointment: Appointment) {
    // Navegar a la ficha del paciente con el ID como parámetro
    this.router.navigate(['/app/paciente-ficha', appointment.id], {
      state: { patientName: appointment.name }
    });
  }

  getStatusColor(status: string): string {
    return status === 'confirmed' ? 'success' : 'warning';
  }

  getStatusText(status: string): string {
    return status === 'confirmed' ? 'Confirmada' : 'Pendiente';
  }

  onDateChange(event: any) {
    console.log('Fecha seleccionada:', event.detail.value);
    // Aquí iría la lógica para cargar las citas de la fecha seleccionada
  }

  addAppointment() {
    // Aquí iría la lógica para agregar una nueva cita
    console.log('Agregar nueva cita');
  }
} 