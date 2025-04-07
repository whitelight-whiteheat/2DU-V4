import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Fab, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';
import AuthForm from './components/AuthForm';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import { Task, Tag } from '../types';
import { startOfDay } from 'date-fns';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { A11yProvider } from './contexts/A11yContext';
import { logError } from './utils/errorLogging';
import { performanceMonitor } from './utils/performanceMonitoring';
import { retry } from './utils/retryMechanism';

// Lazy load route components
const TodayView = lazy(() => import('./components/routes/TodayView'));
const UpcomingView = lazy(() => import('./components/routes/UpcomingView'));
const TagsView = lazy(() => import('./components/routes/TagsView'));
const CompletedView = lazy(() => import('./components/routes/CompletedView'));
const CalendarView = lazy(() => import('./components/routes/CalendarView'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState isLoading={true} fullScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([
    { name: 'Work', color: '#4CAF50' },
    { name: 'Personal', color: '#2196F3' },
    { name: 'Shopping', color: '#FF9800' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simplified theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#4a90e2' },
      background: {
        default: darkMode ? '#1a1a1a' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
    },
  });

  // Load and save state with error handling
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      
      try {
        const savedTasks = localStorage.getItem(`tasks-${user.id}`);
        const savedTags = localStorage.getItem(`tags-${user.id}`);
        const savedDarkMode = localStorage.getItem(`darkMode-${user.id}`);
        
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedTags) setTags(JSON.parse(savedTags));
        if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load user data');
        setError(error);
        logError(error, 'Failed to load user data', {
          componentName: 'AppContent',
          actionName: 'load_user_data',
          userId: user.id
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  // Save state with error handling
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
        localStorage.setItem(`tags-${user.id}`, JSON.stringify(tags));
        localStorage.setItem(`darkMode-${user.id}`, JSON.stringify(darkMode));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save user data');
        logError(error, 'Failed to save user data', {
          componentName: 'AppContent',
          actionName: 'save_user_data',
          userId: user.id
        });
      }
    }
  }, [tasks, tags, darkMode, user]);

  // Simplified task management with error handling
  const handleTaskAction = {
    toggle: async (taskId: string) => {
      try {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to toggle task');
        logError(error, 'Failed to toggle task', {
          componentName: 'AppContent',
          actionName: 'toggle_task',
          userId: user?.id,
          additionalData: { taskId }
        });
      }
    },
    delete: async (taskId: string) => {
      try {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete task');
        logError(error, 'Failed to delete task', {
          componentName: 'AppContent',
          actionName: 'delete_task',
          userId: user?.id,
          additionalData: { taskId }
        });
      }
    },
    update: async (taskId: string, updates: Partial<Task>) => {
      try {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update task');
        logError(error, 'Failed to update task', {
          componentName: 'AppContent',
          actionName: 'update_task',
          userId: user?.id,
          additionalData: { taskId, updates }
        });
      }
    },
    create: () => {
      setEditingTask(undefined);
      setIsTaskModalOpen(true);
    },
    edit: (task: Task) => {
      setEditingTask(task);
      setIsTaskModalOpen(true);
    },
    save: async (taskData: Omit<Task, 'id' | 'order'>) => {
      if (!user) return;

      try {
        // Use retry mechanism for task saving
        await retry(async () => {
          if (editingTask) {
            setTasks(prevTasks =>
              prevTasks.map(task =>
                task.id === editingTask.id 
                  ? { 
                      ...taskData, 
                      id: task.id, 
                      order: task.order,
                      dueDate: startOfDay(taskData.dueDate),
                      userId: user.id
                    } 
                  : task
              )
            );
          } else {
            const newTask: Task = {
              ...taskData,
              id: `task-${Date.now()}`,
              order: tasks.length,
              completed: false,
              tags: taskData.tags || [],
              dueDate: startOfDay(taskData.dueDate),
              userId: user.id,
            };
            setTasks(prevTasks => [...prevTasks, newTask]);
          }
        }, {
          maxAttempts: 3,
          onRetry: (attempt, error) => {
            console.warn(`Retrying task save (attempt ${attempt}): ${error.message}`);
          }
        });
        
        setIsTaskModalOpen(false);
        setEditingTask(undefined);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save task');
        logError(error, 'Failed to save task', {
          componentName: 'AppContent',
          actionName: 'save_task',
          userId: user.id,
          additionalData: { taskData, isEditing: !!editingTask }
        });
      }
    },
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    try {
      const { source, destination } = result;
      
      // Only handle reordering within the same list
      if (source.droppableId === destination.droppableId) {
        setTasks(prevTasks => {
          const updatedTasks = Array.from(prevTasks);
          const [movedTask] = updatedTasks.splice(source.index, 1);
          updatedTasks.splice(destination.index, 0, movedTask);
          
          // Update order based on new position
          return updatedTasks.map((task, index) => ({
            ...task,
            order: index
          }));
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reorder tasks');
      logError(error, 'Failed to reorder tasks', {
        componentName: 'AppContent',
        actionName: 'reorder_tasks',
        userId: user?.id,
        additionalData: { result }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLogout={logout}
          userName={user?.name}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${isSidebarCollapsed ? 64 : 240}px)` },
            ml: { sm: `${isSidebarCollapsed ? 64 : 240}px` },
          }}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Routes>
              <Route path="/auth" element={<AuthForm />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <TodayView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                      isLoading={isLoading}
                      error={error}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upcoming"
                element={
                  <ProtectedRoute>
                    <UpcomingView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                      isLoading={isLoading}
                      error={error}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tags"
                element={
                  <ProtectedRoute>
                    <TagsView
                      tasks={tasks}
                      tags={tags}
                      onTaskAction={handleTaskAction}
                      isLoading={isLoading}
                      error={error}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/completed"
                element={
                  <ProtectedRoute>
                    <CompletedView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                      isLoading={isLoading}
                      error={error}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                      isLoading={isLoading}
                      error={error}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </DragDropContext>

          <Fab
            color="primary"
            aria-label="add task"
            onClick={handleTaskAction.create}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>

          <TaskModal
            open={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setEditingTask(undefined);
            }}
            onSave={handleTaskAction.save}
            task={editingTask}
            tags={tags}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <I18nProvider>
          <A11yProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Suspense fallback={<LoadingFallback />}>
                <AppContent />
              </Suspense>
            </LocalizationProvider>
          </A11yProvider>
        </I18nProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
