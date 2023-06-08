import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {parse} from 'date-fns';
import {ToastrService} from 'ngx-toastr';
import {ExpertService} from '../../experts/expert.service';
import {ScheduleService} from '../schedule.service';
import {Schedule} from "../schedule";

@Component({
  selector: 'app-schedules-new',
  templateUrl: './schedules-new.component.html',
  styleUrls: ['./schedules-new.component.css']
})
export class SchedulesNewComponent implements OnInit {

  task!: Schedule;

  scheduleForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null],
    startTime: [null],
    endTime: [null],
    description: [null],
    fullDay: [false]
  });//, {validators: this.endTimeValidator, updateOn: 'submit'}

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private expertService: ExpertService,
    private activatedRoute: ActivatedRoute,
    private scheduleService: ScheduleService
  ) {
  }

  ngOnInit() {
  }

  private inputDateToScheduleDateFormat(inputDateFormat: string): string {
    let dd, MM, yyyy;

    [yyyy, MM, dd] = inputDateFormat.split('-');

    return dd + "/" + MM + "/" + yyyy;
  }

  onSubmit() {
    this.task = this.scheduleForm.value;
    this.task.startDate = this.inputDateToScheduleDateFormat(this.task.startDate);
    this.task.endDate = this.task.endDate != null ?
      this.inputDateToScheduleDateFormat(this.task.endDate)
      : this.task.endDate;

    console.log(this.task);

    this.scheduleService.save(this.task).subscribe({
      next: () => {
        this.toastrService.success("Task successfully added!", "Success");
      },
      error: (err) => {
        this.toastrService.error("Tasks not added in calendar! retry or contact administrator",
          "Error", {timeOut: 10000, closeButton: true});
        console.error(err);
      },
      complete: () => this.router.navigateByUrl('/schedules')
        .catch((err) => console.error(err))
    });
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
