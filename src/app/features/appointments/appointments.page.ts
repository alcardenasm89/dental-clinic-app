import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentsService, Appointment } from '../../core/services/appointments.service';

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
  public newAppointment: Partial<Appointment> = {};

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit() {
    this.appointmentsService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
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
    if (this.newAppointment.name && this.newAppointment.reason && this.newAppointment.time) {
      const newId = Math.max(0, ...this.appointments.map(a => a.id)) + 1;
      const appointment: Appointment = {
        id: newId,
        name: this.newAppointment.name,
        reason: this.newAppointment.reason,
        time: this.newAppointment.time,
        status: 'pending'
      };
      this.appointmentsService.addAppointment(appointment);
      this.newAppointment = {};
      this.isAddingAppointment = false;
    }
  }
} 