import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchedulesEditComponent} from './schedules-edit/schedules-edit.component';
import {SchedulesListComponent} from './schedules-list/schedules-list.component';
import {SchedulesNewComponent} from './schedules-new/schedules-new.component';
import {SchedulesOverviewComponent} from 'src/app/features/schedules/schedules-overview/schedules-overview.component';

const routes: Routes = [
  {
    path: "",
    component: SchedulesListComponent
  }, {
    path: "new",
    component: SchedulesNewComponent
  }, {
    path: "overview/:day",
    component: SchedulesOverviewComponent
  }, {
    path: "edit/:id/:day",
    component: SchedulesEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule {
}
