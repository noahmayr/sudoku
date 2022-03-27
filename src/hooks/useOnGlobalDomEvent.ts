import { DependencyList, useCallback, useEffect, useReducer } from "react";
import isDeepEqual from "fast-deep-equal/react";

export type GlobalEventMap = WindowEventMap

export type GlobalEventEnum = ValueOf<GlobalEventMap>;
export type GlobalEventId = KeyOf<GlobalEventMap>;
export type GlobalEventForId<K extends GlobalEventId> = ValueForKey<GlobalEventMap, K>;

export type GlobalEventListener<T extends GlobalEventEnum> = (this: Window, event: T) => void

export type GlobalEventListenerForKey<K extends GlobalEventId> = GlobalEventListener<GlobalEventForId<K>>;

export type GlobalEventListenerMap = {
    [key in GlobalEventId]?: GlobalEventListenerForKey<key>;
};


const getListener = <T extends GlobalEventId>(events: GlobalEventListenerMap, identifier: T): GlobalEventListenerForKey<T> | undefined  => {
    return events[identifier];
};

const eventReducer = (state: GlobalEventListenerMap, change: GlobalEventListenerMap): GlobalEventListenerMap => {
    const identifiers: GlobalEventId[] = [...Object.keys(state), ...Object.keys(change)] as GlobalEventId[];

    for (const identifier of identifiers) {
        const current = getListener(state, identifier);
        const next = getListener(change, identifier);
        if (current === next) {
            continue;
        }
        if (current) {
            window.removeEventListener(identifier, current, false);
        }
        if (next) {
            window.addEventListener(identifier, next, false);
        }
    }

    return change;
};

const useGlobalDomEvents = (props: GlobalEventListenerMap) => {
    const [events, updateEvents] = useReducer(eventReducer, {});

    useEffect(() => {
        if (isDeepEqual(events, props)) {
            return;
        }
        updateEvents(props);
    }, [updateEvents, props]);

    useEffect(() => {
        return () => {
            updateEvents({});
        };
    }, [updateEvents]);
};

const useOnGlobalDomEvent = <K extends GlobalEventId>(events: K[], listener: GlobalEventListenerForKey<K>, deps: DependencyList) => {
    const callback = useCallback(listener, deps);
    useGlobalDomEvents(events.map(key => ({[key]: callback})).reduce((a,b) => ({...a,...b}), {}));
};

export default useOnGlobalDomEvent;
