import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { GardenProvider } from './contexts/GardenContext';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BedsPage from './pages/BedsPage';
import BedDetailPage from './pages/BedDetailPage';
import SettingsPage from './pages/SettingsPage';
import { GoogleSheetsService } from './services/GoogleSheetsService';

// Reset default styles
import './App.css';

function App() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  
  // Check if Google Sheets is configured
  useEffect(() => {
    setIsConfigured(GoogleSheetsService.isConfigured());
  }, []);
  
  return (
    <ThemeProvider>
      <GardenProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<BedsPage />} />
              <Route path="/beds/:bedId" element={<BedDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Redirect to settings if not configured and not already on settings */}
              {isConfigured === false && window.location.pathname !== '/settings' && (
                <Route path="*" element={<SettingsPage />} />
              )}
            </Routes>
          </Layout>
        </Router>
      </GardenProvider>
    </ThemeProvider>
  );
}

export default App;
