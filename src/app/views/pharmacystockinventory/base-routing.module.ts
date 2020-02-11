import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterlistComponent } from './masterlist.component';
import { DruglibraryComponent } from './druglibrary.component';
const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'masterlist'
  }, {
    path: 'masterlist',
    component: MasterlistComponent,
    data: {
      title: 'Master list'
    }
  }, {
    path: 'druglibrary',
    component: DruglibraryComponent,
    data: {
      title: 'Druglibrary'
    }
  },]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
