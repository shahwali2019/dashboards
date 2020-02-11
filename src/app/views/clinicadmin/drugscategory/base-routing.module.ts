import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrugsComponent } from './drugs.component';
import { RouteComponent } from './route.component';
import { FrequencyComponent } from './frequency.component';
const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'drugs'
  }, {
    path: 'drugs',
    component: DrugsComponent,
    data: {
      title: 'Drugs'
    }
  }, {
    path: 'route',
    component: RouteComponent,
    data: {
      title: 'Route'
    }
  }, {
    path: 'frequency',
    component: FrequencyComponent,
    data: {
      title: 'Frequency'
    }
  },]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
