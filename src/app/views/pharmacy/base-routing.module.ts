import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispensingComponent } from './dispensing.component';
import { RequisitionComponent } from './requisition.component';
const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'dispensing'
  }, {
    path: 'dispensing',
    component: DispensingComponent,
    data: {
      title: 'Dispensing'
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
