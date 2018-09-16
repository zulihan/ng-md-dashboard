import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { MaterialModule } from '../../material/material.module';
import { PipesModule } from '../pipes/pipes.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';



import { ChecklistSingleComponent } from '../checklist/checklist-single/checklist-single.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule

  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    ChecklistSingleComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule
  ],
  declarations: [ChecklistSingleComponent]
})
export class SharedModule { }
