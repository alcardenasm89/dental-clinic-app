import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid credentials', async () => {
    const result = await service.login('doctor', 'password123');
    expect(result).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should reject invalid credentials', async () => {
    const result = await service.login('invalid', 'invalid');
    expect(result).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should persist login state', async () => {
    await service.login('doctor', 'password123');
    expect(service.isAuthenticated()).toBe(true);
    
    // Simular recarga de página
    const newService = TestBed.inject(AuthService);
    expect(newService.isAuthenticated()).toBe(true);
  });

  it('should logout correctly', () => {
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should change password successfully', async () => {
    await service.login('doctor', 'password123');
    const result = await service.changePassword('password123', 'newpassword123');
    expect(result).toBe(true);
    
    // Verificar que se puede hacer login con la nueva contraseña
    service.logout();
    const newLogin = await service.login('doctor', 'newpassword123');
    expect(newLogin).toBe(true);
  });

  it('should reject password change with wrong current password', async () => {
    await service.login('doctor', 'password123');
    const result = await service.changePassword('wrongpassword', 'newpassword123');
    expect(result).toBe(false);
  });

  it('should get current user', async () => {
    await service.login('doctor', 'password123');
    const user = service.getCurrentUser();
    expect(user).toBeDefined();
    expect(user?.username).toBe('doctor');
  });
}); 