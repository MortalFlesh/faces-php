import { useState, useEffect } from 'react'

interface FaceData {
    id: number
    smiley: string
    color: string
}

export default function FaceDashboard() {
    const [loading, setLoading] = useState(false)
    const [faces, setFaces] = useState<FaceData[]>([])
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
            // Fallback to mock data if API fails
            const mockFaces = Array.from({ length: 16 }, (_, index) => ({
                id: index,
                smiley: ['😊', '😀', '😎', '🤗', '😇', '🥳', '😍', '🤩', '😜', '🙃', '😋', '🤪', '😏', '🥰', '😌', '🤓'][index],
                color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#A29BFE', '#FF7675', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894', '#E17055'][index]
            }))
            setFaces(mockFaces)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFaces()
    }, [])

    return (
        <div className="face-container">
            <div className="face-header">
                <h1 className="face-title">Faces App</h1>
            </div>

            <div className="face-grid">
                {loading ? (
                    // Show loading placeholders
                    Array.from({ length: 16 }).map((_, index) => (
                        <div key={index} className="face-item loading">
                            <div className="face-loading-placeholder">
                                <div className="placeholder-circle"></div>
                                <div className="placeholder-text"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Show actual faces
                    faces.map((face) => (
                        <div key={face.id} className="face-item">
                            <div
                                className="face-emoji"
                                style={{ color: face.color }}
                            >
                                {face.smiley}
                            </div>
                        </div>
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
    )
}

