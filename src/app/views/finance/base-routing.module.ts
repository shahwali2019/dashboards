import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsreceivableComponent } from './accountsreceivable.component';
import { LedgersComponent } from './ledgers.component';
import { FinancialdashboardComponent } from './financialdashboard.component';
import { InsurancemanagementComponent } from './insurancemanagement.component';
import { AssetmanagementComponent } from './assetmanagement.component';
import { UsersComponent } from './users.component';
import { RoleComponent } from './role.component';
import { AccountspayableComponent } from './accountspayable.component';
import { MaterialmanagementComponent } from './materialmanagement.component';
import { BillingmanagerComponent } from './billingmanager.component';
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
        path: 'accountsreceivable',
        component: AccountsreceivableComponent,
        data: {
          title: 'Accounts Receivable'
        }
      },
      {
        path: 'ledgers',
        component: LedgersComponent,
        data: {
          title: 'Ledgers'
        }
      },
      {
        path: 'financialdashboard',
        component: FinancialdashboardComponent,
        data: {
          title: 'Financial Dashboard'
        }
      },
      {
        path: 'insurancemanagement',
        component: InsurancemanagementComponent,
        data: {
          title: 'Insurance Management'
        }
      },
      {
        path: 'assetmanagement',
        component: AssetmanagementComponent,
        data: {
          title: 'Asset Management'
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
        path: 'accountspayable',
        component: AccountspayableComponent,
        data: {
          title: 'Accounts Payable'
        }
      },
      {
        path: 'materialmanagement',
        component: MaterialmanagementComponent,
        data: {
          title: 'Material Management'
        }
      },
      {
        path: 'billingmanager',
        component: BillingmanagerComponent,
        data: {
          title: 'Billing Manager'
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
