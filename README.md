# Garden Activity Tracker

A mobile-first web application to help gardeners track activities across their garden beds. Keep a detailed record of planting, watering, fertilizing, and harvesting activities for each garden bed.

## Features

- **Garden Bed Management**: Create, edit, and delete garden beds
- **Activity Logging**: Record activities like planting, watering, fertilizing, and harvesting
- **Mobile-First Design**: Optimized for use on smartphones while working in the garden
- **Activity Filtering**: Filter activities by type to quickly find what you're looking for

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd garden-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Managing Garden Beds

1. **View Beds**: The home page displays all your garden beds
2. **Add Bed**: Click the "+" button to add a new garden bed
3. **Edit Bed**: Click the "Edit" button on a bed card to modify its details
4. **Delete Bed**: Click the "Delete" button to remove a bed (this will also delete all associated activities)

### Tracking Activities

1. **View Activities**: Click on a bed to see all associated activities
2. **Add Activity**: Click the "+" button to record a new activity
3. **Filter Activities**: Use the toggle buttons to filter activities by type
4. **Edit Activity**: Click the "Edit" button on an activity card to modify its details
5. **Delete Activity**: Click the "Delete" button to remove an activity

## Google Sheets Integration (Coming Soon)

This app is designed to eventually use Google Sheets as a backend to store your garden data. This feature is currently in development.

## Future Enhancements

- Google Sheets integration for data storage
- Weather data integration
- Photo uploads for activities
- Reports and analytics on garden performance
- Task scheduling and reminders

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, TypeScript, Material-UI, and Vite
- Icons from Material-UI Icons
