export interface Checklist {
    id: number;
    artistId: number;
    artist?: string;
    dayId?: number;
    userId?: number;
    invitsChecked: boolean;
    invitsComment: string;
    sacemChecked: boolean;
    sacemComment: string;
    recordingChecked: boolean;
    recordingComment: string;
}
