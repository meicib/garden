import axios from 'axios';
import { GardenBed, GardenActivity } from '../types';

// Configuration settings for Google Sheets
interface SheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  bedSheetName: string;
  activitySheetName: string;
}

// Get configuration from localStorage
const getConfig = (): SheetsConfig => {
  return {
    apiKey: localStorage.getItem('GOOGLE_API_KEY') || '',
    spreadsheetId: localStorage.getItem('SPREADSHEET_ID') || '',
    bedSheetName: localStorage.getItem('BED_SHEET_NAME') || 'Beds',
    activitySheetName: localStorage.getItem('ACTIVITY_SHEET_NAME') || 'Activities'
  };
};

// Helper functions for Google Sheets
const sheetsHelpers = {
  // Convert a range of values from Google Sheets to an array of objects
  valuesToObjects: <T>(values: any[][]): T[] => {
    if (!values || values.length <= 1) return [];
    
    const headers = values[0];
    return values.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? row[index] : '';
      });
      return obj as T;
    });
  },
  
  // Convert an object to a row of values based on headers
  objectToRow: (obj: any, headers: string[]): any[] => {
    return headers.map(header => obj[header] !== undefined ? obj[header] : '');
  },
  
  // Get the headers from the sheet
  getHeaders: async (sheetName: string): Promise<string[]> => {
    const config = getConfig();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${sheetName}!1:1?key=${config.apiKey}`;
    
    try {
      const response = await axios.get(url);
      return response.data.values[0];
    } catch (error) {
      console.error(`Error fetching headers for ${sheetName}:`, error);
      throw error;
    }
  },
  
  // Find row index by ID
  findRowIndexById: async (sheetName: string, id: string): Promise<number> => {
    const config = getConfig();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${sheetName}?key=${config.apiKey}`;
    
    try {
      const response = await axios.get(url);
      const values = response.data.values;
      if (!values || values.length <= 1) return -1;
      
      const headers = values[0];
      const idColumnIndex = headers.indexOf('id');
      
      if (idColumnIndex === -1) return -1;
      
      for (let i = 1; i < values.length; i++) {
        if (values[i][idColumnIndex] === id) {
          return i + 1; // Google Sheets is 1-indexed
        }
      }
      
      return -1;
    } catch (error) {
      console.error(`Error finding row index for ID ${id} in ${sheetName}:`, error);
      throw error;
    }
  }
};

