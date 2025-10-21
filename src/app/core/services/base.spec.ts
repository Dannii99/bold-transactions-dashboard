import { TestBed } from '@angular/core/testing';
import { Base } from './base';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Base', () => {
  let service: Base;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    });
    service = TestBed.inject(Base);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
