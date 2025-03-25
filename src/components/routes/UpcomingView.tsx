import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../TaskList';
import { format, isAfter, startOfDay, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Array<{ name: string; color: string }>;
  project?: string;
}

interface UpcomingViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

const UpcomingView: React.FC<UpcomingViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onEditTask,
}) => {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isAfter(taskDate, today) && !task.completed && !isToday(taskDate);
  });

  const handleDateClick = (date: string) => {
    navigate('/calendar', { state: { selectedDate: date } });
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {upcomingTasks.length} tasks
      </Typography>
      <TaskList
        tasks={upcomingTasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
        onEditTask={onEditTask}
        onDateClick={handleDateClick}
      />
    </Box>
  );
};

export default UpcomingView; 