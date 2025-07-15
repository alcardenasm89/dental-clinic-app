describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })

  it('should display login form', () => {
    cy.get('ion-input[name="username"]').should('be.visible')
    cy.get('ion-input[name="password"]').should('be.visible')
    cy.get('ion-button[type="submit"]').should('be.visible')
  })

  it('should login with valid credentials', () => {
    cy.get('ion-input[name="username"]').type('doctor')
    cy.get('ion-input[name="password"]').type('password123')
    cy.get('ion-button[type="submit"]').click()
    cy.url().should('include', '/app/agenda')
    cy.get('ion-title').should('contain', 'Clínica Dental')
  })

  it('should show error with invalid credentials', () => {
    cy.get('ion-input[name="username"]').type('invalid')
    cy.get('ion-input[name="password"]').type('invalid')
    cy.get('ion-button[type="submit"]').click()
    cy.get('ion-toast').should('be.visible')
  })

  it('should require username and password', () => {
    cy.get('ion-button[type="submit"]').click()
    cy.get('ion-toast').should('be.visible')
  })
}) 