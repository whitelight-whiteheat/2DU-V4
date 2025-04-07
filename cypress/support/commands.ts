// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';
import 'cypress-real-events';

// -- This is a parent command --
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// -- This is a child command --
Cypress.Commands.add('createTask', (title: string, dueDate?: string) => {
  cy.get('[data-testid="add-task-button"]').click();
  cy.get('[data-testid="task-title-input"]').type(title);
  if (dueDate) {
    cy.get('[data-testid="task-due-date-input"]').type(dueDate);
  }
  cy.get('[data-testid="save-task-button"]').click();
});

// -- This is a dual command --
Cypress.Commands.add('completeTask', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).find('[data-testid="task-checkbox"]').click();
});

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createTask(title: string, dueDate?: string): Chainable<void>;
      completeTask(): Chainable<void>;
      checkPerformance(): Chainable<void>;
    }
  }
} 