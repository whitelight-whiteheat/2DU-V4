import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Typography, CircularProgress } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Firestore } from 'firebase/firestore';
import { db } from '../firebase';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import Calendar from './Calendar';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Array<{ name: string; color: string }>;
  project?: string;
  priority: 'low' | 'medium' | 'high';
  order: number;
}

interface CalendarProps {
  tasks: Task[];
  onDateSelect: (date: Date | null) => void;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Load tasks from Firebase
  useEffect(() => {
    const loadTasks = async () => {
      try {
        console.log('TaskManager: Starting to load tasks from Firebase...');
        console.log('TaskManager: Current tasks state:', tasks);
        
        // Verify Firebase connection
        if (!db) {
          console.error('TaskManager: Firebase database not initialized');
          throw new Error('Firebase database not initialized');
        }
        
        console.log('TaskManager: Getting tasks collection reference...');
        const tasksCollection = collection(db, 'tasks');
        
        console.log('TaskManager: Creating query...');
        const tasksQuery = query(tasksCollection, orderBy('order'));
        
        console.log('TaskManager: Executing query...');
        const querySnapshot = await getDocs(tasksQuery);
        console.log('TaskManager: Query executed successfully. Number of documents:', querySnapshot.size);
        
        const loadedTasks = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('TaskManager: Processing document:', { id: doc.id, data });
          return {
            id: doc.id,
            ...data
          } as Task;
        });
        
        console.log('TaskManager: All tasks loaded successfully:', loadedTasks);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('TaskManager: Error in loadTasks:', error);
        if (error instanceof Error) {
          console.error('TaskManager: Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
      } finally {
        console.log('TaskManager: Setting loading state to false');
        setLoading(false);
      }
    };

    console.log('TaskManager: loadTasks effect triggered');
    loadTasks();
  }, []); // Empty dependency array means this runs once on mount

  const addTask = async (newTask: Omit<Task, 'id' | 'order'>) => {
    try {
      setError(null);
      console.log('TaskManager: Starting task creation process...');
      console.log('TaskManager: New task data received:', newTask);
      
      if (!newTask.title.trim()) {
        setError('Title is required');
        console.error('TaskManager: Title is required');
        return;
      }
      
      const order = tasks.length;
      console.log('TaskManager: Calculated order:', order);
      
      // Set default values for required fields
      const taskData: Omit<Task, 'id'> = {
        title: newTask.title.trim(),
        description: '',
        dueDate: new Date().toISOString(), // Set to today by default
        priority: 'medium' as const,
        completed: false,
        tags: [],
        order
      };
      console.log('TaskManager: Prepared task data:', taskData);
      
      if (!db) {
        setError('Database connection error');
        console.error('TaskManager: Firebase database not initialized');
        throw new Error('Firebase database not initialized');
      }
      
      const tasksCollection = collection(db, 'tasks');
      console.log('TaskManager: Got tasks collection reference');
      
      console.log('TaskManager: Attempting to add document to Firestore...');
      const docRef = await addDoc(tasksCollection, taskData);
      console.log('TaskManager: Document added successfully with ID:', docRef.id);
      
      const newTaskWithId: Task = { ...taskData, id: docRef.id };
      console.log('TaskManager: Created new task object with ID:', newTaskWithId);
      
      console.log('TaskManager: Updating local state...');
      setTasks(prevTasks => {
        console.log('TaskManager: Previous tasks state:', prevTasks);
        const updatedTasks = [...prevTasks, newTaskWithId];
        console.log('TaskManager: New tasks state:', updatedTasks);
        return updatedTasks;
      });
      
      console.log('TaskManager: Closing modal...');
      setIsModalOpen(false);
      setSelectedTask(null);
      console.log('TaskManager: Task creation process completed successfully');
    } catch (error) {
      console.error('TaskManager: Error in addTask:', error);
      if (error instanceof Error) {
        setError(error.message);
        console.error('TaskManager: Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, updates);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    await handleTaskUpdate(taskId, updates);
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await handleTaskUpdate(taskId, { completed: !task.completed });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);

    // Update order in Firebase
    try {
      const batch = items.map((task, index) => {
        const taskRef = doc(db, 'tasks', task.id);
        return updateDoc(taskRef, { order: index });
      });
      await Promise.all(batch);
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  // Add a new effect to reload tasks when the modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      const loadTasks = async () => {
        try {
          const tasksCollection = collection(db, 'tasks');
          const tasksQuery = query(tasksCollection, orderBy('order'));
          const querySnapshot = await getDocs(tasksQuery);
          const loadedTasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Task));
          setTasks(loadedTasks);
        } catch (error) {
          console.error('Error reloading tasks:', error);
        }
      };
      loadTasks();
    }
  }, [isModalOpen]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Box>
          <ButtonGroup variant="contained" sx={{ mb: 2 }}>
            <Button
              onClick={() => setView('list')}
              color={view === 'list' ? 'primary' : 'inherit'}
            >
              List View
            </Button>
            <Button
              onClick={() => setView('calendar')}
              color={view === 'calendar' ? 'primary' : 'inherit'}
            >
              Calendar View
            </Button>
          </ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : view === 'list' ? (
        <TaskList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
          onEditTask={(task) => {
            setSelectedTask(task);
            setIsModalOpen(true);
          }}
          draggable={true}
        />
      ) : (
        <Calendar
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={(task: Task) => {
            setSelectedTask(task);
            setIsModalOpen(true);
          }}
          onAddTask={(date: Date) => {
            setSelectedDate(date);
            setIsModalOpen(true);
          }}
        />
      )}

      <TaskModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={addTask}
        initialTask={selectedTask}
      />
    </Box>
  );
};

export default TaskManager; 