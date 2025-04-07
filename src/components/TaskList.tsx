import React from 'react';
import { Box, Typography, Paper, Checkbox, IconButton, Chip, Tooltip } from '@mui/material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import FlagIcon from '@mui/icons-material/Flag';
import FolderIcon from '@mui/icons-material/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onTaskAction: {
    toggle: (taskId: string) => void;
    delete: (taskId: string) => void;
    update: (taskId: string, updates: Partial<Task>) => void;
    edit: (task: Task) => void;
    share: (task: Task) => void;
  };
  draggable?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskAction, draggable = false }) => {
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return '#4CAF50'; // Green
      case 'medium': return '#FF9800'; // Orange
      case 'high': return '#f44336'; // Red
      default: return '#757575'; // Grey
    }
  };

  const renderTask = (task: Task) => (
    <Paper
      key={task.id}
      sx={{
        p: 1.5,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        opacity: task.completed ? 0.7 : 1,
        bgcolor: 'background.paper',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
          boxShadow: 1,
          '& .task-actions': {
            opacity: 1,
          },
        },
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => onTaskAction.toggle(task.id)}
        color="primary"
        size="small"
        sx={{ 
          p: 0.5,
          '& .MuiSvgIcon-root': {
            fontSize: 20,
          }
        }}
      />
      
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'text.secondary' : 'text.primary',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {task.title}
        </Typography>
        
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mt: 0.5,
            }}
          >
            {task.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {task.dueDate && (
            <Tooltip title={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}>
              <Chip
                icon={<AccessTimeIcon />}
                label={format(new Date(task.dueDate), 'MMM d')}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Tooltip>
          )}
          
          {task.categoryId && (
            <Tooltip title="Category">
              <Chip
                icon={<FolderIcon />}
                label={task.categoryId}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Tooltip>
          )}
          
          {task.priority && task.priority !== 'medium' && (
            <Tooltip title={`Priority: ${task.priority}`}>
              <Chip
                icon={<FlagIcon />}
                label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                size="small"
                sx={{ 
                  height: 24,
                  bgcolor: getPriorityColor(task.priority),
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                  }
                }}
              />
            </Tooltip>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <Tooltip title={task.tags.join(', ')}>
              <Chip
                icon={<LabelIcon />}
                label={`${task.tags.length} Tags`}
                size="small"
                color="info"
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Tooltip>
          )}
          
          {task.isShared && (
            <Tooltip title="Shared Task">
              <Chip
                icon={<ShareIcon />}
                label="Shared"
                size="small"
                color="success"
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <Box 
        className="task-actions"
        sx={{ 
          display: 'flex', 
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <Tooltip title="Share">
          <IconButton
            size="small"
            onClick={() => onTaskAction.share(task)}
            color="primary"
            sx={{ p: 0.5 }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => onTaskAction.edit(task)}
            color="primary"
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => onTaskAction.delete(task.id)}
            color="error"
            sx={{ p: 0.5 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
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
      <Droppable droppableId="taskList">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, _index) => (
              <Draggable key={task.id} draggableId={task.id} index={_index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderTask(task)}
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
      {tasks.map((task) => renderTask(task))}
    </Box>
  );
};

export default TaskList; 