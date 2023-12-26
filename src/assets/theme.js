/*
 * Component Name: Theme
 * Author: Priyanka Pandey
 * Created: 2023-07-31
 * Last Modified: 2023-12-15
 * Description: This file is overriding MUI's native color feature
 * Application Release Version:1.0.0
 */
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