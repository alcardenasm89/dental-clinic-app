import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { patientsReducer } from './app/core/store/patients/patients.reducer';
import { appointmentsReducer } from './app/core/store/appointments/appointments.reducer';
import { authReducer } from './app/core/store/auth/auth.reducer';
import { PatientsEffects } from './app/core/store/patients/patients.effects';
import { ApiInterceptor } from './app/core/interceptors/api.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([ApiInterceptor])),
    provideAnimations(),
    provideStore({
      patients: patientsReducer,
      appointments: appointmentsReducer,
      auth: authReducer
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideEffects([PatientsEffects])
  ],
});
