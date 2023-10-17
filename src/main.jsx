import './index.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import theme from './assets/theme'; // Import the custom theme
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routes } from './routing/routes';

// import { store } from './store/store';

const browserRouter = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ThemeProvider theme={theme}>
        {/* <Provider store={store}> */}
    <RouterProvider router={browserRouter} /> 
    {/* </Provider> */}
    </ThemeProvider>
  </React.StrictMode>
);
