import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { WorklistsComponent } from './worklists.component';
import { HealthalliednotesComponent } from './healthalliednotes.component';
import { BaseRoutingModule } from './base-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [
    WorklistsComponent,
    SpecialistassessmentreportsComponent,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
