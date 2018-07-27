import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOneTimetableComponent } from './day-one-timetable.component';

describe('DayOneTimetableComponent', () => {
  let component: DayOneTimetableComponent;
  let fixture: ComponentFixture<DayOneTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayOneTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOneTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
