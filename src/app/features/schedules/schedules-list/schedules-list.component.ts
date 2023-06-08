import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarView, CalendarWeekViewBeforeRenderEvent} from 'angular-calendar';
import {MonthViewDay} from 'calendar-utils';
import {format, isAfter, isBefore, isSameDay, isSameMonth} from 'date-fns';
import {Schedule} from '../schedule';
import {ScheduleService} from '../schedule.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-schedules-list',
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.css']
})
export class SchedulesListComponent implements OnInit {

  @ViewChild('modalContent', {static: true}) modalContent!: TemplateRef<any>;

  CalendarView = CalendarView;
  viewDate = new Date();
  activeDayIsOpen = false;
  view = CalendarView.Month;
  events: CalendarEvent[] = [];
  modalData!: { schedule: Schedule };
  eventsCopy: CalendarEvent[] = [];

  constructor(
    private router: Router,
    private modal: NgbModal,
    private scheduleService: ScheduleService,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loadSchedules();
    console.log(this.events)
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeActiveDay() {
    this.activeDayIsOpen = false;
  }

  onDayClick({date, events}: MonthViewDay) {

    console.log("OnDayClick " + date)

    this.router.navigate([`/schedules/overview/${format(date, 'dd-MM-yyyy')}`])
      .catch((err) => console.error(err));

    if (isSameMonth(date, this.viewDate)) {
      if (events.length === 0 || (isSameDay(this.viewDate, date) && this.activeDayIsOpen)) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }

      this.viewDate = date;
    }
  }

  onEventClick(event: CalendarEvent) {
    this.router.navigate([`/schedules/edit/${event.id}`])
      .catch((err) => console.log(err));
  }

  onSegmentClick(date: Date) {
    if (isAfter(date, new Date())) {
      this.router.navigate(['schedules/new'], {
        queryParams: {
          date: format(date, 'yyyy-MM-dd'),
          startTime: format(date, 'HH:mm')
        }
      });
    }
  }

  onBeforeRenderWeek({hourColumns}: CalendarWeekViewBeforeRenderEvent) {
    const todayDate = new Date();
    const hours = hourColumns.flatMap(hc => hc.hours);
    const segments = hours.flatMap(hours => hours.segments);

    segments.forEach(segment => {
      segment.cssClass = isBefore(segment.date, todayDate) ? 'cell-disabled' : 'cell-available';
    });
  }

  private buildEventActions(schedule: Schedule) {
    const events: CalendarEventAction[] = [];

    events.push({
      label: '<i class="fa-solid fa-pencil mx-1 text-purple"></i>',
      onClick: (): void => {
        this.router.navigate(['schedules', schedule.id]);
      }
    });
  }

  private convertStringToDate(stringDate: string): Date {
    let dd, MM, yyyy;
    [dd, MM, yyyy] = stringDate.split('/');
    return new Date(yyyy + "-" + MM + "-" + dd + "T12:00:00");// avoid GMT problem for +12 to -12
  }


  private loadSchedules() {

    this.eventsCopy.length = 0;

    this.scheduleService.findAllByMonthOfYear(this.viewDate)
      .subscribe({
        next: response => {
          response.map(
            schedule => this.eventsCopy
              .push({
                id: schedule.id,
                title: schedule.title,
                start: this.convertStringToDate(schedule.startDate),
                end: this.convertStringToDate(schedule.endDate ? schedule.endDate : schedule.startDate)
              }));

          console.log(response);
        },
        error: err => {
          console.error('error', err);
          this.toastrService.error("Tasks not loaded in calendar! reload page or contact administrator",
            "Error", {timeOut: 10000, closeButton: true});
        },
        complete: () => this.events = this.eventsCopy.concat(this.events)
      });
  }

  nextMonth() {

    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() + 1));
    this.events.length = 0;
    console.log("Next Month : " + this.viewDate);
    this.loadSchedules();
  }


  currentMonth() {
    this.viewDate = new Date();
    this.events.length = 0
    console.log("Current Month : " + this.viewDate);
    this.loadSchedules();
  }

  previousMonth() {

    this.viewDate = new Date(this.viewDate.setMonth(this.viewDate.getMonth() - 1));
    this.events.length = 0
    console.log("Previous Month : " + this.viewDate);
    this.loadSchedules();
  }

}
