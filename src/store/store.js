import { configureStore } from '@reduxjs/toolkit';
//import logger from 'redux-logger'
import transactionReducer from './features/transaction/transactionSlice';
import pdfDetailsReducer from "./features/DPdf/pdfDetailsSlice";

export const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    pdfDetails: pdfDetailsReducer
  },
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware({ serializableCheck: false, }),
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});