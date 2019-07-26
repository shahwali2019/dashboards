import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { RouteComponent } from './route.component';
import { FrequencyComponent } from './frequency.component';

const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'specialistassessmentreports'
  }, {
    path: 'specialistassessmentreports',
    component: SpecialistassessmentreportsComponent,
    data: {
      title: 'Specialistassessment reports'
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
