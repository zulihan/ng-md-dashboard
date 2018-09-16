export interface SoundCheck {
    id?: number;
    artistId?: number;
    artist?: any;
    venueId: number;
    dayId: number;
    start: Date|string;
    end: Date|string;
}
