import { Component, OnInit } from "@angular/core";
import { PerformanceService } from "../../services/performance.service";
import { MonthGroup } from "../../../../core/model/month-group.model/month-group.model-module";
import { Week } from "../../../../core/model/week.model/week.model-module";
import { WeekHero } from "../../components/week-hero/week-hero";
import { MonthSummary } from "../../components/month-summary/month-summary";
import { CommonModule } from "@angular/common";
import { PerformanceAnalyticsService } from "../../services/performance-analytics.service";
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Day {
  date: Date;
  points: number;
}


@Component({
  selector: 'app-performance',
  imports: [WeekHero, MonthSummary, CommonModule, HttpClientModule],
  templateUrl: './performance.html'
})
export class Performance implements OnInit {

  weeks: Week[] = [];
  months: MonthGroup[] = [];
  selectedMonthIndex = 0;
  days: Day[] = [];
  bestWeekday: any;


  constructor(private performanceService: PerformanceService, private analytics: PerformanceAnalyticsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.weeks = this.performanceService.getWeeks();
    this.months = this.performanceService.groupByMonth(this.weeks);

    const currentMonthIndex = this.months.findIndex(month => month.weeks.some(w => w.isCurrent));

    this.selectedMonthIndex = currentMonthIndex >= 0 ? currentMonthIndex : 0;

    this.loadCsv();
  }

  get currentWeek(): Week | undefined {
    return this.weeks.find(w => w.isCurrent);
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



}