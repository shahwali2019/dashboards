import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UomComponent } from './uom.component'; 
import { DepartmentsComponent } from './departments.component';
import { LocationsComponent } from './locations.component';
import { ServicetypeComponent } from './servicetype.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'uom'
      },
      {
        path: 'uom',
        component: UomComponent,
        data: {
          title: 'Uom'
        }
      },
      {
        path: 'departments',
        component: DepartmentsComponent,
        data: {
          title: 'Departments'
        }
      },
      {
        path: 'locations',
        component: LocationsComponent,
        data: {
          title: 'Locations'
        }
      },

      {
        path: 'servicetype',
        component: ServicetypeComponent,
        data: {
          title: 'Servicetype'
        }
      },
    

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
