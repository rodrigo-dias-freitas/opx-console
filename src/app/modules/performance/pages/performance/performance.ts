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

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.weeks = this.performanceService.getWeeks();
    this.months = this.performanceService.groupByMonth(this.weeks);
  }

  get currentWeek(): Week | undefined {
    return this.weeks.find(w => w.isCurrent);
  }


}