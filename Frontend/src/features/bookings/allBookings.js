import { createSlice } from "@reduxjs/toolkit";

export const allBookingsSlice = createSlice({
    name: 'allBookings',
    initialState: [],
    reducers: {
        getAllBookings: (state, action) => {
            return action.payload;
        }
    }
});

// Export actions
export const { getAllBookings } = allBookingsSlice.actions;

// Export reducer
export default allBookingsSlice.reducer;