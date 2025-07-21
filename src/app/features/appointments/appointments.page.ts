import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { IonicModule, AnimationController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService, Appointment } from '../../core/services/appointments.service';
import { PatientsService, Patient } from '../../core/services/patients.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

registerLocaleData(localeEs);

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule, 
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AppointmentsPage implements OnInit {
  public selectedDate: string = new Date().toISOString();
  public appointments: Appointment[] = [];
  public isAddingAppointment = false;
  public newAppointment: Partial<Appointment> = {};

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Animación de entrada de la página
    this.animatePageEntry();
    
    // Sincronizar agenda con pacientes reales
    this.patientsService.getPatients().subscribe((patients: Patient[]) => {
      this.appointments = patients.map((patient, idx) => ({
        id: patient.id,
        name: patient.name,
        reason: 'Consulta general',
        time: `${9 + idx}:00`,
        status: 'confirmed'
      }));
      
      // Animación de entrada de las citas
      this.animateAppointmentsEntry();
    });
  }

  // Animación de entrada de la página
  async animatePageEntry() {
    const pageElement = document.querySelector('.appointments-page') as HTMLElement;
    if (pageElement) {
      const animation = this.animationCtrl.create()
        .addElement(pageElement)
        .duration(800)
        .easing('cubic-bezier(0.25, 0.46, 0.45, 0.94)')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(30px)', 'translateY(0)');

      await animation.play();
    }
  }

  // Animación de entrada de las citas
  async animateAppointmentsEntry() {
    const appointmentCards = document.querySelectorAll('.appointment-card');
    appointmentCards.forEach((card, index) => {
      const animation = this.animationCtrl.create()
        .addElement(card as HTMLElement)
        .duration(400)
        .delay(index * 100)
        .easing('ease-out')
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'scale(0.8) translateY(20px)', 'scale(1) translateY(0)');

      animation.play();
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

  // Animación de pulse para elementos importantes
  async animatePulse(element: HTMLElement) {
    const animation = this.animationCtrl.create()
      .addElement(element)
      .duration(600)
      .easing('ease-in-out')
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.05)' },
        { offset: 1, transform: 'scale(1)' }
      ]);

    await animation.play();
  }

  onAppointmentClick(appointment: Appointment) {
    // Animación de click
    const cardElement = document.querySelector(`[data-appointment-id="${appointment.id}"]`) as HTMLElement;
    if (cardElement) {
      this.animateCard(cardElement);
    }
    
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
    // Para ion-datetime, el valor está en event.detail.value
    if (event && event.detail && event.detail.value) {
      this.selectedDate = event.detail.value;
    }
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
      
      // Mostrar snackbar de Material
      this.snackBar.open('Cita agregada correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      
      // Animación de confirmación
      const successElement = document.querySelector('.success-message') as HTMLElement;
      if (successElement) {
        this.animatePulse(successElement);
      }
    }
  }
} 