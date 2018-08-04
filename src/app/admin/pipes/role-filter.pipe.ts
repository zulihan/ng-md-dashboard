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



// transform(values: any, args?: any[]): any[] {
//   return values = values.filter(a => {
//     return args.length ? args.indexOf(a.status) != -1 : values;
//   })

//   transform(value: any, searchRole: string = ''): any {
//     if (searchRole !== '') {
//       const result = value.filter((pers) => pers.role.toLowerCase().includes(searchRole));
//       return result;
//     } else {
//       return value;
//     }


// transform(values: any[], args?: any[]): any[] {
//   if (args.length !== 0) {
//     for ( let i = 0; i < args.length; i++) {
//       const result = values.filter((users) => users.role.toLowerCase().includes(args[i]));
//       return result;
//     }
//   } else {
//     return values;
//   }
// }
