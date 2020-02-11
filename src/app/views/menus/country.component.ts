import { Component, OnInit } from '@angular/core';
import { EditableTableService } from 'ng-editable-table/editable-table/editable-table.service';

@Component({
  selector: 'app',
  templateUrl: './country.component.html',
})
export class CountryComponent implements OnInit {

  tableHeaders = ['Name', 'Country', 'Status'];

  tableRowsWithId = [
    [1, 'Loi', 'Singapoor', true],
    [2, 'Shahwali', 'Afghanistan', true],
    [3, 'Rohan', 'India', true],
    [4, 'Jacky', 'Malaysia', true],
    [5, 'King', 'USA', true]
  ];
  dataType = ['string', 'string', 'boolean'];

  constructor(private service: EditableTableService) {
  }

  ngOnInit() {
    this.service.createTableWithIds(this.tableHeaders, this.tableRowsWithId, this.dataType);
  }
 
  
}
