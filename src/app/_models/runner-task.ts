import { Runner } from 'src/app/_models/runner';

export interface RunnerTask {
    id?: any;
    closedAt?: string;
    createdAt: string;
    createdBy: string;
    isDone: boolean;
    runner: Runner;
    artist: string;
    pers: number;
    from: Location;
    to: Location;
    startAt?: string;
    updatedAt?: string;
    status: string;
}
