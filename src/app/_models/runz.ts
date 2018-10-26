import { Leg } from './leg';

export interface Runz {
    id?: any;
    started_at: number | null;
    dist_travelled: number | null;
    distance_total: number;
    duration_total: number;
    estimated_duration: number;
    percent_dist_travelled: number | null;
    from: string;
    to: string;
    legs: Leg;
    status: string;
    type: string;
}
