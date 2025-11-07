import { useState, useEffect } from 'react'
import {Face, FaceSkeleton, FaceType, parseFace} from "./Face";
import {FaceLegend, FaceLegendType} from "./FaceLegend";

const exampleFaces: FaceType[] = Array.from({ length: 16 }, (_, index) => ({
    id: index,
    smiley: ['😊', '😀', '😎', '🤗', '😇', '🥳', '😍', '🤩', '😜', '🙃', '😋', '🤪', '😏', '🥰', '😌', '🤓'][index],
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#A29BFE', '#FF7675', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894', '#E17055'][index]
}))

const faceLegend: Record<string, FaceLegendType> = {
    initial: {
        name: 'Initial',
        description: 'Default face state',
        face: (id: number): FaceType => ({
            id,
            smiley: '😢',
            color: '#FF6B6B'
        })
    },
    error: {
        name: 'Error',
        description: 'Failed to fetch face',
        face: (id: number): FaceType => ({
            id,
            smiley: '💀',
            color: '#D63031'
        })
    },
    parseError: {
        name: 'Parse Error',
        description: 'Error parsing face data',
        face: (id: number): FaceType => ({
            id,
            smiley: '🤯',
            color: '#D63031'
        })
    },
}

const initialFaces: FaceType[] = Array.from({ length: 16 }, (_, index) => (faceLegend.initial.face(index)))
const errorFaces: FaceType[] = Array.from({ length: 16 }, (_, index) => (faceLegend.error.face(index)))

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
                    .then(data => parseFace(index, data) ?? faceLegend.parseError.face(index))
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
                    {Object.entries(faceLegend).map(([name, legend], index) => (
                        <FaceLegend key={name} id={index} legend={legend} />
                    ))}
                </div>
            </div>
        </div>
    )
}
