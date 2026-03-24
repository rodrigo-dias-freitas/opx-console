import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface para garantir que o TypeScript entenda a estrutura das semanas
export interface WeeklyData {
  totalResult: number;
  totalPoints: number;
  label?: string;
}

@Component({
  selector: 'app-month-summary',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './month-summary.html',
  styleUrls: ['./month-summary.css']
})
export class MonthSummaryComponent implements OnChanges {
  // Entradas vindas do componente pai (Dashboard)
  @Input() weeks: any[] = [];
  @Input() monthName: string = '';
  @Input() monthlyGoal: number = 8000;

  // Propriedades calculadas para o HTML
  totalResult: number = 0;
  totalPoints: number = 0;
  progressPercentage: number = 0;
  remainingToGoal: number = 0;
  isGoalAchieved: boolean = false;

  constructor() {}

  // O ngOnChanges dispara sempre que @Input() weeks ou @Input() monthlyGoal mudar
  ngOnChanges(changes: SimpleChanges) {
    if (changes['weeks'] || changes['monthlyGoal']) {
      this.calculateMonthlyPerformance();
    }
  }

  private calculateMonthlyPerformance() {
    if (!this.weeks || this.weeks.length === 0) {
      console.warn('OPX: Nenhuma semana recebida no MonthSummary');
      this.resetStats();
      return;
    }

    // LOG DE DEBUG: Abra o console (F12) e veja o nome das propriedades aqui
    console.log('Dados recebidos no componente:', this.weeks[0]);

    // Tente somar usando os nomes mais comuns (result ou totalResult)
    // O operador '||' garante que se um for undefined, ele tenta o outro ou usa 0
    this.totalResult = this.weeks.reduce((acc, week) => {
      const val = week.result ?? week.totalResult ?? 0;
      return acc + val;
    }, 0);

    this.totalPoints = this.weeks.reduce((acc, week) => {
      const pts = week.points ?? week.totalPoints ?? 0;
      return acc + pts;
    }, 0);
    
    const rawProgress = (this.totalResult / this.monthlyGoal) * 100;
    this.progressPercentage = Math.max(0, Math.min(rawProgress, 100));
    this.remainingToGoal = this.monthlyGoal - this.totalResult;
  }

  private resetStats() {
    this.totalResult = 0;
    this.totalPoints = 0;
    this.progressPercentage = 0;
    this.remainingToGoal = this.monthlyGoal;
    this.isGoalAchieved = false;
  }
}