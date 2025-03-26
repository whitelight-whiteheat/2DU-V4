import React, { useState, useEffect } from 'react';
import { Box, Fab, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';
import AuthForm from './components/AuthForm';
import TodayView from './components/routes/TodayView';
import UpcomingView from './components/routes/UpcomingView';
import TagsView from './components/routes/TagsView';
import CompletedView from './components/routes/CompletedView';
import CalendarView from './components/routes/CalendarView';
import { Task, Tag } from '../types';
import { startOfDay } from 'date-fns';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
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

  // Load and save state
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks-${user.id}`);
      const savedTags = localStorage.getItem(`tags-${user.id}`);
      const savedDarkMode = localStorage.getItem(`darkMode-${user.id}`);
      
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedTags) setTags(JSON.parse(savedTags));
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
      localStorage.setItem(`tags-${user.id}`, JSON.stringify(tags));
      localStorage.setItem(`darkMode-${user.id}`, JSON.stringify(darkMode));
    }
  }, [tasks, tags, darkMode, user]);

  // Simplified task management
  const handleTaskAction = {
    toggle: (taskId: string) => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    },
    delete: (taskId: string) => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    },
    update: (taskId: string, updates: Partial<Task>) => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    },
    create: () => {
      setEditingTask(undefined);
      setIsTaskModalOpen(true);
    },
    edit: (task: Task) => {
      setEditingTask(task);
      setIsTaskModalOpen(true);
    },
    save: (taskData: Omit<Task, 'id' | 'order'>) => {
      if (!user) return;

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
      setIsTaskModalOpen(false);
      setEditingTask(undefined);
    },
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
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
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
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
              width: { sm: `calc(100% - ${isSidebarCollapsed ? 60 : 240}px)` },
              ml: { sm: `${isSidebarCollapsed ? 60 : 240}px` },
              minHeight: '100vh',
              bgcolor: 'background.default',
              color: 'text.primary',
            }}
          >
            <DragDropContext onDragEnd={handleDragEnd}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <TodayView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                    />
                  }
                />
                <Route
                  path="/upcoming"
                  element={
                    <UpcomingView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                    />
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <CalendarView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                    />
                  }
                />
                <Route
                  path="/tags"
                  element={
                    <TagsView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                    />
                  }
                />
                <Route
                  path="/completed"
                  element={
                    <CompletedView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                    />
                  }
                />
                <Route
                  path="*"
                  element={
                    <TodayView
                      tasks={tasks}
                      onTaskAction={handleTaskAction}
                    />
                  }
                />
              </Routes>
            </DragDropContext>
          </Box>

          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleTaskAction.create}
          >
            <AddIcon />
          </Fab>

          <TaskModal
            open={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setEditingTask(undefined);
            }}
            onSubmit={handleTaskAction.save}
            initialTask={editingTask}
            tags={tags}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
