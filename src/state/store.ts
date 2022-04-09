import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import game from "./slice/game";
import input from "./slice/input";
import selection from "./slice/selection";
import { serializableMiddleware, serialize } from "./util/serialize";

const store = configureStore({
    reducer: {
        game, input, selection,
    },
    middleware: (getDefaultMiddleWare) => [
        ...getDefaultMiddleWare({ serializableCheck: false }),
        serializableMiddleware,
    ],
    devTools: { serialize },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppGetState = typeof store.getState
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppGetState>

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => typeof store = useStore;

export default store;
