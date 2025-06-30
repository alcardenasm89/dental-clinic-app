import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Appointment {
  id: number;
  name: string;
  time: string;
  reason: string;
  status: 'confirmed' | 'pending';
}

const APPOINTMENTS_KEY = 'appointments';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>(this.loadAppointments());
  public appointments$ = this.appointmentsSubject.asObservable();

  private loadAppointments(): Appointment[] {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Datos iniciales de ejemplo
    return [
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

  private saveAppointments(appointments: Appointment[]) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments$;
  }

  getAppointmentById(id: number): Appointment | undefined {
    return this.appointmentsSubject.value.find(a => a.id === id);
  }

  addAppointment(appointment: Appointment) {
    const appointments = [...this.appointmentsSubject.value, appointment];
    this.appointmentsSubject.next(appointments);
    this.saveAppointments(appointments);
  }

  updateAppointment(updated: Appointment) {
    const appointments = this.appointmentsSubject.value.map(a => a.id === updated.id ? updated : a);
    this.appointmentsSubject.next(appointments);
    this.saveAppointments(appointments);
  }
} 