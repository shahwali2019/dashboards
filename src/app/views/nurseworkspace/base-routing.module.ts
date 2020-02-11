import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NursingassessmentComponent } from './nursingassessment.component';
import { NursingflowsheetComponent } from './nursingflowsheet.component';
import { NursingnotesComponent } from './nursingnotes.component';

const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'nursingassessment'
  }, {
    path: 'nursingassessment',
    component: NursingassessmentComponent,
    data: {
      title: 'Nursingassessment'
    }
  }, {
    path: 'nursingflowsheet',
    component: NursingflowsheetComponent,
    data: {
      title: 'Nursingflowsheet'
    }
  }, {
    path: 'nursingnotes',
    component: NursingnotesComponent,
    data: {
      title: 'Nursingnotes'
    }
  },]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
