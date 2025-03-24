import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GardenBed, GardenActivity } from '../types';
import { SheetService } from '../services/SheetService';

interface GardenContextType {
  beds: GardenBed[];
  activities: GardenActivity[];
  loading: boolean;
  error: string | null;
  addBed: (bed: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBed: (bed: GardenBed) => Promise<void>;
  deleteBed: (bedId: string) => Promise<void>;
  addActivity: (activity: Omit<GardenActivity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivity: (activity: GardenActivity) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  getActivitiesForBed: (bedId: string) => GardenActivity[];
  refreshData: () => Promise<void>;
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

// Fallback data in case of API failures
const fallbackBeds: GardenBed[] = [
  {
    id: '1',
    name: 'Tomato Bed',
    notes: 'South facing, good drainage',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Herb Garden',
    notes: 'Partial shade, needs more water',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const fallbackActivities: GardenActivity[] = [
  {
    id: '1',
    bedId: '1',
    type: 'plant',
    date: new Date().toISOString(),
    notes: 'Planted Roma tomatoes, 6 plants',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    bedId: '1',
    type: 'water',
    date: new Date().toISOString(),
    notes: 'Deep watering',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface GardenProviderProps {
  children: ReactNode;
}

export const GardenProvider = ({ children }: GardenProviderProps) => {
  const [beds, setBeds] = useState<GardenBed[]>([]);
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to fetch all data from the API
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch beds
      const bedsData = await SheetService.beds.getAll();
      setBeds(bedsData);
      
      // Fetch activities
      const activitiesData = await SheetService.activities.getAll();
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load garden data. Using offline data instead.');
      
      // If API fails, use fallback data
      if (beds.length === 0) setBeds(fallbackBeds);
      if (activities.length === 0) setActivities(fallbackActivities);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (!isInitialized) {
      refreshData();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addBed = async (bedData: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create bed in the sheet
      const newBed = await SheetService.beds.create(bedData);
      
      // Update local state
      setBeds([...beds, newBed]);
      setLoading(false);
    } catch (err) {
      console.error('Failed to add garden bed:', err);
      setError('Failed to add garden bed');
      setLoading(false);
    }
  };

  const updateBed = async (updatedBed: GardenBed) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update bed in the sheet
      await SheetService.beds.update(updatedBed);
      
      // Update local state
      setBeds(beds.map(bed => bed.id === updatedBed.id ? {
        ...updatedBed,
        updatedAt: new Date().toISOString()
      } : bed));
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to update garden bed:', err);
      setError('Failed to update garden bed');
      setLoading(false);
    }
  };

  const deleteBed = async (bedId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete bed from the sheet
      await SheetService.beds.delete(bedId);
      
      // Update local state
      setBeds(beds.filter(bed => bed.id !== bedId));
      
      // Delete all activities for this bed
      const activitiesToDelete = activities.filter(activity => activity.bedId === bedId);
      for (const activity of activitiesToDelete) {
        await SheetService.activities.delete(activity.id);
      }
      
      // Update local activities state
      setActivities(activities.filter(activity => activity.bedId !== bedId));
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to delete garden bed:', err);
      setError('Failed to delete garden bed');
      setLoading(false);
    }
  };

  const addActivity = async (activityData: Omit<GardenActivity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create activity in the sheet
      const newActivity = await SheetService.activities.create(activityData);
      
      // Update local state
      setActivities([...activities, newActivity]);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to add activity:', err);
      setError('Failed to add activity');
      setLoading(false);
    }
  };

  const updateActivity = async (updatedActivity: GardenActivity) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update activity in the sheet
      await SheetService.activities.update(updatedActivity);
      
      // Update local state
      setActivities(activities.map(activity => 
        activity.id === updatedActivity.id ? {
          ...updatedActivity,
          updatedAt: new Date().toISOString()
        } : activity
      ));
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to update activity:', err);
      setError('Failed to update activity');
      setLoading(false);
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete activity from the sheet
      await SheetService.activities.delete(activityId);
      
      // Update local state
      setActivities(activities.filter(activity => activity.id !== activityId));
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to delete activity:', err);
      setError('Failed to delete activity');
      setLoading(false);
    }
  };

  const getActivitiesForBed = (bedId: string) => {
    return activities.filter(activity => activity.bedId === bedId);
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <GardenContext.Provider
      value={{
        beds,
        activities,
        loading,
        error,
        addBed,
        updateBed,
        deleteBed,
        addActivity,
        updateActivity,
        deleteActivity,
        getActivitiesForBed,
        refreshData
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
}; 