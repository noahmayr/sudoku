import { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { DependencyList, useCallback, useEffect, useRef } from "react";
import { RootState } from "../store";

type SuppressCallback = (action: PayloadAction<unknown>) => boolean
type SuppressCallbackRef = React.MutableRefObject<SuppressCallback>;

const shouldSuppress: React.MutableRefObject<SuppressCallback>[] = [];

export const useSuppressAction = (callback: SuppressCallback, deps: DependencyList = []) => {
    const stableCallback = useCallback(callback, deps);

    const ref: SuppressCallbackRef = useRef<SuppressCallback>(stableCallback);

    useEffect(() => {
        ref.current = stableCallback;
    }, [stableCallback]);

    useEffect(() => {
        shouldSuppress.push(ref);
        return () => {
            const index = shouldSuppress.findIndex((item) => item === ref);
            shouldSuppress.splice(index, 1);
        };
    }, []);
};

const suppressAction: Middleware<Record<string, never>, RootState> = storeApi => (
    next => (
        action => {
            if (shouldSuppress.some((callback) => callback.current(action))) {
                return action;
            }
            return next(action);
        }
    )
);

export default suppressAction;
