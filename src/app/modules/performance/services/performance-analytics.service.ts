import { Injectable } from '@angular/core';
import { count } from 'rxjs';

export interface DayPerformance{
  date: Date;
  points: number;
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceAnalyticsService {

  getBestWeekday(days: DayPerformance[]){
    const map = new Map<number, { total: number; count: number }>();

    days.forEach(day => {

      const weekday = new Date(day.date).getDay();

      if(!map.has(weekday)) {
        map.set(weekday, {total: 0, count: 0});
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

    return averages[0];
  }
  
}
