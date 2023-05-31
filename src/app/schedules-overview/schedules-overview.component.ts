import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../features/schedules/schedule.service';
import { Schedule } from '../features/schedules/schedule';

@Component({
  selector: 'app-schedules-overview',
  templateUrl: './schedules-overview.component.html',
  styleUrls: ['./schedules-overview.component.css']
})
export class SchedulesOverviewComponent implements OnInit {

  listItems: any[] = [];

  constructor(
    private scheduleService: ScheduleService
  ) {
   }

  ngOnInit(): void {
    this.showAllSchedules();
  }

  private showAllSchedules() {

    console.log('show all schedules');
    this.scheduleService.findAll().subscribe(
      (data : Schedule[]) => {
      this.listItems = data;
  },
  (error: Error) => {
    console.log(error);
  }
    
  );

  this.listItems.push({
    id : 2,
    title : 'Dentist appointment',
    date : new Date('2023-05-30'),
    initTime : '11:30',
    endTime : '12:00',
    description : 'Dentist appointment at 11:30 to fill cavities'

  })

  console.log(this.listItems);
    
    return this.listItems;
  }

}
