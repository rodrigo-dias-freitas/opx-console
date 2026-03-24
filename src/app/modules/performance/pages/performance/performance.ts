import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { WeekHero } from '../../components/week-hero/week-hero';
import { MonthSummaryComponent } from '../../components/month-summary/month-summary';
import { Week } from '../../../../core/model/week';
import { PerformanceService } from '../../services/performance.service';
import { BestWeekdayComponent } from '../../components/best-weekday/best-weekday';

interface MonthGroup {
  year: number;
  monthIndex: number;
  monthName: string;
  weeks: Week[];
}

interface Day {
  date: Date;
  points: number;
  result: number;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, MonthSummaryComponent, WeekHero, BestWeekdayComponent],
  templateUrl: './performance.html',
  styleUrl: './performance.css',
})
export class Performance implements OnInit {

  weeks: Week[] = [];
  monthsGroup: MonthGroup[] = []
  selectedMonthIndex = 0;
  days: Day[] = [];
  bestWeekday: any;
  currentWeek?: Week;
  months: MonthGroup[] = [];

  constructor(private performanceService: PerformanceService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCsv();
  }


  getWeeksByMonth(month: number) {
    return this.weeks.filter(w => {
      const date = new Date(w.weekStart);
      return date.getMonth() === month;
    });
  }

  /*get months(): MonthGroup[] {
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
  }*/

  private buildMonths():void {
    const map = new Map<string, Week[]>();

    for(const week of this.weeks){
      const date = new Date(week.weekStart);
      const year = date.getFullYear();
      const month = date.getMonth();

      const key = `${year}-${month}`;

      if(!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)?.push(week);
    }

    this.months = Array.from(map.entries())
      .sort(([a], [b]) => {
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);

        const dateA = new Date(yearA, monthA);
        const dateB = new Date(yearB, monthB);

        return dateA.getTime() - dateB.getTime();
      })
      .map(([key, weeks]) => { 
        const [year, monthIndex] = key.split('-').map(Number) as [number, number];

        return{ monthIndex, year, monthName: this.getMonthName(monthIndex), weeks}
      });
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

        const dailyMap = new Map<string, {
          totalResult: number;
          totalPoints: number;
        }>();

        dataLines.forEach(line => {

          if (!line.trim()) return;

          const parts = line.split(';');
          if (parts.length < 15) return; // agora precisa de 15 colunas

          const fechamento = parts[2].trim();

          const resultStr = parts[13].trim();  // financeiro
          const pointsStr = parts[14].trim();  // percentual

          const date = fechamento.split(' ')[0];

          const resultValue = Number(
            resultStr
              .replace('.', '')
              .replace(',', '.')
          );

          const pointsValue = Number(
            pointsStr
              .replace('.', '')
              .replace(',', '.')
          );

          if (!dailyMap.has(date)) {
            dailyMap.set(date, { totalResult: 0, totalPoints: 0 });
          }

          const current = dailyMap.get(date)!;

          current.totalResult += resultValue;
          current.totalPoints += pointsValue;
        });

        this.days = Array.from(dailyMap.entries()).map(([date, data]) => {

          const [day, month, year] = date.split('/');

          return {
            date: new Date(+year, +month - 1, +day),
            points: data.totalPoints,   
            result: data.totalResult    
          };
        });

        this.bestWeekday = this.getBestWeekday();
        this.rebuildWeeks();
        this.calculateAnalytics();
        this.cdr.detectChanges();
        
        this.selectedMonthIndex = this.months.length - 1;

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

 

  private getWeekNumber(date: Date): number {

    const tempDate = new Date(date.getTime());

    // Ajusta para quinta-feira da mesma semana (ISO 8601)
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));

    const yearStart = new Date(tempDate.getFullYear(), 0, 1);

    const weekNumber = Math.ceil(
      (((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7
    );

    return weekNumber;
  }

  private calculateAnalytics(): void {
    this.rebuildWeeks();
    this.buildMonths();
    
    this.currentWeek = this.weeks.find(w => w.isCurrent);
    this.bestWeekday = this.getBestWeekday();

    if(this.currentWeek) {
      const currentMonth = new Date(this.currentWeek.weekStart).getMonth();
      this.selectedMonthIndex = this.months.findIndex(m => m.monthIndex === currentMonth);
    }

  }


  private rebuildWeeks(): void {

    const today = new Date();
    const currentWeekNumber = this.getWeekNumber(today);
    const currentYear = today.getFullYear();

    const map = new Map<string, {
      totalPoints: number;
      totalResult: number;
      start: Date;
      end: Date;
    }>();

    this.days.forEach(day => {

      const year = day.date.getFullYear();
      const weekNumber = this.getWeekNumber(day.date);
      const key = `${year}-W${weekNumber}`;

      if (!map.has(key)) {
        map.set(key, {
          totalPoints: 0,
          totalResult: 0,
          start: day.date,
          end: day.date
        });
      }

      const current = map.get(key)!;

      current.totalPoints += day.points;
      current.totalResult += day.result;

      if (day.date < current.start) current.start = day.date;
      if (day.date > current.end) current.end = day.date;
    });

    this.weeks = Array.from(map.entries())
      .map(([_, data], index) => {

        const weekYear = data.start.getFullYear();
        const weekNumber = this.getWeekNumber(data.start);

        return {
          id: index,
          points: data.totalPoints,
          result: data.totalResult,
          goal: 2500,
          protection: data.totalPoints > 0,
          weekStart: data.start.toISOString().split('T')[0],
          weekEnd: data.end.toISOString().split('T')[0],
          isCurrent:
            weekYear === currentYear &&
            weekNumber === currentWeekNumber
        };
      })
      .sort((a, b) =>
        new Date(a.weekStart).getTime() -
        new Date(b.weekStart).getTime()
      );
      console.log('Weeks with isCurrent true:', this.weeks.filter(w => w.isCurrent));
  }
  
  
}
