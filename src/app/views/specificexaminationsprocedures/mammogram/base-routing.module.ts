import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorklistComponent } from './worklist.component';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
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
        redirectTo: 'worklist'
      },
      {
        path: 'worklist',
        component: WorklistComponent,
        data: {
          title: 'Worklist'
        }
      },
      {
        path: 'specialistassessmentreports',
        component: SpecialistassessmentreportsComponent,
        data: {
          title: 'Specialist Assessment & reports'
        }
      },
      {
        path: 'healthalliednotes',
        component: HealthalliednotesComponent,
        data: {
          title: 'Allied Health & Notes'
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
