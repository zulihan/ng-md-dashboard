import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArtistsService } from '../../artists/service/artists.service';
import { Checklist } from '../../../_models/checklist';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checklist-single',
  templateUrl: './checklist-single.component.html',
  styleUrls: ['./checklist-single.component.scss']
})
export class ChecklistSingleComponent implements OnInit {
  @Input('checklist') checklist: Checklist;
  checklistForm: FormGroup;

  constructor(private fb: FormBuilder,
    private artistsService: ArtistsService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.createChecklistForm();
  }

  createChecklistForm() {
    this.checklistForm = this.fb.group({
      id: [this.checklist.id, [Validators.nullValidator]],
      artistId: [this.checklist.artistId, [Validators.nullValidator]],
      userId: [this.checklist.userId, [Validators.nullValidator]],
      invitsChecked: [this.checklist.invitsChecked, [Validators.nullValidator]],
      invitsComment: [this.checklist.invitsComment, [Validators.nullValidator]],
      sacemChecked: [this.checklist.sacemChecked, [Validators.nullValidator]],
      sacemComment: [this.checklist.sacemComment, [Validators.nullValidator]],
      recordingChecked: [this.checklist.recordingChecked, [Validators.nullValidator]],
      recordingComment: [this.checklist.recordingComment, [Validators.nullValidator]]
    });
  }

  onSubmit() {
    console.log('form value: ', this.checklistForm.value);
    const id = this.checklistForm.value.id;
    const checklist = this.checklistForm.value;
    // Because there is no native boolean data type for SQLite:
    checklist.invitsChecked = checklist.invitsChecked === true ? 1 : 0;
    checklist.recordingChecked = checklist.recordingChecked === true ? 1 : 0;
    checklist.sacemChecked = checklist.sacemChecked === true ? 1 : 0;
    checklist.userId = JSON.parse(localStorage.getItem('user')).id;

    this.artistsService.updateArtistChecklist(id, checklist)
      .subscribe(response => {
        console.log('edit checklist response: ', response);
        this.showEditSuccess();
      }, error => {
        console.log('edit checklist error: ', error);
        this.showEditError(error);
      });
  }

  showEditSuccess() {
    this.toastr.success('Checklist has been updated !');
  }

  showEditError(error) {
    this.toastr.error(error);
  }

}

// const model = {
    //   userId: form.userId,
    //   invitsChecked: form.invitsChecked,
    //   invitsComment: form.invitsComment,
    //   sacemChecked: form.sacemChecked,
    //   sacemComment: form.sacemComment,
    //   recordingChecked: form.recordingChecked,
    //   recordingComment: form.recordingComment
    // };
