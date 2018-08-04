import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/startWith';

import { ObservableMedia } from '@angular/flex-layout';
import { Artist } from '../../../_models/artist';



@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {

  artistsInfos: Artist[];
  // artistsCards: Observable<any[]>;
  // artists;
  searchName;

  cols;
  rowHeight;

  constructor(
    private route: ActivatedRoute,
    private observableMedia: ObservableMedia) {

      // return this.artists;
      // this.artistsInfos.subscribe( artists => this.artists = artists);
    }


  ngOnInit() {

    this.route.data.subscribe(data => {
      this.artistsInfos = data['artistsInfos'];
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

  heightToCols(cols: number): number {
    if (cols === 1) {
      return 250;
    } else if (cols === 2) {
      return 270;
    } else {
      return 300;
    }

  }

}


// This code works
// https://github.com/angular/material2/issues/10395
// https://brianflove.com/2017/05/03/responsive-angular/


// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ArtistsService } from '../service/artists.service';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/takeWhile';
// import 'rxjs/add/operator/startWith';

// import { ObservableMedia } from '@angular/flex-layout';


// @Component({
//   selector: 'app-artists-list',
//   templateUrl: './artists-list.component.html',
//   styleUrls: ['./artists-list.component.scss']
// })
// export class ArtistsListComponent implements OnInit, OnDestroy {

//   artistsInfos: Observable<any[]>;
//   artistsCards: Observable<any[]>;

//   cols;
//   rowHeight;

//   constructor(
//     private artistsService: ArtistsService,
//     private observableMedia: ObservableMedia) {}


//   ngOnInit() {
//     const grid = new Map([
//       ['xs', 1],
//       ['sm', 1],
//       ['md', 2],
//       ['lg', 4],
//       ['xl', 4]
//     ]);

//     let start: number;

//     grid.forEach((cols, mqAlias) => {
//       if (this.observableMedia.isActive(mqAlias)) {
//         start = cols;
//       }
//     });

//     // on breakpoint, assign cols AND ROW HEIGHT appropriately
//     this.cols = this.observableMedia.asObservable()
//       .map(change => {

//         this.rowHeight = this.heightToCols(grid.get(change.mqAlias));
//         console.log(this.rowHeight);

//         return grid.get(change.mqAlias);

//       })
//       .startWith(start);

//     this.artistsInfos = this.artistsService.getArtists();
//   }

//   ngOnDestroy() {}

//   heightToCols(cols: number): number {
//     if (cols === 1) {
//       return 450;
//     } else if (cols === 2) {
//       return 500;
//     } else {
//       return 550;
//     }

//   }

// }




// This code works

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ArtistsService } from '../service/artists.service';
// import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { Layout } from 'src/app/_models/Layout';


// @Component({
//   selector: 'app-artists-list',
//   templateUrl: './artists-list.component.html',
//   styleUrls: ['./artists-list.component.scss']
// })
// export class ArtistsListComponent implements OnInit, OnDestroy {

//   artistsInfos: Observable<any[]>;
//   artistsCards: Observable<any[]>;

//   layoutBS = new BehaviorSubject<Layout>({ cols: 1, rows: 1 });
//   layoutOb = this.layoutBS.asObservable();
//   currentLayout = this.layoutOb.subscribe(layout => this.layout = layout);
//   layout: Layout;
//   isSmallScreen: boolean;

//   constructor(
//     private artistsService: ArtistsService,
//     private breakpointObserver: BreakpointObserver) {}


//   ngOnInit() {
//     this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(
//       ( {matches} ) => {
//         if (matches) {
//           this.isSmallScreen = true;
//           console.log('Xsmall:', matches);
//           this.layoutBS.next({ cols: 4, rows: 1 });
//         }
//       }
//     );

//     this.breakpointObserver.observe(Breakpoints.Tablet).subscribe(
//       ( {matches} ) => {
//         if (matches) {
//           console.log('Tablet:', matches);
//           this.layoutBS.next({ cols: 2, rows: 1 });
//         }
//       }
//     );

//     this.breakpointObserver.observe(Breakpoints.Web).subscribe(
//       ( {matches} ) => {
//         if (matches) {
//           console.log('Web:', matches);
//           this.layoutBS.next({ cols: 1, rows: 1 });
//         }
//       }
//     );

//     this.artistsInfos = this.artistsService.getArtists();
//   }

//   ngOnDestroy() {
//     this.currentLayout.unsubscribe();
//   }

// }













// else {
//   this.layoutBS.next({ cols: 1, rows: 1 });
// }

// this.layout = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
//   map(({ matches }) => {
//     if (matches) {
//       this.isSmallScreen = true;
//       return { cols: 4, rows: 1 };
//     } else {
//       return { cols: 1, rows: 1 };
//     }
//   })
// );

// this.artistsCards = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
//           .pipe(
//             map(({ matches }) => {
//               const artistsCardsArray: any[] = [];
//               if (matches) {
//                 for (let i = 0; i < this.artistsInfos.length; i++) {
//                   this.artistsInfos[i].rows = 1;
//                   this.artistsInfos[i].cols = 4;
//                   artistsCardsArray.push(this.artistsInfos[i]);
//                 }
//                 return artistsCardsArray;
//               } else {
//                 for (let i = 0; i < this.artistsInfos.length; i++) {
//                   this.artistsInfos[i].rows = 1;
//                   this.artistsInfos[i].cols = 1;
//                   artistsCardsArray.push(this.artistsInfos[i]);
//                 }
//                 return artistsCardsArray;
//               }
//           }));
//           console.log(this.artistsCards);


// layoutBS = new BehaviorSubject<Layout>({ cols: 4, rows: 1 });
// currentLayout = this.layoutBS.asObservable();
// displayLayout = this.currentLayout.subscribe( lay => this.displayLayout = lay);


// this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
//   map(({ matches }) => {
//     if (matches) {
//       return  this.layout =  { cols: 4, rows: 1 };
//     }
//     return  this.layout = { cols: 1, rows: 1 };
//   })
// );



// this.artistsService.getArtists().subscribe(
//   artists => {
//     this.artists = artists;

//     this.artistsCards = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
//       map(({ matches }) => {
//         const artistsCardsArray: any[] = [];
//         if (matches) {
//           for (let i = 0; i < this.artists.length; i++) {
//             this.artists[i].rows = 1;
//             this.artists[i].cols = 4;
//             artistsCardsArray.push(this.artists[i]);
//           }
//           return artistsCardsArray;
//         } else {
//           for (let i = 0; i < this.artists.length; i++) {
//             this.artists[i].rows = 1;
//             this.artists[i].cols = 1;
//             artistsCardsArray.push(this.artists[i]);
//           }
//           return artistsCardsArray;
//         }
//       })
//     );
//   }
// );
// console.log('artistsCards:', this.artistsCards.subscribe(
//   artistCard => artistCard
// ));





// this.artistsCards = this.artists.map(
//   artist => {
//     artist.cols = 1;
//     artist.rows = 1;
//   }
//   );
// return this.artistsCards;



// this.xsmallScreenMatcher = this.mediaMatcher.matchMedia('(max-width: 599px)');
//     this.xsmallScreenMatcher.addListener(this.myListener);
//   }

//     ngOnDestroy() {
//       this.xsmallScreenMatcher.removeListener(this.myListener);
//     }

//     changel(layout) {
//       this.test = layout;
//     }


//     myListener(event) {
//       const _this = this;
//       console.log(event.matches ? 'match' : 'no match');
//       ArtistsListComponent.bind(this);
//       // this.layout = event.matches ? { cols: 4, rows: 1 } : { cols: 1, rows: 1 };
//       if ( event.matches) {
//         console.log('this:', this);
//         this.layoutBS.next({ cols: 1, rows: 1 });
//         this.currentLayout = this.layoutBS.asObservable();
