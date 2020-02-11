import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DispensingComponent } from './dispensing.component';
import { RequisitionComponent } from './requisition.component';
import { BaseRoutingModule } from './base-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AvatarModule } from 'ngx-avatar';
import { HttpClientModule } from '@angular/common/http';
import { FilterdataPipe } from './filterdata.pipe';




@NgModule({
  imports: [
    CommonModule,
    AvatarModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    TabsModule,
    DatepickerModule,
    BsDatepickerModule,
    BaseRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    DispensingComponent,
    RequisitionComponent,
    FilterdataPipe
  ]
})
export class BaseModule { }
