import { Component, OnInit } from "@angular/core";
import { PerformanceService } from "../../services/performance.service";
import { MonthGroup } from "../../../../core/model/month-group.model/month-group.model-module";
import { Week } from "../../../../core/model/week.model/week.model-module";
import { WeekHero } from "../../components/week-hero/week-hero";
import { MonthSummary } from "../../components/month-summary/month-summary";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-performance',
  imports: [WeekHero, MonthSummary, CommonModule],
  templateUrl: './performance.html'
})
export class Performance implements OnInit {

  weeks: Week[] = [];
  months: MonthGroup[] = [];
  selectedMonthIndex = 0;

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.weeks = this.performanceService.getWeeks();
    this.months = this.performanceService.groupByMonth(this.weeks);

    const currentMonthIndex = this.months.findIndex(month => month.weeks.some(w => w.isCurrent));

    this.selectedMonthIndex = currentMonthIndex >= 0 ? currentMonthIndex : 0;
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



}