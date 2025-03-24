import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { GardenActivity, ActivityType } from '../../types';

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (activityData: Omit<GardenActivity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  activity?: GardenActivity;
  bedId: string;
  isEdit?: boolean;
}

const ActivityForm = ({ open, onClose, onSave, activity, bedId, isEdit = false }: ActivityFormProps) => {
  const [type, setType] = useState<ActivityType>('water');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [typeError, setTypeError] = useState('');

  useEffect(() => {
    if (activity) {
      setType(activity.type);
      // Convert ISO date to YYYY-MM-DD for date input
      const formattedDate = new Date(activity.date).toISOString().split('T')[0];
      setDate(formattedDate);
      setNotes(activity.notes || '');
    } else {
      setType('water');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [activity, open]);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as ActivityType);
    setTypeError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!type) {
      setTypeError('Activity type is required');
      return;
    }
    
    onSave({
      bedId,
      type,
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
    });
    
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{isEdit ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl 
            fullWidth 
            variant="outlined" 
            margin="dense" 
            error={!!typeError}
            sx={{ mb: 2 }}
          >
            <InputLabel id="activity-type-label">Activity Type</InputLabel>
            <Select
              labelId="activity-type-label"
              id="activity-type"
              value={type}
              onChange={handleTypeChange}
              label="Activity Type"
              required
            >
              <MenuItem value="water">Water</MenuItem>
              <MenuItem value="plant">Plant</MenuItem>
              <MenuItem value="fertilize">Fertilize</MenuItem>
              <MenuItem value="harvest">Harvest</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {typeError && <div className="error">{typeError}</div>}
          </FormControl>
          
          <TextField
            margin="dense"
            id="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="notes"
            label="Notes (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ActivityForm; 