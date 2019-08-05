
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',

   templateUrl: 'generatequeuno.component.html',
  styleUrls: ['generatequeuno.component.css']
})
export class GeneratequeunoComponent {


  /* 
  title = 'Patient Registration';

  ngOnInit() { }

  public url: string;
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
  
  public rows: Array<{ url: string, pname: string, date: string, md: string, time: number, activity: string, duration: number, location: string, staff: string, status: string, comment: string }> = [];

  buttonAdd() {
    this.rows.push({ url: this.url, pname: this.pname, date: this.date, md: this.md, time: this.time, activity: this.activity, duration: this.duration, location: this.location, staff: this.staff, status: this.status, comment: this.comment   });

    //if you want to clear input
    this.url = null;
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


  urls = [];
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  */

  title = 'Patient Registration';

  ngOnInit() { }

  public salutation: string;
  public fullname: string;
  public other: string;
  public active: string;
  public file: string;
  public passport: number;
  public nirc: number;
  public outpatient: number;
  public birthdate: number;
  public birthplace: string;
  public gender: string;
  public maritalstatus: string;
  public religion: string;
  public age: number;
  public allergy: string;
  public language: string;


  public rows: Array<{ salutation: string, fullname: string, other: string, active: string, file: string, passport: number, nirc: number, outpatient: number, birthdate: number, birthplace: string, gender: string, maritalstatus: string, religion: string, age: number, allergy: string, language: string}> = [];

  buttonAdd() {
    this.rows.push({ salutation: this.salutation, fullname: this.fullname, other: this.other, active: this.active, file: this.file, passport: this.passport, nirc: this.nirc, outpatient: this.outpatient, birthdate: this.birthdate, birthplace: this.birthplace, gender: this.gender, maritalstatus: this.maritalstatus, religion: this.religion, age: this.age, allergy: this.allergy, language: this.language });

    //if you want to clear input
    this.salutation = null;
    this.fullname = null;
    this.other = null;
    this.active = null;
    this.file = null;
    this.passport = null;
    this.nirc = null;
    this.outpatient = null;
    this.birthdate = null;
    this.gender = null;
    this.maritalstatus = null;
    this.religion = null;
    this.age = null;
    this.allergy = null;
    this.language = null;
  }


  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: string = '';

  handleDragEnter() {
    console.log("handleDragEnter")
    this.dragging = true;
  }

  handleDragLeave() {
    console.log("handleDragLeave")
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    console.log("input change")
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    console.log("_handleReaderLoaded")
    var reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }
}
