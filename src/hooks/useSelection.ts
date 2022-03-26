import { useState, useMemo, useRef, RefObject } from "react";
import { useSelectionState, useSelectionDispatch, useDraggingSelection } from "../context/Selection";
import useMouse from "./useMouse";

interface UseLocalPositionProps {
    clientPosition: Point;
    ref: RefObject<SVGSVGElement | null>;
}

const useLocalPosition = ({ clientPosition: clientPos, ref }: UseLocalPositionProps) => {
    const rect = ref.current?.getBoundingClientRect();
    const viewBox = ref.current?.viewBox.animVal;
    
    const transform = useMemo(() => {
        if (rect === undefined || viewBox === undefined) {
            return;
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

    if (transform === undefined) {
        return;
    }

    const {scale, offset, size} = transform;

    const position = {
        x: Math.ceil(clientPos.x / scale.x + offset.x)-1,
        y: Math.ceil(clientPos.y / scale.y + offset.y)-1,
    }

    if (position.x < 0 || position.x >= size.width|| position.y < 0 || position.y >= size.height){
        return;
    }

    return position;
}


const useSelection = () => {
    const ref = useRef<SVGSVGElement>(null);

    const {
        mouse: {
            buttons,
            position: clientPosition
        },
        mods
    } = useMouse();

    const position = useLocalPosition({ clientPosition, ref });

    const shouldSelect = buttons.primary;
    const intersect = mods.ctrl || mods.alt || mods.meta || mods.shift;

    useDraggingSelection({
        shouldSelect,
        position,
        intersect
    });

    return {
        ref
    }
}


export default useSelection;
