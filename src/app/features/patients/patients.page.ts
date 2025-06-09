import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController, ActionSheetController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Patient {
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
    email: '',
    address: '',
    avatar: 'assets/default-avatar.png',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalHistory: {
      allergies: [],
      medications: [],
      chronicDiseases: []
    },
    dentalHistory: {
      lastCheckup: '',
      previousTreatments: [],
      dentalHabits: []
    },
    diagnosis: '',
    treatmentStatus: 'pending',
    evolutionNotes: [],
    insurance: {
      provider: '',
      policyNumber: '',
      coverage: ''
    }
  };

  public newNote: string = '';

  constructor(
    private route: ActivatedRoute,
    private animationCtrl: AnimationController,
    private actionSheetCtrl: ActionSheetController
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
    // Simulación de datos - en una aplicación real, esto vendría de una API
    const patientsData: { [key: number]: Patient } = {
      1: {
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
      2: {
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
    };

    // Cargar los datos del paciente según el ID
    this.patient = patientsData[id] || this.patient;
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

  async changeAvatar() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cambiar foto de perfil',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Elegir de la galería',
          icon: 'image',
          handler: () => {
            this.chooseFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async takePicture() {
    // Aquí implementaremos la lógica para tomar una foto
    // Por ahora, simularemos la carga de una imagen
    this.patient.avatar = 'assets/default-avatar.png';
  }

  private async chooseFromGallery() {
    // Aquí implementaremos la lógica para elegir una imagen de la galería
    // Por ahora, simularemos la carga de una imagen
    this.patient.avatar = 'assets/default-avatar.png';
  }
} 