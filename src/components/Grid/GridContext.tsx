import React, { PropsWithChildren, useContext } from 'react'

const GridContext = React.createContext({})

interface GridProviderProps {
    width: number;
    height: number;
    scale: number;
}

const useGridDimensions = ({ width = 9, height = 9, scale = 64 }: GridProviderProps): { bounds: Bounds, size: Size, scale: number } => {
    return {
        bounds: {
            x: - scale / 4,
            y: - scale / 4,
            width: width * scale + scale / 2,
            height: width * scale + scale / 2,
        },
        size: {
            width: width * scale,
            height: height * scale,
        },
        scale: scale
    }
}

export const GridProvider = ({children, ...props}: PropsWithChildren<GridProviderProps>) => {
    const dimensions = useGridDimensions(props)
    return (
        <GridContext.Provider value={dimensions}>
            {children}
        </GridContext.Provider>
    )
}
export const useGridContext = useContext(GridContext);


