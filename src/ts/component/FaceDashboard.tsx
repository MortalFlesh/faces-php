import {useState} from 'react'
import {Face, FaceSkeleton, FaceType, parseFace} from "./Face";
import {faceLegend, FaceLegend} from "./FaceLegend";

const exampleFaces: FaceType[] = Array.from({length: 16}, (_, index) => ({
    id: index,
    smiley: ['😊', '😀', '😎', '🤗', '😇', '🥳', '😍', '🤩', '😜', '🙃', '😋', '🤪', '😏', '🥰', '😌', '🤓'][index],
    color: [
        '#FFD700',
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEAA7',
        '#DFE6E9',
        '#A29BFE',
        '#FF7675',
        '#74B9FF',
        '#A29BFE',
        '#FD79A8',
        '#FDCB6E',
        '#6C5CE7',
        '#00B894',
        '#E17055'
    ][index]
}))

const initialFaces: FaceType[] = Array.from({length: 16}, (_, index) => (faceLegend.initial.face(index)))
const errorFaces: FaceType[] = Array.from({length: 16}, (_, index) => (faceLegend.error.face(index)))

// Helper function to fetch with timeout
const fetchWithTimeout = (url: string, timeout: number = 1000): Promise<Response> => {
    return Promise.race([
        fetch(url),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ])
}

export default function FaceDashboard() {
    const [loading, setLoading] = useState(false)
    const [faces, setFaces] = useState<FaceType[]>(initialFaces)
    const [isRunning, setIsRunning] = useState(false)

    const handleStart = () => {
        setIsRunning(true)
        // TODO: Implement start functionality
        console.log('Start button clicked')
    }

    const handleStop = () => {
        setIsRunning(false)
        // TODO: Implement stop functionality
        console.log('Stop button clicked')
    }

    const fetchFaces = async () => {
        setLoading(true)
        // Start with initial faces
        const tempFaces = [...initialFaces]
        setFaces(tempFaces)

        try {
            // Fetch all 16 faces in parallel with 1 second timeout
            Array.from({length: 16}, (_, index) => {
                fetchWithTimeout('/face', 1000)
                    .then(res => res.json())
                    .then(data => {
                        const face = parseFace(index, data) ?? faceLegend.parseError.face(index)
                        setFaces(currentFaces => {
                            const newFaces = [...currentFaces]
                            newFaces[index] = face
                            return newFaces
                        })
                    })
                    .catch((error) => {
                        const face = error.message === 'Timeout'
                            ? faceLegend.timeout.face(index)
                            : faceLegend.error.face(index)
                        setFaces(currentFaces => {
                            const newFaces = [...currentFaces]
                            newFaces[index] = face
                            return newFaces
                        })
                    })
            })
        } catch (error) {
            console.error('Error fetching faces:', error)
            setFaces(errorFaces)
        } finally {
            // Keep loading state on until all requests complete or timeout
            setTimeout(() => setLoading(false), 1100)
        }
    }

    return (
        <div className="dashboard-container">
            <div className="face-container">
                <div className="face-header">
                    <h1 className="face-title">Faces App</h1>
                </div>

                <div className="face-grid">
                    {loading ? (
                        // Show loading placeholders
                        Array.from({length: 16}).map((_, index) => (
                            <FaceSkeleton key={index} />
                        ))
                    ) : (
                        // Show actual faces
                        faces.map((face) => (
                            <Face face={face} />
                        ))
                    )}
                </div>

                <div className="face-actions">
                    <button
                        className="face-button face-button-start"
                        onClick={handleStart}
                        disabled={isRunning || loading}
                    >
                        {isRunning ? '▶ Running...' : '▶ Start'}
                    </button>
                    <button
                        className="face-button face-button-stop"
                        onClick={handleStop}
                        disabled={!isRunning || loading}
                    >
                        ⏹ Stop
                    </button>
                    <button
                        className="face-button face-button-fetch"
                        onClick={fetchFaces}
                        disabled={loading}
                    >
                        {loading && <span className="button-loading"></span>}
                        {loading ? 'Fetching Faces...' : '🔄 Fetch New Faces'}
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
