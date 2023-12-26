import { configureStore } from '@reduxjs/toolkit';
//import logger from 'redux-logger'
import transactionReducer from './features/transaction/transactionSlice';
import pdfDetailsReducer from "./features/DPdf/pdfDetailsSlice";

export const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    pdfDetails: pdfDetailsReducer
  },
  middleware: (getDefaultMiddleware) => { 
    let middleware = getDefaultMiddleware({ serializableCheck: false, });
     
   /* if(process.env.NODE_ENV == "development") {
      middleware = middleware.concat(logger);
    }*/
    return middleware;
  }
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});