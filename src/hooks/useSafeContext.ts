import React, { useContext } from "react";

const useSafeContext = <T>(context: React.Context<T|undefined>, error: string = 'useSafeContext can only be used inside the appropriate provider'): T => {
    const result = useContext(context);
    if (result === undefined) {
        throw new Error(error);
    }
    return result;
}

export default useSafeContext;