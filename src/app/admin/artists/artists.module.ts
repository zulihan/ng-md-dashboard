import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { AdminRoutingModule } from '../admin-routing.module';
// import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
// import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

import { ArtistsComponent } from './artists.component';
import { ArtistsListComponent } from './artists-list/artists-list.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ArtistEditComponent } from './artist-edit/artist-edit.component';
import { ArtistsRegisterComponent } from './artists-register/artists-register.component';

// export const MOMENT_FORMATS = {
//   parseInput: 'l LT',
//   fullPickerInput: 'l LT',
//   datePickerInput: 'l',
//   timePickerInput: 'LT',
//   monthYearLabel: 'MMM YYYY',
//   dateA11yLabel: 'LL',
//   monthYearA11yLabel: 'MMMM YYYY',
// };

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
    AdminRoutingModule,
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
  ],
  // providers: [
  //   // use french locale
  //   {provide: OWL_DATE_TIME_FORMATS, useValue: MOMENT_FORMATS},
  // ],
})
export class ArtistsModule { }
