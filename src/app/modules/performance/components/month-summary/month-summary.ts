import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Week {
  id: number;
  points: number;
  result: number;
  goal: number;
  protection: boolean;
  weekStart: string;
  weekEnd: string;
  isCurrent: boolean;
}

@Component({
  selector: 'app-month-summary',
  imports: [ CommonModule ],
  templateUrl: './month-summary.html',
  styleUrl: './month-summary.css',
})
export class MonthSummary {

  @Input() weeks: Week[] = [];
  @Input() monthName!: string;
  @Input() monthlyGoal!: number;

  get totalPoints(): number {
    return this.weeks.reduce((acc, w) => acc + w.points, 0);
  }

  get progressPercent(): number {
    if (!this.monthlyGoal) return 0;

    return Math.min(
      Math.max((this.totalPoints / this.monthlyGoal) * 100, 0),
      100
    );
  }

  get weeklyAverage(): number {
    if (!this.weeks.length) return 0;
    return this.totalPoints / this.weeks.length;
  }

  get statusLabel(): string {
    if (this.totalPoints >= this.monthlyGoal) return 'META ATINGIDA';
    if (this.totalPoints > 0) return 'EM CONSTRUÇÃO';
    return 'NEGATIVO';
  }

  get statusClass(): string {
    if (this.totalPoints >= this.monthlyGoal)
      return 'text-green-600';

    if (this.totalPoints > 0)
      return 'text-blue-600';

    return 'text-red-600';
  }
}
