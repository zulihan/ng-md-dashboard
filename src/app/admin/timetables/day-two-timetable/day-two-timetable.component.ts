import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';
import { TimetablesService } from '../_service/timetables.service';
import { ArtistsService } from '../../artists/service/artists.service';
import { Artist } from '../../../_models/artist';

@Component({
  selector: 'app-day-two-timetable',
  templateUrl: './day-two-timetable.component.html',
  styleUrls: ['./day-two-timetable.component.scss']
})
export class DayTwoTimetableComponent implements OnInit {

  @ViewChild('timetableTwo') timetableDayTwo: ElementRef;
  selector;
  timetable: Timetable;
  timeTableDayTwo: any;

  scope: Scope;
  scopeTime: number;

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  artists: Artist[];
  day: number;

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
  }

  ngOnInit() {
    this.selector =  this.timetableDayTwo.nativeElement;
    this.artistService.getArtistsByDay(2)
      .subscribe(artists => {
        this.artists = artists;
        this.day = artists[0].dayId;
        return this.artists;
      });

    this.timeTableService.getTimeTableByDay(2)
      .subscribe(response => {
        this.timeTableDayTwo = response;
        this.addTimeTable(this.timetable, this.selector, this.timeTableDayTwo);
        console.log(' DayTwoTimetableComponent -> ngOnInit -> this.timeTableDayTwo', this.timeTableDayTwo);
      }, error => {
        console.log(' DayTwoTimetableComponent -> ngOnInit -> error', error);
      });
  }

  setScopeTime(timeTable) {
    const getInsStart = [];

    timeTable.getIns.value.forEach(g => {
      getInsStart.push(g.start);
    });

    const getInsStartumber = getInsStart.map(gis => {
      return gis = Number(new Date(gis));
    });

    const earliestGetIn = getInsStartumber.reduce((a, b) => {
        return Math.min(a, b);
      });

    return new Date(earliestGetIn).getHours();
  }


  addTimeTable(tt, selector, timeTable) {
    const artists: string[] = [];
    this.scopeTime = this.setScopeTime(timeTable);

    console.log(' DayTwoTimetableComponent -> addTimeTable -> this.scopeTime', this.scopeTime);
    console.log(' DayTwoTimetableComponent -> addTimeTable -> timeTable', timeTable);
    console.log(' DayTwoTimetableComponent -> addTimeTable -> artists', artists);
    console.log(' DayTwoTimetableComponent -> addTimeTable -> this.artists', this.artists);

    tt.setScope(this.scopeTime, this.scopeTime);
    this.artists.forEach(a => artists.push(a.name.toUpperCase()));
    tt.addArtists(artists);

    timeTable.getIns.value.forEach(g => {
      if (g.start && g.end !== null) {
        tt.addEvent('GI', g.artist.toUpperCase(), new Date(g.start), new Date(g.end), this.getInOptions);
      }
    });

    timeTable.setUpWings.value.forEach(suw => {
      if (suw.start && suw.end !== null) {
        tt.addEvent('SUW', suw.artist.toUpperCase(), new Date(suw.start), new Date(suw.end), this.setUpWingsOptions);
      }
    });

    timeTable.soundChecks.value.forEach(sc => {
      if (sc.start && sc.end !== null) {
        tt.addEvent('SC', sc.artist.toUpperCase(), new Date(sc.start), new Date(sc.end), this.soundChecksOptions);
      }
    });

    timeTable.shows.value.forEach(s => {
      if (s.start && s.end !== null) {
        tt.addEvent('Show', s.artist.toUpperCase(), new Date(s.start), new Date(s.end), this.showsOptions);
      }
    });

    const renderer = new Renderer(tt);
    renderer.draw(selector);
    console.log(' DayTwoTimetableComponent -> addTimeTable -> this.timeNow', this.timeNow);
    document.getElementById('time').scrollIntoView();
  }

}
