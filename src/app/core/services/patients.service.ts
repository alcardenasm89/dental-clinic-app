import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string[];
    medications: string[];
    chronicDiseases: string[];
  };
  dentalHistory: {
    lastCheckup: string;
    previousTreatments: string[];
    dentalHabits: string[];
  };
  diagnosis: string;
  treatmentStatus: 'pending' | 'in-progress' | 'completed';
  evolutionNotes: string[];
  insurance: {
    provider: string;
    policyNumber: string;
    coverage: string;
  };
}

const PATIENTS_KEY = 'patients';

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private patientsSubject = new BehaviorSubject<Patient[]>(this.loadPatients());
  public patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchPatientsFromApi();
  }

  private loadPatients(): Patient[] {
    const data = localStorage.getItem(PATIENTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Datos iniciales de ejemplo
    return [
      {
        id: 1,
        name: 'Juan Pérez',
        age: 35,
        phone: '+56 9 1234 5678',
        email: 'juan.perez@example.com',
        address: '1234 Calle Principal, Santiago',
        avatar: 'assets/default-avatar.png',
        emergencyContact: {
          name: 'María Pérez',
          phone: '+56 9 5678 1234',
          relationship: 'Esposa'
        },
        medicalHistory: {
          allergies: ['Penicilina'],
          medications: ['Ibuprofeno'],
          chronicDiseases: ['Hipertensión']
        },
        dentalHistory: {
          lastCheckup: '2024-03-15',
          previousTreatments: ['Limpieza dental', 'Empaste molar'],
          dentalHabits: ['Cepillado 3 veces al día', 'Uso de hilo dental']
        },
        diagnosis: 'Caries múltiples y gingivitis moderada',
        treatmentStatus: 'in-progress',
        evolutionNotes: [
          'Primera consulta: Paciente presenta múltiples caries y gingivitis moderada. Se recomienda limpieza profunda y tratamiento de caries.',
          'Segunda consulta: Se realizó limpieza profunda. Paciente reporta mejoría en sensibilidad.',
          'Tercera consulta: Se completó el tratamiento de caries en molares superiores.'
        ],
        insurance: {
          provider: 'Seguros de Salud',
          policyNumber: '123456789',
          coverage: 'Completo'
        }
      },
      {
        id: 2,
        name: 'María García',
        age: 28,
        phone: '+56 9 8765 4321',
        email: 'maria.garcia@example.com',
        address: '5678 Avenida Central, Santiago',
        avatar: 'assets/default-avatar.png',
        emergencyContact: {
          name: 'Pedro García',
          phone: '+56 9 4321 8765',
          relationship: 'Esposo'
        },
        medicalHistory: {
          allergies: [],
          medications: [],
          chronicDiseases: []
        },
        dentalHistory: {
          lastCheckup: '2024-03-10',
          previousTreatments: ['Ortodoncia'],
          dentalHabits: ['Cepillado 2 veces al día']
        },
        diagnosis: 'Ortodoncia en progreso',
        treatmentStatus: 'in-progress',
        evolutionNotes: [
          'Primera consulta: Paciente requiere ortodoncia para corregir alineación dental.',
          'Segunda consulta: Se colocaron brackets superiores.',
          'Tercera consulta: Ajuste de brackets realizado.'
        ],
        insurance: {
          provider: 'Seguros Dentales',
          policyNumber: '987654321',
          coverage: 'Parcial'
        }
      }
    ];
  }

  private savePatients(patients: Patient[]) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  }

  getPatients(): Observable<Patient[]> {
    return of(this.patientsSubject.value).pipe(delay(500));
  }

  getPatientById(id: number): Observable<Patient | undefined> {
    return of(this.patientsSubject.value.find(p => p.id === id)).pipe(delay(500));
  }

  addPatient(patient: Patient) {
    const patients = [...this.patientsSubject.value, patient];
    this.patientsSubject.next(patients);
    this.savePatients(patients);
  }

  updatePatient(updated: Patient) {
    const patients = this.patientsSubject.value.map(p => p.id === updated.id ? updated : p);
    this.patientsSubject.next(patients);
    this.savePatients(patients);
  }

  fetchPatientsFromApi() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').subscribe(apiPatients => {
      const patients: Patient[] = apiPatients.map((user, idx) => ({
        id: user.id,
        name: user.name,
        age: 30 + idx, // Simulación de edad
        phone: user.phone,
        email: user.email,
        address: user.address?.street + ', ' + user.address?.city,
        avatar: 'assets/default-avatar.png',
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
      this.patientsSubject.next(patients);
      this.savePatients(patients);
    });
  }
} 