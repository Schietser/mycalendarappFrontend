import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent, CalendarEventAction, CalendarView, CalendarWeekViewBeforeRenderEvent} from 'angular-calendar';
import {MonthViewDay} from 'calendar-utils';
import {format, isAfter, isBefore, isSameDay, isSameMonth} from 'date-fns';
import {Schedule} from '../schedule';
import {ScheduleService} from '../schedule.service';
import {Subject} from "rxjs";

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
  refreshCalendar: Subject<void> = new Subject();
  modalData!: { schedule: Schedule };
  eventsCopy: CalendarEvent[] = [];

  constructor(
    private router: Router,
    private modal: NgbModal,
    private scheduleService: ScheduleService) {
    //this.events.push({start: new Date('2023-05-31'), title: 'Schedule', id: 1})
    this.events.push({title: 'Dentist appointment', start: new Date('2023-05-30')})

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

    this.router.navigate([`/schedules/overview/${format(date, 'dd-MM-yyyy')}`]);
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
    this.router.navigate([`/schedules/edit/${event.id}`]);
    /* this.modalData = { schedule: event.meta };
    this.modal.open(this.modalContent, { size: 'md' }); */
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

    events.push({
      label: '<i class="fa-solid fa-trash-can mx-1 text-purple"></i>',
      onClick: (): void => {

        this.scheduleService.delete(schedule.id).subscribe(() => {
          this.loadSchedules();
          this.closeActiveDay();
        });
      }
    });

    return events;
  }

  private convertStringToDate(stringDate: string): Date {
    let dd, MM, yyyy;
    [dd, MM, yyyy] = stringDate.split('/');
    return new Date(yyyy + "-" + MM + "-" + dd + "T12:00:00");// avoid GMT problem for +12 to -12
  }

  private buildEvent(schedule: Schedule) {
    const parsedDate = this.convertStringToDate(schedule.startDate);
    const event: CalendarEvent = {
      id: schedule.id,
      title: schedule.title,
      //start: parse(schedule.startTime ? schedule.startTime : "00:00", 'HH:mm', parsedDate),
      start: new Date('2023-06-22')
      /*end: parse(schedule.endTime ? schedule.endTime : "00:00", 'HH:mm', parsedDate),
      cssClass: 'event-body',
      color: {
        primary: 'var(--purple)',
        secondary: 'var(--bg-purple-alpha)'
      },
      meta: schedule*/
    }

    //if (isAfter(event.start, new Date())) {
    // event.actions = this.buildEventActions(schedule);
    // }

    return event;
  }

  private loadSchedules() {

    this.scheduleService.findAllByMonthOfYear(this.viewDate)
      .subscribe({
        next: response => {
          response.map(
            schedule => this.eventsCopy
              .push({
                title: schedule.title,
                start: this.convertStringToDate(schedule.startDate)
              }));//this.buildEvent(schedule)));

          console.log(response);
        },
        error: err => console.log('error', err)
      });

    this.events = this.eventsCopy;
    this.refreshCalendar.next();
  }

}
