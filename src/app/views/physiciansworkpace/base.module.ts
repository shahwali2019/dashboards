import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PhysicianassessmentComponent } from './physicianassessment.component';
import { OrdersComponent } from './orders.component';
import { CareplansComponent } from './careplans.component';
import { PhysiciannotesComponent } from './physiciannotes.component';
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    PhysicianassessmentComponent,
    OrdersComponent,
    CareplansComponent,
    PhysiciannotesComponent,
    
  ]

})
export class BaseModule { }
