import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalComponent } from './hospital.component';
import { FormsComponent } from './forms.component';
import { CityComponent } from './city.component';
import { ReligionComponent } from './religion.component';
import { MaritialComponent } from './maritial.component';
import { UsersComponent } from './users.component';
import { RoleComponent } from './role.component';
import { HolidaysComponent } from './holidays.component';
import {PopoversComponent} from './popovers.component';
import {CountryComponent} from './country.component';
import { StatusComponent } from './status.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'hospital'
      },
      {
        path: 'hospital',
        component: HospitalComponent,
        data: {
          title: 'Hospital'
        }
      },
      {
        path: 'forms',
        component: FormsComponent,
        data: {
          title: 'Forms'
        }
      },
      {
        path: 'city',
        component: CityComponent,
        data: {
          title: 'City'
        }
      },
      {
        path: 'religion',
        component: ReligionComponent,
        data: {
          title: 'Religion'
        }
      },
      {
        path: 'maritial',
        component: MaritialComponent,
        data: {
          title: 'Maritial'
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          title: 'Users'
        }
      },
      {
        path: 'role',
        component: RoleComponent,
        data: {
          title: 'Role'
        }
      },
      {
        path: 'holidays',
        component: HolidaysComponent,
        data: {
          title: 'Holidays'
        }
      },
      {
        path: 'popovers',
        component: PopoversComponent,
        data: {
          title: 'Popover'
        }
      },
      {
        path: 'country',
        component: CountryComponent,
        data: {
          title: 'Country'
        }
      },
      {
        path: 'status',
        component: StatusComponent,
        data: {
          title: 'status'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
