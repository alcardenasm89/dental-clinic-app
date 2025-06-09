import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'agenda',
        loadComponent: () => import('./features/appointments/appointments.page').then(m => m.AppointmentsPage)
      },
      {
        path: 'paciente-ficha/:id',
        loadComponent: () => import('./features/patients/patients.page').then(m => m.PatientsPage)
      },
      {
        path: 'tratamientos',
        loadComponent: () => import('./features/treatments/treatments.page').then(m => m.TreatmentsPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'ajustes',
        loadComponent: () => import('./features/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: '',
        redirectTo: 'agenda',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];
