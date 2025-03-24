import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Fab, 
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Paper,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ActivityCard from '../components/activities/ActivityCard';
import ActivityForm from '../components/activities/ActivityForm';
import { useGarden } from '../contexts/GardenContext';
import { GardenActivity, ActivityType } from '../types';

const BedDetailPage = () => {
  const { bedId } = useParams<{ bedId: string }>();
  const navigate = useNavigate();
  const { beds, activities, loading, error, addActivity, updateActivity, deleteActivity, getActivitiesForBed } = useGarden();
  
  const [openForm, setOpenForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<GardenActivity | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  
  const bed = beds.find(b => b.id === bedId);
  const bedActivities = bedId ? getActivitiesForBed(bedId) : [];
  
  // Filter activities based on selected type
  const filteredActivities = filterType === 'all' 
    ? bedActivities 
    : bedActivities.filter(activity => activity.type === filterType);
  
  // Sort activities by date (newest first)
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  useEffect(() => {
    if (!bed && !loading && beds.length > 0) {
      // Bed not found, redirect to beds list
      navigate('/');
    }
  }, [bed, loading, beds, navigate]);

  const handleAddClick = () => {
    setSelectedActivity(undefined);
    setOpenForm(true);
  };

  const handleEditClick = (activity: GardenActivity) => {
    setSelectedActivity(activity);
    setOpenForm(true);
  };

  const handleDeleteClick = (activityId: string) => {
    setConfirmDelete(activityId);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await deleteActivity(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleSave = async (activityData: Omit<GardenActivity, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedActivity) {
      await updateActivity({
        ...selectedActivity,
        ...activityData,
      });
    } else {
      await addActivity(activityData);
    }
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: ActivityType | 'all' | null,
  ) => {
    if (newFilter !== null) {
      setFilterType(newFilter);
    }
  };

  if (loading || !bed) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pb: 7 }}>
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            edge="start" 
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h1" component="h1">
            {bed.name}
          </Typography>
        </Box>
        
        {bed.notes && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary">
              {bed.notes}
            </Typography>
          </Paper>
        )}
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" component="h2" gutterBottom>
            Activities
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
              value={filterType}
              exclusive
              onChange={handleFilterChange}
              aria-label="activity filter"
              size="small"
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                '& .MuiToggleButtonGroup-grouped': {
                  border: 1,
                  borderColor: 'divider',
                  m: 0.5,
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="water">Water</ToggleButton>
              <ToggleButton value="plant">Plant</ToggleButton>
              <ToggleButton value="fertilize">Fertilize</ToggleButton>
              <ToggleButton value="harvest">Harvest</ToggleButton>
              <ToggleButton value="other">Other</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          {sortedActivities.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="body1" gutterBottom>
                No activities recorded yet.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddClick}
                sx={{ mt: 2 }}
              >
                Add Activity
              </Button>
            </Box>
          ) : (
            <Box>
              {sortedActivities.map(activity => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Floating action button for adding new activity */}
      {sortedActivities.length > 0 && (
        <Fab 
          color="primary" 
          aria-label="add activity" 
          onClick={handleAddClick}
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 20 
          }}
        >
          <AddIcon />
        </Fab>
      )}
      
      {/* Activity Form Dialog */}
      {bedId && (
        <ActivityForm 
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSave={handleSave}
          activity={selectedActivity}
          bedId={bedId}
          isEdit={!!selectedActivity}
        />
      )}
      
      {/* Confirmation Dialog */}
      <Snackbar
        open={!!confirmDelete}
        autoHideDuration={6000}
        onClose={() => setConfirmDelete(null)}
      >
        <Alert 
          severity="warning"
          action={
            <>
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                color="error" 
                size="small" 
                onClick={handleConfirmDelete}
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete this activity?
        </Alert>
      </Snackbar>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BedDetailPage; 