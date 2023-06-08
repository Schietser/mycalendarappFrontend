import {Component, OnInit} from '@angular/core';
import {Schedule} from '../schedule';
import {ActivatedRoute, Router} from '@angular/router';
import {ScheduleService} from "../schedule.service";
import {format} from "date-fns";
import {ToastrService} from "ngx-toastr";

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
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
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
    let dateString: string = format(this.day, 'dd-MM-yyyy');

    this.router.navigate([`/schedules/edit/${event.id}/${dateString}`])
      .catch((err) => console.error(err));
  }

  onDelete(event: Schedule) {
    console.log("delete: " + event.id);
    this.scheduleService.delete(event.id).subscribe({
      next: () => {
        this.toastrService.success("Task deleted successfully!", "Success");
      },
      error: (err) => {
        this.toastrService.error("Task not deleted! retry or contact administrator",
          "Error", {timeOut: 10000, closeButton: true});
        console.error(err);
      },
      complete: () => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/schedules/overview/${format(this.day, 'dd-MM-yyyy')}`])
            .catch((err) => console.error(err));
        });
      }
    });
  }

  private showAllSchedules() {

    console.log('show all schedules');
    this.scheduleService.findAllByDay(this.day).subscribe({
      next: (data: Schedule[]) => {
        this.tasks = data;
      },
      error: (error: Error) => {
        console.error(error);
        this.toastrService.error("Task list cannot be loaded! reload page or contact administrator",
          "Error", {timeOut: 10000, closeButton: true});
      }
    });

    console.log(this.tasks);

    return this.tasks;
  }

  nextDayTasks(): void {
    let tomorrow: Date = new Date(this.day.getTime() + (24 * 60 * 60 * 1000));
    //const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/schedules/overview/${format(tomorrow, 'dd-MM-yyyy')}`])
        .catch((err) => console.error(err));
    });
  }

  previousDayTasks(): void {
    let yesterday: Date = new Date(this.day.getTime() - (24 * 60 * 60 * 1000));

    //const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/schedules/overview/${format(yesterday, 'dd-MM-yyyy')}`])
        .catch((err) => console.error(err));
    });
  }
}
