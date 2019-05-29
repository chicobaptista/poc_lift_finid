import { TestBed } from '@angular/core/testing';

import { CordaService } from './corda.service';

describe('CordaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CordaService = TestBed.get(CordaService);
    expect(service).toBeTruthy();
  });
});
