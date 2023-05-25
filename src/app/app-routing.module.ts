import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/schedules",
  }, {
    path: 'schedules',
    loadChildren: () => import('./features/schedules/schedules.module').then(m => m.SchedulesModule)
  },  {
    path: "**",
    redirectTo: "/schedules",
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
