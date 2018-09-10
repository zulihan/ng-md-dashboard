import { Roles } from './Roles';
import { Photo } from './photo';

export interface User {
    id: string;
    userName: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    roles: Roles;
    photo?: Photo;
}
