import { Pipe, PipeTransform } from '@angular/core';
import { Artist } from '../../_models/artist';
import { User } from '../../_models/User';

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe implements PipeTransform {

  transform(value: any, searchName: string = '') {
    if (searchName !== '') {
      const result = value.filter((pers) => pers.name.toLowerCase().startsWith(searchName) );
      return result;
    } else {
      return value;
    }
  }
}
