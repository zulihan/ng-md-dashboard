import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RegisterComponent } from '../../auth/register/register.component';

import { UserService } from './service/user.service';

import { ObservableMedia } from '@angular/flex-layout';

import { User } from '../../_models/User';
import { UserEditComponent } from './user-edit/user-edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewChecked {

  users: User[];
  searchName: string;
  rolesStatus = [
    { role: 'admin', checked: false },
    { role: 'host', checked: false },
    {role: 'runner', checked: false }
  ];
  filterArr = [];
  admin;
  host;
  runner;

  cols;
  rowHeight;

  constructor(
    public dialog: MatDialog,
    private observableMedia: ObservableMedia,
    private userService: UserService) { }

  ngOnInit() {
    console.log('filerArr: ', this.filterArr.length);
    this.userService.getUsers().subscribe( response => {
      this.users = response;
      console.log('users: ', response);
    }, error => {
      console.log(error);
    });

    const grid = new Map([
      ['xs', 1],
      ['sm', 1],
      ['md', 2],
      ['lg', 4],
      ['xl', 4]
    ]);

    let start: number;

    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });

    // on breakpoint, assign cols AND ROW HEIGHT appropriately
    this.cols = this.observableMedia.asObservable()
      .map(change => {

        this.rowHeight = this.heightToCols(grid.get(change.mqAlias));
        // console.log(this.rowHeight);

        return grid.get(change.mqAlias);

      })
      .startWith(start);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openEdit(user): void {
    console.log(user);
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '400px',
      data: {
        dataKey: user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  heightToCols(cols: number): number {
    if (cols === 1) {
      return 250;
    } else if (cols === 2) {
      return 270;
    } else {
      return 300;
    }

  }

  updateFilter(role) {
    console.log(role);
    if (role.checked) {
      this.filterArr.push(role.checked);
    } else {
      const index = this.filterArr.indexOf(role.checked);
      this.filterArr.splice(index, 1);
    }
    console.log(this.filterArr);
    // console.log('role:', this.roles);
  }

  ngAfterViewChecked() {
    // console.log(this.roles);
  }

}


// if (role.checked) {
//   // checkbox is checked, push to filterArr
//   this.filterArr.push(role.status);
// } else {
//   // unchecked box, let's remove it from array
//   const index = this.filterArr.indexOf(role.status)
//   this.filterArr.splice(index, 1);
// }
