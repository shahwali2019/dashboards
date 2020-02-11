import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'medicalcertificate.component.html'
})
export class MedicalcertificateComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  weight: number;
  height: number;
  bmi: string;
  ngOnInit() {
    this.weight = 0;
    this.height = 0;
    this.dropdownList = [{
      item_id: 1,
      item_text: 'Appropriate'
    }, {
      item_id: 2,
      item_text: 'Aggressive'
    }, {
      item_id: 3,
      item_text: 'Angry'
    }, {
      item_id: 4,
      item_text: 'Anxiety'
    }, {
      item_id: 5,
      item_text: 'Depressed'
    }, {
      item_id: 6,
      item_text: 'Apathy'
    }, {
      item_id: 7,
      item_text: 'Agitated'
    }, {
      item_id: 8,
      item_text: 'Nursing Notes'
    }];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  getBmi() {
    var bmi = (this.weight / ((this.height / 100) * (this.height / 100)));
    var res = null;
    if (isNaN(bmi) || bmi < 10) res = 'Underweight';
    else if (bmi > 40) res = 'Normal';
    this.bmi = bmi.toFixed(2);
    this.bmi;
  }
  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  collapsed(event: any): void {
  
  }
  expanded(event: any): void {
  }
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }
}
