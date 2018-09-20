import { Runner } from 'src/app/_models/runner';
import { Place } from './place';

export interface RunnerTask {
    id?: any;
    closedAt?: string;
    createdAt: string;
    createdBy: string;
    isDone: boolean;
    runner: Runner;
    artist: any;
    pers: number;
    from: Place;
    to: Place;
    startAt?: any;
    startAtToString: string;
    updatedAt?: string;
    status: string;
    over: any;
    type: string;
    taskStatus: string;
}
