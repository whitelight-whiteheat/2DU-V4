import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

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
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onAddTask?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: Date) => {
    if (onAddTask) {
      onAddTask(day);
    }
  };

  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation(); // Prevent day click event
    onToggleTask(task.id);
  };

  const handleTaskContextMenu = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent day click event
    onEditTask(task);
  };

  const renderTaskPreview = (task: Task) => (
    <Box
      key={task.id}
      onClick={(e) => handleTaskClick(e, task)}
      onContextMenu={(e) => handleTaskContextMenu(e, task)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 0.25,
        mb: 0.25,
        bgcolor: task.completed ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.2)',
        borderRadius: 0.5,
        borderLeft: 2,
        borderColor: task.tags[0]?.color || 'primary.main',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: task.completed ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          fontSize: '0.75rem',
          lineHeight: 1.2,
          width: '100%',
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </Typography>
    </Box>
  );

  const renderDay = (day: Date) => {
    const tasksForDay = getTasksForDate(day);
    const isTodayDate = isToday(day);
    const isCurrentMonth = isSameMonth(day, currentDate);

    return (
      <Box
        key={day.toString()}
        onClick={() => handleDayClick(day)}
        sx={{
          minHeight: '80px',
          p: 0.5,
          cursor: 'pointer',
          bgcolor: isCurrentMonth ? 'background.paper' : 'action.hover',
          border: 1,
          borderColor: isTodayDate ? 'primary.main' : 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            mb: 0.25,
            color: isCurrentMonth ? 'text.primary' : 'text.disabled',
            fontSize: '0.85rem',
          }}
        >
          {format(day, 'd')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {tasksForDay.slice(0, 4).map(renderTaskPreview)}
          {tasksForDay.length > 4 && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                p: 0.25,
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 0.5,
                borderLeft: 2,
                borderColor: 'primary.main',
              }}
            >
              +{tasksForDay.length - 4} more
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '90vh',
        width: '90vw',
        maxWidth: '1400px',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          height: '45px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePreviousMonth}
            size="small"
            sx={{ color: 'text.secondary', p: 0.5 }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 160, textAlign: 'center', fontSize: '1.2rem' }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton
            onClick={handleNextMonth}
            size="small"
            sx={{ color: 'text.secondary', p: 0.5 }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Weekday Headers */}
      <Grid
        container
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0,
          borderBottom: 1,
          borderColor: 'divider',
          height: '30px',
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item key={day}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                fontWeight: 500,
                color: 'text.secondary',
                fontSize: '0.85rem',
                p: 0.5,
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Days */}
      <Grid
        container
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0,
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {days.map((day) => renderDay(day))}
      </Grid>
    </Paper>
  );
};

export default Calendar; 