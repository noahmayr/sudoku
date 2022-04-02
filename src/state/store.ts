import { configureStore } from "@reduxjs/toolkit";
import game from "./slice/game";
import input from "./slice/input";
import { serializableMiddleware, serialize } from "./util/serialize";

const store = configureStore({
    reducer: { game, input },
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

export default store;
