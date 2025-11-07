import {z} from "zod";
import cn from 'classnames'

export function FaceSkeleton() {
    return (
        <div className="face-loading-placeholder">
            <div className="placeholder-circle"></div>
            <div className="placeholder-text"></div>
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
    isLoading?: boolean
}

function Smiley({face}: { face: FaceType }) {
    return (
        <div className="face-emoji">
            {face.smiley}
        </div>
    )
}

export function Face({face, isLoading = false}: FaceProps) {
    return (
        <div key={face.id} className={cn('face-item', {loading: isLoading})} style={{backgroundColor: face.color}}>
            {isLoading
                ? <FaceSkeleton />
                : <Smiley face={face} />
            }
        </div>
    )
}

/**
 * @see StudyItem.php
 */
const FaceSchema = z.object({
    smiley: z.string(),
    color: z.string(),
});

const createFace = (id: number, data: z.infer<typeof FaceSchema>): FaceType => ({
    id,
    smiley: data.smiley,
    color: data.color,
});

export function parseFace(index: number, raw: string | object): FaceType | null {
    const rawData = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const result = FaceSchema.safeParse(JSON.parse(rawData));

    if (!result.success) {
        return null
    }

    return createFace(index, result.data);
}
