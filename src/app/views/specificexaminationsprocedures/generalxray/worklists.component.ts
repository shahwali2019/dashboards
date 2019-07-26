import { Component, OnInit } from '@angular/core';
import { Worklist } from './worklist';
import { WORKLISTS } from './mock-worklists';
/* import * as jsPDF from "jspdf"; */
@Component({
  templateUrl: './worklists.component.html',
  styleUrls: ['./worklists.component.css']
})
export class WorklistsComponent implements OnInit {

  worklists = WORKLISTS;
  imageSource: boolean = false;

  selectedWorklist: Worklist;
  constructor() { }

  ngOnInit() {
  }

  onSelect(worklist: Worklist): void {
    this.selectedWorklist = worklist;
  }
  /*
  downloadPdf() {
   let doc = new jsPDF();
    doc.text("king", 20, 20);
      doc.save('table.pdf');
  }
  let jsPDF = require('jspdf');

*/

}


