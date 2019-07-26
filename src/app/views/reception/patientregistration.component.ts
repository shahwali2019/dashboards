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

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
  showFormControls(form: any) {
    return form && form.controls[''] &&
      form.controls[''].value; // Dr. IQ
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



