import { TestBed } from '@angular/core/testing';

import { PerformanceAnalyticsServiceTs } from './performance-analytics.service.ts';

describe('PerformanceAnalyticsServiceTs', () => {
  let service: PerformanceAnalyticsServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformanceAnalyticsServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
