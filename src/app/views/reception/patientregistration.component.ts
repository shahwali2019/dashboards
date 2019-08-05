import { Component } from '@angular/core';
import { User } from '../user';

@Component({
  templateUrl: './patientregistration.component.html',
  styleUrls: ['./patientregistration.component.css'],
      inputs: ['activeColor', 'baseColor', 'overlayColor']


})
export class PatientregistrationComponent {

  myDateValue: Date;

  ngOnInit() {
    this.myDateValue = new Date();
  }

  onDateChange(newDate: Date) {
    console.log(newDate);
  }

  powers = ['Select', 'Super Flexible',
    'Super Hot', 'Weather Changer'];

  model = new User(1, '', this.powers[0], '');

  submitted = false;

  onSubmit() { this.submitted = true; }

  //  we're done
  get diagnostic() { return JSON.stringify(this.model); }
  showFormControls(form: any) {
    return form && form.controls[''] &&
      form.controls[''].value; 
  }
/* Patient Registration */
  title = 'Patient Registration';
  public salutation: string;
  public fullname: string;
  public other: string;
  public active: string;
  public file: any;
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
  public rows: Array<{ salutation: string, fullname: string, other: string, active: string, file: any, passport: number, nirc: number, outpatient: number, birthdate: number, birthplace: string, gender: string, maritalstatus: string, religion: string, age: number, allergy: string, language: string }> = [];

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
    console.log("")
    this.dragging = true;
  }

  handleDragLeave() {
    console.log("")
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
    console.log("")
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
    console.log("")
    var reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }

  /*End Patient Registration*/

}



