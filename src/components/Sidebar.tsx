import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  Typography,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Inbox as InboxIcon,
  Event as EventIcon,
  CalendarMonth as CalendarIcon,
  LocalOffer as TagIcon,
  CheckCircle as CompletedIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  darkMode,
  onToggleDarkMode,
  onLogout,
  userName,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Today's Tasks", icon: <InboxIcon />, path: "/" },
    { text: "Upcoming", icon: <EventIcon />, path: "/upcoming" },
    { text: "Calendar", icon: <CalendarIcon />, path: "/calendar" },
    { text: "Tags", icon: <TagIcon />, path: "/tags" },
    { text: "Completed", icon: <CompletedIcon />, path: "/completed" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 60 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 60 : 240,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
        <IconButton onClick={onToggleCollapse}>
          {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              background: 'linear-gradient(45deg, #4a90e2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            2DU
          </Typography>
        )}
      </Box>
      <Divider />
      {!isCollapsed && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {userName || 'User'}
          </Typography>
        </Box>
      )}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 1 }}>
        <IconButton onClick={onToggleDarkMode} sx={{ mb: 1 }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton onClick={onLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 