import { Component} from '@angular/core';

@Component({
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent {

  constructor() { }

  category: Array<any> = [{
    catnumber: 1,
    nest: [
      {
        link: 1
      },
      {
        link: 2
      }

    ]
  },
  {
    catnumber: 2,
    nest: [
      {
        link: 1
      },
      {
        link: 2
      },


    ]
  },
  {
    catnumber: 3,
    nest: [
      {
        link: 1
      },
      {
        link: 2
      }

    ]
  },
  ];

  flag: boolean = false;

  catchEvent(event) {
    this.flag = true
    console.log(event)
  }

  hide(event) {
    this.flag = false;
  }
}
