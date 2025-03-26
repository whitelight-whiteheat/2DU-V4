import React from 'react';
import { Box, Typography } from '@mui/material';
import { isToday, startOfDay } from 'date-fns';
import TaskList from '../TaskList';
import { Task } from '../../types';

interface TodayViewProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
  };
}

const TodayView: React.FC<TodayViewProps> = ({ tasks, onTaskAction }) => {
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isToday(startOfDay(new Date(task.dueDate)));
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Today's Tasks
      </Typography>
      <TaskList
        tasks={todayTasks}
        onTaskAction={onTaskAction}
        draggable
      />
    </Box>
  );
};

export default TodayView; 