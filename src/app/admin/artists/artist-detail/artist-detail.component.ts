import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {MatDialog} from '@angular/material';

import { Artist } from '../../../_models/artist';
import { GetIn } from '../../../_models/getin';

import { ObservableMedia } from '@angular/flex-layout';
import { ArtistsService } from '../service/artists.service';
import { ToastrService } from 'ngx-toastr';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/startWith';
import { ArtistEditComponent } from '../artist-edit/artist-edit.component';
import { Checklist } from 'src/app/_models/checklist';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {

  artist: any;
  checklist: Checklist;

  cols;
  rowHeight;

  constructor(
    public dialog: MatDialog,
    private artistsService: ArtistsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private observableMedia: ObservableMedia) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.artist = data['artist'];
      this.checklist = data['artist']['checklist'];

      if ((this.artist.getIn != null || undefined) &&
          (this.artist.getIn.start != null || undefined) &&
          (this.artist.getIn.end != null || undefined)) {
        this.artist.getIn.start = new Date(this.artist.getIn.start);
        this.artist.getIn.end = new Date(this.artist.getIn.end);
      } else if (this.artist.getIn === null || undefined) {
        this.artist.getIn = {
          id: null,
          artistId: null,
          venueId: null,
          dayId: null,
          start: null,
          end: null
        };
      }

      if ((this.artist.setUpWings != null || undefined) &&
          (this.artist.setUpWings.start != null || undefined) &&
          (this.artist.setUpWings.end != null || undefined) ) {
        this.artist.setUpWings.start = new Date(this.artist.setUpWings.start);
        this.artist.setUpWings.end = new Date(this.artist.setUpWings.end);
      } else if (this.artist.setUpWings === null || undefined) {
        this.artist.setUpWings = {
          id: null,
          artistId: null,
          venueId: null,
          dayId: null,
          start: null,
          end: null
        };
      }

      if ((this.artist.soundCheck != null || undefined) &&
          (this.artist.soundCheck.start != null || undefined) &&
          (this.artist.soundCheck.end != null || undefined)) {
        this.artist.soundCheck.start = new Date(this.artist.soundCheck.start);
        this.artist.soundCheck.end = new Date(this.artist.soundCheck.end);
      } else if (this.artist.soundCheck === null || undefined) {
        this.artist.soundCheck = {
          id: null,
          artistId: null,
          venueId: null,
          dayId: null,
          start: null,
          end: null
        };
      }

      if ((this.artist.show != null || undefined) &&
          (this.artist.show.start != null || undefined) &&
          (this.artist.show.end != null || undefined)) {
        this.artist.show.start = new Date(this.artist.show.start);
        this.artist.show.end = new Date(this.artist.show.end);
      } else if (this.artist.show === null || undefined) {
        this.artist.show = {
          id: null,
          artistId: null,
          venueId: null,
          dayId: null,
          start: null,
          end: null
        };
      }

      this.artistsService.artistDetails.next(this.artist);
      console.log('artist from artist detail after updateArtist', this.artist);
      this.artistsService.afterEditArtist.subscribe(artist => this.artist = artist);
      console.log('artist from artist detail after edited artist subscribe', this.artist);

      // this.artistsService.getArtistChecklist(this.artist.id)
      // .subscribe(checklist => {
      //   this.checklist = checklist;
      //   console.log('checklist : ', this.checklist);
      // });


    });

    console.log('artist detail: ', this.artist);

    const grid = new Map([
      ['xs', 2],
      ['sm', 2],
      ['md', 4],
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

  heightToCols(cols: number): number {
    if (cols === 1) {
      return 450;
    } else if (cols === 2) {
      return 450;
    } else {
      return 450;
    }

  }

  openEdit(artist): void {
    console.log('artist from openEdit', artist);
    const dialogRef = this.dialog.open(ArtistEditComponent, {
      width: '500px',
      data: {
        dataKey: artist
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  deleteArtist(id, name) {
    if (confirm('Are you sure to delete ' + name.toUpperCase() + ' ?')) {
      this.artistsService.deleteArtist(id)
        .subscribe(response => {
          console.log('response from deleteArtist: ', response);
          this.showEditSuccess(name);
          this.router.navigate(['admin/artists']);
        }, error => {
          this.showEditError(error);
        });
    }
  }

  showEditSuccess(name) {
    this.toastr.success('You\'ve susccesfully deleted artist ' + name.toUpperCase());
  }

  showEditError(response) {
    this.toastr.error(response.error);
  }

  // loadArtist() {
  //   this.artistsService.getArtist(+this.route.snapshot.params['id'])
  //     .subscribe( (artist: Artist) => {
  //       this.artist = artist;
  //     }, error => {
  //       this.toastr.error(error);
  //     }
  //   );
  // }

}


// this.artist.getIn.start = this.artist.getIn != null || undefined ?
//         new Date(this.artist.getIn.start) : this.artist.getIn =  null;
//       this.artist.getIn.end = this.artist.getIn != null || undefined ?
//         new Date(this.artist.getIn.end) : this.artist.getIn = null;
//       this.artist.setUpWings.start = this.artist.setUpWings != null || undefined ?
//         new Date(this.artist.setUpWings.start) : this.artist.setUpWings = null;
//       this.artist.setUpWings.end = this.artist.setUpWings != null || undefined ?
//         new Date(this.artist.setUpWings.end) : this.artist.setUpWings  = null;
//       this.artist.soundCheck.start = this.artist.soundCheck != null || undefined ?
//         new Date(this.artist.soundCheck.start) : this.artist.soundCheck = null;
//       this.artist.soundCheck.end = this.artist.soundCheck != null || undefined ?
//         new Date(this.artist.soundCheck.end) : this.artist.soundCheck = null;
//       this.artist.show.start = this.artist.show != null || undefined ?
//         new Date(this.artist.show.start) : this.artist.show = null;
//       this.artist.show.end = this.artist.show != null || undefined ?
//         new Date(this.artist.show.end) : this.artist.show = null;

