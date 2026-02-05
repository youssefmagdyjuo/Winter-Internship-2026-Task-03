import { createSlice } from "@reduxjs/toolkit";

export const allOrdersSlice = createSlice({
    name: 'allOrders',
    initialState: [],
    reducers: {
        getallOrders: (state, action) => {
            return action.payload;
        }
    }
});

// Export actions
export const { getallOrders } = allOrdersSlice.actions;

// Export reducer
export default allOrdersSlice.reducer;
