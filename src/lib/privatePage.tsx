import React from "react";

export function privatePage<T>(Component: any) {
    return async (props: T) => {
        // TODO- authentication logic

        return <Component {...props} />;
    };
}