import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeekHero } from '../../components/week-hero/week-hero';
import { MonthSummary } from '../../components/month-summary/month-summary';
import { Week } from '../../../../core/model/week';
import { PerformanceService } from '../../services/performance.service';

interface MonthGroup {
  monthIndex: number;
  monthName: string;
  weeks: Week[];
}

@Component({
  selector: 'app-performance',
  imports: [ CommonModule, WeekHero, MonthSummary ],
  templateUrl: './performance.html',
  styleUrl: './performance.css',
})
export class Performance implements OnInit {

  weeks: Week[] = [];
  monthsGroup: MonthGroup[] = []

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.weeks = this.performanceService.getWeeks();
    this.monthsGroup = this.performanceService.groupByMonth(this.weeks);
  }

  get currentWeek(): Week | undefined {
    return this.weeks.find(w => w.isCurrent);
  }

  getWeeksByMonth(month: number) {
    return this.weeks.filter(w => {
      const date = new Date(w.weekStart);
      return date.getMonth() === month;
    });
  }

  get months(): MonthGroup[] {
    const map = new Map<number, Week[]>();
  
    for (const week of this.weeks) {
      const date = new Date(week.weekStart);
      const month = date.getMonth();
  
      if (!map.has(month)) {
        map.set(month, []);
      }
  
      map.get(month)!.push(week);
    }
  
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([monthIndex, weeks]) => ({
        monthIndex,
        monthName: this.getMonthName(monthIndex),
        weeks
      }));
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'JANEIRO',
      'FEVEREIRO',
      'MARÇO',
      'ABRIL',
      'MAIO',
      'JUNHO',
      'JULHO',
      'AGOSTO',
      'SETEMBRO',
      'OUTUBRO',
      'NOVEMBRO',
      'DEZEMBRO'
    ];
  
    return months[monthIndex];
  }

}
