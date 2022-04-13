import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import superjson from "superjson";
import suppressAction from "./middleware/suppressAction";
import game from "./slice/game";
import input from "./slice/input";
import selection from "./slice/selection";
import settings from "./slice/settings";
import { serializableMiddleware, serialize } from "./util/serialize";


const rootReducer = combineReducers({
    game, input, selection, settings,
});

export type RootState = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer<RootState>({
    key: "root",
    storage,
    blacklist: ["selection"],
    transforms: [
        createTransform(
            (inboundState) => superjson.serialize(inboundState),
            (outboundState) => superjson.deserialize(outboundState),
        ),
    ],
}, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleWare) => [
        ...getDefaultMiddleWare({ serializableCheck: false }),
        serializableMiddleware,
        suppressAction,
    ],
    devTools: { serialize },
});

export const persistor = persistStore(store);

export type AppGetState = typeof store.getState
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => typeof store = useStore;

export default store;
