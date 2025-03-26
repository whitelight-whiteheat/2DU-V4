export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  tags: string[];
  order: number;
  userId: string;
}

export interface Tag {
  name: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  name: string;
} 