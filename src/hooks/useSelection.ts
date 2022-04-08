import { useMemo, useRef, useCallback } from "react";
import { useDraggingSelection, useSelectAllOfType } from "../context/Selection";
import { getType } from "./useInput";
import useMouse, { ModifierKeys } from "./useMouse";

const getViewBoxSize = (element: SVGSVGElement|null): Size|undefined => {
    if (element === null) {
        return undefined;
    }
    const { width, height } = element.viewBox.baseVal;
    return { width, height };
};

const useGetLocalPosition = (element: SVGSVGElement|null, padding: number) => {
    const rect = element?.getBoundingClientRect();
    const viewBox = getViewBoxSize(element);

    const transform = useMemo(() => {
        if (rect === undefined || viewBox === undefined) {
            return undefined;
        }
        const scale = {
            x: rect.width / viewBox.width,
            y: rect.height / viewBox.height,
        };
        return {
            scale,
            offset: {
                x: -rect.left / scale.x - padding,
                y: -rect.top / scale.y - padding,
            },
            size: {
                width: viewBox.width - padding * 2,
                height: viewBox.height - padding * 2,
            },
        };
    }, [JSON.stringify(rect), JSON.stringify(viewBox), padding]);

    return useCallback((position: Point) => {
        if (transform === undefined) {
            return undefined;
        }

        const { scale, offset, size } = transform;

        const local = {
            x: Math.ceil(position.x / scale.x + offset.x),
            y: Math.ceil(position.y / scale.y + offset.y),
        };

        if (local.x < 1 || local.x > size.width || local.y < 1 || local.y > size.height) {
            return undefined;
        }

        return local;
    }, [transform]);
};

const shouldIntersect = ({ ctrl, alt, meta, shift }: ModifierKeys) => ctrl || alt || meta || shift;

const useSelection = (padding: number) => {
    const ref = useRef<SVGSVGElement>(null);
    const getLocalPosition = useGetLocalPosition(ref.current, padding);
    const selectAllOfType = useSelectAllOfType();
    const mouse = useMouse(({ state, mods }) => {
        const position = getLocalPosition(state.position);
        if (position === undefined) {
            return;
        }
        selectAllOfType({
            type: getType(mods), position, intersect: shouldIntersect(mods),
        });
    }, [selectAllOfType, getLocalPosition]);

    const {
        buttons,
        position,
    } = mouse.state;

    const shouldSelect = buttons.primary;
    const intersect = shouldIntersect(mouse.mods);

    useDraggingSelection({
        shouldSelect,
        position: getLocalPosition(position),
        intersect,
    });

    return { ref };
};


export default useSelection;
