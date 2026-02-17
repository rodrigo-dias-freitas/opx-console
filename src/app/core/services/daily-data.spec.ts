import { TestBed } from '@angular/core/testing';

import { DailyData } from './daily-data';

describe('DailyData', () => {
  let service: DailyData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
