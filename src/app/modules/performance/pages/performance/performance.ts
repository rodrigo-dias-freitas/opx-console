import { Component } from '@angular/core';
import { WeekHero } from '../../components/week-hero/week-hero';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance',
  imports: [ CommonModule, WeekHero ],
  templateUrl: './performance.html',
  styleUrl: './performance.css',
})
export class Performance {

  weeks = [
    {
      id: 1,
      points: 440,
      result: 529.00,
      goal: 2500,
      protection: false,
      weekStart: '05 Jan',
      weekEnd: '09 Jan',
      isCurrent: false
    },
    {
      id: 2,
      points: 596.25,
      result: 477.00,
      goal: 2500,
      protection: false,
      weekStart: '12 Jan',
      weekEnd: '16 Jan',
      isCurrent: false
    },
    {
      id: 3,
      points: 6996.25,
      result: 5597.00,
      goal: 2500,
      protection: false,
      weekStart: '19 Jan',
      weekEnd: '23 Jan',
      isCurrent: false
    },
    {
      id: 4,
      points: -1575,
      result: -1260.00,
      goal: 2500,
      protection: false,
      weekStart: '26 Jan',
      weekEnd: '30 Jan',
      isCurrent: false
    },
    {
      id: 5,
      points: 2730,
      result: 2184.00,
      goal: 2500,
      protection: false,
      weekStart: '02 Fev',
      weekEnd: '06 Fev',
      isCurrent: false
    },
    {
      id: 6,
      points: 2525,
      result: 2020.00,
      goal: 2500,
      protection: false,
      weekStart: '09 Fev',
      weekEnd: '13 Fev',
      isCurrent: true
    },
  ]


  get currentWeek() {
    return this.weeks.find(w => w.isCurrent);
  }

}
