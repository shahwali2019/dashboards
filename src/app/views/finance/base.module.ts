import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AccountsreceivableComponent } from './accountsreceivable.component';
import { LedgersComponent } from './ledgers.component';

import { FinancialdashboardComponent } from './financialdashboard.component';
import { InsurancemanagementComponent } from './insurancemanagement.component';
import { AssetmanagementComponent } from './assetmanagement.component';
import { UsersComponent } from './users.component';
import { RoleComponent } from './role.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MaterialmanagementComponent } from './materialmanagement.component';
import { AccountspayableComponent } from './accountspayable.component';
import { BillingmanagerComponent } from './billingmanager.component';
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
    AccountsreceivableComponent,
    LedgersComponent,
    FinancialdashboardComponent,
    InsurancemanagementComponent,
    AssetmanagementComponent,
    UsersComponent,
    RoleComponent,
    AccountspayableComponent,
    MaterialmanagementComponent,
    BillingmanagerComponent,
    StatusComponent
  ]
})
export class BaseModule { }
