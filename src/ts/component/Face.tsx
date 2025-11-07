import {z} from "zod";

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

/**
 * @see StudyItem.php
 */
const FaceSchema = z.strictObject({
    smiley: z.string(),
    color: z.string(),
});

const createFace = (id: number, data: z.infer<typeof FaceSchema>): FaceType => ({
    id,
    smiley: data.smiley,
    color: data.color,
});

export function parseFace(index: number, raw: string | object): FaceType|null {
    const rawData = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const result = FaceSchema.safeParse(JSON.parse(rawData));

    if (!result.success) {
        return null
    }

    return createFace(index, result.data);
}
