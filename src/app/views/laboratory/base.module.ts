// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LaboratoryanalysisComponent } from './laboratoryanalysis.component';
import { LabstockinventoryComponent } from './labstockinventory.component';
import { MasterlistComponent } from './masterlist.component';
import { ReagentlibraryComponent } from './reagentlibrary.component'; 
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule
  ],
  declarations: [
    LaboratoryanalysisComponent,
    LabstockinventoryComponent,
    MasterlistComponent,
    ReagentlibraryComponent
  ]
})
export class BaseModule { }
