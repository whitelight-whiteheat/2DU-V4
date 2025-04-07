import React from 'react';
import { Box, Typography } from '@mui/material';
import { isAfter, isToday } from 'date-fns';
import TaskList from '../TaskList';
import { Task } from '../../types';

interface UpcomingViewProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
    share: (task: Task) => void;
  };
}

const UpcomingView: React.FC<UpcomingViewProps> = ({ tasks, onTaskAction }) => {
  const upcomingTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isAfter(taskDate, new Date()) && !isToday(taskDate);
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upcoming Tasks
      </Typography>
      <TaskList
        tasks={upcomingTasks}
        onTaskAction={onTaskAction}
        draggable
      />
    </Box>
  );
};

export default UpcomingView; 