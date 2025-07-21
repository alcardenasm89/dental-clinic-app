import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, delay } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ApiInterceptor: HttpInterceptorFn = (request, next) => {
  // Agregar headers comunes
  const modifiedRequest = request.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  console.log(`🚀 API Request: ${request.method} ${request.url}`);

  // Simular latencia de red para desarrollo
  return next(modifiedRequest).pipe(
    delay(500), // Simular latencia de 500ms
    retry(1), // Reintentar una vez en caso de error
    catchError((error: HttpErrorResponse) => {
      console.error(`❌ API Error: ${error.status} ${error.message}`);
      
      let errorMessage = 'Ha ocurrido un error en la aplicación';
      
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          case 403:
            errorMessage = 'Acceso denegado';
            break;
          case 401:
            errorMessage = 'No autorizado';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.message}`;
        }
      }
      
      // Aquí podrías mostrar un toast o notificación
      console.error('Error details:', errorMessage);
      
      return throwError(() => new Error(errorMessage));
    })
  );
}; 