import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ExpertService} from '../../experts/expert.service';
import {ScheduleService} from '../schedule.service';
import {Schedule} from '../schedule';
import { Location } from '@angular/common'

@Component({
  selector: 'app-schedules-edit',
  templateUrl: './schedules-edit.component.html',
  styleUrls: ['./schedules-edit.component.css']
})
export class SchedulesEditComponent implements OnInit {

  scheduleId!: number;
  schedule: Schedule = {
    id: 2,
    title: 'title',
    description: 'description',
    startDate: '30/05/2023',//new Date("2023-05-31"),
    endDate: '30/05/2023',//new Date("2023-05-31"),
    startTime: '09:30',
    endTime: '10:30',
    fullDay: false
  };

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

  ngOnInit(): void {
    this.scheduleId = this.activatedRoute.snapshot.params['id'] as number;
    this.loadSchedule();
  }

  onSubmit() {
    this.scheduleService.update(this.scheduleId, this.scheduleForm.value).subscribe(() => {
      this.router.navigateByUrl('/schedules');
    });
  }

  onBack() {
    this.location.back();
  }



  private loadSchedule(): any {
    console.log('Loading schedule');
    this.scheduleService.findById(this.scheduleId).subscribe(schedule => {
      this.scheduleForm.patchValue({
        title: schedule.title,
        date: schedule.startDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        description: schedule.description
      });

      console.log(this.schedule);

      return schedule;

    });
  }

}
