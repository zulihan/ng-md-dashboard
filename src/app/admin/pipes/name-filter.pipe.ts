import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe implements PipeTransform {

  transform(value: any, searchName: string = '') {
    if (searchName !== '') {
      const result = value.filter((pers) => pers.name.toLowerCase().startsWith(searchName)
      );
      return result;
    } else {
      return value;
    }
  }
}
