import { createAction, props } from '@ngrx/store';
import { Patient } from '../../services/patients.service';

export const loadPatients = createAction('[Patients] Load Patients');

export const loadPatientsSuccess = createAction(
  '[Patients] Load Patients Success',
  props<{ patients: Patient[] }>()
);

export const loadPatientsFailure = createAction(
  '[Patients] Load Patients Failure',
  props<{ error: string }>()
);

export const addPatient = createAction(
  '[Patients] Add Patient',
  props<{ patient: Patient }>()
);

export const updatePatient = createAction(
  '[Patients] Update Patient',
  props<{ patient: Patient }>()
); 