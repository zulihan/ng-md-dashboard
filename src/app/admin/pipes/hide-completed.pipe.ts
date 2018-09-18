import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideCompleted', pure: false
})
export class HideCompletedPipe implements PipeTransform {

  transform(values?: any, args?: any[]): any {
    if (values !== undefined) {
      return values = values.filter(a => {
        if (args.length) {
          return args.indexOf(a.taskStatus) === -1;
        } else {
          return values;
        }
      });
    }
  }
}
