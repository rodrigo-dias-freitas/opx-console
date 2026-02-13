import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekHero } from './week-hero';

describe('WeekHero', () => {
  let component: WeekHero;
  let fixture: ComponentFixture<WeekHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
