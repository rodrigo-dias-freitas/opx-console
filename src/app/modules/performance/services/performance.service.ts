import { Injectable } from '@angular/core';
import { Week } from '../../../core/model/week.model/week.model-module';
import { MonthGroup } from '../../../core/model/month-group.model/month-group.model-module';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  getWeeks(): Week[] {
    return [
      {
        id: 1,
        points: 440,
        result: 529.00,
        goal: 2500,
        protection: false,
        weekStart: '2026/01/05',
        weekEnd: '2026/01/09',
        isCurrent: false
      },
      {
        id: 2,
        points: 596.25,
        result: 477.00,
        goal: 2500,
        protection: false,
        weekStart: '2026/01/12',
        weekEnd: '2026/01/16',
        isCurrent: false
      },
      {
        id: 3,
        points: 6996.25,
        result: 5597.00,
        goal: 2500,
        protection: false,
        weekStart: '2026/01/19',
        weekEnd: '2026/01/23',
        isCurrent: false
      },
      {
        id: 4,
        points: -1575,
        result: -1260.00,
        goal: 2500,
        protection: false,
        weekStart: '2026/01/26',
        weekEnd: '2026/01/30',
        isCurrent: false
      },
      {
        id: 5,
        points: 2730,
        result: 2184.00,
        goal: 2500,
        protection: false,
        weekStart: '2026/02/02',
        weekEnd: '2026/02/06',
        isCurrent: false
      },
      {
        id: 6,
        points: 2525,
        result: 2020.00,
        goal: 2500,
        protection: false,
        weekStart: '2026/02/09',
        weekEnd: '2026/02/13',
        isCurrent: false
      },
      {
        id: 7,
        points: 0,
        result: 0,
        goal: 2500,
        protection: false,
        weekStart: '2026/02/18',
        weekEnd: '2026/02/20',
        isCurrent: true
      },
    ];
  }

  groupByMonth(weeks: Week[]): MonthGroup[] {
    const map = new Map<string, Week[]>();

    for (const week of weeks) {
      const date = new Date(week.weekStart);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(week);
    }

    return Array.from(map.entries()).map(([key, weeks]) => {
      const [year, monthIndex] = key.split('-').map(Number);

      return {
        year,
        monthIndex,
        monthName: this.getMonthName(monthIndex),
        weeks
      };
    });
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'JANEIRO','FEVEREIRO','MARÇO','ABRIL',
      'MAIO','JUNHO','JULHO','AGOSTO',
      'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'
    ];
    return months[monthIndex];
  }
}
