import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CorsiModel, UserClaims } from '../anagrafiche-models';
import { HttpClient } from '@angular/common/http';
import { CommonUtilities } from '../_helpers';
import { TokenService } from '../_services';

@Component({
  selector: 'app-insegna',
  templateUrl: './insegna.component.html',
  styleUrls: ['./insegna.component.css']
})
export class InsegnaComponent implements OnInit {
  userClaims: UserClaims | undefined;
  corsi: CorsiModel[] = [];
  userId:number= 0;

  constructor(private router: Router, public tokenService: TokenService,
    private _http: HttpClient) { }


  ngOnInit(): void {
    if (this.tokenService.isUserLoggedIn()) {
      let token = localStorage.getItem('AuthToken');
      if (token != null) {
        this.userClaims = CommonUtilities.getDataObjectFromAuthToken(token) as UserClaims;
        console.log("DataObj: ", this.userClaims.nome)
        this.userId = parseInt(this.userClaims.id);
      }

    }

    this.GetMyCourses().subscribe(res => {
      this.corsi = res;
    })

  }

  onCreaClick() {
    this.router.navigate(['/newcorso']);
  }
  
  onVisualizzaClick(corso: any) {
    console.log("Corso: ", corso);
    this.router.navigate(['/corsi'], { queryParams: { id: corso.id } })

  }
  GetMyCourses(): Observable<CorsiModel[]> {
    let that = this;
    return this._http.get(environment.UrlApi + `/Corso/GetCorsiOfTutor/` + that.userClaims?.id).pipe(
      map(res => {
        return res as CorsiModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

}
