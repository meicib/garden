import { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme, PaletteMode } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { green, brown, lightGreen, blueGrey, grey } from '@mui/material/colors';

// Define context type
interface ThemeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Create custom theme provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Use system preference as default theme mode
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');
  
  // Function to toggle between light and dark modes
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  // Customize the theme based on light/dark mode
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode,
        primary: {
          light: lightGreen[400],
          main: green[600], // Garden green theme
          dark: green[800],
          contrastText: '#fff',
        },
        secondary: {
          light: brown[300],
          main: brown[500], // Earth/soil color for contrast
          dark: brown[700],
          contrastText: '#fff',
        },
        background: {
          default: mode === 'light' ? '#f5f7f5' : '#121212', // Slightly green tinted background for light mode
          paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
        text: {
          primary: mode === 'light' ? '#2e3b2e' : '#e0e0e0', // Darker green-tinted text for light mode
          secondary: mode === 'light' ? '#5c6b5c' : blueGrey[300],
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2rem',
          fontWeight: 500,
          '@media (max-width:600px)': {
            fontSize: '1.8rem',
          },
        },
        h2: {
          fontSize: '1.6rem',
          fontWeight: 500,
          '@media (max-width:600px)': {
            fontSize: '1.4rem',
          },
        },
        h3: {
          fontSize: '1.4rem',
          fontWeight: 500,
          '@media (max-width:600px)': {
            fontSize: '1.2rem',
          },
        },
        body1: {
          lineHeight: 1.6,
        },
        button: {
          textTransform: 'none', // More modern look without all caps
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8, // Consistent rounded corners
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '8px 16px',
              // Mobile-optimized touch target
              '@media (max-width:600px)': {
                minHeight: '42px',
              },
            },
            containedPrimary: {
              background: `linear-gradient(145deg, ${green[600]}, ${green[700]})`,
              '&:hover': {
                background: `linear-gradient(145deg, ${green[500]}, ${green[600]})`,
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              // Better touch targets for mobile
              '@media (max-width:600px)': {
                padding: 10,
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: mode === 'light' 
                ? '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)' 
                : '0 4px 12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: mode === 'light' 
                  ? '0 6px 16px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.08)'
                  : '0 6px 16px rgba(0, 0, 0, 0.6)',
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            },
          },
        },
        MuiBottomNavigation: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'light' ? '#fff' : '#272727',
              borderTop: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
              height: 60, // Taller bottom nav for better touch targets
            },
          },
        },
        MuiBottomNavigationAction: {
          styleOverrides: {
            root: {
              paddingTop: 8,
              paddingBottom: 8,
              '&.Mui-selected': {
                paddingTop: 6,
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: mode === 'light' 
                ? `linear-gradient(145deg, ${green[600]}, ${green[700]})` 
                : `linear-gradient(145deg, ${green[800]}, ${green[900]})`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none', // Remove the gradient in dark mode
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 12,
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
        MuiSnackbar: {
          styleOverrides: {
            root: {
              // Better positioning for mobile
              '@media (max-width:600px)': {
                bottom: 70, // Above the bottom navigation
              },
            },
          },
        },
      },
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 