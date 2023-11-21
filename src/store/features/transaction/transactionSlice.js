import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  updatedTranData: [],
  preview:false
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setPaymentPreview:(state) => {
      state.preview = true
    },
    setTransaction: (state,action) => {
      // This is all a placeholder to create an example reducer.
      state.updatedTranData = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setTransaction,setPaymentPreview } = transactionSlice.actions;

export default transactionSlice.reducer;
