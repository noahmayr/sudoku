import { DependencyList, useCallback, useState } from "react";
import useOnGlobalDomEvent from "./useOnGlobalDomEvent";

interface MouseState {
    mouse: {
        buttons: {
            primary: boolean;
            secondary: boolean;
            auxiliary: boolean;
        }
        position: Point;
    };
    mods: {
        ctrl: boolean;
        alt: boolean;
        meta: boolean;
        shift: boolean;
    }
}

const MouseMasks = {
    primary: 0b001,
    secondary: 0b010,
    auxiliary: 0b100,
};
type MouseMask = typeof MouseMasks[keyof typeof MouseMasks];

const isPressed = (mask: MouseMask, buttons: number): boolean => {
    return (mask & buttons) === mask;
};

const getMouseButtons = ({ buttons }: MouseEvent) => {
    return {
        primary: isPressed(MouseMasks.primary, buttons),
        secondary: isPressed(MouseMasks.secondary, buttons),
        auxiliary: isPressed(MouseMasks.auxiliary, buttons)
    };
};

const useMouse = (onDoubleClick: (state: MouseState) => void, deps: DependencyList): MouseState => {
    const doubleClickCallback = useCallback(onDoubleClick, deps);
    const [mouseState, setMouseState] = useState<MouseState>({
        mouse: {
            buttons: {
                primary: false,
                secondary: false,
                auxiliary: false
            },
            position: {
                x: 0,
                y: 0
            }
        },
        mods: {
            ctrl: false,
            alt: false,
            meta: false,
            shift: false
        }
    });

    useOnGlobalDomEvent(["mousedown", "mouseup", "mousemove", "dblclick"], (event) => {
        const state = {
            mouse: {
                buttons: getMouseButtons(event),
                position: {
                    x: event.clientX,
                    y: event.clientY
                }
            },
            mods: {
                alt: event.altKey,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                meta: event.metaKey,
            }
        };
        if (event.type === "dblclick") {
            doubleClickCallback(state);
        }
        setMouseState({
            mouse: {
                buttons: getMouseButtons(event),
                position: {
                    x: event.clientX,
                    y: event.clientY
                }
            },
            mods: {
                alt: event.altKey,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                meta: event.metaKey,
            }
        });
    }, [setMouseState, doubleClickCallback]);

    return mouseState;
};

export default useMouse;
