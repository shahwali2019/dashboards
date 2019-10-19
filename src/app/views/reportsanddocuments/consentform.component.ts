import { Component, OnInit} from '@angular/core';
@Component({
  templateUrl: 'consentform.component.html'
})
export class ConsentformComponent implements OnInit {



  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: '  Abdomen 1 View' },
      { item_id: 2, item_text: '  Abdomen 2 View' },
      {
        item_id: 3, item_text: '  Abdomen Flat / Upright'},
      { item_id: 4, item_text: 'Anxiety' },
      { item_id: 5, item_text: 'Depressed' },
      { item_id: 6, item_text: 'Apathy' },
      { item_id: 7, item_text: 'Agitated' },
      { item_id: 8, item_text: 'Nursing Notes' }
    ];
    this.dropdownList = [
      { item_id: 1, item_text: 'Upper Abdomen (Liver, Pancreas, Gallbladder)' },
      { item_id: 2, item_text: 'Lower Abdomen' },
      {item_id: 3, item_text: 'Retroperitoneal / Aorta Complete(Aorta, Kidneys, Inferior Vena Cava)'},
      { item_id: 4, item_text: 'Aorta Only(screening for AAA)' },
      { item_id: 5, item_text: 'Renal(Bladder) - Full Bladder' },
      { item_id: 6, item_text: 'Renal(Kidney)' },
      { item_id: 7, item_text: 'Pelvic / Transvaginal - Full Bladder' },
      { item_id: 8, item_text: 'Pelvic Complete - Full Bladder' },
      { item_id: 9, item_text: 'Pelvic / Transvaginal / FLO - Full Bladder' },
      { item_id: 10, item_text: 'Transvaginal Only' }
    ];
    this.dropdownList = [
      { item_id: 1, item_text: 'Medication Name' },
      { item_id: 2, item_text: 'Dose Amount' },
      { item_id: 3, item_text: 'Days' },
      { item_id: 4, item_text: 'Frequency' },
      { item_id: 5, item_text: ' Refill' },
      { item_id: 6, item_text: ' Direction to Patient' },
      { item_id: 7, item_text: 'Note to Pharmacy' }
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
