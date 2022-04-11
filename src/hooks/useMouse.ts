import { DependencyList, useCallback, useState } from "react";
import useOnGlobalDomEvent from "./useOnGlobalDomEvent";

export interface ModifierKeys {
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    shift: boolean;
}

export interface MouseState {
    buttons: {
        primary: boolean;
        secondary: boolean;
        auxiliary: boolean;
    }
    position: Position;
}

interface MouseEventProps {
    state: MouseState;
    mods: ModifierKeys
}

const MouseMasks = {
    primary: 0b001,
    secondary: 0b010,
    auxiliary: 0b100,
};
type MouseMask = typeof MouseMasks[keyof typeof MouseMasks];

// eslint-disable-next-line no-bitwise
const isPressed = (mask: MouseMask, buttons: number) => (mask & buttons) === mask;

const getMouseButtons = ({ buttons }: MouseEvent) => {
    return {
        primary: isPressed(MouseMasks.primary, buttons),
        secondary: isPressed(MouseMasks.secondary, buttons),
        auxiliary: isPressed(MouseMasks.auxiliary, buttons),
    };
};

type OnDoubleClick = (state: MouseEventProps) => void;

const useMouse = (onDoubleClick: OnDoubleClick, deps: DependencyList): MouseEventProps => {
    const doubleClickCallback = useCallback(onDoubleClick, deps);
    const [mouseState, setMouseState] = useState<MouseEventProps>({
        state: {
            buttons: {
                primary: false,
                secondary: false,
                auxiliary: false,
            },
            position: {
                x: 0,
                y: 0,
            },
        },
        mods: {
            ctrl: false,
            alt: false,
            meta: false,
            shift: false,
        },
    });

    useOnGlobalDomEvent(["mousedown", "mouseup", "mousemove", "dblclick"], (event) => {
        const mouse: MouseEventProps = {
            state: {
                buttons: getMouseButtons(event),
                position: {
                    x: event.clientX,
                    y: event.clientY,
                },
            },
            mods: {
                alt: event.altKey,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                meta: event.metaKey,
            },
        };
        if (event.type === "dblclick") {
            doubleClickCallback(mouse);
        }
        setMouseState(mouse);
    }, [setMouseState, doubleClickCallback]);

    return mouseState;
};

export default useMouse;
