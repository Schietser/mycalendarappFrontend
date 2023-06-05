import {Component, OnInit} from '@angular/core';
import {Schedule} from '../schedule';
import {ActivatedRoute, Router} from '@angular/router';
import {ScheduleService} from "../schedule.service";

@Component({
  selector: 'app-schedules-overview',
  templateUrl: './schedules-overview.component.html',
  styleUrls: ['./schedules-overview.component.css']
})
export class SchedulesOverviewComponent implements OnInit {

  tasks: Schedule[] = [];
  day!: Date;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  private convertStringToDate(stringDate: string): Date {
    let dd, MM, yyyy;
    [dd, MM, yyyy] = stringDate.split('-');
    return new Date(yyyy + "-" + MM + "-" + dd + "T12:00:00");// avoid GMT problem for +12 to -12
  }

  ngOnInit(): void {
    this.day = this.convertStringToDate(this.activatedRoute.snapshot.params['day'] as string);

    console.log("Overview date :" + this.day)
    this.showAllSchedules();
  }

  onEdit(event: Schedule) {
    this.router.navigate([`/schedules/edit/${event.id}`]);
  }

  onDelete(event: Schedule) {
    console.log("delete: " + event.id);
    this.scheduleService.delete(event.id);
  }

  private showAllSchedules() {

    console.log('show all schedules');
    this.scheduleService.findAllByDay(this.day).subscribe({
      next: (data: Schedule[]) => {
        this.tasks = data;
      },
      error: (error: Error) => {
        console.log(error);
      }
    });

    this.tasks.push({
      id: 2,
      title: 'Dentist appointment',
      startDate: '30/05/2023',//new Date('2023-05-30'),
      endDate: '30/05/2023',//new Date('2023-05-30'),
      startTime: '11:30',
      endTime: '12:00',
      description: 'Dentist appointment at 11:30 to fill cavities',
      fullDay: false
    })

    this.tasks.push({
      id: 3,
      title: 'Test evenement',
      startDate: '30/05/2023',//new Date('2023-05-30'),
      endDate: '30/05/2023',//new Date('2023-05-30'),
      startTime: '14:30',
      endTime: '15:00',
      description: 'Test evenement',
      fullDay: true
    })

    console.log(this.tasks);

    return this.tasks;
  }

}
