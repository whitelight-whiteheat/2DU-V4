import React, { useState, useEffect } from 'react';
import { Box, Fab, IconButton, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';
import TodayView from './components/routes/TodayView';
import UpcomingView from './components/routes/UpcomingView';
import Calendar from './components/Calendar';
import TagsView from './components/routes/TagsView';
import CompletedView from './components/routes/CompletedView';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Array<{ name: string; color: string }>;
  priority: 'low' | 'medium' | 'high';
  order: number;
}

interface Tag {
  name: string;
  color: string;
}

const App: React.FC = () => {
  // Load initial state from localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem('tags');
    return saved ? JSON.parse(saved) : [
      { name: 'Work', color: '#4CAF50' },
      { name: 'Personal', color: '#2196F3' },
      { name: 'Shopping', color: '#FF9800' },
    ];
  });

  // Create theme based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4a90e2',  // Modern blue from Notion
        light: '#6ba5e7',
        dark: '#357abd',
      },
      secondary: {
        main: '#f5f5f5',
      },
      background: {
        default: darkMode ? '#1a1a1a' : '#ffffff',
        paper: darkMode ? '#2d2d2d' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
        secondary: darkMode ? '#b0b0b0' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.3px',
      },
      body1: {
        fontSize: '0.95rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 6,
            fontWeight: 500,
            padding: '8px 16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            boxShadow: darkMode 
              ? '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)' 
              : '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: 12,
            boxShadow: darkMode 
              ? '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)' 
              : '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRight: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: darkMode 
              ? '2px 0 8px rgba(0,0,0,0.1)' 
              : '2px 0 8px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            backgroundColor: '#4a90e2',
            '&:hover': {
              backgroundColor: '#357abd',
            },
            boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: darkMode ? '#ffffff' : '#333333',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    },
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save tags to localStorage
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  // Save dark mode state to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'order'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? { ...taskData, id: task.id, order: task.order } : task
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        order: tasks.length,
        completed: false,
        tags: taskData.tags || [],
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box 
          sx={{ 
            display: 'flex',
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
          }}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
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
            <IconButton
              onClick={handleToggleDarkMode}
              sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1000,
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Routes>
              <Route
                path="/"
                element={
                  <TodayView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onEditTask={handleEditTask}
                  />
                }
              />
              <Route
                path="/upcoming"
                element={
                  <UpcomingView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onEditTask={handleEditTask}
                  />
                }
              />
              <Route
                path="/calendar"
                element={
                  <Calendar
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onEditTask={handleEditTask}
                    onAddTask={(date) => {
                      setEditingTask({
                        id: '',
                        title: '',
                        dueDate: date.toISOString(),
                        completed: false,
                        tags: [],
                        priority: 'low',
                      });
                      setIsTaskModalOpen(true);
                    }}
                  />
                }
              />
              <Route
                path="/tags"
                element={
                  <TagsView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onEditTask={handleEditTask}
                  />
                }
              />
              <Route
                path="/completed"
                element={
                  <CompletedView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onEditTask={handleEditTask}
                  />
                }
              />
            </Routes>
          </Box>
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleCreateTask}
          >
            <AddIcon />
          </Fab>
          <TaskModal
            open={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setEditingTask(undefined);
            }}
            onSubmit={handleSaveTask}
            editingTask={editingTask}
            tags={tags}
            projects={[]}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
