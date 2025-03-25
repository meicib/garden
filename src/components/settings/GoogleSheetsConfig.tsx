import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  AlertTitle,
  CircularProgress,
  Link
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

// Get the configuration from localStorage
const getStoredConfig = () => {
  const apiKey = localStorage.getItem('GOOGLE_API_KEY') || '';
  const spreadsheetId = localStorage.getItem('SPREADSHEET_ID') || '';
  const bedSheetName = localStorage.getItem('BED_SHEET_NAME') || 'Beds';
  const activitySheetName = localStorage.getItem('ACTIVITY_SHEET_NAME') || 'Activities';
  
  return { apiKey, spreadsheetId, bedSheetName, activitySheetName };
};

// Save the configuration to localStorage
const saveConfigToStorage = (
  apiKey: string, 
  spreadsheetId: string, 
  bedSheetName: string, 
  activitySheetName: string
) => {
  localStorage.setItem('GOOGLE_API_KEY', apiKey);
  localStorage.setItem('SPREADSHEET_ID', spreadsheetId);
  localStorage.setItem('BED_SHEET_NAME', bedSheetName);
  localStorage.setItem('ACTIVITY_SHEET_NAME', activitySheetName);
};

const GoogleSheetsConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [bedSheetName, setBedSheetName] = useState('Beds');
  const [activitySheetName, setActivitySheetName] = useState('Activities');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load stored configuration on component mount
  useEffect(() => {
    const { apiKey, spreadsheetId, bedSheetName, activitySheetName } = getStoredConfig();
    setApiKey(apiKey);
    setSpreadsheetId(spreadsheetId);
    setBedSheetName(bedSheetName);
    setActivitySheetName(activitySheetName);
    setIsConfigured(apiKey !== '' && spreadsheetId !== '');
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);
      
      // Validate form
      if (!apiKey || !spreadsheetId) {
        setError('API Key and Spreadsheet ID are required');
        setIsSaving(false);
        return;
      }
      
      if (!bedSheetName || !activitySheetName) {
        setError('Sheet names are required');
        setIsSaving(false);
        return;
      }
      
      // Save to localStorage
      saveConfigToStorage(apiKey, spreadsheetId, bedSheetName, activitySheetName);
      
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
        Connect your garden tracker directly to Google Sheets using the Google Sheets API.
      </Typography>
      
      {isConfigured && !success && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Google Sheets Already Configured</AlertTitle>
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
          <li>Create a <Link href="https://docs.google.com/spreadsheets" target="_blank" rel="noopener noreferrer">Google Spreadsheet</Link></li>
          <li>Setup two sheets (tabs) named "Beds" and "Activities" (or customize the names below)</li>
          <li>In the "Beds" sheet, add these headers in the first row: id, name, notes, createdAt, updatedAt</li>
          <li>In the "Activities" sheet, add these headers: id, bedId, type, date, notes, createdAt, updatedAt</li>
          <li>Make the spreadsheet publicly accessible via File → Share → Anyone with the link → Viewer</li>
          <li>Create a <Link href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Project</Link> and enable the Google Sheets API</li>
          <li>Create an API key in the Google Cloud Console and restrict it to Google Sheets API</li>
          <li>Copy the Spreadsheet ID from your Google Sheet URL (it's the long string between /d/ and /edit in the URL)</li>
          <li>Enter the API Key and Spreadsheet ID below</li>
        </ol>
      </Box>
      
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Google Sheets API Key"
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIzaSyBOjs..."
          helperText="The API Key from Google Cloud Console"
          required
        />
        
        <TextField
          label="Spreadsheet ID"
          fullWidth
          value={spreadsheetId}
          onChange={(e) => setSpreadsheetId(e.target.value)}
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
          helperText="The ID from your Google Sheet URL"
          required
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Beds Sheet Name"
            value={bedSheetName}
            onChange={(e) => setBedSheetName(e.target.value)}
            helperText="Name of the sheet tab for garden beds"
            required
            sx={{ flex: 1 }}
          />
          
          <TextField
            label="Activities Sheet Name"
            value={activitySheetName}
            onChange={(e) => setActivitySheetName(e.target.value)}
            helperText="Name of the sheet tab for activities"
            required
            sx={{ flex: 1 }}
          />
        </Box>
        
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

export default GoogleSheetsConfig; 