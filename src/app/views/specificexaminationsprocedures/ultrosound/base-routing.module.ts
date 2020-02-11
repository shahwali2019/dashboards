import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { Worklist1Component } from './worklist1.component';
import { Worklist2Component } from './worklist2.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'specialistassessmentreports'
      },
      {
        path: 'specialistassessmentreports',
        component: SpecialistassessmentreportsComponent,
        data: {
          title: 'Specialistassessment reports'
        }
      },
      {
        path: 'worklist1',
        component: Worklist1Component,
        data: {
          title: 'U/S I Worklist'
        }
      },
      {
        path: 'worklist2',
        component: Worklist2Component,
        data: {
          title: 'U/S II Worklist'
        }
      },
      {
        path: 'healthalliednotes',
        component: HealthalliednotesComponent,
        data: {
          title: 'Healthalliednotes'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
