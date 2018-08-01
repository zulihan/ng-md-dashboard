import { Scope } from './_models/scope';

export class Timetable {

    scope: Scope;
    artists = [];
    events = [];
    newArtists = [];
    scopeDurationHours: number;

    constructor() {
        this.scope = {
            hourStart: 0,
            hourEnd: 24
          };
        this.artists = [];
        this.events = [];
        this.scopeDurationHours = this.getDurationHours(this.scope.hourStart, this.scope.hourEnd);
    }

    setScope(start, end) {
        if (this.isValidHourRange(start, end)) {
            this.scope.hourStart = start;
            this.scope.hourEnd = end;
        } else {
            throw new RangeError('Timetable scope should consist of (start, end) in whole hours from 0 to 23');
        }
        return this.scope;
    }

    hasProperFormat(newArtists) {
        return this.newArtists instanceof Array;
    }

    addArtists(newArtists) {
        const existingArtists = this.artists;

        if (this.hasProperFormat(newArtists)) {
            newArtists.forEach ( artist => {
                if (!this.artistExistsIn(artist, existingArtists)) {
                    existingArtists.push(artist);
                } else {
                    throw new Error('Artist already exists');
                }
            });

        } else {
            throw new Error('Tried to add artists in wrong format');
        }
        console.log('this:', this);
        // return this;
    }

    addEvent(name, artist, start, end, options) {
        if (!this.artistExistsIn(artist, this.artists)) {
            throw new Error('Unknown artist');
        }
        if (!this.isValidTimeRange(start, end)) {
            throw new Error('Invalid time range: ' + JSON.stringify([start, end]));
        }

        const optionsHasValidType = Object.prototype.toString.call(options) === '[object Object]';

        this.events.push({
            name: name,
            artist: artist,
            startDate: start,
            endDate: end,
            options: optionsHasValidType ? options : undefined
        });

        // return this;
    }

    isValidHourRange(start, end) {
        return this.isValidHour(start) && this.isValidHour(end);
    }

    isValidHour(number) {
        return this.isInt(number) && this.isInHourRange(number);
    }

    isInt(number) {
        return number === parseInt(number, 10);
    }

    isInHourRange(number) {
        return number >= 0 && number < 24;
    }

    artistExistsIn(art, arts) {
        return arts.indexOf(art) !== -1;
    }

    isValidTimeRange(start, end) {
        const correctTypes = start instanceof Date && end instanceof Date;
        const correctOrder = start < end;
        return correctTypes && correctOrder;
    }

    getDurationHours(startHour, endHour) {
        return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
    }

    prettyFormatHour(hour) {
        const prefix = hour < 10 ? '0' : '';
        return prefix + hour + ':00';
    }

}
