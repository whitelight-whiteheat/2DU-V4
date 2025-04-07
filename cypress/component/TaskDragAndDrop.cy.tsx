import React from 'react';
import TaskDragAndDrop from '../../src/components/TaskDragAndDrop';
import { Task } from '../../src/types';

describe('TaskDragAndDrop Component', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      completed: false,
      dueDate: new Date('2023-12-31'),
      order: 0,
      tags: ['Work'],
      userId: 'user1',
    },
    {
      id: '2',
      title: 'Task 2',
      completed: false,
      dueDate: new Date('2023-12-30'),
      order: 1,
      tags: ['Personal'],
      userId: 'user1',
    },
    {
      id: '3',
      title: 'Task 3',
      completed: false,
      dueDate: new Date('2023-12-29'),
      order: 2,
      tags: ['Work'],
      userId: 'user1',
    },
  ];

  const mockOnReorder = cy.stub().as('onReorder');

  beforeEach(() => {
    cy.mount(
      <TaskDragAndDrop
        tasks={mockTasks}
        onReorder={mockOnReorder}
      />
    );
  });

  it('renders task list correctly', () => {
    // Check if task list is visible
    cy.get('[data-testid="task-list"]').should('be.visible');
    
    // Check if all tasks are rendered
    mockTasks.forEach(task => {
      cy.contains(task.title).should('be.visible');
    });
  });

  it('handles drag start', () => {
    // Start dragging first task
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    
    // Verify drag handle is visible
    cy.get('[data-testid="drag-handle"]').should('be.visible');
  });

  it('handles drag over', () => {
    // Start dragging first task
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    
    // Drag over second task
    cy.get('[data-testid="task-2"]')
      .trigger('mouseover')
      .trigger('mousemove', { clientX: 100, clientY: 200 });
    
    // Verify drop indicator is visible
    cy.get('[data-testid="drop-indicator"]').should('be.visible');
  });

  it('handles drop', () => {
    // Start dragging first task
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    
    // Drop on second task
    cy.get('[data-testid="task-2"]')
      .trigger('mouseover')
      .trigger('mousemove', { clientX: 100, clientY: 200 })
      .trigger('mouseup');
    
    // Verify onReorder was called with correct order
    cy.get('@onReorder').should('have.been.calledWith([
      { ...mockTasks[1], order: 0 },
      { ...mockTasks[0], order: 1 },
      { ...mockTasks[2], order: 2 }
    ]);
  });

  it('handles drag cancel', () => {
    // Start dragging first task
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    
    // Cancel drag
    cy.get('body').trigger('mouseup');
    
    // Verify drag handle is not visible
    cy.get('[data-testid="drag-handle"]').should('not.exist');
  });

  it('maintains task order after drop', () => {
    // Start dragging first task
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    
    // Drop on second task
    cy.get('[data-testid="task-2"]')
      .trigger('mouseover')
      .trigger('mousemove', { clientX: 100, clientY: 200 })
      .trigger('mouseup');
    
    // Verify tasks are in new order
    cy.get('[data-testid="task-list"]')
      .find('[data-testid^="task-"]')
      .should('have.length', 3)
      .first()
      .should('have.attr', 'data-testid', 'task-2');
  });

  it('handles touch events', () => {
    // Start dragging first task with touch
    cy.get('[data-testid="task-1"]')
      .trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] })
      .trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] });
    
    // Drop on second task
    cy.get('[data-testid="task-2"]')
      .trigger('touchmove', { touches: [{ clientX: 100, clientY: 200 }] })
      .trigger('touchend');
    
    // Verify onReorder was called
    cy.get('@onReorder').should('have.been.called');
  });

  it('disables drag and drop during loading', () => {
    // Mount with loading state
    cy.mount(
      <TaskDragAndDrop
        tasks={mockTasks}
        onReorder={mockOnReorder}
        isLoading={true}
      />
    );
    
    // Try to drag a task
    cy.get('[data-testid="task-1"]')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 100, clientY: 100 });
    
    // Verify drag handle is not visible
    cy.get('[data-testid="drag-handle"]').should('not.exist');
  });

  it('handles keyboard navigation', () => {
    // Focus first task
    cy.get('[data-testid="task-1"]').focus();
    
    // Press arrow down to move to next task
    cy.focused().type('{downarrow}');
    
    // Verify second task is focused
    cy.get('[data-testid="task-2"]').should('be.focused');
  });
}); 