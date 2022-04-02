import { configureStore, createSerializableStateInvariantMiddleware, isPlain } from "@reduxjs/toolkit";
import gameSlice from "./game/gameSlice";

type AnyMapOrSet = Set<unknown>|Map<unknown, unknown>
const isMapOrSet = (value: AnyMapOrSet|unknown): value is AnyMapOrSet => (
    value instanceof Set || value instanceof Map
);

// Augment middleware to consider Immutable.JS iterables serializable
const isSerializable = (value: unknown) => isMapOrSet(value) || isPlain(value);

type Entries = [string, unknown][];

const mapEntries = (collection: AnyMapOrSet): Entries => {
    if (collection instanceof Map) {
        return Array.from(collection.entries(), ([key, value]) => [JSON.stringify(key), value]);
    }
    return Array.from(collection.values(), (value, key) => [key.toString(), value]);
};

interface SerializedMap {
    __serializedType__: "Map";
    data: {[key: string]: unknown};
    keys: [string, unknown][];
}

const serializeMap = (map: Map<unknown, unknown>): SerializedMap => {
    const data = Array.from(map.entries());
    return {
        __serializedType__: "Map",
        data: Object.fromEntries(data.map(([key, value]) => [JSON.stringify(key), value])),
        keys: data.map(([key]) => [JSON.stringify(key), key]),
    };
};

const deserializeMap = ({ data, keys }: SerializedMap) => new Map(
    keys.map(([key, keyValue]) => [keyValue, data[key]]),
);

interface SerializedSet {
    __serializedType__: "Set";
    data: unknown[];
}

const serializeSet = (set: Set<unknown>): SerializedSet => {
    return {
        __serializedType__: "Set",
        data: Array.from(set.values()),
    };
};

const deserializeSet = ({ data }: SerializedSet) => new Set(data.values());


const getEntries = (value: unknown): Entries => (
    isMapOrSet(value) ? mapEntries(value) : Object.entries(value as object)
);

const serializableMiddleware = createSerializableStateInvariantMiddleware({
    isSerializable,
    getEntries,
});

const isSerializedMapOrSet = (value: unknown): value is SerializedMap|SerializedSet => {
    if (typeof value !== "object" || value as Partial<SerializedMap|SerializedSet>|null === null) {
        return false;
    }
    const serialized = value as Partial<SerializedMap|SerializedSet>;
    // eslint-disable-next-line no-underscore-dangle
    if (typeof serialized.__serializedType__ !== "string" || ["Map", "Set"].includes(serialized.__serializedType__)) {
        return false;
    }
    return Array.isArray(serialized.data);
};

const store = configureStore({
    reducer: { game: gameSlice },
    middleware: [serializableMiddleware],
    devTools: {
        serialize: {
            replacer: (key, value) => {
                if (value instanceof Set) {
                    return serializeSet(value);
                }
                if (value instanceof Map) {
                    return serializeMap(value);
                }
                return value;
            },
            reviver: (key, value) => {
                if (isSerializedMapOrSet(value)) {
                    const { __serializedType__ } = value;
                    if (__serializedType__ === "Set") {
                        return deserializeSet(value);
                    }
                    if (__serializedType__ === "Map") {
                        return deserializeMap(value);
                    }
                }
                return undefined;
            },
        },
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
