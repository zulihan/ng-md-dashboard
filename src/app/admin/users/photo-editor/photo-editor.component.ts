import { Component, Input, OnInit } from '@angular/core';
import { Photo } from '../../../_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/service/auth.service';
import { isNgTemplate } from '@angular/compiler';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photo;
  @Input() userToEdit: any;
  @Input() photoUrl: string;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.userToEdit.id + '/photo',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        console.log('response from photo-editor', response);
        const res: Photo = JSON.parse(response);
        // this.photo.url = res.url;
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          publicId: res.publicId
        };
        this.photo = photo;
        const currentUser = this.authService.currentUser;
        const currentUserId = currentUser.id;
        if (this.userToEdit.id === currentUserId) {
          this.authService.changeUserPhoto(photo.url);
          currentUser.photo = photo;
          currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      }
    };
  }

  deletePhoto(id: number) {
    this.userService.deletePhoto(this.userToEdit.id, id).subscribe(() => {
      this.photo.url = null;
    }, error => {
      console.log(error);
    });
  }
}
