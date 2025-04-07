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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Divider,
  Tooltip,
  Paper,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Task, Tag, Category, Subtask, Attachment } from '../types';
import { startOfDay, format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NotesIcon from '@mui/icons-material/Notes';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import FolderIcon from '@mui/icons-material/Folder';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'order'>) => void;
  initialTask?: Task;
  tags: Tag[];
  categories: Category[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  initialTask,
  tags = [],
  categories = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(startOfDay(new Date()));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [reminder, setReminder] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showDescription, setShowDescription] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : startOfDay(new Date()));
      setSelectedTags(initialTask.tags || []);
      setCategoryId(initialTask.categoryId || '');
      setPriority(initialTask.priority || 'medium');
      setSubtasks(initialTask.subtasks || []);
      setReminder(initialTask.reminder ? new Date(initialTask.reminder) : null);
      setNotes(initialTask.notes || '');
      setAttachments(initialTask.attachments || []);
      setShowDescription(!!initialTask.description);
      setShowSubtasks(!!initialTask.subtasks?.length);
      setShowNotes(!!initialTask.notes);
      setShowAttachments(!!initialTask.attachments?.length);
    } else {
      resetForm();
    }
  }, [initialTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(startOfDay(new Date()));
    setSelectedTags([]);
    setCategoryId('');
    setPriority('medium');
    setSubtasks([]);
    setNewSubtask('');
    setReminder(null);
    setNotes('');
    setAttachments([]);
    setShowDescription(false);
    setShowSubtasks(false);
    setShowNotes(false);
    setShowAttachments(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      dueDate: dueDate || startOfDay(new Date()),
      completed: false,
      tags: selectedTags,
      categoryId,
      priority,
      subtasks,
      reminder: reminder || undefined,
      notes,
      attachments,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    resetForm();
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks(prev => [...prev, {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false,
        order: prev.length,
      }]);
      setNewSubtask('');
    }
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you would upload these files to a storage service
      // and get back URLs. For now, we'll create mock attachments
      const newAttachments: Attachment[] = Array.from(files).map(file => ({
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return '#4CAF50'; // Green
      case 'medium': return '#FF9800'; // Orange
      case 'high': return '#f44336'; // Red
      default: return '#757575'; // Grey
    }
  };

  const toggleSection = (section: 'description' | 'subtasks' | 'notes' | 'attachments') => {
    switch (section) {
      case 'description':
        setShowDescription(!showDescription);
        break;
      case 'subtasks':
        setShowSubtasks(!showSubtasks);
        break;
      case 'notes':
        setShowNotes(!showNotes);
        break;
      case 'attachments':
        setShowAttachments(!showAttachments);
        break;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="standard"
              autoFocus
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '1.2rem', fontWeight: 500 }
              }}
            />
            <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Tooltip title="Due Date">
              <Chip 
                icon={<AccessTimeIcon />} 
                label={dueDate ? format(dueDate, 'MMM d, yyyy') : 'No due date'} 
                size="small"
                color={dueDate ? "primary" : "default"}
                variant={dueDate ? "filled" : "outlined"}
              />
            </Tooltip>
            
            <Tooltip title="Category">
              <Chip 
                icon={<FolderIcon />} 
                label={categories.find(c => c.id === categoryId)?.name || "No Category"} 
                size="small"
                color={categoryId ? "primary" : "default"}
                variant={categoryId ? "filled" : "outlined"}
              />
            </Tooltip>
            
            <Tooltip title="Priority">
              <Chip 
                icon={<FlagIcon />} 
                label={priority.charAt(0).toUpperCase() + priority.slice(1)} 
                size="small"
                sx={{ 
                  bgcolor: getPriorityColor(priority),
                  color: 'white',
                  '&:hover': { bgcolor: getPriorityColor(priority) }
                }}
              />
            </Tooltip>
            
            {selectedTags.length > 0 && (
              <Tooltip title="Tags">
                <Chip 
                  icon={<LabelIcon />} 
                  label={`${selectedTags.length} Tags`} 
                  size="small"
                  color="secondary"
                />
              </Tooltip>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                startIcon={<AccessTimeIcon />}
                onClick={() => setDueDate(dueDate ? null : startOfDay(new Date()))}
                color={dueDate ? "primary" : "inherit"}
                variant={dueDate ? "contained" : "outlined"}
              >
                {dueDate ? format(dueDate, 'MMM d') : 'Add due date'}
              </Button>
              
              <Button 
                size="small" 
                startIcon={<FolderIcon />}
                onClick={() => setCategoryId(categoryId ? '' : categories[0]?.id || '')}
                color={categoryId ? "primary" : "inherit"}
                variant={categoryId ? "contained" : "outlined"}
              >
                {categoryId ? categories.find(c => c.id === categoryId)?.name : 'Add category'}
              </Button>
              
              <Button 
                size="small" 
                startIcon={<FlagIcon />}
                onClick={() => setPriority(priority === 'medium' ? 'high' : 'medium')}
                color={priority === 'high' ? "error" : priority === 'low' ? "success" : "warning"}
                variant="outlined"
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Button>
              
              <Button 
                size="small" 
                startIcon={<LabelIcon />}
                onClick={() => setSelectedTags(selectedTags.length > 0 ? [] : [tags[0]?.name || ''])}
                color={selectedTags.length > 0 ? "secondary" : "inherit"}
                variant={selectedTags.length > 0 ? "contained" : "outlined"}
              >
                {selectedTags.length > 0 ? `${selectedTags.length} Tags` : 'Add tags'}
              </Button>
            </Box>
            
            {/* Description */}
            <Box>
              <Button 
                size="small" 
                startIcon={<NotesIcon />}
                onClick={() => toggleSection('description')}
                color={showDescription ? "primary" : "inherit"}
                variant="text"
                sx={{ justifyContent: 'flex-start', pl: 0 }}
              >
                {showDescription ? 'Hide description' : 'Add description'}
              </Button>
              
              {showDescription && (
                <TextField
                  placeholder="Add a description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
            
            {/* Subtasks */}
            <Box>
              <Button 
                size="small" 
                startIcon={<SubtitlesIcon />}
                onClick={() => toggleSection('subtasks')}
                color={showSubtasks ? "primary" : "inherit"}
                variant="text"
                sx={{ justifyContent: 'flex-start', pl: 0 }}
              >
                {showSubtasks ? 'Hide subtasks' : 'Add subtasks'}
              </Button>
              
              {showSubtasks && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      placeholder="Add a subtask..."
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      fullWidth
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                    />
                    <IconButton onClick={handleAddSubtask} color="primary" size="small">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  
                  <List dense>
                    {subtasks.map((subtask) => (
                      <ListItem key={subtask.id} sx={{ py: 0.5 }}>
                        <ListItemText primary={subtask.title} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
            
            {/* Notes */}
            <Box>
              <Button 
                size="small" 
                startIcon={<NotesIcon />}
                onClick={() => toggleSection('notes')}
                color={showNotes ? "primary" : "inherit"}
                variant="text"
                sx={{ justifyContent: 'flex-start', pl: 0 }}
              >
                {showNotes ? 'Hide notes' : 'Add notes'}
              </Button>
              
              {showNotes && (
                <TextField
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
            
            {/* Attachments */}
            <Box>
              <Button 
                size="small" 
                startIcon={<AttachFileIcon />}
                onClick={() => toggleSection('attachments')}
                color={showAttachments ? "primary" : "inherit"}
                variant="text"
                sx={{ justifyContent: 'flex-start', pl: 0 }}
              >
                {showAttachments ? 'Hide attachments' : 'Add attachments'}
              </Button>
              
              {showAttachments && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    size="small"
                    sx={{ mb: 1 }}
                  >
                    Add Files
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleFileUpload}
                    />
                  </Button>
                  
                  <List dense>
                    {attachments.map((attachment) => (
                      <ListItem key={attachment.id} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={attachment.name}
                          secondary={`${(attachment.size / 1024).toFixed(1)} KB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => setAttachments(prev => 
                              prev.filter(a => a.id !== attachment.id)
                            )}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            startIcon={<CheckIcon />}
          >
            {initialTask ? 'Save' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal; 