import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Renderer2 } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { GetIn } from 'src/app/_models/getin';
import { TimetablesService } from '../_service/timetables.service';
import { ArtistsService } from '../../artists/service/artists.service';
import { Artist } from '../../../_models/artist';

@Component({
  selector: 'app-day-one-timetable',
  templateUrl: './day-one-timetable.component.html',
  styleUrls: ['./day-one-timetable.component.scss']
})
export class DayOneTimetableComponent implements OnInit, AfterViewInit {

  @ViewChild('timetableOne') timetableDayOne: ElementRef;
  selector;
  timetable: Timetable;
  timeTableDayOne: any;

  // @ViewChild('timetableTwo') secondTimetable: ElementRef;
  // selectorTwo;
  // timetableVenueTwo: Timetable;

  // @ViewChild('timetableOne') thirdTimetable: ElementRef;
  // selectorThree;
  // timetableVenueThree: Timetable;

  scope: Scope;

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  artists: Artist[];

  getInOptions = {
    url: '', // makes the event clickable
    class: 'getin', // additional css class
    data: { // each property will be added to the data-* attributes of the DOM node for this event
      id: 4,
      ticketType: 'VIP'
    },
    onClick: function(event) {
        window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
      }
    // custom click handler, which is passed the event object and full timetable as context
  };

  setUpWingsOptions = {
    url: '',
    class: 'setupwings',
  };

  soundChecksOptions = {
    url: '',
    class: 'soundcheck',
  };

  showsOptions = {
    url: '',
    class: 'show',
  };

  constructor(private timeTableService: TimetablesService, private artistService: ArtistsService) {
    this.timetable = new Timetable();
    // this.timetableVenueTwo = new Timetable();
    // this.timetableVenueThree = new Timetable();
  }

  ngOnInit() {
    this.selector =  this.timetableDayOne.nativeElement;
    // this.selectorTwo = this.secondTimetable.nativeElement;
    // this.selectorThree = this.thirdTimetable.nativeElement;
    this.artistService.getArtistsByDay(1)
      .subscribe(artists => this.artists = artists);

    this.timeTableService.getTimeTableByDay(1)
      .subscribe(response => {
        this.timeTableDayOne = response;
        this.addTimeTable(this.timetable, this.selector, this.timeTableDayOne);
        console.log('getIns day one: ', this.timeTableDayOne );
        // this.addTimeTable(this.timetableVenueTwo, this.selectorTwo, this.getInsDayOne, 2);
        // this.addTimeTable(this.timetableVenueThree, this.selectorThree, this.getInsDayOne, 3);
      }, error => {
        console.log(error);
      });

  }

  ngAfterViewInit() {

}

  addTimeTable(tt, selector, timeTable) {
    tt.setScope(10, 10);

    console.log('Get Ins from addTimeTable method: ', timeTable);

    // const getInsByVenue = getIns.filter(g => g.venueId === venueId);
    const artists: string[] = [];
    console.log('artists from getins', artists);
    console.log('artists: ', this.artists);
    this.artists.forEach(a => artists.push(a.name.toUpperCase()));
    tt.addArtists(artists);

    // getInsByVenue.forEach(g => {
    //   console.log('getInsByVenue.forEach', g.artist);
    //   console.log('time tesst', g.start);
    // });

    timeTable.getIns.value.forEach(g => {
      if (g.start && g.end !== null) {
        tt.addEvent('GI', g.artist.toUpperCase(), new Date(g.start), new Date(g.end), this.getInOptions);
        console.log('g.start from forEach', g.start);
      }
    });

    timeTable.setUpWings.value.forEach(suw => {
      if (suw.start && suw.end !== null) {
        tt.addEvent('SUW', suw.artist.toUpperCase(), new Date(suw.start), new Date(suw.end), this.setUpWingsOptions);
        console.log('g.start from forEach', suw.start);
      }
    });

    timeTable.soundChecks.value.forEach(sc => {
      if (sc.start && sc.end !== null) {
        tt.addEvent('SC', sc.artist.toUpperCase(), new Date(sc.start), new Date(sc.end), this.soundChecksOptions);
        console.log('sc.start from forEach', sc.start);
      }
    });

    timeTable.shows.value.forEach(s => {
      if (s.start && s.end !== null) {
        tt.addEvent('S', s.artist.toUpperCase(), new Date(s.start), new Date(s.end), this.showsOptions);
        console.log('s.start from forEach', s.start);
      }
    });

    const renderer = new Renderer(tt);
    renderer.draw(selector);
    console.log('timeNow from day-one-component in addTimeTable method: ', this.timeNow);
    document.getElementById('time').scrollIntoView();
  }

}




// addTimeTable(tt) {
//   tt.setScope(9, 9);

//   tt.addArtists(['Lord Esperanza', 'Biffty & DJ Weedim', 'Ho99o9', 'Gangue', 'Myth Syzer']);

//   tt.addEvent('GI', 'Lord Esperanza', new Date(2018, 8, 25, 17, 15), new Date(2018, 8, 25, 17, 30), this.options);
//   tt.addEvent('GI', 'Biffty & DJ Weedim', new Date(2018, 8, 25, 16, 15), new Date(2018, 8, 25, 16, 30), this.options);

//   tt.addEvent('GI', 'Ho99o9', new Date(2018, 8, 27, 9), new Date(2018, 8, 27, 10), { url: '#' });

//   tt.addEvent('GI', 'Gangue', new Date(2018, 8, 22, 9), new Date(2018, 8, 22, 10), {  onClick: function(event) {
//     window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
//   }} );
//   tt.addEvent('GI', 'Myth Syzer', new Date(2018, 8, 22, 9), new Date(2018, 8, 22, 10), {  onClick: function(event) {
//     window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
//   }} );

//   this.renderer = new Renderer(tt);
//   this.renderer.draw(this.selector);
//   console.log('timeNow from day-one-component in addTimeTable method: ', this.timeNow);
// }
