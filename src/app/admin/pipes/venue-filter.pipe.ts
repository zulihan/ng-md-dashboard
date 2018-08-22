import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'venueFilter', pure: false
})
export class VenueFilterPipe implements PipeTransform {
  transform(values?: any, args?: any[]): any {
    if (values !== undefined) {
      return values = values.filter(a => {
        return args.length ? args.indexOf(a.venue) !== -1 : values;
      });
    }
  }
}
