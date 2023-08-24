import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { custom } from 'devextreme/ui/dialog';
import { CorsiModel } from '../anagrafiche-models';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // corsi = [
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  //   { id: 1, nome: "Ingegneria del software", autore: "Andrea Valenti", votoAutore: 4.3, universita: "Università di Catania" },
  // ];

  corsi:CorsiModel[] = [];


  constructor(
    private router: Router,
    private _http: HttpClient
  ) { }
  
  ngOnInit(): void {
    this.GetCorsi().subscribe(res => {
      this.corsi = res;
    })
  }

  GetCorsi(): Observable<CorsiModel[]> {
    return this._http.get(environment.UrlApi + `/Corso/CorsiList`).pipe(
      map(res => {
        return res as CorsiModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  // GetCorsi(): Observable<CorsiModel[]> {
  //   return this._http.get(this.auth.getBaseUrl() + `api/Anagrafiche/AssettiApi/GetAssetti`, { headers: headers }).pipe(
  //     map(res => {
  //       return res['data'] as AssettiModel[];
  //     }), catchError(err => {
  //       return throwError(err);
  //     })
  //   );
  // }

  onViewClick(corso: any) {
    this.router.navigate(['/corsi'], { queryParams: { id: corso.id } })
  }

}
