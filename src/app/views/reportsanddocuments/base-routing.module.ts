import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalcertificateComponent } from './medicalcertificate.component';
import { ConsentformComponent } from './consentform.component';
import { ReferralnotesComponent } from './referralnotes.component';
import { ExamproceduresComponent } from './examprocedures.component';
import { HealtscreeningreoprtComponent } from './healtscreeningreoprt.component';

const routes: Routes = [{
  path: '',
  data: {
    title: ''
  },
  children: [{
    path: '',
    redirectTo: 'physicianassessment'
  }, {
      path: 'medicalcertificate',
      component: MedicalcertificateComponent,
    data: {
      title: 'Medication Certificate'
    }
  }, {
    path: 'consentform',
      component: ConsentformComponent,
    data: {
      title: 'Consent Form'
    }
  }, {
      path: 'referralnotes',
      component: ReferralnotesComponent,
    data: {
      title: 'Referral Notes'
    }
    }, {
      path: 'healtscreeningreoprt',
      component: HealtscreeningreoprtComponent,
      data: {
        title: 'Health Screening and Reoprt'
      }
    }, 

    {
      path: 'examprocedures',
      component: ExamproceduresComponent,
    data: {
      title: 'Request for Specific Examination/Procedure Report'
    }
  },]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
