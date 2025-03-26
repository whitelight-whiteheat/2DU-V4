import React from 'react';
import { Box, Typography, Paper, Checkbox, IconButton, Chip } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
  };
  draggable?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskAction, draggable = false }) => {
  const renderTask = (task: Task, index: number) => (
    <Paper
      key={task.id}
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        opacity: task.completed ? 0.7 : 1,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onTaskAction.toggle(task.id)}
        color="primary"
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'text.secondary' : 'text.primary',
          }}
        >
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        )}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {task.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
      <IconButton
        size="small"
        onClick={() => onTaskAction.edit(task)}
        color="primary"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onTaskAction.delete(task.id)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );

  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No tasks yet. Click the + button to add one!</Typography>
      </Box>
    );
  }

  if (draggable) {
    return (
      <Droppable droppableId="tasks">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ minHeight: '100px' }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      ...provided.draggableProps.style,
                      marginBottom: '8px',
                    }}
                  >
                    {renderTask(task, index)}
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    );
  }

  return (
    <Box>
      {tasks.map((task, index) => renderTask(task, index))}
    </Box>
  );
};

export default TaskList; 