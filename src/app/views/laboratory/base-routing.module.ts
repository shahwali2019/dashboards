import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaboratoryanalysisComponent } from './laboratoryanalysis.component';
import { LabstockinventoryComponent } from './labstockinventory.component';
import { MasterlistComponent } from './masterlist.component';
import { ReagentlibraryComponent } from './reagentlibrary.component'; 


const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'laboratoryanalysis'
      },
      {
        path: 'laboratoryanalysis',
        component: LaboratoryanalysisComponent,
        data: {
          title: 'Laboratory Analysis'
        }
      },
      {
        path: 'labstockinventory',
        component: LabstockinventoryComponent,
        data: {
          title: 'Lab Stock & Inventory'
        }
      },
      {
        path: 'masterlist',
        component: MasterlistComponent,
        data: {
          title: 'Master List'
        }
      },

      {
        path: 'reagentlibrary',
        component: ReagentlibraryComponent,
        data: {
          title: 'Reagent Library'
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
