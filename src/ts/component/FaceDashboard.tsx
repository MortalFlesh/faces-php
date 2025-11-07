import { useState, useEffect } from 'react'
import {Face, FaceSkeleton, FaceType} from "./Face";

const exampleFaces: FaceType[] = Array.from({ length: 16 }, (_, index) => ({
    id: index,
    smiley: ['😊', '😀', '😎', '🤗', '😇', '🥳', '😍', '🤩', '😜', '🙃', '😋', '🤪', '😏', '🥰', '😌', '🤓'][index],
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#A29BFE', '#FF7675', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894', '#E17055'][index]
}))

const face = {
    initial: (id: number): FaceType => ({
        id,
        smiley: '😢',
        color: '#FF6B6B'
    }),
    error: (id: number): FaceType => ({
        id,
        smiley: '💀',
        color: '#D63031'
    }),
}

const initialFaces: FaceType[] = Array.from({ length: 16 }, (_, index) => (face.initial(index)))
const errorFaces: FaceType[] = Array.from({ length: 16 }, (_, index) => (face.error(index)))

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
        try {
            // Fetch 16 faces from the API
            const facePromises = Array.from({ length: 16 }, (_, index) =>
                fetch('/face')
                    .then(res => res.json())
                    .then(data => ({ id: index, ...data }))
            )

            const fetchedFaces = await Promise.all(facePromises)
            setFaces(fetchedFaces)
        } catch (error) {
            console.error('Error fetching faces:', error)
            setFaces(errorFaces)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFaces()
    }, [])

    return (
        <div className="dashboard-container">
            <div className="face-container">
                <div className="face-header">
                    <h1 className="face-title">Faces App</h1>
                </div>

                <div className="face-grid">
                    {loading ? (
                        // Show loading placeholders
                        Array.from({ length: 16 }).map((_, index) => (
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
                    <div className="legend-item">
                        <div className="legend-face" style={{ backgroundColor: '#FF6B6B' }}>
                            <span className="legend-emoji">😢</span>
                        </div>
                        <div className="legend-label">
                            <strong>Initial</strong>
                            <small>Default state</small>
                        </div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-face" style={{ backgroundColor: '#D63031' }}>
                            <span className="legend-emoji">💀</span>
                        </div>
                        <div className="legend-label">
                            <strong>Error</strong>
                            <small>Failed to fetch</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

