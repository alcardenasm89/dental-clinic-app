import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AnimationController, ActionSheetController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientsService, Patient } from '../../core/services/patients.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
    private actionSheetCtrl: ActionSheetController,
    private patientsService: PatientsService
  ) {}

  ngOnInit() {
    // Obtener el ID del paciente de la URL
    const patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.patientsService.getPatientById(patientId).subscribe(patient => {
      if (patient) {
        this.patient = { ...patient };
      }
      // Aplicar animación después de cargar los datos
      setTimeout(() => {
        this.playLoadAnimation();
      }, 100);
    });
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

  addNote() {
    if (this.newNote.trim()) {
      const date = new Date().toLocaleDateString('es-ES');
      this.patient.evolutionNotes.unshift(`${date}: ${this.newNote}`);
      this.patientsService.updatePatient(this.patient);
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
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      if (image && image.dataUrl) {
        this.patient.avatar = image.dataUrl;
        this.patientsService.updatePatient(this.patient);
      }
    } catch (error) {
      // Manejar error o cancelación
    }
  }

  private async chooseFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      if (image && image.dataUrl) {
        this.patient.avatar = image.dataUrl;
        this.patientsService.updatePatient(this.patient);
      }
    } catch (error) {
      // Manejar error o cancelación
    }
  }
} 