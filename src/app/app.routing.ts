import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';


import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { RegComponent } from './views/reg/reg.component';

export
  const routes: Routes = [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  }, {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
    },
    {
      path: 'reg',
      component: RegComponent,
      data: {
        title: 'Register Page'
      }
    },

    {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: ''
    },
    children: [{
      path: 'menus',
      loadChildren: './views/menus/base.module#BaseModule'
    }, {
      path: 'physiciansworkpace',
      loadChildren: './views/physiciansworkpace/base.module#BaseModule'
    }, {
      path: 'nurseworkspace',
      loadChildren: './views/nurseworkspace/base.module#BaseModule'
    }, {
      path: 'reception',
      loadChildren: './views/reception/base.module#BaseModule'
      },

      {
      path: 'clinicadmin',
      loadChildren: './views/clinicadmin/base.module#BaseModule'
    }, {
      path: 'clinicadmin/drugscategory',
      loadChildren: './views/clinicadmin/drugscategory/base.module#BaseModule'
    }, {
      path: 'clinicadmin/procedures',
      loadChildren: './views/clinicadmin/procedures/base.module#BaseModule'
    }, {
      path: 'eyevisiontests',
      loadChildren: './views/eyevisiontests/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/generalxray',
      loadChildren: './views/specificexaminationsprocedures/generalxray/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/specialistassessmentreport',
      loadChildren: './views/specificexaminationsprocedures/specialistassessmentreport/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/mammogram',
      loadChildren: './views/specificexaminationsprocedures/mammogram/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/endoscopy',
      loadChildren: './views/specificexaminationsprocedures/endoscopy/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/ultrosound',
      loadChildren: './views/specificexaminationsprocedures/ultrosound/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/exercisestresstest',
      loadChildren: './views/specificexaminationsprocedures/exercisestresstest/base.module#BaseModule'
    }, {
      path: 'specificexaminationsprocedures/eyevisiontests',
      loadChildren: './views/specificexaminationsprocedures/eyevisiontests/base.module#BaseModule'
    }, {
      path: 'laboratory',
      loadChildren: './views/laboratory/base.module#BaseModule'
    }, {
      path: 'pharmacy',
      loadChildren: './views/pharmacy/base.module#BaseModule'
      },


      {
      path: 'pharmacystockinventory',
      loadChildren: './views/pharmacystockinventory/base.module#BaseModule'
    }, {
      path: 'charts',
      loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
    }, {
      path: 'dashboard',
      loadChildren: './views/dashboard/dashboard.module#DashboardModule'
    }, {
      path: 'widgets',
      loadChildren: './views/widgets/widgets.module#WidgetsModule'
    }]
  },];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
