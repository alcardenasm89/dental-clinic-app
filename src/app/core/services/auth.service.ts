import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private _storage: Storage | null = null;
  private DOCTOR_EMAIL = 'doctor@clinicadental.com';
  private DOCTOR_PASSWORD_KEY = 'doctor_password';

  constructor(private router: Router, @Optional() private storage: Storage) {
    this.init();
  }

  async init() {
    try {
      if (this.storage) {
        const storage = await this.storage.create();
        this._storage = storage;
        // Configurar contraseña inicial del doctor si no existe
        await this.setupInitialDoctorPassword();
        this.checkAuthStatus();
      } else {
        console.warn('Storage not available, using localStorage fallback');
        this.checkAuthStatus();
      }
    } catch (error) {
      console.warn('Storage not available, using localStorage fallback');
      this.checkAuthStatus();
    }
  }

  private async setupInitialDoctorPassword(): Promise<void> {
    if (!this._storage) return;
    
    const currentPassword = await this._storage.get(this.DOCTOR_PASSWORD_KEY);
    if (!currentPassword) {
      // Establecer contraseña inicial del doctor
      await this._storage.set(this.DOCTOR_PASSWORD_KEY, '123456');
    }
  }

  private async checkAuthStatus(): Promise<void> {
    if (this._storage) {
      const isAuthenticated = (await this._storage.get('isAuthenticated')) === true;
      this.isAuthenticatedSubject.next(isAuthenticated);
    } else {
      // Fallback a localStorage
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      this.isAuthenticatedSubject.next(isAuthenticated);
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Login solo para el doctor
  login(email: string, password: string): Observable<boolean> {
    return from(this.loginAsync(email, password));
  }

  private async loginAsync(email: string, password: string): Promise<boolean> {
    // Validar que sea el email del doctor
    if (email !== this.DOCTOR_EMAIL) {
      return false;
    }

    let storedPassword: string;
    
    if (this._storage) {
      // Obtener la contraseña almacenada del doctor
      storedPassword = await this._storage.get(this.DOCTOR_PASSWORD_KEY);
    } else {
      // Fallback a localStorage
      storedPassword = localStorage.getItem(this.DOCTOR_PASSWORD_KEY) || '123456';
    }
    
    // Validar la contraseña
    if (password === storedPassword) {
      if (this._storage) {
        await this._storage.set('isAuthenticated', true);
      } else {
        localStorage.setItem('isAuthenticated', 'true');
      }
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    
    return false;
  }

  logout(): void {
    if (this._storage) {
      this._storage.set('isAuthenticated', false);
    } else {
      localStorage.setItem('isAuthenticated', 'false');
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  // Método para cambiar la contraseña del doctor
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    let storedPassword: string;
    
    if (this._storage) {
      // Obtener la contraseña actual almacenada
      storedPassword = await this._storage.get(this.DOCTOR_PASSWORD_KEY);
    } else {
      // Fallback a localStorage
      storedPassword = localStorage.getItem(this.DOCTOR_PASSWORD_KEY) || '123456';
    }
    
    // Validar que la contraseña actual sea correcta
    if (currentPassword !== storedPassword) {
      return false;
    }
    
    // Cambiar a la nueva contraseña
    if (this._storage) {
      await this._storage.set(this.DOCTOR_PASSWORD_KEY, newPassword);
    } else {
      localStorage.setItem(this.DOCTOR_PASSWORD_KEY, newPassword);
    }
    return true;
  }
} 