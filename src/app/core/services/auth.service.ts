import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Verificar si hay un estado de autenticación almacenado al iniciar el servicio
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulamos la autenticación con credenciales fijas
    if (email === 'doctor@clinicadental.com' && password === '123456') {
      localStorage.setItem('isAuthenticated', 'true');
      this.isAuthenticatedSubject.next(true);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }
} 