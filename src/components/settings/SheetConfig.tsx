import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  AlertTitle,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

// Get the API URLs from localStorage or use empty strings
const getStoredUrls = () => {
  const bedsUrl = localStorage.getItem('BEDS_API_URL') || '';
  const activitiesUrl = localStorage.getItem('ACTIVITIES_API_URL') || '';
  return { bedsUrl, activitiesUrl };
};

// Save the API URLs to localStorage
const saveUrlsToStorage = (bedsUrl: string, activitiesUrl: string) => {
  localStorage.setItem('BEDS_API_URL', bedsUrl);
  localStorage.setItem('ACTIVITIES_API_URL', activitiesUrl);
};

const SheetConfig: React.FC = () => {
  const [bedsUrl, setBedsUrl] = useState('');
  const [activitiesUrl, setActivitiesUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load stored URLs on component mount
  useEffect(() => {
    const { bedsUrl, activitiesUrl } = getStoredUrls();
    setBedsUrl(bedsUrl);
    setActivitiesUrl(activitiesUrl);
    setIsConfigured(bedsUrl !== '' && activitiesUrl !== '');
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);
      
      // Validate URLs
      if (!bedsUrl || !activitiesUrl) {
        setError('Both URLs are required');
        return;
      }
      
      if (!bedsUrl.includes('sheet.best') || !activitiesUrl.includes('sheet.best')) {
        setError('URLs must be from Sheet.Best service');
        return;
      }
      
      // Save to localStorage
      saveUrlsToStorage(bedsUrl, activitiesUrl);
      
      // Show success message and update state
      setSuccess(true);
      setIsConfigured(true);
      
      // Reload the app after a brief delay to apply new config
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Google Sheets Configuration
      </Typography>
      
      <Typography variant="body1" paragraph>
        Connect your garden tracker to Google Sheets using Sheet.Best API.
      </Typography>
      
      {isConfigured && !success && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Sheet.Best Already Configured</AlertTitle>
          You can update your configuration below if needed.
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Configuration Saved!</AlertTitle>
          Reloading application to apply changes...
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Setup Instructions:
        </Typography>
        <ol>
          <li>Go to <a href="https://sheet.best" target="_blank" rel="noopener noreferrer">Sheet.Best</a> and create an account</li>
          <li>Create a Google Sheet with two tabs: "Beds" and "Activities"</li>
          <li>In the "Beds" tab, add these headers: id, name, notes, createdAt, updatedAt</li>
          <li>In the "Activities" tab, add these headers: id, bedId, type, date, notes, createdAt, updatedAt</li>
          <li>Create a new connection in Sheet.Best and connect to your Google Sheet</li>
          <li>Copy the API URLs and paste them below (one for each tab)</li>
        </ol>
      </Box>
      
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Beds API URL"
          fullWidth
          value={bedsUrl}
          onChange={(e) => setBedsUrl(e.target.value)}
          placeholder="https://sheet.best/api/sheets/YOUR_CONNECTION_ID/tabs/Beds"
          helperText="The Sheet.Best API URL for your Beds sheet"
          required
        />
        
        <TextField
          label="Activities API URL"
          fullWidth
          value={activitiesUrl}
          onChange={(e) => setActivitiesUrl(e.target.value)}
          placeholder="https://sheet.best/api/sheets/YOUR_CONNECTION_ID/tabs/Activities"
          helperText="The Sheet.Best API URL for your Activities sheet"
          required
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSaving}
          startIcon={success ? <CloudDoneIcon /> : <SaveIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Configuration'}
        </Button>
      </Box>
    </Paper>
  );
};

export default SheetConfig; 