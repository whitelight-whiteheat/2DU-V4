import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'order'>) => void;
  initialTask?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSubmit, initialTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<Array<{ name: string; color: string }>>([]);
  const [newTag, setNewTag] = useState('');
  const [newTagColor, setNewTagColor] = useState('#1976d2');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : new Date());
      setPriority(initialTask.priority);
      setTags(initialTask.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setPriority('medium');
      setTags([]);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      dueDate: dueDate?.toISOString() || new Date().toISOString(),
      priority,
      tags,
      completed: false
    });
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { name: newTag.trim(), color: newTagColor }]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Tags</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.name}
                  onDelete={() => handleDeleteTag(index)}
                  sx={{ backgroundColor: tag.color, color: 'white' }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                size="small"
                label="New Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                style={{ width: '40px', height: '40px', padding: 0 }}
              />
              <IconButton onClick={handleAddTag} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal; 