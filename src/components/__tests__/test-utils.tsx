import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock Firebase
jest.mock('../firebase', () => ({
  db: {},
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
}));

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Droppable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Draggable: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Create a theme instance
const theme = createTheme();

// Custom render function that includes providers
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    ),
    ...options,
  });

// Mock task data
export const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test Description 1',
    status: 'todo',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 0,
    category: 'Work',
    categoryId: 'work',
    tags: [],
    subtasks: [],
    attachments: [],
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Test Description 2',
    status: 'in-progress',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1,
    category: 'Personal',
    categoryId: 'personal',
    tags: [],
    subtasks: [],
    attachments: [],
  },
];

// Mock categories data
export const mockCategories = [
  {
    id: 'work',
    name: 'Work',
    order: 0,
  },
  {
    id: 'personal',
    name: 'Personal',
    order: 1,
  },
];

// Mock tags data
export const mockTags = [
  {
    id: '1',
    name: 'Work',
    color: '#4CAF50',
  },
  {
    id: '2',
    name: 'Personal',
    color: '#2196F3',
  },
];

// Export everything
export * from '@testing-library/react';
export { customRender as render }; 