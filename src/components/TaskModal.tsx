import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Task, Tag } from '../types';
import { startOfDay } from 'date-fns';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'order'>) => void;
  initialTask?: Task;
  tags: Tag[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialTask,
  tags,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(startOfDay(new Date()));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : startOfDay(new Date()));
      setSelectedTags(initialTask.tags);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(startOfDay(new Date()));
      setSelectedTags([]);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      dueDate: dueDate || startOfDay(new Date()),
      completed: false,
      tags: selectedTags,
    });
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialTask ? 'Edit Task' : 'New Task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    onClick={() => handleTagToggle(tag.name)}
                    color={selectedTags.includes(tag.name) ? 'primary' : 'default'}
                    variant={selectedTags.includes(tag.name) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal; 