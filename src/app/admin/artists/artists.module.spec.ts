import { ArtistsModule } from './artists.module';

describe('ArtistsModule', () => {
  let artistsModule: ArtistsModule;

  beforeEach(() => {
    artistsModule = new ArtistsModule();
  });

  it('should create an instance', () => {
    expect(artistsModule).toBeTruthy();
  });
});
