import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { WeekHero } from '../../components/week-hero/week-hero';
import { MonthSummary } from '../../components/month-summary/month-summary';
import { Week } from '../../../../core/model/week';
import { PerformanceService } from '../../services/performance.service';

interface MonthGroup {
  monthIndex: number;
  monthName: string;
  weeks: Week[];
}

interface Day {
  date: Date;
  points: number;
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
  selectedMonthIndex = 0;
  days: Day[] = [];
  bestWeekday: any;

  constructor(private performanceService: PerformanceService, private http: HttpClient) {}

  ngOnInit(): void {
    this.weeks = this.performanceService.getWeeks();
    this.monthsGroup = this.performanceService.groupByMonth(this.weeks);
    this.loadCsv();

    const currentMonthIndex = this.months.findIndex(month => 
      month.weeks.some(w => w.isCurrent)
    );

    this.selectedMonthIndex = currentMonthIndex >= 0 ? currentMonthIndex : 0;
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

  get currentMonth(): MonthGroup | undefined {
    return this.months[this.selectedMonthIndex];
  }

  goToPreviousMonth(): void {
    if (this.selectedMonthIndex > 0) {
      this.selectedMonthIndex--;
    }
  }
  
  goToNextMonth(): void {
    if (this.selectedMonthIndex < this.months.length - 1) {
      this.selectedMonthIndex++;
    }
  }

  loadCsv() {

    this.http
      .get('data/daily-2025.csv', { responseType: 'text' })
      .subscribe(data => {

        const lines = data.split('\n');

        // Encontrar onde começa a tabela
        const startIndex = lines.findIndex(line =>
          line.startsWith('Ativo;')
        );

        const dataLines = lines.slice(startIndex + 1);

        const dailyMap = new Map<string, number>();

        dataLines.forEach(line => {

          if (!line.trim()) return;

          const parts = line.split(';');

          if (parts.length < 14) return;

          const fechamento = parts[2].trim(); // 02/01/2025 09:11:33
          const resultado = parts[13].trim(); // -110,00

          const date = fechamento.split(' ')[0]; // 02/01/2025

          const value = Number(
            resultado
              .replace('.', '')
              .replace(',', '.')
          );

          if (!dailyMap.has(date)) {
            dailyMap.set(date, 0);
          }

          dailyMap.set(date, dailyMap.get(date)! + value);
        });

        this.days = Array.from(dailyMap.entries()).map(([date, points]) => {

          const [day, month, year] = date.split('/');

          return {
            date: new Date(+year, +month - 1, +day),
            points
          };
        });

        this.bestWeekday = this.getBestWeekday();

      });
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

    return averages[0];
  }

}
