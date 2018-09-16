export interface Show {
    id?: number;
    artist?: any;
    artistId?: number;
    venueId: number;
    dayId: number;
    start: Date|string  ;
    end: Date|string;
}
