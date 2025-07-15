import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ActionSheetController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService, Patient } from '../../core/services/patients.service';
import { Camera, CameraResultType, CameraSource, CameraPermissionType } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-patients-detail',
  templateUrl: './patients-detail.page.html',
  styleUrls: ['./patients-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PatientsDetailPage implements OnInit {
  public patient: Patient = {
    id: 0,
    name: '',
    age: 0,
    phone: '',
    email: '',
    address: '',
          avatar: '',
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
  public loading = false;
  public currentLocation: { latitude: number; longitude: number } | null = null;
  public locationLoading = false;
  public isNative = Capacitor.isNativePlatform();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private patientsService: PatientsService
  ) {}

  ngOnInit() {
    const patientId = Number(this.route.snapshot.paramMap.get('id'));
    if (patientId) {
      this.loadPatient(patientId);
    }
  }

  private loadPatient(patientId: number) {
    this.loading = true;
    this.patientsService.getPatientById(patientId).subscribe(patient => {
      if (patient) {
        this.patient = { ...patient };
      } else {
        this.showToast('Paciente no encontrado', 'danger');
        this.router.navigate(['/app/paciente-ficha']);
      }
      this.loading = false;
    });
  }

  async getCurrentLocation() {
    this.locationLoading = true;
    try {
      if (this.isNative) {
        // Usar Capacitor Geolocation en dispositivos nativos
        const permission = await Geolocation.checkPermissions();
        if (permission.location !== 'granted') {
          const request = await Geolocation.requestPermissions();
          if (request.location !== 'granted') {
            this.showToast('Se requieren permisos de ubicación', 'warning');
            this.locationLoading = false;
            return;
          }
        }

        const position: Position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });

        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } else {
        // Usar Web Geolocation API en navegador
        if (!navigator.geolocation) {
          this.showToast('La geolocalización no está disponible en este navegador', 'warning');
          this.locationLoading = false;
          return;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      }

      // Agregar la ubicación como nota de evolución
      const locationNote = `Ubicación de consulta: ${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`;
      this.patient.evolutionNotes.unshift(`${new Date().toLocaleDateString('es-ES')}: ${locationNote}`);
      this.patientsService.updatePatient(this.patient);

      this.showToast('Ubicación registrada correctamente', 'success');
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      this.showToast('Error al obtener la ubicación', 'danger');
    } finally {
      this.locationLoading = false;
    }
  }

  async openLocationInMaps() {
    if (!this.currentLocation) {
      this.showToast('No hay ubicación disponible', 'warning');
      return;
    }

    try {
      // Abrir en Google Maps (o aplicación de mapas predeterminada)
      const url = `https://www.google.com/maps?q=${this.currentLocation.latitude},${this.currentLocation.longitude}`;
      window.open(url, '_blank');
    } catch (error) {
      this.showToast('Error al abrir el mapa', 'danger');
    }
  }

  async changeAvatar() {
    const buttons = [];
    
    if (this.isNative) {
      // Opciones nativas para móvil
      buttons.push(
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
        }
      );
    } else {
      // Opción para web
      buttons.push({
        text: 'Seleccionar imagen',
        icon: 'image',
        handler: () => {
          this.selectImageFromWeb();
        }
      });
    }
    
    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.isNative ? 'Cambiar foto de perfil' : 'Seleccionar imagen (solo archivo)',
      buttons: buttons
    });
    await actionSheet.present();
  }

  private async takePicture() {
    if (!this.isNative) {
      this.showToast('La cámara solo está disponible en dispositivos móviles', 'warning');
      return;
    }

    try {
      // Verificar permisos de cámara
      const permission = await Camera.checkPermissions();
      if (permission.camera !== 'granted') {
        const request = await Camera.requestPermissions();
        if (request.camera !== 'granted') {
          this.showToast('Se requieren permisos de cámara', 'warning');
          return;
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        height: 800
      });

      if (image && image.dataUrl) {
        this.patient.avatar = image.dataUrl;
        this.patientsService.updatePatient(this.patient);
        this.showToast('Foto actualizada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      this.showToast('Error al tomar la foto', 'danger');
    }
  }

  private selectImageFromWeb() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.patient.avatar = e.target.result;
          this.patientsService.updatePatient(this.patient);
          this.showToast('Imagen seleccionada correctamente', 'success');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  private async chooseFromGallery() {
    if (!this.isNative) {
      this.selectImageFromWeb();
      return;
    }

    try {
      // Verificar permisos de galería
      const permission = await Camera.checkPermissions();
      if (permission.photos !== 'granted') {
        const request = await Camera.requestPermissions();
        if (request.photos !== 'granted') {
          this.showToast('Se requieren permisos de galería', 'warning');
          return;
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 800,
        height: 800
      });

      if (image && image.dataUrl) {
        this.patient.avatar = image.dataUrl;
        this.patientsService.updatePatient(this.patient);
        this.showToast('Foto actualizada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      this.showToast('Error al seleccionar la foto', 'danger');
    }
  }

  addNote() {
    if (this.newNote.trim()) {
      const date = new Date().toLocaleDateString('es-ES');
      this.patient.evolutionNotes.unshift(`${date}: ${this.newNote}`);
      this.patientsService.updatePatient(this.patient);
      this.newNote = '';
      this.showToast('Nota agregada correctamente', 'success');
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

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
} 