import { TestBed } from '@angular/core/testing';

import { IndyService } from './indy.service';

describe('IndyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndyService = TestBed.get(IndyService);
    expect(service).toBeTruthy();
  });
});
