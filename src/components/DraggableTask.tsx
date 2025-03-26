import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';

interface Tag {
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  tags: Tag[];
  priority: 'low' | 'medium' | 'high';
  order: number;
}

interface DraggableTaskProps {
  task: Task;
  index: number;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  index,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 1,
            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
            cursor: 'grab',
            '&:hover': {
              bgcolor: 'action.hover',
            },
            position: 'relative',
            transition: 'all 0.2s ease',
            transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)',
            boxShadow: snapshot.isDragging ? 3 : 0,
            zIndex: snapshot.isDragging ? 1 : 0,
          }}
        >
          <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Box
              {...provided.dragHandleProps}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                cursor: 'grab',
                '&:hover': {
                  color: 'text.primary',
                },
                opacity: snapshot.isDragging ? 1 : 0.5,
                transition: 'opacity 0.2s ease',
              }}
            >
              <DragIndicatorIcon />
            </Box>
            <Checkbox
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              onClick={(e) => e.stopPropagation()}
              size="small"
              sx={{ mt: 0.5 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {task.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {task.tags.map((tag: Tag) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    size="small"
                    sx={{ bgcolor: tag.color, color: 'white' }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                sx={{
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
                sx={{
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default DraggableTask; 