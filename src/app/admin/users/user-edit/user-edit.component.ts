import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  editForm: FormGroup;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles = ['admin', 'host', 'runner'];
  userToEdit = this.data.dataKey;
  photoUrl: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data.dataKey);
    this.createEditForm();
    console.log(this.userToEdit);
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createEditForm() {
    this.editForm = this.fb.group({
      email: [this.userToEdit.email, [Validators.required, Validators.pattern(this.emailPattern)]],
      name: [this.userToEdit.name, [Validators.required, Validators.minLength(2)]],
      phone: [this.userToEdit.phone, [Validators.required, Validators.minLength(10), , Validators.maxLength(10)]],
      role: [this.userToEdit.role]
    });
  }


  onSubmit() {
    const name = this.editForm.value.name;
    const password = this.editForm.value.password;
    this.userService.updateUser(this.userToEdit.id, this.editForm.value).subscribe( next => {
      this.showUpdateSuccess(name);
      console.log(this.editForm.value);
    }, error => {
      console.log(error);
      this.showUpdateError(error);
    });
  }

  showUpdateSuccess(name) {
    this.toastr.success('You\'ve susccesfully updated ' + name + '\'s profile');
  }

  showUpdateError(response) {
    this.toastr.error(response.error);
  }

}
