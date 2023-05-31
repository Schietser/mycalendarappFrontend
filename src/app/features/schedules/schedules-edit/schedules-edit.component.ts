import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpertService } from '../../experts/expert.service';
import { ScheduleService } from '../schedule.service';
import { Schedule } from '../schedule';

@Component({
  selector: 'app-schedules-edit',
  templateUrl: './schedules-edit.component.html',
  styleUrls: ['./schedules-edit.component.css']
})
export class SchedulesEditComponent implements OnInit {

  scheduleId! : number;
  schedule : Schedule={id : 2, title: 'title', description: 'description', date: new Date("2023-05-31"), initTime: '09:30', endTime: '10:30'};

  scheduleForm: FormGroup = this.formBuilder.group({
    title: [null, Validators.required],
    date: [null, Validators.required],
    initTime: [null, Validators.required],
    endTime: [null, Validators.required],
    description: [null]
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private expertService: ExpertService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.scheduleId = this.activatedRoute.snapshot.params['id'] as number;
    this.loadSchedule();
  }

  onSubmit() {
    this.scheduleService.update(this.scheduleId, this.scheduleForm.value).subscribe(() => {
      this.router.navigateByUrl('/schedules');
    });
  }

  private loadSchedule() : any{
    console.log('Loading schedule');
    this.scheduleService.findById(this.scheduleId).subscribe(schedule => {
      this.scheduleForm.patchValue({
        title: schedule.title,
        date: schedule.date,
        initTime: schedule.initTime,
        endTime: schedule.endTime,
        description: schedule.description
      });

      console.log(this.schedule);

      return schedule;

    });
  }

}
