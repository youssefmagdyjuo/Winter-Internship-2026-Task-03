import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import navBarReducer from "../features/puplic/navBar.js";
import approvedProductsReducer from "../features/products/approvedProducts.js";
import categoriesReducer from "../features/products/categories.js";
import cartReducer from "../features/cart/cart.js";

// Persist config for cart
const cartPersistConfig = {
    key: "cart",
    storage,
};
// Create a persisted reducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        navBar: navBarReducer,
        approvedProducts: approvedProductsReducer,
        categories: categoriesReducer,
        cart: persistedCartReducer
    },
});
export const persistor = persistStore(store);
