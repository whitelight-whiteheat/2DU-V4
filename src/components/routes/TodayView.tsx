import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../TaskList';
import { format, isToday } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Array<{ name: string; color: string }>;
  project?: string;
}

interface TodayViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onEditTask,
}) => {
  const today = new Date();
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isToday(taskDate) && !task.completed;
  });

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Today
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {format(today, 'EEEE, MMMM d')}
      </Typography>
      <TaskList
        tasks={todaysTasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
        onEditTask={onEditTask}
        draggable={false}
      />
    </Box>
  );
};

export default TodayView; 