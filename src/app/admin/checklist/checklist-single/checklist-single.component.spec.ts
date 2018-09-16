import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistSingleComponent } from './checklist-single.component';

describe('ChecklistSingleComponent', () => {
  let component: ChecklistSingleComponent;
  let fixture: ComponentFixture<ChecklistSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
