import axios from 'axios';
import { GardenBed, GardenActivity } from '../types';

// Get configuration from localStorage
const getConfig = () => {
  return {
    BEDS_API_URL: localStorage.getItem('BEDS_API_URL') || 'https://sheet.best/api/sheets/YOUR_CONNECTION_ID/tabs/Beds',
    ACTIVITIES_API_URL: localStorage.getItem('ACTIVITIES_API_URL') || 'https://sheet.best/api/sheets/YOUR_CONNECTION_ID/tabs/Activities',
  };
};

// Service for interacting with Google Sheets via Sheet.Best
export const SheetService = {
  // Beds API methods
  beds: {
    // Get all beds
    getAll: async (): Promise<GardenBed[]> => {
      try {
        const config = getConfig();
        const response = await axios.get(config.BEDS_API_URL);
        return response.data;
      } catch (error) {
        console.error('Error fetching beds:', error);
        throw error;
      }
    },
    
    // Get a single bed by ID
    getById: async (id: string): Promise<GardenBed | null> => {
      try {
        const config = getConfig();
        const response = await axios.get(`${config.BEDS_API_URL}/id/${id}`);
        return response.data[0] || null;
      } catch (error) {
        console.error(`Error fetching bed with ID ${id}:`, error);
        throw error;
      }
    },
    
    // Create a new bed
    create: async (bed: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>): Promise<GardenBed> => {
      try {
        const config = getConfig();
        const now = new Date().toISOString();
        const newBed: GardenBed = {
          ...bed,
          id: Date.now().toString(), // Generate a unique ID
          createdAt: now,
          updatedAt: now,
        };
        
        const response = await axios.post(config.BEDS_API_URL, newBed);
        return response.data;
      } catch (error) {
        console.error('Error creating bed:', error);
        throw error;
      }
    },
    
    // Update an existing bed
    update: async (bed: GardenBed): Promise<GardenBed> => {
      try {
        const config = getConfig();
        const updatedBed = {
          ...bed,
          updatedAt: new Date().toISOString(),
        };
        
        const response = await axios.put(`${config.BEDS_API_URL}/id/${bed.id}`, updatedBed);
        return response.data;
      } catch (error) {
        console.error(`Error updating bed with ID ${bed.id}:`, error);
        throw error;
      }
    },
    
    // Delete a bed
    delete: async (id: string): Promise<void> => {
      try {
        const config = getConfig();
        await axios.delete(`${config.BEDS_API_URL}/id/${id}`);
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
        const response = await axios.get(config.ACTIVITIES_API_URL);
        return response.data;
      } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
    },
    
    // Get activities for a specific bed
    getByBedId: async (bedId: string): Promise<GardenActivity[]> => {
      try {
        const config = getConfig();
        const response = await axios.get(`${config.ACTIVITIES_API_URL}/bedId/${bedId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching activities for bed ID ${bedId}:`, error);
        throw error;
      }
    },
    
    // Create a new activity
    create: async (activity: Omit<GardenActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<GardenActivity> => {
      try {
        const config = getConfig();
        const now = new Date().toISOString();
        const newActivity: GardenActivity = {
          ...activity,
          id: Date.now().toString(), // Generate a unique ID
          createdAt: now,
          updatedAt: now,
        };
        
        const response = await axios.post(config.ACTIVITIES_API_URL, newActivity);
        return response.data;
      } catch (error) {
        console.error('Error creating activity:', error);
        throw error;
      }
    },
    
    // Update an existing activity
    update: async (activity: GardenActivity): Promise<GardenActivity> => {
      try {
        const config = getConfig();
        const updatedActivity = {
          ...activity,
          updatedAt: new Date().toISOString(),
        };
        
        const response = await axios.put(`${config.ACTIVITIES_API_URL}/id/${activity.id}`, updatedActivity);
        return response.data;
      } catch (error) {
        console.error(`Error updating activity with ID ${activity.id}:`, error);
        throw error;
      }
    },
    
    // Delete an activity
    delete: async (id: string): Promise<void> => {
      try {
        const config = getConfig();
        await axios.delete(`${config.ACTIVITIES_API_URL}/id/${id}`);
      } catch (error) {
        console.error(`Error deleting activity with ID ${id}:`, error);
        throw error;
      }
    },
  },
  
  // Check if the service is configured
  isConfigured: (): boolean => {
    const bedsUrl = localStorage.getItem('BEDS_API_URL');
    const activitiesUrl = localStorage.getItem('ACTIVITIES_API_URL');
    return !!bedsUrl && !!activitiesUrl;
  }
}; 