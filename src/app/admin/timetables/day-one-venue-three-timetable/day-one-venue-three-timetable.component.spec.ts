/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayOneVenueThreeTimetableComponent } from './day-one-venue-three-timetable.component';

describe('DayOneVenueThreeTimetableComponent', () => {
  let component: DayOneVenueThreeTimetableComponent;
  let fixture: ComponentFixture<DayOneVenueThreeTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayOneVenueThreeTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOneVenueThreeTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
