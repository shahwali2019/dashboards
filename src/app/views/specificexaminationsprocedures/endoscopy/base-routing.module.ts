import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { Endoscopyworklist1Component } from './endoscopyworklist1.component';
import { Endoscopyworklist2Component } from './endoscopyworklist2.component';
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
      title: 'Specialist Assessment & Reports'
    }
  }, {
      path: 'endoscopyworklist1',
      component: Endoscopyworklist1Component,
    data: {
      title: 'Endoscopy I Worklist'
    }
  }, {
      path: 'endoscopyworklist2',
      component: Endoscopyworklist2Component,
    data: {
      title: 'Endoscopy II Worklist'
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
