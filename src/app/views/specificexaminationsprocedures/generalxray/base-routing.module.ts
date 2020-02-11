import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorklistsComponent } from './worklists.component';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';

const routes: Routes = [{

  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'worklists'
  },


    {
    path: 'worklists',
    component: WorklistsComponent,
    data: {
      title: 'Worklists'
    }
    },

    {
      path: 'specialistassessmentreports',
      component: SpecialistassessmentreportsComponent,
      data: {
        title: 'Specialist assessment & reports'
      }
    },
    {
      path: 'healthalliednotes',
      component: HealthalliednotesComponent,
      data: {
        title: 'Allied Health Notes'
      }
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