// Service for interacting with Google Sheets API directly
export const GoogleSheetsService = {
  // Beds API methods
  beds: {
    // Get all beds
    getAll: async (): Promise<GardenBed[]> => {
      try {
        const config = getConfig();
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.bedSheetName}?key=${config.apiKey}`;
        
        const response = await axios.get(url);
        return sheetsHelpers.valuesToObjects<GardenBed>(response.data.values);
      } catch (error) {
        console.error('Error fetching beds:', error);
        throw error;
      }
    },
    
    // Get a single bed by ID
    getById: async (id: string): Promise<GardenBed | null> => {
      try {
        const beds = await GoogleSheetsService.beds.getAll();
        const bed = beds.find(bed => bed.id === id);
        return bed || null;
      } catch (error) {
        console.error(`Error fetching bed with ID ${id}:`, error);
        throw error;
      }
    },
    
    // Create a new bed
    create: async (bed: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>): Promise<GardenBed> => {
      try {
        const config = getConfig();
        const headers = await sheetsHelpers.getHeaders(config.bedSheetName);
        
        const now = new Date().toISOString();
        const newBed: GardenBed = {
          ...bed,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        };
        
        const rowValues = sheetsHelpers.objectToRow(newBed, headers);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.bedSheetName}!A:${String.fromCharCode(65 + headers.length - 1)}:append?valueInputOption=RAW&key=${config.apiKey}`;
        
        await axios.post(url, {
          values: [rowValues]
        });
        
        return newBed;
      } catch (error) {
        console.error('Error creating bed:', error);
        throw error;
      }
    },
    
    // Update an existing bed
    update: async (bed: GardenBed): Promise<GardenBed> => {
      try {
        const config = getConfig();
        const headers = await sheetsHelpers.getHeaders(config.bedSheetName);
        const rowIndex = await sheetsHelpers.findRowIndexById(config.bedSheetName, bed.id);
        
        if (rowIndex === -1) {
          throw new Error(`Bed with ID ${bed.id} not found`);
        }
        
        const updatedBed = {
          ...bed,
          updatedAt: new Date().toISOString(),
        };
        
        const rowValues = sheetsHelpers.objectToRow(updatedBed, headers);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.bedSheetName}!A${rowIndex}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex}?valueInputOption=RAW&key=${config.apiKey}`;
        
        await axios.put(url, {
          values: [rowValues]
        });
        
        return updatedBed;
      } catch (error) {
        console.error(`Error updating bed with ID ${bed.id}:`, error);
        throw error;
      }
    },
    
    // Delete a bed
    delete: async (id: string): Promise<void> => {
      try {
        const config = getConfig();
        const rowIndex = await sheetsHelpers.findRowIndexById(config.bedSheetName, id);
        
        if (rowIndex === -1) {
          throw new Error(`Bed with ID ${id} not found`);
        }
        
        // To "delete" a row in Google Sheets API, we'll actually just clear it
        // Since the API doesn't have a direct delete operation
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.bedSheetName}!A${rowIndex}:Z${rowIndex}:clear?key=${config.apiKey}`;
        
        await axios.post(url);
      } catch (error) {
        console.error(`Error deleting bed with ID ${id}:`, error);
        throw error;
      }
    },
  },
  
  // Activities API methods
  activities: {
    // Get all activities
    getAll: async (): Promise<GardenActivity[]> => {
      try {
        const config = getConfig();
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.activitySheetName}?key=${config.apiKey}`;
        
        const response = await axios.get(url);
        return sheetsHelpers.valuesToObjects<GardenActivity>(response.data.values);
      } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
    },
    
    // Get activities for a specific bed
    getByBedId: async (bedId: string): Promise<GardenActivity[]> => {
      try {
        const activities = await GoogleSheetsService.activities.getAll();
        return activities.filter(activity => activity.bedId === bedId);
      } catch (error) {
        console.error(`Error fetching activities for bed ID ${bedId}:`, error);
        throw error;
      }
    },
    
    // Create a new activity
    create: async (activity: Omit<GardenActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<GardenActivity> => {
      try {
        const config = getConfig();
        const headers = await sheetsHelpers.getHeaders(config.activitySheetName);
        
        const now = new Date().toISOString();
        const newActivity: GardenActivity = {
          ...activity,
          id: Date.now().toString(),
          createdAt: now,
          updatedAt: now,
        };
        
        const rowValues = sheetsHelpers.objectToRow(newActivity, headers);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.activitySheetName}!A:${String.fromCharCode(65 + headers.length - 1)}:append?valueInputOption=RAW&key=${config.apiKey}`;
        
        await axios.post(url, {
          values: [rowValues]
        });
        
        return newActivity;
      } catch (error) {
        console.error('Error creating activity:', error);
        throw error;
      }
    },
    
    // Update an existing activity
    update: async (activity: GardenActivity): Promise<GardenActivity> => {
      try {
        const config = getConfig();
        const headers = await sheetsHelpers.getHeaders(config.activitySheetName);
        const rowIndex = await sheetsHelpers.findRowIndexById(config.activitySheetName, activity.id);
        
        if (rowIndex === -1) {
          throw new Error(`Activity with ID ${activity.id} not found`);
        }
        
        const updatedActivity = {
          ...activity,
          updatedAt: new Date().toISOString(),
        };
        
        const rowValues = sheetsHelpers.objectToRow(updatedActivity, headers);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.activitySheetName}!A${rowIndex}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex}?valueInputOption=RAW&key=${config.apiKey}`;
        
        await axios.put(url, {
          values: [rowValues]
        });
        
        return updatedActivity;
      } catch (error) {
        console.error(`Error updating activity with ID ${activity.id}:`, error);
        throw error;
      }
    },
    
    // Delete an activity
    delete: async (id: string): Promise<void> => {
      try {
        const config = getConfig();
        const rowIndex = await sheetsHelpers.findRowIndexById(config.activitySheetName, id);
        
        if (rowIndex === -1) {
          throw new Error(`Activity with ID ${id} not found`);
        }
        
        // Clear the row to "delete" it
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.activitySheetName}!A${rowIndex}:Z${rowIndex}:clear?key=${config.apiKey}`;
        
        await axios.post(url);
      } catch (error) {
        console.error(`Error deleting activity with ID ${id}:`, error);
        throw error;
      }
    },
  },
  
  // Check if the service is configured
  isConfigured: (): boolean => {
    const config = getConfig();
    return !!config.apiKey && !!config.spreadsheetId;
  }
}; 