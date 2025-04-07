import { mount } from 'cypress/react18';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { createTheme } from '@mui/material/styles';

// Augment the Cypress namespace to include mount
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

// Create a default theme for testing
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4a90e2' },
  },
});

// Custom mount command that wraps components with providers
Cypress.Commands.add('mount', (component, options = {}) => {
  const wrappedComponent = (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
  
  return mount(wrappedComponent, options);
}); 