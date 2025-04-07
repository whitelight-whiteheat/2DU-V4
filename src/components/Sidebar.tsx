import React, { useEffect } from 'react';
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
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';

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
  const { t } = useI18n();

  console.log('Sidebar rendering with props:', {
    isCollapsed,
    darkMode,
    userName,
    currentPath: location.pathname,
  });

  const menuItems = [
    { text: t('sidebar.today'), icon: <InboxIcon />, path: "/" },
    { text: t('sidebar.upcoming'), icon: <EventIcon />, path: "/upcoming" },
    { text: t('sidebar.calendar'), icon: <CalendarIcon />, path: "/calendar" },
    { text: t('sidebar.tags'), icon: <TagIcon />, path: "/tags" },
    { text: t('sidebar.completed'), icon: <CompletedIcon />, path: "/completed" },
    { text: t('sidebar.settings'), icon: <SettingsIcon />, path: "/settings" },
  ];

  useEffect(() => {
    console.log('Sidebar translations:', {
      today: t('sidebar.today'),
      upcoming: t('sidebar.upcoming'),
      calendar: t('sidebar.calendar'),
      tags: t('sidebar.tags'),
      completed: t('sidebar.completed'),
      settings: t('sidebar.settings'),
      welcome: t('sidebar.welcome', { userName: userName || t('sidebar.user') }),
    });
  }, [t, userName]);

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
            {t('sidebar.welcome', { userName: userName || t('sidebar.user') })}
          </Typography>
        </Box>
      )}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 2.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem
          button
          onClick={onToggleDarkMode}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isCollapsed ? 0 : 2,
              justifyContent: 'center',
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
          )}
        </ListItem>
        <ListItem
          button
          onClick={onLogout}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isCollapsed ? 0 : 2,
              justifyContent: 'center',
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Logout" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 