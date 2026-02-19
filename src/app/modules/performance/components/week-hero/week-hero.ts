import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-week-hero',
  imports: [CommonModule],
  templateUrl: './week-hero.html',
  styleUrl: './week-hero.css',
})
export class WeekHero {

@Input() points!: number;
@Input() result!: number;
@Input() goal!: number;
@Input() protection!: boolean;
@Input() weekStart!: string;
@Input() weekEnd!: string;

get progressPercent(): number {
  if (!this.goal) return 0;
  return Math.min(Math.round((this.points / this.goal) * 100), 100);
}

get statusLabel(): string {
  if (this.points >= this.goal) return 'CONSISTENTE';
  if (this.points > 0) return 'EM CONSTRUÇÃO';
  if (this.points < 0 && this.protection) return 'PROTEGIDO';
  return 'QUEBRA DE DISCIPLINA';
}
get statusContainerClass(): string {
  const base = 'bg-cockpit-card border-cockpit-border';

  if (this.points >= this.goal)
    return `${base} border-green-600`;

  if (this.points > 0)
    return `${base} border-blue-600`;

  if (this.points < 0 && this.protection)
    return `${base} border-yellow-600`;

  return `${base} border-red-600`;
}

get progressBarClass(): string {
  if (this.points >= this.goal) return 'bg-green-600';
  if (this.points > 0) return 'bg-blue-600';
  if (this.points < 0 && this.protection) return 'bg-yellow-600';
  return 'bg-red-600';
}


}
