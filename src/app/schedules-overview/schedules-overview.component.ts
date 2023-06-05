import {Component, OnInit} from '@angular/core';
import {ScheduleService} from '../features/schedules/schedule.service';
import {Schedule} from '../features/schedules/schedule';
import {ActivatedRoute, Router} from '@angular/router';

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

  ngOnInit(): void {
    this.day = this.activatedRoute.snapshot.params['day'] as Date;

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
    /*this.scheduleService.findAllByDay(this.day).subscribe(
      (data: Schedule[]) => {
        this.tasks = data;
      },
      (error: Error) => {
        console.log(error);
      }
    );*/


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
