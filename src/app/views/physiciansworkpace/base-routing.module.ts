import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhysicianassessmentComponent } from './physicianassessment.component';
import { OrdersComponent } from './orders.component';
import { CareplansComponent } from './careplans.component';
import { PhysiciannotesComponent } from './physiciannotes.component';
import { MedicationprescriptionComponent } from './medicationprescription.component';

const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'physicianassessment'
  }, {
    path: 'physicianassessment',
    component: PhysicianassessmentComponent,
    data: {
      title: 'Physician Assessment'
    }
  }, {
    path: 'orders',
    component: OrdersComponent,
    data: {
      title: 'Orders'
    }
  }, {
    path: 'careplans',
    component: CareplansComponent,
    data: {
      title: 'Careplans'
    }
    }, {
      path: 'medicationprescription',
      component: MedicationprescriptionComponent,
      data: {
        title: 'Medicationprescription'
      }
    }, 

    {
    path: 'physician',
    component: PhysiciannotesComponent,
    data: {
      title: 'Physician'
    }
  },]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
