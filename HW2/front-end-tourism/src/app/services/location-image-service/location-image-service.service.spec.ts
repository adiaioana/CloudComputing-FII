import { TestBed } from '@angular/core/testing';

import { LocationImageServiceService } from './location-image-service.service';

describe('LocationImageServiceService', () => {
  let service: LocationImageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationImageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
