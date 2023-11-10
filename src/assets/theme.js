import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: { 
        MuiInputLabel: {
            styleOverrides: {
              root: {
                color: '#000', 
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: '#000', 
                '&:disabled': {
                  color: '#666'
                }, 
              },
            },
          },
      } 
});

export default theme;