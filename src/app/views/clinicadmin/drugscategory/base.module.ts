// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DrugsComponent } from './drugs.component';
import { RouteComponent } from './route.component';
import { FrequencyComponent } from './frequency.component';
// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule
  ],
  declarations: [
    DrugsComponent,
    RouteComponent,
    FrequencyComponent
  ]
})
export class BaseModule { }
