import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as jsPDF from "jspdf";
import { Worklist } from './worklist';
import { WORKLISTS } from './mock-worklists';

@Component({
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.css']
})
export class WorklistComponent implements OnInit {

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





/*
import { Component } from '@angular/core';

@Component({
  templateUrl: 'worklist.component.html'
})
export class WorklistComponent {

  searchText; 
  works = [
    { status: 'a', id: 11, name: 'Mr. Nice', sex: 'male', age: 23, date: '2/09/2019', modality: 'Humanities', study: 'patient satisfaction', accession: 'abc'},
    { status: 'b', id: 12, name: 'Narco', sex: 'female', age: 23, date: '2/09/2019', modality: 'Linguistics', study: 'patient satisfaction', accession: 'cdb'},
    { status: 'c', id: 13, name: 'Bombasto', sex: 'male', age: 23, date: '2/09/2019', modality: 'Medicine', study: 'patient satisfaction', accession: 'bvc'},
    { status: 'd', id: 14, name: 'Celeritas', sex: 'male', age: 23, date: '2/09/2019', modality: 'Science and technology', study: 'patient satisfaction', accession: 'fds'},
    { status: 'e', id: 15, name: 'Magneta', sex: 'female', age: 23, date: '2/09/2019', modality: 'Pseudoscience', study: 'patient satisfaction', accession: 'ccd'},
    { status: 'f', id: 16, name: 'RubberMan', sex: 'female', age: 23, date: '2/09/2019', modality: 'Pseudoscience', study: 'patient satisfaction', accession: 'abc'},
    { status: 'j', id: 17, name: 'Dynama', sex: 'female', age: 23, date: '2/09/2019', modality: 'Medicine', study: 'patient satisfaction', accession: 'awc'},
    { status: 'bg', id: 18, name: 'Dr IQ', sex: 'male', age: 23, date: '2/09/2019', modality: 'Humanities', study: 'patient satisfaction', accession: 'wwa'},
    { status: 'cd', id: 19, name: 'Magma', sex: 'male', age: 23, date: '2/09/2019', modality: 'Linguistics', study: 'patient satisfaction', accession: 'bbc'},
    { status: 'xcs', id: 20, name: 'Tornado', sex: 'male', age: 23, date: '2/09/2019', modality: 'Medicine', study: 'patient', accession: 'ddv'}
  ];

}


*/
