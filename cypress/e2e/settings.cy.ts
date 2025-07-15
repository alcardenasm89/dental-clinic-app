describe('Settings Tests', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
    cy.get('ion-input[name="username"]').type('doctor')
    cy.get('ion-input[name="password"]').type('password123')
    cy.get('ion-button[type="submit"]').click()
    cy.url().should('include', '/app/agenda')
  })

  it('should navigate to settings page', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.url().should('include', '/app/ajustes')
    cy.get('ion-title').should('contain', 'Ajustes')
  })

  it('should display settings options', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.get('ion-toggle').should('have.length.at.least', 2)
    cy.get('ion-select').should('have.length.at.least', 2)
  })

  it('should toggle dark mode', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.get('ion-toggle').first().click()
    cy.get('body').should('have.class', 'dark')
  })

  it('should toggle auto dark mode', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.get('ion-toggle').eq(1).click()
    // Verificar que el modo automático se activa
  })

  it('should change language', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.get('ion-select').first().click()
    cy.get('ion-select-option').contains('English').click()
  })

  it('should change font size', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.get('ion-select').eq(1).click()
    cy.get('ion-select-option').contains('Grande').click()
  })

  it('should save settings', () => {
    cy.get('ion-menu-button').click()
    cy.get('ion-menu ion-item').contains('Ajustes').click()
    cy.get('ion-button').contains('Guardar Ajustes').click()
    cy.get('ion-toast').should('be.visible')
  })
}) 