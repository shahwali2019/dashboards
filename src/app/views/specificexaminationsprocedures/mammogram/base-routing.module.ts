import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorklistComponent } from './worklist.component';
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
