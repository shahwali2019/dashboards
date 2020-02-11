import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { WorklistComponent } from './worklist.component';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    WorklistComponent,
    SpecialistassessmentreportsComponent,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
