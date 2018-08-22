import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userNameFilter'
})
export class UserNameFilterPipe implements PipeTransform {

  transform(value: any, searchName: string = '') {
    if (searchName !== '') {
      const result = value.filter((pers) => pers.userName.toLowerCase().startsWith(searchName)
      );
      return result;
    } else {
      return value;
    }
  }
}
