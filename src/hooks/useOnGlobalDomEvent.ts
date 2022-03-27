import {
    DependencyList, useCallback, useEffect, useReducer,
} from "react";
import isDeepEqual from "fast-deep-equal/react";

type EventMap = WindowEventMap

type AnyEvent = ValueOf<EventMap>;
type EventKey = KeyOf<EventMap>;
type EventFor<K extends EventKey> = ValueForKey<EventMap, K>;

type Listener<T extends AnyEvent> = (this: Window, event: T) => void

type ListenerFor<K extends EventKey> = Listener<EventFor<K>>;

type ListenerMap = {
    [key in EventKey]?: ListenerFor<key>;
};


const getListener = <T extends EventKey>(
    events: ListenerMap,
    identifier: T,
): ListenerFor<T> | undefined => {
    return events[identifier];
};

const eventReducer = (state: ListenerMap, change: ListenerMap): ListenerMap => {
    const identifiers: EventKey[] = [...Object.keys(state), ...Object.keys(change)] as EventKey[];

    identifiers.forEach(identifier => {
        const current = getListener(state, identifier);
        const next = getListener(change, identifier);
        if (current === next) {
            return;
        }
        if (current) {
            window.removeEventListener(identifier, current, false);
        }
        if (next) {
            window.addEventListener(identifier, next, false);
        }
    });

    return change;
};

const useGlobalDomEvents = (props: ListenerMap) => {
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

const useOnGlobalDomEvent = <K extends EventKey>(
    events: K[], listener: ListenerFor<K>,
    deps: DependencyList,
) => {
    const callback = useCallback(listener, deps);
    useGlobalDomEvents(events.map(key => {
        return { [key]: callback };
    }).reduce((a, b) => { return { ...a, ...b }; }, {}));
};

export default useOnGlobalDomEvent;
