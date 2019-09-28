import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { Worklist } from './worklist';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { WORKLISTS } from './mock-worklists';

@Component({

  selector: '',
  templateUrl: './patientappointments.component.html',
  styleUrls: ['./patientappointments.component.css']
})
export class PatientappointmentsComponent implements OnInit {

  

  myDateValue: Date;
  onDateChange(newDate: Date) {
    console.log(newDate);
  }
  worklists = WORKLISTS;
  imageSource: boolean = false;

  selectedWorklist: Worklist;
  constructor() { }

  isValid: boolean = true;
  age: number = 12;
  changeValue(valid: boolean) {
    this.isValid = valid;
  }

  public lname: string;
  public fname: string;

  Submit(data) {

    this.lname = data.lname;
    this.fname = data.fname;
    
  }
  title = 'New Appointment';

  public pname: string;
  public md: string;
  public date: string;
  public time: number;
  public activity: string;
  public duration: number;
  public location: string;
  public staff: string;
  public status: string;
  public comment: string;

  public rows: Array<{ pname: string, date: string, md: string, time: number, activity: string, duration: number, location: string, staff: string, status: string, comment: string }> = [];

  buttonAdd() {
    this.rows.push({ pname: this.pname, date: this.date, md: this.md, time: this.time, activity: this.activity, duration: this.duration, location: this.location, staff: this.staff, status: this.status, comment: this.comment });

    //if you want to clear input
    this.pname = null;
    this.md = null;
    this.date = null;
    this.time = null;
    this.activity = null;
    this.duration = null;
    this.location = null;
    this.staff = null;
    this.status = null;
    this.comment = null;
  }


  public bookTitle: string;
  public bookAuthor: string;
  public bookNoOfPages: number;


  ngOnInit() {
    this.myDateValue = new Date();
  }



  onSelect(worklist: Worklist): void {
    this.selectedWorklist = worklist;
  }

  public currentDate: Date = new Date(2019, 10, 30);
  public newViewMode: View = 'Month';
  public eventData: EventSettingsModel = {
    dataSource: [{
      Id: 1,
      Subject: 'Meeting with the Staff',
      StartTime: new Date(2019, 10, 30, 9, 0),
      EndTime: new Date(2019, 10, 30, 11, 0)
    },
    {
      Id: 2,
      Subject: 'Appointment with the patience',
      StartTime: new Date(2019, 10, 30, 15, 0),
      EndTime: new Date(2019, 10, 30, 17, 0)
    },
    {
      Id: 3,
      Subject: 'appointment with board',
      StartTime: new Date(2019, 10, 30, 9, 30),
      EndTime: new Date(2019, 10, 30, 11, 0)
    },
    {
      Id: 4,
      Subject: 'Meeting with president',
      StartTime: new Date(2019, 7, 30, 9, 30),
      EndTime: new Date(2019, 7, 30, 11, 0)
    }
    ]
  }



}

