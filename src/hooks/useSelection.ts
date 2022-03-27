import { useMemo, useRef, useCallback } from "react";
import { useDraggingSelection, useSelectAllOfType } from "../context/Selection";
import useMouse from "./useMouse";

const useGetLocalPosition = (element: SVGSVGElement|null) => {
    const rect = element?.getBoundingClientRect();
    const viewBox = element?.viewBox.animVal;
    
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
    }, [JSON.stringify(rect), JSON.stringify(viewBox)]);

    return useCallback((position: Point) => {
        if (transform === undefined) {
            return;
        }
    
        const {scale, offset, size} = transform;
    
        const local = {
            x: Math.ceil(position.x / scale.x + offset.x)-1,
            y: Math.ceil(position.y / scale.y + offset.y)-1,
        }
    
        if (local.x < 0 || local.x >= size.width|| local.y < 0 || local.y >= size.height){
            return;
        }
    
        return local;
    }, [transform])
}


const useSelection = () => {
    const ref = useRef<SVGSVGElement>(null);
    const getLocalPosition = useGetLocalPosition(ref.current);
    const selectAllOfType = useSelectAllOfType();
    const {
        mouse: {
            buttons,
            position: clientPosition
        },
        mods
    } = useMouse((state) => {        
        const position = getLocalPosition(state.mouse.position);
        const {mods} = state 
        if (position === undefined) {
            return;
        }
        selectAllOfType({type: 'value', position, intersect: mods.ctrl || mods.alt || mods.meta || mods.shift});
    },[selectAllOfType, getLocalPosition]);

    const shouldSelect = buttons.primary;
    const intersect = mods.ctrl || mods.alt || mods.meta || mods.shift;

    useDraggingSelection({
        shouldSelect,
        position: getLocalPosition(clientPosition),
        intersect
    });

    return {
        ref
    }
}


export default useSelection;
