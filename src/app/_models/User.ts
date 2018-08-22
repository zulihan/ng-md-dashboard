import { Roles } from './Roles';
import { Photo } from 'src/app/_models/photo';

export interface User {
    id: string;
    userName: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    roles: Roles;
    photo?: Photo;
}
