import { Roles } from './Roles';

export interface User {
    uid: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    displayName?: string;
    roles?: Roles;
}
