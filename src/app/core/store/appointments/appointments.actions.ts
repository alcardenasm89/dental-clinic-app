import { createAction, props } from '@ngrx/store';
import { Appointment } from '../../services/appointments.service';

export const loadAppointments = createAction('[Appointments] Load Appointments');

export const loadAppointmentsSuccess = createAction(
  '[Appointments] Load Appointments Success',
  props<{ appointments: Appointment[] }>()
);

export const loadAppointmentsFailure = createAction(
  '[Appointments] Load Appointments Failure',
  props<{ error: string }>()
);

export const addAppointment = createAction(
  '[Appointments] Add Appointment',
  props<{ appointment: Appointment }>()
);

export const updateAppointment = createAction(
  '[Appointments] Update Appointment',
  props<{ appointment: Appointment }>()
); 