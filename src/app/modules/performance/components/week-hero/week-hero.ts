import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-week-hero',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './week-hero.html',
  styleUrls: ['./week-hero.css']
})
export class WeekHeroComponent implements OnChanges {
  // Recebe a 'currentWeek' do seu dashboard principal
  @Input() week: any; 

  isGain: boolean = false;
  winRate: number = 0;

  ngOnChanges() {
    if (this.week) {
      // Ajuste os nomes das propriedades conforme o seu objeto Week
      const result = this.week.result ?? this.week.totalResult ?? 0;
      this.isGain = result >= 0;
      
      // Cálculo simples de aproveitamento se você tiver o número de trades
      if (this.week.trades) {
        const positives = this.week.trades.filter((t: any) => t.result > 0).length;
        this.winRate = (positives / this.week.trades.length) * 100;
      }
    }
  }
}