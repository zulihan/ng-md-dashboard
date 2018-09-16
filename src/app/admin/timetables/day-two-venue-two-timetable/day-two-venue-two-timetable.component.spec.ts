/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayTwoVenueTwoTimetableComponent } from './day-two-venue-two-timetable.component';

describe('DayTwoVenueTwoTimetableComponent', () => {
  let component: DayTwoVenueTwoTimetableComponent;
  let fixture: ComponentFixture<DayTwoVenueTwoTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTwoVenueTwoTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTwoVenueTwoTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
