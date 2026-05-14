import { TestBed } from '@angular/core/testing';

import { Visas } from './visas';

describe('Visas', () => {
  let service: Visas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Visas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
