// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UomComponent } from './uom.component';
// Forms Component
import { DepartmentsComponent } from './departments.component';
import { LocationsComponent } from './locations.component';
import { ServicetypeComponent } from './servicetype.component';
// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule
  ],
  declarations: [
    UomComponent,
    DepartmentsComponent,
    LocationsComponent,
    ServicetypeComponent
    
    
  ]
})
export class BaseModule { }
