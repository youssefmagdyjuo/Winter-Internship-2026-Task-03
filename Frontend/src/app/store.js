import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import navBarReducer from "../features/puplic/navBar.js";
import servicesReducer from "../features/services folder/services.js";
import cartReducer from "../features/cart/cart.js";
import allOrdersReducer from "../features/orders/allOrders.js";

const cartPersistConfig = {
    key: "cart",
    storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
    reducer: {
        navBar: navBarReducer,
        services: servicesReducer,
        cart: persistedCartReducer,
        allOrders: allOrdersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
