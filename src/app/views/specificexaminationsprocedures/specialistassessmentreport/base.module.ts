import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SpecialistassessmentreportsComponent } from './specialistassessmentreports.component';
import { HeroesComponent } from './heroes.component';
import { FrequencyComponent } from './frequency.component';
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
    HeroesComponent,
    FrequencyComponent,
    HealthalliednotesComponent
  ]
})
export class BaseModule { }
