import { Component, OnInit } from '@angular/core';
import { EditableTableService } from 'ng-editable-table/editable-table/editable-table.service';

@Component({
  selector: 'app',
  templateUrl: './healtscreeningreoprt.component.html'
})
export class HealtscreeningreoprtComponent {

  users = [
    {
      Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Age: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
  ];
  public selectUsers(event: any, user: any) {
    user.flag = !user.flag;
  }

  user = [
    {
      Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions'
    },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Age: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
  ];
  public selectUser(event: any, user: any) {
    user.flag = !user.flag;
  }

}

