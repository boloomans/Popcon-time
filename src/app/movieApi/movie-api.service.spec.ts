import { TestBed } from '@angular/core/testing';

import { MovieApiService } from './movie-api.service';

describe('MovieAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovieApiService = TestBed.get(MovieApiService);
    expect(service).toBeTruthy();
  });
});
