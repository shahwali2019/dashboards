import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { WorklistComponent } from './worklist.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    SpecialistassessmentreportsComponent,
    WorklistComponent,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
