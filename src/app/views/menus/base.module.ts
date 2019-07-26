// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { HospitalComponent } from './hospital.component';

// Forms Component
import { FormsComponent } from './forms.component';

import { CityComponent } from './city.component';
import { ReligionComponent } from './religion.component';

// Tabs Component
import { MaritialComponent } from './maritial.component';

// Carousel Component
import { UsersComponent } from './users.component';

// Collapse Component
import { RoleComponent } from './role.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PopoversComponent } from './popovers.component';

// Popover Component
import { HolidaysComponent } from './holidays.component';

import { CountryComponent } from './country.component';

// Tooltip Component
import { StatusComponent } from './status.component';


// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    HospitalComponent,
    FormsComponent,
    CityComponent,
    ReligionComponent,
    MaritialComponent,
    UsersComponent,
    RoleComponent,
    HolidaysComponent,
    PopoversComponent,
    CountryComponent,
    StatusComponent
  ]
})
export class BaseModule { }
