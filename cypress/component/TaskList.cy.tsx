import React from 'react';
import TaskList from '../../src/components/TaskList';
import { Task } from '../../src/types';

describe('TaskList Component', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      completed: false,
      dueDate: new Date('2023-12-31'),
      order: 0,
      tags: ['Work'],
      userId: 'user1',
    },
    {
      id: '2',
      title: 'Test Task 2',
      completed: true,
      dueDate: new Date('2023-12-30'),
      order: 1,
      tags: ['Personal'],
      userId: 'user1',
    },
  ];

  const mockOnTaskAction = {
    toggle: cy.stub().as('toggleTask'),
    delete: cy.stub().as('deleteTask'),
    update: cy.stub().as('updateTask'),
    create: cy.stub().as('createTask'),
    edit: cy.stub().as('editTask'),
    save: cy.stub().as('saveTask'),
  };

  it('renders task list correctly', () => {
    cy.mount(<TaskList tasks={mockTasks} onTaskAction={mockOnTaskAction} />);
    
    // Check if tasks are rendered
    cy.contains('Test Task 1').should('be.visible');
    cy.contains('Test Task 2').should('be.visible');
    
    // Check if due dates are rendered
    cy.contains('Dec 31, 2023').should('be.visible');
    cy.contains('Dec 30, 2023').should('be.visible');
    
    // Check if tags are rendered
    cy.contains('Work').should('be.visible');
    cy.contains('Personal').should('be.visible');
  });

  it('handles task completion', () => {
    cy.mount(<TaskList tasks={mockTasks} onTaskAction={mockOnTaskAction} />);
    
    // Click on the checkbox of the first task
    cy.get('[data-testid="task-checkbox"]').first().click();
    
    // Verify the toggle function was called with the correct task ID
    cy.get('@toggleTask').should('have.been.calledWith', '1');
  });

  it('handles task deletion', () => {
    cy.mount(<TaskList tasks={mockTasks} onTaskAction={mockOnTaskAction} />);
    
    // Click on the delete button of the first task
    cy.get('[data-testid="task-delete-button"]').first().click();
    
    // Verify the delete function was called with the correct task ID
    cy.get('@deleteTask').should('have.been.calledWith', '1');
  });

  it('handles task editing', () => {
    cy.mount(<TaskList tasks={mockTasks} onTaskAction={mockOnTaskAction} />);
    
    // Click on the edit button of the first task
    cy.get('[data-testid="task-edit-button"]').first().click();
    
    // Verify the edit function was called with the correct task
    cy.get('@editTask').should('have.been.calledWith', mockTasks[0]);
  });

  it('renders empty state when no tasks', () => {
    cy.mount(<TaskList tasks={[]} onTaskAction={mockOnTaskAction} />);
    
    // Check if empty state message is displayed
    cy.contains('No tasks found').should('be.visible');
  });

  it('filters tasks correctly', () => {
    cy.mount(<TaskList tasks={mockTasks} onTaskAction={mockOnTaskAction} />);
    
    // Filter by completed tasks
    cy.get('[data-testid="filter-completed"]').click();
    
    // Only completed task should be visible
    cy.contains('Test Task 2').should('be.visible');
    cy.contains('Test Task 1').should('not.exist');
    
    // Filter by active tasks
    cy.get('[data-testid="filter-active"]').click();
    
    // Only active task should be visible
    cy.contains('Test Task 1').should('be.visible');
    cy.contains('Test Task 2').should('not.exist');
  });
}); 