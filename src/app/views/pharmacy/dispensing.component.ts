import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact.component';

import _ from 'lodash';

@Component({
  templateUrl: './dispensing.component.html'
})
export class DispensingComponent {

  contacts: Array<Contact>;
  constructor() {
    this.contacts = [];
  }

  addContact(name, phone) {
    let contact = new Contact(name, phone);
    this.contacts.push(contact);
  }

  removeContact(contact) {
    let index = this.contacts.indexOf(contact);
    this.contacts.splice(index, 1);
  }
  users = [
    {
      Prescription: 'abcdef', Purpose: 'CCDD', Dose: '199', Time: 29, Form: '11Nov2019', Special: ' Special Instructions'
    },
    { Prescription: 'abcdef', Purpose: 'ABC', Dose: '2929', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'CDA', Dose: '2892', Age: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'CCD', Dose: '1898', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
  ];
  public selectUsers(event: any, user: any) {
    user.flag = !user.flag;
  }

  user = [
    {
      Prescription: 'abcd', Purpose: 'CDDD', Dose: '298', Time: 29, Form: '11Nov2019', Special: ' Special Instructions'
    },
    { Prescription: 'abcd', Purpose: 'IIDC', Dose: '1289', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcd', Purpose: 'CCCN', Dose: '2897', Age: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcd', Purpose: 'DDCC', Dose: '2876', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
  ];
  public selectUser(event: any, user: any) {
    user.flag = !user.flag;
  }
  userz = [
    {
      Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions'
    },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Age: 29, Form: '11Nov2019', Special: ' Special Instructions' },
    { Prescription: 'abcdef', Purpose: 'Tester', Dose: 'a2z', Time: 29, Form: '11Nov2019', Special: ' Special Instructions' },
  ];
  public selectUserz(event: any, user: any) {
    user.flag = !user.flag;
  }
  public pname: string;
  public prescriber: string;
  public mdname: string;
  public doseamount: number;
  public days: number;
  public frequency: number;
  public refill: string;
  public direpatient: string;
  public pharmacy: string;
  public allergy: string;
  public date: number;
  public quantity: number;
  public diretopatient: string;
  public billable: number;

  public rows: Array<{ pname: string, prescriber: string, mdname: string, doseamount: number, days: number, frequency: number, refill: string, direpatient: string, pharmacy: string, allergy: string, date: number, quantity: number, diretopatient: string, billable: number }> = [];

  buttonAdd() {
    this.rows.push({ pname: this.pname, prescriber: this.prescriber, mdname: this.mdname, doseamount: this.doseamount, days: this.days, frequency: this.frequency, refill: this.refill, direpatient: this.direpatient, pharmacy: this.pharmacy, allergy: this.allergy, date: this.date, quantity: this.quantity, diretopatient: this.diretopatient, billable: this.billable });

    //if you want to clear input
    this.pname = null;
    this.prescriber = null;
    this.mdname = null;
    this.doseamount = null;
    this.days = null;
    this.frequency = null;
    this.refill = null;
    this.direpatient = null;
    this.pharmacy = null;
    this.allergy = null;
    this.date = null;
    this.quantity = null;
    this.diretopatient = null;
    this.billable = null;
  }



  // Radar
  public radarChartLabels: string[] = ['Patient Name', 'Prescriber', 'Dose Amount', 'Days', 'Frequency', ' Quantity Dispensed', 'Billable Amount'];

  public radarChartData: any = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Patient A' },
    { data: [68, 58, 70, 59, 36, 67, 70], label: 'Patient A' },
    { data: [45, 39, 40, 71, 66, 45, 60], label: 'Patient B' },
    { data: [48, 58, 60, 79, 36, 67, 40], label: 'Patient C' }
  ];
  public radarChartType = 'radar';
}
