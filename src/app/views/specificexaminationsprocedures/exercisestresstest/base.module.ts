import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { WorklistComponent } from './worklist.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';
import { BaseRoutingModule } from './base-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

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
    WorklistComponent,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
