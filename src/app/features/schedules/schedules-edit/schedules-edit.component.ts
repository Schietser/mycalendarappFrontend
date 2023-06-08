import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ExpertService} from '../../experts/expert.service';
import {ScheduleService} from '../schedule.service';
import {Schedule} from '../schedule';
import {Location} from '@angular/common'
import {ToastrService} from "ngx-toastr";
import {parse} from "date-fns";

@Component({
  selector: 'app-schedules-edit',
  templateUrl: './schedules-edit.component.html',
  styleUrls: ['./schedules-edit.component.css']
})
export class SchedulesEditComponent implements OnInit {

  scheduleId!: number;
  schedule!: Schedule;
  day!: string;

  scheduleForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null],
    startTime: [null, Validators.required],
    endTime: [null, Validators.required],
    description: [null],
    fullDay: [false]
  });//, {validators: this.endTimeValidator, updateOn: 'submit'}

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private expertService: ExpertService,
    private scheduleService: ScheduleService,
    private toastrService: ToastrService
  ) {
  }

  private endTimeValidator(control: AbstractControl) {
    const startDate = parse(control.get('StartDate')?.value, 'yyyy-MM-dd', Date.now());
    const endDate = parse(control.get('endDate')?.value, 'yyyy-MM-dd', Date.now());

    const startTime = parse(control.get('startTime')?.value, 'HH:mm', Date.now());
    const endTime = parse(control.get('endTime')?.value, 'HH:mm', Date.now());

    if (startDate.getTime() === endDate.getTime()
      && startTime >= endTime) {
      return {
        timeError: 'The end hour must be greater than initial hour.'
      }
    }

    return null;
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

    this.scheduleService.update(this.scheduleId, updateSchedule).subscribe({
      next: () => {
        this.toastrService.success("Task updated successfully!", "Success");
      },
      error: (err) => {
        this.toastrService.error("Task not updated! retry or contact administrator",
          "Error", {timeOut: 10000, closeButton: true});
        console.error(err);
      },
      complete: () => {
        this.router.navigateByUrl('/schedules/overview/' + this.day)
          .catch((err) => console.error(err))
      }
    });
  }

  onBack() {
    this.router.navigateByUrl('/schedules/overview/' + this.day)
      .catch((err) => console.error(err));
  }

  private loadSchedule(): any {
    console.log('Loading schedule');

    this.scheduleService.findById(this.scheduleId).subscribe({
      next: schedule => {

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
      },
      error: (err) => {
        this.toastrService.error("Task not loaded! reload page  or contact administrator",
          "Error", {timeOut: 10000, closeButton: true});
        console.error(err);
      }
    });

  }

  fullDayChecked(): void {
    if (this.scheduleForm.get("fullDay")?.value == true) {
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
