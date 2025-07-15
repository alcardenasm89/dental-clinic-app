// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configuración global para pruebas móviles
Cypress.on('window:before:load', (win) => {
  // Simular características móviles
  Object.defineProperty(win.navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  })
  
  // Simular geolocalización
  cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
    success({
      coords: {
        latitude: -33.4489,
        longitude: -70.6693,
        accuracy: 100
      },
      timestamp: Date.now()
    })
  })
})