import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as jsPDF from "jspdf";
import { Worklist } from './worklist';
import { WORKLISTS } from './mock-worklists';

@Component({
  templateUrl: './worklist1.component.html',
  styleUrls: ['./worklist1.component.css']
})
export class Worklist1Component implements OnInit {

  today: number = Date.now();


  @ViewChild('content') content: ElementRef;

  makePdf() {
    let doc = new jsPDF();
    doc.addHTML(this.content.nativeElement, function () {
      doc.save("report.pdf");
    });
  }

  worklists = WORKLISTS;
  imageSource: boolean = false;

  selectedWorklist: Worklist;

  ngOnInit() {
  }

  onSelect(worklist: Worklist): void {
    this.selectedWorklist = worklist;
  }

  public selectedName: any;

  public highlightRow(worklist) {
    this.selectedName = worklist.id;
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


