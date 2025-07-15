import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientsService, Patient } from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientsService]
    });
    service = TestBed.inject(PatientsService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Limpiar localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial patients', (done) => {
    service.getPatients().subscribe(patients => {
      expect(patients.length).toBeGreaterThan(0);
      expect(patients[0].name).toBeDefined();
      done();
    });
  });

  it('should get patient by id', (done) => {
    service.getPatientById(1).subscribe(patient => {
      expect(patient).toBeDefined();
      expect(patient?.id).toBe(1);
      done();
    });
  });

  it('should add new patient', (done) => {
    const newPatient: Patient = {
      id: 999,
      name: 'Test Patient',
      age: 30,
      phone: '+56 9 1234 5678',
      email: 'test@example.com',
      address: 'Test Address',
      avatar: '',
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+56 9 8765 4321',
        relationship: 'Family'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicDiseases: []
      },
      dentalHistory: {
        lastCheckup: '2024-01-01',
        previousTreatments: [],
        dentalHabits: []
      },
      diagnosis: 'Test diagnosis',
      treatmentStatus: 'pending',
      evolutionNotes: [],
      insurance: {
        provider: 'Test Insurance',
        policyNumber: '123456',
        coverage: 'Full'
      }
    };

    service.addPatient(newPatient);
    
    service.getPatientById(999).subscribe(patient => {
      expect(patient).toBeDefined();
      expect(patient?.name).toBe('Test Patient');
      done();
    });
  });

  it('should update patient', (done) => {
    const updatedPatient: Patient = {
      id: 1,
      name: 'Updated Patient',
      age: 35,
      phone: '+56 9 1234 5678',
      email: 'updated@example.com',
      address: 'Updated Address',
      avatar: '',
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+56 9 8765 4321',
        relationship: 'Family'
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        chronicDiseases: []
      },
      dentalHistory: {
        lastCheckup: '2024-01-01',
        previousTreatments: [],
        dentalHabits: []
      },
      diagnosis: 'Updated diagnosis',
      treatmentStatus: 'in-progress',
      evolutionNotes: [],
      insurance: {
        provider: 'Test Insurance',
        policyNumber: '123456',
        coverage: 'Full'
      }
    };

    service.updatePatient(updatedPatient);
    
    service.getPatientById(1).subscribe(patient => {
      expect(patient).toBeDefined();
      expect(patient?.name).toBe('Updated Patient');
      expect(patient?.treatmentStatus).toBe('in-progress');
      done();
    });
  });

  it('should fetch patients from API', () => {
    const mockApiPatients = [
      {
        id: 1,
        name: 'API Patient 1',
        phone: '+56 9 1111 1111',
        email: 'api1@example.com',
        address: { street: 'API Street 1', city: 'API City' },
        username: 'apiuser1'
      },
      {
        id: 2,
        name: 'API Patient 2',
        phone: '+56 9 2222 2222',
        email: 'api2@example.com',
        address: { street: 'API Street 2', city: 'API City' },
        username: 'apiuser2'
      }
    ];

    service.fetchPatientsFromApi();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiPatients);
  });
}); 