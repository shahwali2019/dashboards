import { Component, OnInit} from '@angular/core';

@Component({
  templateUrl: 'masterlist.component.html'
})
export class MasterlistComponent implements OnInit {

  constructor() { }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit() {
    this.dropdownList = [
      {
        item_id: 1, item_text: 'Consult Ophthalmologist for further investigation & proper treatment'},
      { item_id: 2, item_text: 'Follow up with Ophthalmology' },
      { item_id: 3, item_text: 'Wear sunglasses is advised' },
      { item_id: 4, item_text: 'Visual field testing is advised' },
      { item_id: 5, item_text: 'Yearly eye screening examination is recommended' },
      { item_id: 6, item_text: 'Others' }
    ];

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



}
