import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Week {
  id: number;
  points: number;
  result: number;
  goal: number;
  protection: boolean;
  weekStart: string;
  weekEnd: string;
  isCurrent: boolean;
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class WeekModelModule { }
