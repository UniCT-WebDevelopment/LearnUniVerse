import { Injectable } from '@angular/core';

export class Lezioni {

  IdCorso?: number;
  NumLezione!: Number;

  ArgomentoLezione!: string;



}



const lezioni: Lezioni[] = [ ];



@Injectable()
export class Service {
  getLezioni() {
    return lezioni;
  }


}