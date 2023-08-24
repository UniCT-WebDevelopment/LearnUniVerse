
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  formatDecimal(n: number): string {
    return n?.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1'").replace('.', ',');
  }
  formatDateTime(data:string | undefined,time:boolean): string {
    if(data == null){
      return ""
    }
    var temp = data.split('T')
    if(time){
      var tempDate = temp[0].split("-")
      temp[1]=temp[1].replace("Z","")
      var tempTime = temp[1].split(":")
      return tempDate[2]+"/"+tempDate[1]+"/"+tempDate[0]+", "+tempTime[0]+":"+tempTime[1]
    }
    else{
      var tempDate = temp[0].split("-")
      return tempDate[2]+"/"+tempDate[1]+"/"+tempDate[0]
    }
  }
}
