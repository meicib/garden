import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Divider } from '@mui/material';
import { GardenActivity } from '../../types';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import HarvestIcon from '@mui/icons-material/Grass';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActivityCardProps {
  activity: GardenActivity;
  onEdit: (activity: GardenActivity) => void;
  onDelete: (activityId: string) => void;
}

const ActivityCard = ({ activity, onEdit, onDelete }: ActivityCardProps) => {
  // Helper function to get the icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <WaterDropIcon color="info" />;
      case 'plant':
        return <LocalFloristIcon color="success" />;
      case 'fertilize':
        return <AgricultureIcon color="warning" />;
      case 'harvest':
        return <HarvestIcon color="primary" />;
      default:
        return <HelpOutlineIcon />;
    }
  };

  // Helper function to get color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'water':
        return 'info';
      case 'plant':
        return 'success';
      case 'fertilize':
        return 'warning';
      case 'harvest':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Helper function to get chip class based on activity type
  const getChipClass = (type: string) => {
    return `${type}-chip`;
  };
  
  // Format date in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If it's today or yesterday, show that instead of the date
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // For other dates, show formatted date
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <Card 
      sx={{ mb: 2, width: '100%' }}
      className="fade-in"
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip
            icon={getActivityIcon(activity.type)}
            label={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            color={getActivityColor(activity.type) as any}
            size="small"
            className={getChipClass(activity.type)}
            sx={{ 
              borderRadius: 1,
              fontWeight: 500,
              px: 0.5
            }}
          />
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: 'background.default',
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {formatDate(activity.date)}
          </Typography>
        </Box>
        
        {activity.notes && (
          <Typography 
            variant="body2"
            sx={{ 
              mt: 1.5, 
              lineHeight: 1.5,
              color: 'text.primary',
              whiteSpace: 'pre-line' // Preserve line breaks
            }}
          >
            {activity.notes}
          </Typography>
        )}
      </CardContent>
      
      <Divider sx={{ opacity: 0.6 }} />
      
      <CardActions>
        <Button 
          size="small" 
          onClick={() => onEdit(activity)}
          startIcon={<EditIcon fontSize="small" />}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          color="error" 
          onClick={() => onDelete(activity.id)}
          startIcon={<DeleteIcon fontSize="small" />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ActivityCard; 