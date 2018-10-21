import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleFilter', pure: false
})
export class RoleFilterPipe implements PipeTransform {
  transform(values?: any, args?: any[]): any {
    if (values !== undefined) {
      return values = values.filter(a => {
        return args.length ? args.indexOf(a.role) !== -1 : values;
      });
    }
  }
}
