import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Week } from '../../../../core/model/week';

@Component({
  selector: 'app-week-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-hero.html',
  styleUrl: './week-hero.css',
})
export class WeekHero {

@Input() week?: Week;

get progressPercent(): number {
  if (!this.week?.goal) return 0;

  return Math.min(
    Math.max((this.week.points / this.week.goal) * 100, 0),
    100
  );
}
get progressBarClass(): string {
  if (this.progressPercent >= 100)
    return 'bg-green-500';

  if (this.progressPercent >= 50)
    return 'bg-blue-500';

  return 'bg-red-500';
}

get statusLabel(): string {

  if (!this.week) return '';

  if (this.week.points >= this.week.goal)
    return 'META ATINGIDA';

  if (this.week.points > 0)
    return 'EM CONSTRUÇÃO';

  return 'NEGATIVO';
}


}
