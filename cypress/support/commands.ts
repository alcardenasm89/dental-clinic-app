/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para login
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/auth/login')
  cy.get('ion-input[name="username"]').type(username)
  cy.get('ion-input[name="password"]').type(password)
  cy.get('ion-button[type="submit"]').click()
  cy.url().should('include', '/app/agenda')
})

// Comando para navegar a pacientes
Cypress.Commands.add('navigateToPatients', () => {
  cy.get('ion-menu-button').click()
  cy.get('ion-menu ion-item').contains('Pacientes').click()
  cy.url().should('include', '/app/pacientes')
})

// Comando para simular tomar foto
Cypress.Commands.add('takePhoto', () => {
  cy.window().then((win) => {
    cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
      getTracks: () => [{ stop: () => {} }]
    })
  })
})

// Comando para simular obtener ubicación
Cypress.Commands.add('getLocation', () => {
  cy.window().then((win) => {
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
})

// Comando para alternar modo oscuro
Cypress.Commands.add('toggleDarkMode', () => {
  cy.get('ion-menu-button').click()
  cy.get('ion-menu ion-item').contains('Ajustes').click()
  cy.get('ion-toggle').contains('Modo Oscuro').click()
  cy.get('body').should('have.class', 'dark')
})