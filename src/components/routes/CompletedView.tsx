import React from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../TaskList';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Array<{ name: string; color: string }>;
  project?: string;
}

interface CompletedViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

const CompletedView: React.FC<CompletedViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onEditTask,
}) => {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Completed
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {completedTasks.length} tasks completed
      </Typography>
      <TaskList
        tasks={completedTasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
        onEditTask={onEditTask}
      />
    </Box>
  );
};

export default CompletedView; 