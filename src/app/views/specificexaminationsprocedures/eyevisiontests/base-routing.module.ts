import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { WorklistComponent } from './worklist.component';
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
      path: 'worklist',
      component: WorklistComponent,
    data: {
      title: 'Worklist'
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
