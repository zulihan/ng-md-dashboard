import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/map';


import { ObservableMedia } from '@angular/flex-layout';
import { Artist } from '../../../_models/artist';
import { ArtistsRegisterComponent } from '../artists-register/artists-register.component';
import { ArtistsService } from 'src/app/admin/artists/service/artists.service';


@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {

  artistsInfos: Artist[];
  searchName: string;
  // TODO: change for variables
  venues = [
    { name: 'Open Air', checked: false},
    { name: 'Grand Palais', checked: false},
    { name: 'Palais Phocéen', checked: false},
    { name: 'Not set yet', checked: false}
  ];
  filterVenues = [];

  // TODO: change for variables
  days = [
    { number: '1', dayId: 1, checked: false},
    { number: '2', dayId: 2, checked: false},
    { number: '3', dayId: 3, checked: false},
    { number: 'Not set yet', dayId: 4, checked: false}
  ];
  filterDays = [];

  // veenues: ['a', 'b', 'c', 'd'];
  // daays: ['1', '2', '3'];

  cols;
  rowHeight;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private artistsService: ArtistsService,
    private observableMedia: ObservableMedia) {
  }


  ngOnInit() {

    // this.route.data.subscribe(data => {
    //   this.artistsInfos = data['artistsInfos'];
    // });

    this.artistsService.artistListObservable.subscribe(artists => this.artistsInfos = artists);
    console.log(' ArtistsListComponent -> ngOnInit -> this.artistsInfos', this.artistsInfos);

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

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(ArtistsRegisterComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  heightToCols(cols: number): number {
    if (cols === 1) {
      return 290;
    } else if (cols === 2) {
      return 300;
    } else {
      return 350;
    }

  }

}
