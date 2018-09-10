/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimetablesService } from './timetables.service';

describe('Service: Timetables', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimetablesService]
    });
  });

  it('should ...', inject([TimetablesService], (service: TimetablesService) => {
    expect(service).toBeTruthy();
  }));
});
