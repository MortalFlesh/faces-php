import {FaceType} from "./Face";

export type FaceLegendType = {
    name: string,
    description: string,
    face: (id: number) => FaceType,
}

const runtimeErrorColor = '#D63031';

export const faceLegend: Record<string, FaceLegendType> = {
    initial: {
        name: 'Initial',
        description: 'Default face state',
        face: (id: number): FaceType => ({
            id,
            smiley: '😐',
            color: '#DFE6E9'
        })
    },
    healthy: {
        name: 'Healthy',
        description: 'Healthy face',
        face: (id: number): FaceType => ({
            id,
            smiley: '😄',
            color: '#00B894'
        })
    },
    error: {
        name: 'Error',
        description: 'Failed to fetch face',
        face: (id: number): FaceType => ({
            id,
            smiley: '💀',
            color: runtimeErrorColor
        })
    },
    parseError: {
        name: 'Parse Error',
        description: 'Error parsing face data',
        face: (id: number): FaceType => ({
            id,
            smiley: '🤯',
            color: runtimeErrorColor
        })
    },
    timeout: {
        name: 'Timeout',
        description: 'Request timed out',
        face: (id: number): FaceType => ({
            id,
            smiley: '😴',
            color: runtimeErrorColor
        })
    },
}

type FaceLegendProps = {
    id: number,
    legend: FaceLegendType
}

export function FaceLegend({id, legend}: FaceLegendProps) {

    const face = legend.face(id);
    return (
        <div className="legend-item">
            <div className="legend-face" style={{ backgroundColor: face.color }}>
                <span className="legend-emoji">{face.smiley}</span>
            </div>
            <div className="legend-label">
                <strong>{legend.name}</strong>
                <small>{legend.description}</small>
            </div>
        </div>
    )

}
