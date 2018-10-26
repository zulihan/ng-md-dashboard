export class Enums {
    
}

export enum RunStatus {
    NotStarted = 'has not started yet',
    Started = 'has started',
    ArrivedAtDestination = 'has arrived at destination',
    OnTheWayToSecondDestination = 'is on the way to second destination',
    ArrivedAtSecondDestination = 'has arrived to second destination',
    OnTheWayBack = 'is on the way back',
    Completed = 'has completed'
}

export enum TaskStatus {
    SCHEDULED = 'scheduled',
    APPROACHING = 'approaching',
    DUE = 'due',
    LATE = 'late',
    OK = "ok",
    DONE = 'done'
}