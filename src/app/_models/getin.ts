export interface GetIn {
    id?: number;
    artistId?: number;
    venueId: number;
    dayId: number;
    start: Date|string;
    end: Date|string;
}
