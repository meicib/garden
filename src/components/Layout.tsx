import { ReactNode } from 'react';
import { 
  Box, 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';
import ScienceIcon from '@mui/icons-material/Science';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode, mode } = useTheme();
  
  // Extract the base path for navigation highlighting
  const path = location.pathname.split('/')[1] || '';

  return (
    <Box sx={{ pb: 7, width: '100%', height: '100%' }}>
      {/* App Bar */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <GrassIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Garden Tracker
          </Typography>
          
          {/* Theme Toggle Button */}
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton 
              color="inherit" 
              onClick={toggleColorMode}
              aria-label="toggle dark/light mode"
              edge="end"
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Box sx={{ width: '100%', maxWidth: '100%', pb: 8 }}>
        {children}
      </Box>
      
      {/* Bottom Navigation for Mobile */}
      <Paper 
        sx={{ 
          width: '100%', 
          position: 'fixed', 
          bottom: 0, 
          boxShadow: '0px -2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        <BottomNavigation
          value={path}
          onChange={(_, newValue) => {
            navigate('/' + newValue);
          }}
          showLabels
        >
          <BottomNavigationAction 
            label="Garden Beds" 
            value="" 
            icon={<LocalFloristIcon />} 
          />
          <BottomNavigationAction 
            label="Settings" 
            value="settings" 
            icon={<SettingsIcon />} 
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout; 