import { Week } from "./week";

export interface MonthGroup {
  year: number;
  monthIndex: number;
  monthName: string;
  weeks: Week[];
}