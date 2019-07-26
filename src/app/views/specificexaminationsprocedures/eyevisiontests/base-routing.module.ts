import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { RouteComponent } from './route.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';

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
    path: 'healthalliednotes',
    component: HealthalliednotesComponent,
    data: {
      title: 'Healthalliednotes'
    }
  },]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
