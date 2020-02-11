import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { Worklist1Component } from './worklist1.component';
import { Worklist2Component } from './worklist2.component';
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
    Worklist1Component,
    Worklist2Component,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
