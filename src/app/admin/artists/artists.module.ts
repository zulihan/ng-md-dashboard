import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistsComponent } from './artists.component';
import { ArtistsListComponent } from './artists-list/artists-list.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ArtistEditComponent } from './artist-edit/artist-edit.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { ArtistsRegisterComponent } from './artists-register/artists-register.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    PipesModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [
    ArtistsRegisterComponent
  ],
  declarations: [
    ArtistsComponent,
    ArtistsListComponent,
    ArtistDetailComponent,
    ArtistEditComponent,
    ArtistsRegisterComponent
  ]
})
export class ArtistsModule { }
