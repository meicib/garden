import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Fab, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BedCard from '../components/beds/BedCard';
import BedForm from '../components/beds/BedForm';
import { useGarden } from '../contexts/GardenContext';
import { GardenBed } from '../types';

const BedsPage = () => {
  const { beds, loading, error, addBed, updateBed, deleteBed } = useGarden();
  const [openForm, setOpenForm] = useState(false);
  const [selectedBed, setSelectedBed] = useState<GardenBed | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAddClick = () => {
    setSelectedBed(undefined);
    setOpenForm(true);
  };

  const handleEditClick = (bed: GardenBed) => {
    setSelectedBed(bed);
    setOpenForm(true);
  };

  const handleDeleteClick = (bedId: string) => {
    setConfirmDelete(bedId);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await deleteBed(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleSave = async (bedData: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedBed) {
      await updateBed({
        ...selectedBed,
        ...bedData,
      });
    } else {
      await addBed(bedData);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 7 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Garden Beds
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {beds.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="body1" gutterBottom>
              No garden beds yet! Add your first one.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ mt: 2 }}
            >
              Add Garden Bed
            </Button>
          </Box>
        ) : (
          <Box>
            {beds.map(bed => (
              <BedCard 
                key={bed.id} 
                bed={bed}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </Box>
        )}
      </Box>
      
      {/* Floating action button for adding new bed */}
      {beds.length > 0 && (
        <Fab 
          color="primary" 
          aria-label="add" 
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
      
      {/* Bed Form Dialog */}
      <BedForm 
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        bed={selectedBed}
        isEdit={!!selectedBed}
      />
      
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
          Are you sure you want to delete this garden bed?
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

export default BedsPage; 