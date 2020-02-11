// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NursingassessmentComponent } from './nursingassessment.component';

// Forms Component
import { NursingflowsheetComponent } from './nursingflowsheet.component';

import { NursingnotesComponent } from './nursingnotes.component';


// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  declarations: [
    NursingassessmentComponent,
    NursingflowsheetComponent,
    NursingnotesComponent
  ]
})
export class BaseModule { }
