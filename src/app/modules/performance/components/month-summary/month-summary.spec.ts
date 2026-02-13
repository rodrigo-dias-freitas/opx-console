import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSummary } from './month-summary';

describe('MonthSummary', () => {
  let component: MonthSummary;
  let fixture: ComponentFixture<MonthSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
