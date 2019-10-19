import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationdashboardComponent } from './operationdashboard.component';
import { RequisitionComponent } from './requisition.component';

const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'operationdashboard'
  }, {
      path: 'operationdashboard',
      component: OperationdashboardComponent,
    data: {
      title: 'Operation Dashboard'
    }
  }, {
    path: 'requisition',
    component: RequisitionComponent,
    data: {
      title: 'Requisition'
    }
  },]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
