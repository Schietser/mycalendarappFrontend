import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ExpertService} from '../../experts/expert.service';
import {ScheduleService} from '../schedule.service';
import {Schedule} from '../schedule';
import {Location} from '@angular/common'

@Component({
  selector: 'app-schedules-edit',
  templateUrl: './schedules-edit.component.html',
  styleUrls: ['./schedules-edit.component.css']
})
export class SchedulesEditComponent implements OnInit {

  scheduleId!: number;
  schedule!: Schedule;
  day!: string;
  /*schedule: Schedule = {
    id: 2,
    title: 'title',
    description: 'description',
    startDate: '30/05/2023',//new Date("2023-05-31"),
    endDate: '30/05/2023',//new Date("2023-05-31"),
    startTime: '09:30',
    endTime: '10:30',
    fullDay: false
  };*/

  scheduleForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null],
    startTime: [null, Validators.required],
    endTime: [null, Validators.required],
    description: [null],
    fullDay: [false]
  });

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private expertService: ExpertService,
    private scheduleService: ScheduleService,
  ) {
  }

  private scheduleDateToInputDateFormat(scheduleDateFormat: string): string {
    let dd, MM, yyyy;

    [dd, MM, yyyy] = scheduleDateFormat.split('/');

    return yyyy + "-" + MM + "-" + dd;
  }

  private inputDateToScheduleDateFormat(inputDateFormat: string): string {
    let dd, MM, yyyy;

    [yyyy, MM, dd] = inputDateFormat.split('-');

    return dd + "/" + MM + "/" + yyyy;
  }

  ngOnInit(): void {
    this.scheduleId = this.activatedRoute.snapshot.params['id'] as number;
    this.day = this.activatedRoute.snapshot.params['day'] as string;
    this.loadSchedule();
  }

  onSubmit() {
    let updateSchedule = this.scheduleForm.value;
    updateSchedule.startDate = this.inputDateToScheduleDateFormat(updateSchedule.startDate);
    updateSchedule.endDate = updateSchedule.endDate != null ?
      this.inputDateToScheduleDateFormat(updateSchedule.endDate)
      : updateSchedule.endDate;

    this.scheduleService.update(this.scheduleId, updateSchedule).subscribe(() => {
      //this.router.navigateByUrl('/schedules');
      this.router.navigateByUrl('/schedules/overview/' + this.day);
    });
  }

  onBack() {
    //this.location.back();
    this.router.navigateByUrl('/schedules/overview/' + this.day);
  }


  private loadSchedule(): any {
    console.log('Loading schedule');

    this.scheduleService.findById(this.scheduleId).subscribe(schedule => {
      this.scheduleForm.patchValue({
        title: schedule.title,
        startDate: this.scheduleDateToInputDateFormat(schedule.startDate),
        endDate: schedule.endDate != null ? this.scheduleDateToInputDateFormat(schedule.endDate) : schedule.endDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        description: schedule.description,
        fullDay: schedule.fullDay
      });

      this.schedule = schedule;


      if (this.scheduleForm.get("fullDay")?.value == true) {

        this.scheduleForm.get("endDate")?.reset();
        this.scheduleForm.get("startTime")?.reset();
        this.scheduleForm.get("endTime")?.reset();

        this.scheduleForm.get("endDate")?.disable();
        this.scheduleForm.get("startTime")?.disable();
        this.scheduleForm.get("endTime")?.disable();
      }
      return schedule;
    });

  }


  fullDayChecked(): void {
    if (this.scheduleForm.get("fullDay")?.value) {
      this.scheduleForm.get("endDate")?.reset();
      this.scheduleForm.get("startTime")?.reset();
      this.scheduleForm.get("endTime")?.reset();

      this.scheduleForm.get("endDate")?.disable();
      this.scheduleForm.get("startTime")?.disable();
      this.scheduleForm.get("endTime")?.disable();
    } else {
      this.scheduleForm.get("endDate")?.enable();
      this.scheduleForm.get("startTime")?.enable();
      this.scheduleForm.get("endTime")?.enable();
    }
  }
}
