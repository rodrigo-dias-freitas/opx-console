import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestWeekday } from './best-weekday';

describe('BestWeekday', () => {
  let component: BestWeekday;
  let fixture: ComponentFixture<BestWeekday>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestWeekday]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestWeekday);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
