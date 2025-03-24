import { Card, CardContent, CardActions, Typography, Button, Box, Divider, Chip } from '@mui/material';
import { GardenBed } from '../../types';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GrassIcon from '@mui/icons-material/Grass';

interface BedCardProps {
  bed: GardenBed;
  onEdit: (bed: GardenBed) => void;
  onDelete: (bedId: string) => void;
}

const BedCard = ({ bed, onEdit, onDelete }: BedCardProps) => {
  const navigate = useNavigate();

  // Format date in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: new Date().getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  };
  
  return (
    <Card 
      sx={{ mb: 2, width: '100%' }}
      className="fade-in garden-pattern-bg"
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GrassIcon 
            color="primary" 
            sx={{ mr: 1, opacity: 0.8 }}
          />
          <Typography 
            variant="h3" 
            component="h2"
            sx={{ fontWeight: 500 }}
          >
            {bed.name}
          </Typography>
        </Box>
        
        {bed.notes && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mt: 1, 
              mb: 2,
              fontStyle: 'italic',
              pl: 0.5,
              borderLeft: '3px solid',
              borderColor: 'primary.light',
              py: 0.2,
              whiteSpace: 'pre-line' // Preserve line breaks
            }}
          >
            {bed.notes}
          </Typography>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            label={`Updated: ${formatDate(bed.updatedAt)}`}
            size="small"
            variant="outlined"
            sx={{ 
              fontSize: '0.7rem',
              height: '22px'
            }}
          />
        </Box>
      </CardContent>
      
      <Divider sx={{ opacity: 0.6, mx: 2 }} />
      
      <CardActions>
        <Button 
          size="small" 
          color="primary"
          variant="contained"
          onClick={() => navigate(`/beds/${bed.id}`)}
          startIcon={<ListAltIcon />}
          sx={{ flex: 1 }}
        >
          View Activities
        </Button>
        <Button 
          size="small" 
          onClick={() => onEdit(bed)}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          color="error" 
          onClick={() => onDelete(bed.id)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default BedCard; 