import React from 'react';
import TaskItem from '../../src/components/TaskItem';
import { Task } from '../../src/types';

describe('TaskItem Component', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    completed: false,
    dueDate: new Date('2023-12-31'),
    order: 0,
    tags: ['Work', 'Personal'],
    userId: 'user1',
  };

  const mockOnTaskAction = {
    toggle: cy.stub().as('toggleTask'),
    delete: cy.stub().as('deleteTask'),
    update: cy.stub().as('updateTask'),
    edit: cy.stub().as('editTask'),
  };

  beforeEach(() => {
    cy.mount(
      <TaskItem
        task={mockTask}
        onTaskAction={mockOnTaskAction}
      />
    );
  });

  it('renders task item correctly', () => {
    // Check if title is rendered
    cy.contains('Test Task').should('be.visible');
    
    // Check if due date is rendered
    cy.contains('Dec 31, 2023').should('be.visible');
    
    // Check if tags are rendered
    cy.contains('Work').should('be.visible');
    cy.contains('Personal').should('be.visible');
  });

  it('handles task completion toggle', () => {
    // Click on the checkbox
    cy.get('[data-testid="task-checkbox"]').click();
    
    // Verify toggle function was called with correct task ID
    cy.get('@toggleTask').should('have.been.calledWith', '1');
  });

  it('handles task deletion', () => {
    // Click on the delete button
    cy.get('[data-testid="task-delete-button"]').click();
    
    // Verify delete function was called with correct task ID
    cy.get('@deleteTask').should('have.been.calledWith', '1');
  });

  it('handles task editing', () => {
    // Click on the edit button
    cy.get('[data-testid="task-edit-button"]').click();
    
    // Verify edit function was called with correct task
    cy.get('@editTask').should('have.been.calledWith', mockTask);
  });

  it('displays completed task styling', () => {
    // Mount with completed task
    cy.mount(
      <TaskItem
        task={{ ...mockTask, completed: true }}
        onTaskAction={mockOnTaskAction}
      />
    );
    
    // Check if completed styling is applied
    cy.get('[data-testid="task-item"]').should('have.class', 'completed');
    cy.get('[data-testid="task-title"]').should('have.class', 'strikethrough');
  });

  it('displays overdue task styling', () => {
    // Mount with overdue task
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 1);
    
    cy.mount(
      <TaskItem
        task={{ ...mockTask, dueDate: overdueDate }}
        onTaskAction={mockOnTaskAction}
      />
    );
    
    // Check if overdue styling is applied
    cy.get('[data-testid="task-due-date"]').should('have.class', 'overdue');
  });

  it('handles tag click navigation', () => {
    // Click on a tag
    cy.get('[data-testid="tag-Work"]').click();
    
    // Verify navigation occurred (this would depend on your routing setup)
    // For example, if using React Router:
    cy.url().should('include', '/tags/Work');
  });
}); 