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
              root: {
                '&.Mui-disabled': {
                  background:'#e9ecef'
                }, 
                input: {
                  color: '#000', 
                  '&:disabled': {
                    background:'#e9ecef',
                    borderColor:'#ced4da',
                    color: '#666',  
                  }, 
                },  
              },
               
            },
          },
      } 
});

export default theme;