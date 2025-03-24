// Garden bed interface
export interface GardenBed {
  id: string;
  name: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity types
export type ActivityType = 'plant' | 'water' | 'fertilize' | 'harvest' | 'other';

// Garden activity interface
export interface GardenActivity {
  id: string;
  bedId: string;
  type: ActivityType;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Plant data (for planting activities)
export interface PlantData {
  name: string;
  variety?: string;
  quantity?: number;
}

// Harvest data (for harvest activities)
export interface HarvestData {
  plantName: string;
  quantity?: number;
  unit?: string;
} 