import { configureStore } from '@reduxjs/toolkit';
//import logger from 'redux-logger'
import transactionReducer from './features/transaction/transactionSlice';

export const store = configureStore({
  reducer: {
    transaction: transactionReducer
  },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
