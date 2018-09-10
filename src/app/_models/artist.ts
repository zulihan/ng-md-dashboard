import { Hotel } from './hotel';
import { Show } from './show';
import { GetIn } from './getin';
import { SetUpWings } from './setupwings';
import { SoundCheck } from './soundcheck';
import { Venue } from './venue';

export interface Artist {
    id?: number;
    name: string;
    photoUrl: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    onRoad: number;
    onStage: number;
    hotel?: Hotel;
    dayId: number;
    day?: string;
    show: Show;
    getIn: GetIn;
    setUpWings: SetUpWings;
    soundCheck: SoundCheck;
    venueId: number;
    venue?: string;
}
