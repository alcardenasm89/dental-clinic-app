describe('Patients Tests', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
    cy.get('ion-input[name="username"]').type('doctor')
    cy.get('ion-input[name="password"]').type('password123')
    cy.get('ion-button[type="submit"]').click()
    cy.url().should('include', '/app/agenda')
  })

  it('should navigate to patients page', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Pacientes').click()
    cy.url().should('include', '/app/pacientes')
    cy.get('ion-title').should('contain', 'Pacientes')
  })

  it('should display patients list', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Pacientes').click()
    cy.get('ion-list ion-item').should('have.length.greaterThan', 0)
  })

  it('should sync patients from API', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Pacientes').click()
    cy.get('ion-refresher').trigger('refresh')
    cy.get('ion-list ion-item').should('have.length.greaterThan', 0)
  })

  it('should open patient details', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Pacientes').click()
    cy.get('ion-list ion-item').first().click()
    cy.url().should('include', '/app/paciente-ficha/')
    cy.get('ion-title').should('contain', 'Ficha Clínica')
  })

  it('should display patient information', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Pacientes').click()
    cy.get('ion-list ion-item').first().click()
    cy.get('ion-card').should('contain', 'Datos Personales')
    cy.get('ion-card').should('contain', 'Contacto de Emergencia')
    cy.get('ion-card').should('contain', 'Historial Médico')
  })
}) 