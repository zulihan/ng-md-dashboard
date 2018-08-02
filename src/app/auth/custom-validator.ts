// import { HttpClient } from '@angular/common/http';
// import { AbstractControl } from '@angular/forms';
// import { Injectable } from '@angular/core';
// import { debounceTime, take, map, } from 'rxjs/operators';


// @Injectable({
//     providedIn: 'root'
// })
// export class CustomValidator {


//     constructor(private http: HttpClient) {}

//     static username() {
//         return (control: AbstractControl) => {
//             const username = control.value.toLowerCase();

//             return this.http.get(
//                 'http://localhost:5000/api/users', ref => ref.where('username', '==', username)
//             ).pipe(
//                 debounceTime(500),
//                 take(1),
//                 map( arr => arr.length ? { usernameAvailable: false} : null),
//             );
//         };
//     }

// }

