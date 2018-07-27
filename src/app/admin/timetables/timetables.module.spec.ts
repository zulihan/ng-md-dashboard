import { TimetablesModule } from './timetables.module';

describe('TimetablesModule', () => {
  let timetablesModule: TimetablesModule;

  beforeEach(() => {
    timetablesModule = new TimetablesModule();
  });

  it('should create an instance', () => {
    expect(timetablesModule).toBeTruthy();
  });
});
