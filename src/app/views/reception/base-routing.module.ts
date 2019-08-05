import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientregistrationComponent } from './patientregistration.component';
import { PatientappointmentsComponent } from './patientappointments.component';
import { GeneratequeunoComponent } from './generatequeuno.component';
import { BillinginvoicingComponent } from './billinginvoicing.component'; 

const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'patientregistration'
  }, {
    path: 'patientregistration',
    component: PatientregistrationComponent,
    data: {
      title: 'Patient Registration'
    }
  }, {
    path: 'patientappointments',
    component: PatientappointmentsComponent,
    data: {
      title: 'Patient Appointments'
    }
  }, {
    path: 'generatequeuno',
    component: GeneratequeunoComponent,
    data: {
      title: 'Generate queuno'
    }
    },


    {
    path: 'billinginvoicing',
    component: BillinginvoicingComponent,
    data: {
      title: 'Billing Invoicing'
    }
  },]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
