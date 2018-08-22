import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayFilter', pure: false
})
export class DayFilterPipe implements PipeTransform {
  transform(values?: any, args?: any[]): any {
    if (values !== undefined) {
      return values = values.filter(a => {
        return args.length ? args.indexOf(a.dayId) !== -1 : values;
      });
    }
  }
}
