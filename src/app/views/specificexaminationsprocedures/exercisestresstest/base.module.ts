import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { RouteComponent } from './route.component';
import { FrequencyComponent } from './frequency.component';
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
    RouteComponent,
    FrequencyComponent,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
