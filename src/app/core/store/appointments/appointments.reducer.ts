import { createReducer, on } from '@ngrx/store';
import * as AppointmentsActions from './appointments.actions';

export interface AppointmentsState {
  appointments: any[];
}

export const initialState: AppointmentsState = {
  appointments: []
};

export const appointmentsReducer = createReducer(
  initialState
  // Aquí puedes agregar on(...) para manejar acciones específicas
); 