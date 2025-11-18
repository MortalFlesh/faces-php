import {Suspense, useEffect, useState, useRef} from 'react'
import {repeat, takeWhile} from 'rxjs'
import {Face, FaceSkeleton, FaceType} from "./Face";
import {faceLegend, FaceLegend} from "./FaceLegend";
import {fetchSingleFace} from "../service/face";
import {useBase} from "./Base";

type SingleFaceProps = {
    index: number
    isRunning: boolean
}

function SingleFace({index, isRunning}: SingleFaceProps) {
    const {interval, faces, delay} = useBase()

    const [isLoading, setIsLoading] = useState(false)
    const [face, setFace] = useState<FaceType>(faceLegend.initial.face(index))
    const isRunningRef = useRef(isRunning)

    // Keep ref in sync with prop
    useEffect(() => {
        isRunningRef.current = isRunning
    }, [isRunning])

    const fetchFace = fetchSingleFace(
        (face) => setFace(face),
        (loading) => setIsLoading(loading),
        interval,
        faces,
        delay,
    )

    useEffect(() => {
        if (isRunning) {
            // Use repeat() to continuously fetch, and takeWhile to stop when isRunning becomes false
            const subscription = fetchFace(index).pipe(
                repeat(),
                takeWhile(() => isRunningRef.current, true) // true = inclusive, emit the last value before stopping
            ).subscribe()

            return () => {
                subscription.unsubscribe()
            }
        }
    }, [isRunning])

    return (
        <Face face={face} isLoading={isLoading} />
    )
}

function SingleFaceApp({index, isRunning}: SingleFaceProps) {
    return (
        <Suspense fallback={<FaceSkeleton />}>
            <SingleFace index={index} isRunning={isRunning} />
        </Suspense>
    )
}

export default function FaceDashboard() {
    const {faces} = useBase()

    const [isRunning, setIsRunning] = useState(false)
    const indexes = Array.from({length: faces}, (_, index) => index)

    const handleStart = () => {
        setIsRunning(true)
    }

    const handleStop = () => {
        setIsRunning(false)
    }

    return (
        <div className="dashboard-container">
            <div className="face-container">
                <div className="face-header">
                    <h1 className="face-title">Faces App</h1>
                </div>

                <div className="face-grid">
                    {indexes.map((index) => (
                        <SingleFaceApp
                            key={index}
                            index={index}
                            isRunning={isRunning}
                        />
                    ))}
                </div>

                <div className="face-actions">
                    <button
                        className="face-button face-button-start"
                        onClick={handleStart}
                        disabled={isRunning}
                    >
                        {isRunning ? '▶ Running...' : '▶ Start'}
                    </button>
                    <button
                        className="face-button face-button-stop"
                        onClick={handleStop}
                        disabled={!isRunning}
                    >
                        ⏹ Stop
                    </button>
                </div>
            </div>

            <div className="legend-container">
                <h2 className="legend-title">Legend</h2>
                <div className="legend-items">
                    {Object.entries(faceLegend).map(([name, legend], index) => (
                        <FaceLegend key={name} id={index} legend={legend} />
                    ))}
                </div>
            </div>
        </div>
    )
}
