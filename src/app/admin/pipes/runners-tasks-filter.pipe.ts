import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runnersTasksFilter', pure: false
})
export class RunnersTasksFilterPipe implements PipeTransform {

  transform(values?: any, args?: any[]): any {
    if (values !== undefined) {
      return values = values.filter(a => {
        return args.length ? args.indexOf(a.taskStatus) !== -1 : values;
      });
    }
  }

}

