import { createSlice } from "@reduxjs/toolkit";

export const servicesSlice = createSlice({
    name: 'services',
    initialState: [],
    reducers: {
        getServices: (state, action) => {
            return action.payload;
        }
    }
});

// Export actions
export const { getServices } = servicesSlice.actions;

// Export reducer
export default servicesSlice.reducer;
