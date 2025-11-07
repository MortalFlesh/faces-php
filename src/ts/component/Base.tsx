import {createContext, PropsWithChildren, useContext} from "react";

export type Base = {
    // Interval for the whole dashboard faces cycle
    interval: number,

    // Total number of faces on dashboard
    faces: number,

    /// Delay before starting to fetch new face
    delay: number,
}

const defaultBase: Base = {
    interval: 2000,
    faces: 16,
    delay: 2000,
}

const BaseContext = createContext(defaultBase)

function BaseProvider({ base, children }: PropsWithChildren<{ base: Base }>) {
    return (
        <BaseContext.Provider value={ base }>
            {children}
        </BaseContext.Provider>
    );
}

export function useBase(): Base {
    return useContext(BaseContext);
}

export default BaseProvider;
