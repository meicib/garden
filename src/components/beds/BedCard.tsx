import { Card, CardContent, CardActions, Typography, Button, Box, Divider, Chip, IconButton } from '@mui/material';
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

  // Format date in a more compact format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <Card 
      sx={{ mb: 1.5, width: '100%' }}
      className="fade-in"
    >
      <CardContent sx={{ py: 1, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GrassIcon 
            color="primary" 
            fontSize="small"
            sx={{ mr: 1, opacity: 0.8 }}
          />
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ fontWeight: 500 }}
          >
            {bed.name}
          </Typography>
          <Chip
            label={formatDate(bed.updatedAt)}
            size="small"
            variant="outlined"
            sx={{ 
              fontSize: '0.65rem',
              height: '20px',
              ml: 'auto'
            }}
          />
        </Box>
      </CardContent>
      
      <Divider sx={{ opacity: 0.6, mx: 2 }} />
      
      <CardActions sx={{ p: 0.75, justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          color="primary"
          onClick={() => navigate(`/beds/${bed.id}`)}
          startIcon={<ListAltIcon />}
          sx={{ ml: 0.5 }}
        >
          Activities
        </Button>
        <Box>
          <IconButton 
            size="small" 
            onClick={() => onEdit(bed)}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => onDelete(bed.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BedCard; 