import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadiologymastersComponent } from './radiologymasters.component';
import { GastroentrologymastersComponent } from './gastroentrologymasters.component';
import { CardiologymastersComponent } from './cardiologymasters.component';
import { OphthalmologymastersComponent } from './ophthalmologymasters.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [{
      path: '',
      redirectTo: 'radiologymasters'
    }, {
      path: 'radiologymasters',
      component: RadiologymastersComponent,
      data: {
        title: 'Radiologymasters'
      }
    }, {
      path: 'gastroentrologymasters',
      component: GastroentrologymastersComponent,
      data: {
        title: 'Gastroentrologymasters'
      }
    }, {
      path: 'cardiologymasters',
      component: CardiologymastersComponent,
      data: {
        title: 'Cardiologymasters'
      }
    }, {
      path: 'ophthalmologymasters',
      component: OphthalmologymastersComponent,
      data: {
        title: 'Ophthalmologymasters'
      }
    },]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
