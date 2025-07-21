import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as PatientsActions from './patients.actions';
import { Patient } from '../../services/patients.service';

@Injectable()
export class PatientsEffects {
  loadPatients$ = createEffect(() => this.actions$.pipe(
    ofType(PatientsActions.loadPatients),
    mergeMap(() => this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        delay(1000), // Simular latencia de red
        map(apiPatients => {
          const patients: Patient[] = apiPatients.map((user, idx) => ({
            id: user.id,
            name: user.name,
            age: 30 + idx,
            phone: user.phone,
            email: user.email,
            address: user.address?.street + ', ' + user.address?.city,
            avatar: '',
            emergencyContact: {
              name: user.username,
              phone: user.phone,
              relationship: 'Familiar'
            },
            medicalHistory: {
              allergies: [],
              medications: [],
              chronicDiseases: []
            },
            dentalHistory: {
              lastCheckup: '2024-03-01',
              previousTreatments: [],
              dentalHabits: []
            },
            diagnosis: 'Sin diagnóstico',
            treatmentStatus: 'pending',
            evolutionNotes: [],
            insurance: {
              provider: 'Sin seguro',
              policyNumber: '',
              coverage: ''
            }
          }));
          return PatientsActions.loadPatientsSuccess({ patients });
        }),
        catchError(error => of(PatientsActions.loadPatientsFailure({ error: error.message })))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
} 