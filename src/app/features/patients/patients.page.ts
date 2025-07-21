import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PatientsService, Patient } from '../../core/services/patients.service';
import * as PatientsActions from '../../core/store/patients/patients.actions';
import { PatientsState } from '../../core/store/patients/patients.reducer';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class PatientsPage implements OnInit {
  public patients: Patient[] = [];
  public loading = false;
  public displayedColumns: string[] = ['name', 'email', 'phone', 'status', 'actions'];
  public patients$: Observable<PatientsState>;

  constructor(
    private animationCtrl: AnimationController,
    private toastCtrl: ToastController,
    private patientsService: PatientsService,
    private store: Store<{ patients: PatientsState }>
  ) {
    this.patients$ = this.store.select('patients');
  }

  ngOnInit() {
    this.loadPatients();
    this.patients$.subscribe(state => {
      this.patients = state.patients;
      this.loading = state.loading;
    });
  }

  async loadPatients() {
    // Animación de carga
    const loadingAnimation = this.animationCtrl.create()
      .addElement(document.querySelector('.loading-container') as HTMLElement)
      .duration(500)
      .easing('ease-in-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'scale(0.8)', 'scale(1)');

    await loadingAnimation.play();
    
    // Dispatch action para cargar pacientes
    this.store.dispatch(PatientsActions.loadPatients());
  }

  async syncPatients(event?: any) {
    // Animación de pull-to-refresh
    const refreshAnimation = this.animationCtrl.create()
      .addElement(document.querySelector('.patients-list') as HTMLElement)
      .duration(300)
      .easing('ease-in-out')
      .fromTo('transform', 'translateY(-20px)', 'translateY(0)')
      .fromTo('opacity', '0.8', '1');

    await refreshAnimation.play();

    this.patientsService.fetchPatientsFromApi();
    
    if (event) {
      event.target.complete();
    }

    this.showToast('Pacientes sincronizados correctamente', 'success');
  }

  openPatient(patient: Patient) {
    // Animación de click en paciente
    const clickAnimation = this.animationCtrl.create()
      .addElement(document.querySelector(`[data-patient-id="${patient.id}"]`) as HTMLElement)
      .duration(200)
      .easing('ease-in-out')
      .fromTo('transform', 'scale(1)', 'scale(0.95)')
      .fromTo('transform', 'scale(0.95)', 'scale(1)');

    clickAnimation.play();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  getStatusColor(status: string): string {
    return status === 'completed' ? 'success' : (status === 'in-progress' ? 'primary' : 'warning');
  }

  getStatusText(status: string): string {
    return status === 'completed' ? 'Finalizado' : (status === 'in-progress' ? 'En Curso' : 'Pendiente');
  }
} 