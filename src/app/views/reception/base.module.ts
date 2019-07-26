// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PatientregistrationComponent } from './patientregistration.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
// Forms Component
import { PatientappointmentsComponent } from './patientappointments.component';
import { ScheduleModule, AgendaService, DayService, DragAndDropService, ResizeService, WeekService, WorkWeekService, MonthService } from '@syncfusion/ej2-angular-schedule';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { GeneratequeunoComponent } from './generatequeuno.component';
import { BillinginvoicingComponent } from './billinginvoicing.component'; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// Components Routing
import { BaseRoutingModule } from './base-routing.module';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    TabsModule,
    ScheduleModule,
    Ng2SearchPipeModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(), 
    

  ],

  providers: [AgendaService, DayService, WeekService, WorkWeekService, MonthService, DragAndDropService, ResizeService],
  bootstrap: [PatientregistrationComponent],

  declarations: [
    PatientregistrationComponent,
    PatientappointmentsComponent,
    GeneratequeunoComponent,
    BillinginvoicingComponent
  ]
})
export class BaseModule { }
