import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import SheetConfig from '../components/settings/SheetConfig';
import { SheetService } from '../services/SheetService';

const SettingsPage: React.FC = () => {
  const isConfigured = SheetService.isConfigured();
  
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Google Sheets Integration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {isConfigured 
            ? 'Your garden tracker is connected to Google Sheets via Sheet.Best.' 
            : 'Connect your garden tracker to Google Sheets for data persistence.'}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <SheetConfig />
      </Box>
    </Container>
  );
};

export default SettingsPage; 