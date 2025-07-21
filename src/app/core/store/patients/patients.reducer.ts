import { createReducer, on } from '@ngrx/store';
import { Patient } from '../../services/patients.service';
import * as PatientsActions from './patients.actions';

export interface PatientsState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

export const initialState: PatientsState = {
  patients: [],
  loading: false,
  error: null
};

export const patientsReducer = createReducer(
  initialState,
  on(PatientsActions.loadPatients, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(PatientsActions.loadPatientsSuccess, (state, { patients }) => ({
    ...state,
    patients,
    loading: false
  })),
  on(PatientsActions.loadPatientsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(PatientsActions.addPatient, (state, { patient }) => ({
    ...state,
    patients: [...state.patients, patient]
  })),
  on(PatientsActions.updatePatient, (state, { patient }) => ({
    ...state,
    patients: state.patients.map(p => p.id === patient.id ? patient : p)
  }))
); 