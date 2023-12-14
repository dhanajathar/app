import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pageNum: 0,
  numPages: 0,
  fileSize: 0,
  pdfFile: null
};

export const pdfDetailsSlice = createSlice({
  name: 'pdfDetails',
  initialState,
  reducers: {
    setPdfDetails: (state,action) => {
      // This is all a placeholder to create an example reducer.
      state.updatedPdfData = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setPdfDetails } = pdfDetailsSlice.actions;

export default pdfDetailsSlice.reducer;