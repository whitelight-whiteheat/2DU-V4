import React from 'react';
import TaskForm from '../../src/components/TaskForm';
import { Task } from '../../src/types';

describe('TaskForm Component', () => {
  const mockOnSubmit = cy.stub().as('onSubmit');
  const mockOnCancel = cy.stub().as('onCancel');

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    completed: false,
    dueDate: new Date('2023-12-31'),
    order: 0,
    tags: ['Work'],
    userId: 'user1',
  };

  beforeEach(() => {
    cy.mount(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialTask={mockTask}
      />
    );
  });

  it('renders form with initial task data', () => {
    // Check if title is pre-filled
    cy.get('[data-testid="task-title-input"]').should('have.value', 'Test Task');
    
    // Check if due date is pre-filled
    cy.get('[data-testid="task-due-date-input"]').should('have.value', '2023-12-31');
    
    // Check if tags are pre-filled
    cy.get('[data-testid="task-tags-input"]').should('contain', 'Work');
  });

  it('handles form submission with updated data', () => {
    // Update title
    cy.get('[data-testid="task-title-input"]')
      .clear()
      .type('Updated Task');
    
    // Update due date
    cy.get('[data-testid="task-due-date-input"]')
      .clear()
      .type('2024-01-01');
    
    // Add new tag
    cy.get('[data-testid="task-tags-input"]')
      .type('Personal{enter}');
    
    // Submit form
    cy.get('[data-testid="task-submit-button"]').click();
    
    // Verify onSubmit was called with updated task
    cy.get('@onSubmit').should('have.been.calledWith', {
      ...mockTask,
      title: 'Updated Task',
      dueDate: new Date('2024-01-01'),
      tags: ['Work', 'Personal'],
    });
  });

  it('validates required fields', () => {
    // Clear title
    cy.get('[data-testid="task-title-input"]').clear();
    
    // Try to submit
    cy.get('[data-testid="task-submit-button"]').click();
    
    // Check for error message
    cy.contains('Title is required').should('be.visible');
    
    // Verify onSubmit was not called
    cy.get('@onSubmit').should('not.have.been.called');
  });

  it('handles cancel action', () => {
    // Click cancel button
    cy.get('[data-testid="task-cancel-button"]').click();
    
    // Verify onCancel was called
    cy.get('@onCancel').should('have.been.called');
  });

  it('handles tag removal', () => {
    // Remove existing tag
    cy.get('[data-testid="tag-Work"]')
      .find('[data-testid="remove-tag"]')
      .click();
    
    // Verify tag was removed
    cy.get('[data-testid="tag-Work"]').should('not.exist');
  });

  it('validates date format', () => {
    // Enter invalid date
    cy.get('[data-testid="task-due-date-input"]')
      .clear()
      .type('invalid-date');
    
    // Try to submit
    cy.get('[data-testid="task-submit-button"]').click();
    
    // Check for error message
    cy.contains('Invalid date format').should('be.visible');
    
    // Verify onSubmit was not called
    cy.get('@onSubmit').should('not.have.been.called');
  });
}); 