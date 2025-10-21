import { TestBed } from '@angular/core/testing';
import { Interceptors } from './interceptors';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('Interceptors', () => {
  let service: Interceptors;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideHttpClient()
      ]
    });
    service = TestBed.inject(Interceptors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
