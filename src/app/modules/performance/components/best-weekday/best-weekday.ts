import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Day {
  date: Date;
  points: number;
  result: number;
}

@Component({
  selector: 'app-best-weekday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-weekday.html',
  styleUrl: './best-weekday.css',
})
export class BestWeekday {

  @Input() data!:{
    weekday: number;
    weekdayName: number;
    average: number;
  };

  days: Day[] = [];

  getWeekdayName(index: number): string {

    const names = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ];

    return names[index];
  }

  getBestWeekday() {

    const map = new Map<number, { total: number; count: number }>();

    this.days.forEach(day => {

      const weekday = day.date.getDay();

      if (!map.has(weekday)) {
        map.set(weekday, { total: 0, count: 0 });
      }

      const current = map.get(weekday)!;
      current.total += day.points;
      current.count += 1;
    });

    const averages = Array.from(map.entries()).map(([weekday, value]) => ({
      weekday,
      average: value.total / value.count
    }));

    averages.sort((a, b) => b.average - a.average);

    const best = averages[0];

    if (!best) return undefined;

    return {
      ...best,
      weekdayName: this.getWeekdayName(best.weekday)
    };
  }


}
