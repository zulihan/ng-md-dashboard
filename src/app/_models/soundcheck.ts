export interface SoundCheck {
    id?: number;
    artistId?: number;
    venueId: number;
    dayId: number;
    start: Date|string;
    end: Date|string;
}
