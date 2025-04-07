import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import TaskManager from '../TaskManager';
import { Task } from '../../types';

// Mock the Firebase functions
vi.mock('../../firebase', () => ({
  getTasks: vi.fn(),
  addTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  reorderTasks: vi.fn(),
}));

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-user-id', email: 'test@example.com' },
    loading: false,
  }),
}));

// Mock the feedback context
vi.mock('../UserFeedback', () => ({
  useFeedback: () => ({
    showFeedback: vi.fn(),
  }),
}));

describe('TaskManager Component', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      completed: false,
      dueDate: new Date('2023-12-31'),
      order: 0,
      tags: ['Work'],
      userId: 'test-user-id',
    },
    {
      id: '2',
      title: 'Test Task 2',
      completed: true,
      dueDate: new Date('2023-12-30'),
      order: 1,
      tags: ['Personal'],
      userId: 'test-user-id',
    },
    {
      id: '3',
      title: 'Test Task 3',
      completed: false,
      dueDate: new Date('2023-12-29'),
      order: 2,
      tags: ['Work'],
      userId: 'test-user-id',
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock the getTasks function to return our mock tasks
    const { getTasks } = require('../../firebase');
    getTasks.mockResolvedValue(mockTasks);
  });

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks();
  });

  it('renders the task manager correctly', async () => {
    render(<TaskManager />);
    
    // Check if the component renders
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.getByText('Test Task 3')).toBeInTheDocument();
    });
  });

  it('displays a loading state while fetching tasks', () => {
    // Mock the getTasks function to delay
    const { getTasks } = require('../../firebase');
    getTasks.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<TaskManager />);
    
    // Check if the loading state is displayed
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('displays an error state when fetching tasks fails', async () => {
    // Mock the getTasks function to fail
    const { getTasks } = require('../../firebase');
    getTasks.mockRejectedValue(new Error('Failed to fetch tasks'));
    
    render(<TaskManager />);
    
    // Wait for the error state to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error loading tasks')).toBeInTheDocument();
    });
  });

  it('allows adding a new task', async () => {
    const { addTask } = require('../../firebase');
    addTask.mockResolvedValue({
      id: '4',
      title: 'New Task',
      completed: false,
      dueDate: new Date('2023-12-28'),
      order: 3,
      tags: [],
      userId: 'test-user-id',
    });
    
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the add task button
    fireEvent.click(screen.getByText('Add Task'));
    
    // Wait for the task modal to open
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
    
    // Fill in the task form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-28' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the task to be added
    await waitFor(() => {
      expect(addTask).toHaveBeenCalledWith({
        title: 'New Task',
        completed: false,
        dueDate: expect.any(Date),
        order: 3,
        tags: [],
        userId: 'test-user-id',
      });
    });
  });

  it('allows updating a task', async () => {
    const { updateTask } = require('../../firebase');
    updateTask.mockResolvedValue({
      id: '1',
      title: 'Updated Task',
      completed: false,
      dueDate: new Date('2023-12-31'),
      order: 0,
      tags: ['Work'],
      userId: 'test-user-id',
    });
    
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the edit button for the first task
    fireEvent.click(screen.getAllByTestId('edit-task')[0]);
    
    // Wait for the task modal to open
    await waitFor(() => {
      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });
    
    // Update the task title
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Task' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the task to be updated
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith('1', {
        title: 'Updated Task',
      });
    });
  });

  it('allows deleting a task', async () => {
    const { deleteTask } = require('../../firebase');
    deleteTask.mockResolvedValue(true);
    
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the delete button for the first task
    fireEvent.click(screen.getAllByTestId('delete-task')[0]);
    
    // Confirm the deletion
    fireEvent.click(screen.getByText('Delete'));
    
    // Wait for the task to be deleted
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith('1');
    });
  });

  it('allows completing a task', async () => {
    const { updateTask } = require('../../firebase');
    updateTask.mockResolvedValue({
      id: '1',
      title: 'Test Task 1',
      completed: true,
      dueDate: new Date('2023-12-31'),
      order: 0,
      tags: ['Work'],
      userId: 'test-user-id',
    });
    
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the checkbox for the first task
    fireEvent.click(screen.getAllByTestId('task-checkbox')[0]);
    
    // Wait for the task to be updated
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith('1', {
        completed: true,
      });
    });
  });

  it('allows filtering tasks by status', async () => {
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the "Completed" filter
    fireEvent.click(screen.getByText('Completed'));
    
    // Check if only completed tasks are displayed
    expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 3')).not.toBeInTheDocument();
  });

  it('allows filtering tasks by tag', async () => {
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the "Work" tag filter
    fireEvent.click(screen.getByText('Work'));
    
    // Check if only tasks with the "Work" tag are displayed
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    expect(screen.getByText('Test Task 3')).toBeInTheDocument();
  });

  it('allows searching for tasks', async () => {
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Enter a search query
    fireEvent.change(screen.getByPlaceholderText('Search tasks...'), { target: { value: 'Task 1' } });
    
    // Check if only matching tasks are displayed
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Task 3')).not.toBeInTheDocument();
  });

  it('allows sorting tasks by due date', async () => {
    render(<TaskManager />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
    
    // Click the sort button
    fireEvent.click(screen.getByTestId('sort-button'));
    
    // Select "Due Date" sort option
    fireEvent.click(screen.getByText('Due Date'));
    
    // Check if tasks are sorted by due date
    const taskElements = screen.getAllByTestId('task-item');
    expect(taskElements[0]).toHaveTextContent('Test Task 3');
    expect(taskElements[1]).toHaveTextContent('Test Task 2');
    expect(taskElements[2]).toHaveTextContent('Test Task 1');
  });
}); 