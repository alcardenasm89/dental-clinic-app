import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  diagnosis: string;
  treatmentStatus: 'pending' | 'in-progress' | 'completed';
  evolutionNotes: string[];
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PatientsPage implements OnInit {
  public patient: Patient = {
    id: 0,
    name: '',
    age: 0,
    phone: '',
    diagnosis: '',
    treatmentStatus: 'pending',
    evolutionNotes: []
  };

  public newNote: string = '';

  constructor(
    private route: ActivatedRoute,
    private animationCtrl: AnimationController
  ) {}

  ngOnInit() {
    // Obtener el ID del paciente de la URL
    const patientId = this.route.snapshot.paramMap.get('id');
    
    // Simulación de datos del paciente
    this.loadPatientData(Number(patientId));

    // Aplicar animación después de cargar los datos
    setTimeout(() => {
      this.playLoadAnimation();
    }, 100);
  }

  private playLoadAnimation() {
    const element = document.querySelector('.profile-container');
    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(800)
        .easing('ease-out')
        .fromTo('opacity', 0, 1)
        .fromTo('transform', 'scale(0.95)', 'scale(1)');

      animation.play();
    }
  }

  private loadPatientData(id: number) {
    // Simulación de datos
    this.patient = {
      id: id,
      name: 'Juan Pérez',
      age: 35,
      phone: '+56 9 1234 5678',
      diagnosis: 'Caries múltiples y gingivitis moderada',
      treatmentStatus: 'in-progress',
      evolutionNotes: [
        'Primera consulta: Paciente presenta múltiples caries y gingivitis moderada. Se recomienda limpieza profunda y tratamiento de caries.',
        'Segunda consulta: Se realizó limpieza profunda. Paciente reporta mejoría en sensibilidad.',
        'Tercera consulta: Se completó el tratamiento de caries en molares superiores.'
      ]
    };
  }

  addNote() {
    if (this.newNote.trim()) {
      const date = new Date().toLocaleDateString('es-ES');
      this.patient.evolutionNotes.unshift(`${date}: ${this.newNote}`);
      this.newNote = '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in-progress':
        return 'En Curso';
      case 'completed':
        return 'Finalizado';
      default:
        return 'Desconocido';
    }
  }
} 