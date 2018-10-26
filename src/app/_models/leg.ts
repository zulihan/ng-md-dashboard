import { Place } from './place';

export interface Leg {
    started_at: number;
    completed_at: any;
    distance: number;
    duration: number;
    perc_dist_travelled: number;
    from: Place;
    to: Place;
}
