import {FaceType} from "./Face";

export type FaceLegendType = {
    name: string,
    description: string,
    face: (id: number) => FaceType,
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
