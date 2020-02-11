import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MedicalcertificateComponent } from './medicalcertificate.component';
import { ConsentformComponent } from './consentform.component';
import { ReferralnotesComponent } from './referralnotes.component';
import { ExamproceduresComponent } from './examprocedures.component';
import { HealtscreeningreoprtComponent } from './healtscreeningreoprt.component';
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    MedicalcertificateComponent,
    ConsentformComponent,
    ReferralnotesComponent,
    ExamproceduresComponent,
    HealtscreeningreoprtComponent,
    
  ]

})
export class BaseModule { }
