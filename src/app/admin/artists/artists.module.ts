import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistsComponent } from './artists.component';
import { ArtistsListComponent } from './artists-list/artists-list.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ArtistEditComponent } from './artist-edit/artist-edit.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { AdminRoutingModule } from '../admin-routing.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    PipesModule,
    AdminRoutingModule
  ],
  exports: [
  ],
  declarations: [
    ArtistsComponent,
    ArtistsListComponent,
    ArtistDetailComponent,
    ArtistEditComponent
  ]
})
export class ArtistsModule { }
