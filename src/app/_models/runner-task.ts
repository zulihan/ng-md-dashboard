import { Runner } from 'src/app/_models/runner';
import { Place } from './place';

export interface RunnerTask {
    id?: any;
    closedAt?: any;
    createdAt?: any;
    createdBy: string;
    isDone: boolean;
    runner: Runner;
    artist: any;
    pers: number;
    from: Place;
    to: Place;
    startAt?: any;
    startAtToString: string;
    updatedAt?: any;
    status: string;
    over: any;
    type: string;
    taskStatus: string;
    runId: string;
    estimatedDuration: any;
    distance: any;
}
