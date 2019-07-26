import { Component, OnInit } from '@angular/core';
import * as jsPDF from "jspdf"
@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  weight: number;
  height: number;
  bmi: string;
  constructor() { }
  ngOnInit() {
    this.weight = 0;
    this.height = 0;
  }
  getBmi() {
    var bmi = (this.weight / ((this.height / 100) * (this.height / 100)));
    var res = null;
    if (isNaN(bmi) || bmi < 10) res = 'Underweight';
    else if (bmi > 40) res = 'Normal';
    this.bmi = bmi.toFixed(2);
    this.bmi;
  }
}
