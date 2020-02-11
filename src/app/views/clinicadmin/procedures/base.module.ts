import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RadiologymastersComponent } from './radiologymasters.component';
import { GastroentrologymastersComponent } from './gastroentrologymasters.component';
import { CardiologymastersComponent } from './cardiologymasters.component';
import { OphthalmologymastersComponent } from './ophthalmologymasters.component';
import { BaseRoutingModule } from './base-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule
  ],
  declarations: [
    RadiologymastersComponent,
    GastroentrologymastersComponent,
    CardiologymastersComponent,
    OphthalmologymastersComponent
  ]
})
export class BaseModule { }
