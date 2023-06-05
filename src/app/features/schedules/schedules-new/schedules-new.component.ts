import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {parse} from 'date-fns';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {Expert} from '../../experts/expert';
import {ExpertService} from '../../experts/expert.service';
import {ScheduleService} from '../schedule.service';

@Component({
  selector: 'app-schedules-new',
  templateUrl: './schedules-new.component.html',
  styleUrls: ['./schedules-new.component.css']
})
export class SchedulesNewComponent implements OnInit {

  experts: Observable<Expert[]> = this.expertService.findAll();

  scheduleForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    startDate: ["2020-03-10", Validators.required],
    endDate: [null],
    startTime: [null, Validators.required],
    endTime: [null, Validators.required],
    description: [null],
    fullDay: [false]
  }, {validators: this.endTimeValidator});

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private expertService: ExpertService,
    private activatedRoute: ActivatedRoute,
    private scheduleService: ScheduleService
  ) {
  }

  ngOnInit() {
    const {date, startTime} = this.activatedRoute.snapshot.queryParams;
    if (date && startTime) {
      this.scheduleForm.patchValue({date, startTime});
    }
  }

  onSubmit() {
    let data = this.scheduleForm.value;
    this.scheduleService.save(this.scheduleForm.value).subscribe(() => {
      this.router.navigateByUrl('/schedules');
      this.toastr.success("Event scheduled successfully!", "Information");
    });
  }

  private endTimeValidator(control: AbstractControl) {
    const startTime = parse(control.get('startTime')?.value, 'HH:mm', Date.now());
    const endTime = parse(control.get('endTime')?.value, 'HH:mm', Date.now());

    if (startTime >= endTime) {
      return {
        timeError: 'The end hour must be greater than initial hour.'
      }
    }


    return null;
  }

}
