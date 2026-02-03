import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: []
};
export const cartsSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addToCart: (state, action) => {

            const { productId, quantity, productName, productImage, productPrice } = action.payload;
            const existingItem = state.items.find(
                item => item.productId === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ productId, quantity, productName, productImage, productPrice });
            }
        },

        removeFromCart: (state, action) => {
            const productId = action.payload;

            state.items = state.items.filter(
                item => item.productId !== productId
            );
        },

        updateQuantityIncrease: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item.productId === productId);
            if (item) {
                item.quantity += 1;
            }
        },

        updateQuantityDecrease: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item.productId === productId);
            if (item && item.quantity > 1) { // prevent going below 1
                item.quantity -= 1;
            }
        },

        clearCart: (state) => {
            state.items = [];
        }

    }
});

// Export actions
export const {
    addToCart,
    removeFromCart,
    updateQuantityIncrease,
    updateQuantityDecrease,
    clearCart
} = cartsSlice.actions;

// Export reducer
export default cartsSlice.reducer;