import { useState, useReducer, useCallback, useEffect, useMemo, useRef, RefObject } from "react";
import useMouseSelection from "./useMouseSelection";

interface SelectProps {
    dimensions: Dimensions;
}

export const getKey = ({x, y}: Point): string => {
    return JSON.stringify({x, y});
}

export type Selection = Record<string, true>;

interface SelectionReducerProps {
    position?: Point;
    selected?: boolean;
    reset?: boolean;
}

const selectionReducer = (state: Selection, { position, selected = true, reset = false }: SelectionReducerProps): Selection => {
    if (position === undefined) {
        return reset ? {} : state;
    }
    if (reset) {
        if (!selected) {
            return {};
        }
        return {
            [getKey(position)]: selected
        };
    }
    if (!selected) {
        delete state[getKey(position)];
        return state;
    }
    return {
        ...state,
        [getKey(position)]: selected
    };
}

interface UseLocalPositionProps {
    clientPosition: Point;
    ref: RefObject<SVGSVGElement | null>;
    dimensions: Dimensions
}

const useSelection = ({ dimensions }: SelectProps) => {
    const [selecting, setSelecting] = useState<boolean | null>(null);
    const ref = useRef<SVGSVGElement>(null);
    const [selection, dispatchSelect] = useReducer(selectionReducer, {});

    const {
        mouse: {
            buttons,
            position: clientPosition
        },
        mods
    } = useMouseSelection(dimensions);

    const position = useLocalPosition({ clientPosition, ref, dimensions });

    const mouseDown = buttons.primary;
    const intersect = mods.ctrl || mods.alt || mods.meta || mods.shift;

    useEffect(() => {
        if (!mouseDown) {
            return setSelecting(null);
        }
        if (position === null && !selecting) {
            dispatchSelect({ reset: true });
        }
        if (position !== null) {
            const positionIsSelected = selection[getKey(position)];
            if (selecting === null) {
                setSelecting(intersect ? !positionIsSelected : true);
                return dispatchSelect({ position, selected: intersect ? !positionIsSelected : true, reset: !intersect });
            }
            if (selecting === positionIsSelected) {
                return;
            }
            return dispatchSelect({ position, selected: selecting });
        }
    }, [mouseDown, position, selecting, setSelecting, JSON.stringify(selection), dispatchSelect]);

    return {
        selection,
        ref
    }
}

export default useSelection;

const useLocalPosition = ({ clientPosition: clientPos, ref, dimensions }: UseLocalPositionProps) => {
    const rect = ref.current?.getBoundingClientRect();
    const viewBox = ref.current?.viewBox.animVal;
    
    const transform = useMemo(() => {
        if (rect === undefined || viewBox === undefined) {
            return null;
        }
        const scale = {
            x: rect.width / viewBox.width,
            y: rect.height / viewBox.height,
        };
        return {
            scale,
            offset: {
                x: - rect.left / scale.x + viewBox.x,
                y: - rect.top / scale.y + viewBox.y,
            },
            size: {
                width: viewBox.width + viewBox.x * 2,
                height: viewBox.height + viewBox.y * 2        
            }
        }
    }, [clientPos, JSON.stringify(rect), JSON.stringify(viewBox)]);

    if (transform === null) {
        return null;
    }

    const {scale, offset, size} = transform;

    const position = {
        x: Math.ceil(clientPos.x / scale.x + offset.x)-1,
        y: Math.ceil(clientPos.y / scale.y + offset.y)-1,
    }

    if (position.x < 0 || position.x >= size.width|| position.y < 0 || position.y >= size.height){
        return null;
    }

    return position;
}