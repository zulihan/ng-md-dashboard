import { Scope } from './scope';

export interface Tt {
    events: Array<{}>;
    artists: Array<string>;
    newArtists: Array<string>;
    scope: Scope;
    scopeDurationHours: number;
}
