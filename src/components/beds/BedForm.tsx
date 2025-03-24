import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box
} from '@mui/material';
import { GardenBed } from '../../types';

interface BedFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (bedData: Omit<GardenBed, 'id' | 'createdAt' | 'updatedAt'>) => void;
  bed?: GardenBed;
  isEdit?: boolean;
}

const BedForm = ({ open, onClose, onSave, bed, isEdit = false }: BedFormProps) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (bed) {
      setName(bed.name);
      setNotes(bed.notes || '');
    } else {
      setName('');
      setNotes('');
    }
  }, [bed, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    
    onSave({
      name: name.trim(),
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
      <DialogTitle>{isEdit ? 'Edit Garden Bed' : 'Add New Garden Bed'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Bed Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            error={!!nameError}
            helperText={nameError}
            required
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

export default BedForm; 