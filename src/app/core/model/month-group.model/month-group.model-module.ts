import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Week } from '../week.model/week.model-module';

export interface MonthGroup {
  year: number;
  monthIndex: number;
  monthName: string;
  weeks: Week[];
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class MonthGroupModelModule { }
