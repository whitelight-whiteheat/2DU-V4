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
  useMediaQuery,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const drawerWidth = 240;
const collapsedDrawerWidth = 80;

const menuItems = [
  { text: 'Today', icon: <InboxIcon />, path: '/' },
  { text: 'Upcoming', icon: <EventIcon />, path: '/upcoming' },
  { text: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendar' },
  { text: 'Tags', icon: <LocalOfferIcon />, path: '/tags' },
  { text: 'Completed', icon: <CheckCircleIcon />, path: '/completed' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const renderLogo = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        position: 'relative',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
          fontSize: '1.5rem',
        }}
      >
        2DU
      </Typography>
      <IconButton
        onClick={onToggleCollapse}
        size="small"
        sx={{
          position: 'absolute',
          right: isCollapsed ? -1 : -1,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: 1,
          width: 16,
          height: 16,
          '&:hover': {
            bgcolor: 'background.paper',
            borderColor: '#4a90e2',
            color: '#4a90e2',
            transform: 'translateY(-50%) scale(1.02)',
          },
          zIndex: 1,
          '& .MuiSvgIcon-root': {
            fontSize: '0.7rem',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: 'border-box',
          borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          overflowX: 'hidden',
        },
      }}
    >
      {renderLogo()}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={isCollapsed ? item.text : ''}
            placement="right"
          >
            <ListItem
              button
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 40,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2,
                borderRadius: 6,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(74, 144, 226, 0.15)' 
                    : 'rgba(74, 144, 226, 0.08)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(74, 144, 226, 0.2)' 
                      : 'rgba(74, 144, 226, 0.12)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#4a90e2',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#4a90e2',
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.04)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 'auto' : 2,
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#4a90e2' : 'text.primary',
                  transition: 'color 0.2s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: location.pathname === item.path ? '#4a90e2' : 'text.primary',
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 500 : 400,
                    },
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 