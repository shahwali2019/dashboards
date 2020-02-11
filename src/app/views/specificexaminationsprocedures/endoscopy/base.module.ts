import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { Endoscopyworklist1Component } from './endoscopyworklist1.component';
import { Endoscopyworklist2Component } from './endoscopyworklist2.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    SpecialistassessmentreportsComponent,
    Endoscopyworklist1Component,
    Endoscopyworklist2Component,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
