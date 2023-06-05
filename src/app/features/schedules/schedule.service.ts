import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Schedule} from './schedule';
import {Observable, of} from 'rxjs';
import {format} from "date-fns";


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {
  }

  save(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}/create`, schedule);
  }

  update(id: number, schedule: Schedule): Observable<Schedule> {
    schedule.id = id;
    return this.http.put<Schedule>(`${this.apiUrl}/update`, schedule);
  }

  findById(id: number): Observable<Schedule> {
    console.log("findById")
    /*var schedule: Schedule = {
      id: 2,
      title: 'title',
      description: 'description',
      startDate: new Date("2023-05-31"),
      endDate: new Date("2023-05-31"),
      startTime: '09:30',
      endTime: '10:30',
      fullDay: false
    };
    return of(schedule)*/
    return this.http.get<Schedule>(`${this.apiUrl}/${id}`);
  }

  findAll(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/`);
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

  findAllByDay(day: Date): Observable<Schedule[]> {
    let dateString: string = format(day, 'dd/MM/yyyy');

    return this.http.get<Schedule[]>(`${this.apiUrl}/day?date=${dateString}`);
  }

  findAllByMonthOfYear(date: Date): Observable<Schedule[]> {
    let dateString: string = format(date, 'dd/MM/yyyy');
    var schedule: Schedule = {
      id: 2,
      title: 'title',
      description: 'description',
      startDate: '15/06/2023',
      endDate: '10/06/2023',
      startTime: '09:30',
      endTime: '10:30',
      fullDay: false
    };
    return of([schedule]);

    //return this.http.get<Schedule[]>(`${this.apiUrl}/month-of-year?date=${dateString}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}
