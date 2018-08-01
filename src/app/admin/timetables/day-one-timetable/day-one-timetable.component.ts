import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Renderer2 } from '@angular/core';

import { Timetable } from '../_timetable/timetable';
import { Renderer } from '../_timetable/renderer';
import { Scope } from '../_timetable/_models/scope';

@Component({
  selector: 'app-day-one-timetable',
  templateUrl: './day-one-timetable.component.html',
  styleUrls: ['./day-one-timetable.component.scss']
})
export class DayOneTimetableComponent implements OnInit, AfterViewInit {

  options = {
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


  @ViewChild('timetableOne') firstTimetable: ElementRef;
  selector;
  timetableOne: Timetable;
  renderer: Renderer;
  scope: Scope;
  artists = [];
  events = [];
  zone;
  render;

  dateNow = new Date();
  timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

  constructor() {
    this.timetableOne = new Timetable();
  }

  ngOnInit() {
    this.selector =  this.firstTimetable.nativeElement;
    this.addTimeTable(this.timetableOne);
  }

  ngAfterViewInit() {
    document.getElementById('time').scrollIntoView();

}


  addTimeTable(tt) {
    tt.setScope(9, 9);

    tt.addArtists(['Lord Esperanza', 'Biffty & DJ Weedim', 'Ho99o9', 'Gangue', 'Myth Syzer']);

    tt.addEvent('GI', 'Lord Esperanza', new Date(2018, 8, 25, 17, 15), new Date(2018, 8, 25, 17, 30), this.options);
    tt.addEvent('GI', 'Biffty & DJ Weedim', new Date(2018, 8, 25, 16, 15), new Date(2018, 8, 25, 16, 30), this.options);

    tt.addEvent('GI', 'Ho99o9', new Date(2018, 8, 27, 9), new Date(2018, 8, 27, 10), { url: '#' });

    tt.addEvent('GI', 'Gangue', new Date(2018, 8, 22, 9), new Date(2018, 8, 22, 10), {  onClick: function(event) {
      window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
    }} );
    tt.addEvent('GI', 'Myth Syzer', new Date(2018, 8, 22, 9), new Date(2018, 8, 22, 10), {  onClick: function(event) {
      window.alert('You clicked on the ' + event.name + ' event in ' + event.location + '. This is an example of a click handler');
    }} );

    this.renderer = new Renderer(tt);
    this.renderer.draw(this.selector);
    console.log('timeNow from day-one-component in addTimeTable method: ', this.timeNow);
  }

}
