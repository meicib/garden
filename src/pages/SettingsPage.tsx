import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import GoogleSheetsConfig from '../components/settings/GoogleSheetsConfig';
import { GoogleSheetsService } from '../services/GoogleSheetsService';

const SettingsPage: React.FC = () => {
  const isConfigured = GoogleSheetsService.isConfigured();
  
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
            ? 'Your garden tracker is connected to Google Sheets.' 
            : 'Connect your garden tracker directly to Google Sheets for data persistence.'}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <GoogleSheetsConfig />
      </Box>
    </Container>
  );
};

export default SettingsPage; 