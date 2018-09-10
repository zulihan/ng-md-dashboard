import { Geopoint } from './Geopoint';

export interface Hotel {
    id: number;
    name: string;
    address: string;
    phone: string;
    geolocation: Geopoint;
}
