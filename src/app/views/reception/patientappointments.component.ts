import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { Worklist } from './worklist';
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


  title = 'app';

  public pname: string;
  public md: string;
  public date: number;
  public rows: Array < { pname: string, md: string, date: number }> = [];

  buttonClicked() {
    this.rows.push({ pname: this.pname, md: this.md, date: this.date  });

    //if you want to clear input
    this.pname = null;
    this.md = null;
    this.date = null;
  }


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

