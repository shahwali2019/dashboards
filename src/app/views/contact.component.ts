export class Contact {

  id: number;
  fname: string;
  flag: string;
  area: number;
  population: number;

  name: string;
  phone: string;
  descr: string;

  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
    this.descr = this.name + ' ' + this.phone;
  }
}
