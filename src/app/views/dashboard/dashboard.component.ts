import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import * as jsPDF from 'jspdf';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

@Component({
  templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.css']

})
export class DashboardComponent implements OnInit {
  @ViewChild('content') content: ElementRef;

  makePdf() {
    let doc = new jsPDF();
    doc.addHTML(this.content.nativeElement, function () {
      doc.save("obrz.pdf");
    });
  }
  constructor() { }



  ngOnInit(): void {

  }


}
