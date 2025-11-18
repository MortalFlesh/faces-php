import {from, map, catchError, of} from "rxjs";

export const checkHealth = () => {
    return from(fetch('/health-check')).pipe(
        map((response) => response.ok),
        catchError(() => of(false))
    )
}

