import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnersTasksTimetableComponent } from './runners-tasks-timetable.component';

describe('RunnersTasksTimetableComponent', () => {
  let component: RunnersTasksTimetableComponent;
  let fixture: ComponentFixture<RunnersTasksTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnersTasksTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnersTasksTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
