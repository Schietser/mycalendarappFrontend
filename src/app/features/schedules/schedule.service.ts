import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Schedule} from './schedule';
import {Observable} from 'rxjs';
import {format} from "date-fns";


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {
  }

  /* private convertStringToDate(stringDate: string): Date {
    let dd, MM, yyyy;
    [dd, MM, yyyy] = stringDate.split('/');
    return new Date(yyyy + "-" + MM + "-" + dd + "T12:00:00");// avoid GMT problem for +12 to -12
  }

  private convertDateFormats(hyphenDate: string): string {
    let dd, MM, yyyy;
    [dd, MM, yyyy] = hyphenDate.split('-');
    return dd + "/" + MM + "/" + yyyy;
  }*/

  save(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}/create`, schedule);
  }

  update(id: number, schedule: Schedule): Observable<Schedule> {
    schedule.id = id;
    return this.http.put<Schedule>(`${this.apiUrl}/update`, schedule);
  }

  findById(id: number): Observable<Schedule> {
    console.log("findById")
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`);
  }

  findAll(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/`);
  }

  findAllByDay(day: Date): Observable<Schedule[]> {
    let dateString: string = format(day, 'dd/MM/yyyy');

    return this.http.get<Schedule[]>(`${this.apiUrl}/day?date=${dateString}`);
  }

  findAllByMonthOfYear(date: Date): Observable<Schedule[]> {
    let dateString: string = format(date, 'dd/MM/yyyy');

    return this.http.get<Schedule[]>(`${this.apiUrl}/month-of-year?date=${dateString}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}
