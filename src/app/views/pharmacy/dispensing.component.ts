import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact.component';
import { formatDate } from '@angular/common';
import _ from 'lodash';

@Component({
  templateUrl: './dispensing.component.html'
})
export class DispensingComponent {
  today = new Date();
  jstoday = '';
  contacts: Array<Contact>;
  constructor() {
    this.contacts = [];
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
  }
  
  
  
  
  
  
  
  
  
  


}






