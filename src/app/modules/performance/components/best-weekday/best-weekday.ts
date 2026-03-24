import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WeekdayStats {
  name: string;
  totalResult: number;
  tradeCount: number;
}

@Component({
  selector: 'app-best-weekday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-weekday.html',
  styleUrls: ['./best-weekday.css']
})
export class BestWeekdayComponent implements OnChanges {
  @Input() days: any[] = []; // O array 'this.days' do seu loadCsv
  
  bestDay: WeekdayStats | null = null;
  weekdays: WeekdayStats[] = [];
  
  private names = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  ngOnChanges() {
    if (this.days && this.days.length > 0) {
      this.calculateBestDay();
    }
  }

  private calculateBestDay() {
    const group = new Map<number, { res: number; count: number }>();

    this.days.forEach(d => {
      const dayIdx = d.date.getDay();
      const current = group.get(dayIdx) || { res: 0, count: 0 };
      group.set(dayIdx, { 
        res: current.res + d.result, 
        count: current.count + 1 
      });
    });

    this.weekdays = Array.from(group.entries())
      .map(([idx, data]) => ({
        name: this.names[idx],
        totalResult: data.res,
        tradeCount: data.count
      }))
      .sort((a, b) => b.totalResult - a.totalResult);

    this.bestDay = this.weekdays[0];
  }
}