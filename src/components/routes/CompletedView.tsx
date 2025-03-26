import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../TaskList';
import { Task } from '../../types';

interface CompletedViewProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
  };
}

const CompletedView: React.FC<CompletedViewProps> = ({ tasks, onTaskAction }) => {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Completed Tasks
      </Typography>
      <TaskList
        tasks={completedTasks}
        onTaskAction={onTaskAction}
      />
    </Box>
  );
};

export default CompletedView; 