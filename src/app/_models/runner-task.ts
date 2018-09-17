import { Runner } from 'src/app/_models/runner';

export interface RunnerTask {
    id?: any;
    closedAt?: string;
    createdAt: string;
    createdBy: string;
    isDone: boolean;
    runner: Runner;
    artist: any;
    pers: number;
    from: Location;
    to: Location;
    startAt?: any;
    startAtToString: string;
    updatedAt?: string;
    status: string;
    over: any;
    type: string;
    taskStatus: string;
}
