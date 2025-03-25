import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDateClick?: (date: string) => void;
  draggable?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onEditTask,
  onDateClick,
  draggable = false,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
  });

  const handleDateClick = (date: string) => {
    if (onDateClick) {
      onDateClick(date);
    } else {
      navigate('/calendar', { state: { selectedDate: date } });
    }
  };

  const handleTagClick = (tagName: string) => {
    navigate('/tags', { state: { selectedTag: tagName } });
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: editForm.title,
        description: editForm.description,
        dueDate: editForm.dueDate || null,
        priority: editForm.priority,
      });
      setEditDialogOpen(false);
      setEditingTask(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (tasks.length === 0) {
    console.log('No tasks to display');
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No tasks to display</Typography>
      </Box>
    );
  }

  console.log('Rendering tasks:', tasks);
  return (
    <>
      <List>
        {tasks.map((task, index) => {
          console.log('Rendering task:', task);
          const taskContent = (
            <ListItem
              key={task.id}
              sx={{
                backgroundColor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                color="primary"
                sx={{ mr: 2 }}
              />
              <ListItemText
                primary={
                  <Box component="div" display="flex" alignItems="center" gap={1}>
                    <Typography
                      component="span"
                      variant="subtitle1"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority)}
                    />
                  </Box>
                }
                secondary={
                  <Box component="div">
                    {task.description && (
                      <Typography
                        component="div"
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                    <Box component="div" display="flex" gap={1} mt={1}>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={() => handleDateClick(task.dueDate)}
                      >
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </Typography>
                      {(task.tags || []).map((tag) => (
                        <Chip
                          key={`${task.id}-${tag.name}`}
                          label={tag.name}
                          size="small"
                          sx={{
                            backgroundColor: tag.color,
                            color: 'white',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleTagClick(tag.name)}
                        />
                      ))}
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditClick(task)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteClick(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );

          return draggable ? (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {taskContent}
                </div>
              )}
            </Draggable>
          ) : (
            taskContent
          );
        })}
      </List>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">Edit Task</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Due Date"
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Priority"
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
              fullWidth
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskList; 