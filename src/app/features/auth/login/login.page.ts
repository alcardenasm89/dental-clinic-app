import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingCtrl.create({
        message: 'Iniciando sesión...',
        spinner: 'circular'
      });
      await loading.present();

      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe(async (success) => {
        await loading.dismiss();
        this.isLoading = false;

        if (success) {
          const toast = await this.toastCtrl.create({
            message: '¡Bienvenido!',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          await toast.present();
          this.router.navigate(['/app/agenda'], { replaceUrl: true });
        } else {
          const toast = await this.toastCtrl.create({
            message: 'Credenciales inválidas',
            duration: 2000,
            color: 'danger',
            position: 'top'
          });
          await toast.present();
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
      const toast = await this.toastCtrl.create({
        message: 'Por favor, corrige los errores en el formulario.',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters para acceder a los controles del formulario
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
} 