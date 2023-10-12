// import App from './App.jsx'
import './index.css';

import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routes } from './routing/routes';

// import { store } from './store/store';

const browserRouter = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <RouterProvider router={browserRouter} />
    {/* </Provider> */}
  </React.StrictMode>
);
