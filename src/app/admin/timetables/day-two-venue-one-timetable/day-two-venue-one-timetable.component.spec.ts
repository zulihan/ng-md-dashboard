/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayTwoVenueOneTimetableComponent } from './day-two-venue-one-timetable.component';

describe('DayTwoVenueOneTimetableComponent', () => {
  let component: DayTwoVenueOneTimetableComponent;
  let fixture: ComponentFixture<DayTwoVenueOneTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTwoVenueOneTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTwoVenueOneTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
