import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Stack, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TaskList from '../TaskList';

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

interface TagsViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
}

const TagsView: React.FC<TagsViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onEditTask,
}) => {
  const location = useLocation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Set selected tag from navigation state when component mounts
  useEffect(() => {
    const tagFromState = location.state?.selectedTag;
    if (tagFromState) {
      setSelectedTag(tagFromState);
    }
  }, [location.state]);

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      tasks.flatMap(task => task.tags.map(tag => tag.name))
    )
  );

  // Get tasks for selected tag
  const tasksForTag = selectedTag
    ? tasks.filter(task => task.tags.some(tag => tag.name === selectedTag))
    : [];

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tags
      </Typography>
      
      <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap" gap={1}>
        {allTags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            color={tag === selectedTag ? 'primary' : 'default'}
            sx={{ 
              m: 0.5,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          />
        ))}
      </Stack>

      {selectedTag ? (
        <>
          <Typography variant="h6" gutterBottom>
            Tasks with tag "{selectedTag}"
          </Typography>
          <TaskList
            tasks={tasksForTag}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
            onEditTask={onEditTask}
          />
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Select a tag to view associated tasks
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TagsView; 