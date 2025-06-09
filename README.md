# Clínica Dental App

Aplicación móvil interna para la gestión de una clínica dental, desarrollada con Ionic Angular.

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios core, guards, interceptors
│   ├── features/            # Módulos principales de la aplicación
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── patients/       # Gestión de pacientes
│   │   ├── appointments/   # Agenda y citas
│   │   ├── treatments/     # Tratamientos
│   │   └── profile/        # Perfil de usuario
│   ├── layouts/            # Layouts principales
│   └── shared/             # Componentes, pipes y directivas compartidas
├── assets/                 # Recursos estáticos
└── theme/                  # Variables de tema y estilos globales
```

## Tecnologías Utilizadas

- Ionic Angular
- SCSS para estilos
- Angular Material (componentes complementarios)
- AnimationController para animaciones

## Características Principales

- Autenticación de usuarios
- Agenda diaria de pacientes
- Gestión de fichas clínicas
- Registro de notas de evolución
- Gestión de tratamientos
- Perfil de usuario
- Ajustes personales

## Requisitos

- Node.js (versión LTS)
- Ionic CLI
- Angular CLI

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   ionic serve
   ```

## Estructura de Carpetas

- **core/**: Contiene servicios singleton, guards e interceptors
- **features/**: Módulos principales de la aplicación
- **layouts/**: Componentes de layout reutilizables
- **shared/**: Componentes, pipes y directivas compartidas

## Convenciones de Código

- Componentes: Usar el prefijo 'app-'
- Servicios: Usar el sufijo 'Service'
- Interfaces: Usar el prefijo 'I'
- Enums: Usar el sufijo 'Enum'
- Constantes: Usar UPPER_SNAKE_CASE 