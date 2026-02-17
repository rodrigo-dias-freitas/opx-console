import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Day } from '../model/day';

@Injectable({
  providedIn: 'root'
})
export class DailyDataService {

  constructor(private http: HttpClient) {}

  loadDailyData(): Observable<Day[]> {

    return this.http
      .get('assets/data/daily-2025.csv', { responseType: 'text' })
      .pipe(
        map(csv => this.parseCsv(csv))
      );
  }

  private parseCsv(csv: string): Day[] {

    const lines = csv.split('\n').slice(1); // remove header

    return lines
      .filter(line => line.trim() !== '')
      .map(line => {

        const [date, points] = line.split(',');

        return {
          date: new Date(date.trim()),
          points: Number(points.trim())
        };
      });
  }
}
