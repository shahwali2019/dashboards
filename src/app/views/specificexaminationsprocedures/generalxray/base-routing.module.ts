import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorklistsComponent } from './worklists.component';
const routes: Routes = [{

  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'worklists'
  }, {
    path: 'worklists',
    component: WorklistsComponent,
    data: {
      title: 'Worklists'
    }
  },]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
