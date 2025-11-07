import {faceLegend} from "../component/FaceLegend";
import {catchError, delay, from, mergeMap, of, timeout, TimeoutError, defer} from "rxjs";
import {FaceType, parseFace} from "../component/Face";

type SetFace = (face: FaceType) => void;
type SetLoading = (loading: boolean) => void;

export const fetchSingleFace = (setFace: SetFace, setLoading: SetLoading, interval: number, faces: number, delayMillisecond: number) => (index: number) => {
    // Calculate initial delay to stagger face fetching
    // Similar to faces-demo: each face starts at (interval / faces) * index milliseconds
    const faceInterval = Math.floor(interval / faces)
    const initialDelay = index * faceInterval

    // Create the fetch observable that resets state on every subscription
    const fetchObservable = defer(() => {
        // Reset to initial face and start loading - this happens on EVERY repeat
        setFace(faceLegend.initial.face(index))
        setLoading(true)

        return from(fetch(`/face?index=${index}`)).pipe(
            timeout(10000),
            mergeMap((response) => from(response.json())),
            mergeMap((data) => {
                setLoading(false)

                const face = parseFace(index, data) ?? faceLegend.parseError.face(index)
                setFace(face)

                return of(index)
            }),
            catchError((error) => {
                setLoading(false)

                const face = error instanceof TimeoutError
                    ? faceLegend.timeout.face(index)
                    : faceLegend.error.face(index)

                setFace(face)

                return of(index)
            }),
            delay(delayMillisecond)
        )
    })

    // Apply initial delay only, then the fetch observable repeats without delay
    return of(null).pipe(
        delay(initialDelay),
        mergeMap(() => fetchObservable)
    )
}
