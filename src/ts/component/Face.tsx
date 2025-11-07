export function FaceSkeleton() {
    return (
        <div className="face-item loading" style={{ backgroundColor: '#e0e0e0' }}>
            <div className="face-loading-placeholder">
                <div className="placeholder-circle"></div>
                <div className="placeholder-text"></div>
            </div>
        </div>
    )
}

export type FaceType = {
    id: number
    smiley: string
    color: string
}

export type FaceProps = {
    face: FaceType
}

export function Face({ face }: FaceProps) {
    return (
        <div key={face.id} className="face-item" style={{ backgroundColor: face.color }}>
            <div className="face-emoji">
                {face.smiley}
            </div>
        </div>
    )
}
