import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientsService, Patient } from '../../core/services/patients.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PatientsPage implements OnInit {
  patients: Patient[] = [];
  loading = false;

  constructor(
    private patientsService: PatientsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients(event?: any) {
    this.loading = true;
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    });
  }

  syncPatients(event?: any) {
    this.loading = true;
    this.patientsService.fetchPatientsFromApi();
    // Esperar a que se actualicen los pacientes
    setTimeout(() => {
      this.loadPatients(event);
    }, 1200);
  }

  openPatient(patient: Patient) {
    this.router.navigate(['/app/paciente-ficha', patient.id]);
  }
} 