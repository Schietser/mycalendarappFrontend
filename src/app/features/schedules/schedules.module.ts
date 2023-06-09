import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchedulesRoutingModule} from './schedules-routing.module';
import {SchedulesEditComponent} from './schedules-edit/schedules-edit.component';
import {SchedulesListComponent} from './schedules-list/schedules-list.component';
import {SchedulesNewComponent} from './schedules-new/schedules-new.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';

import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SchedulesOverviewComponent} from "./schedules-overview/schedules-overview.component";

// import localePt from '@angular/common/locales/pt';

// registerLocaleData(localePt);

@NgModule({
  declarations: [
    SchedulesEditComponent,
    SchedulesListComponent,
    SchedulesNewComponent,
    SchedulesOverviewComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SchedulesRoutingModule,

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ]
})
export class SchedulesModule {
}
