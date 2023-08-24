import { NgModule, Component, enableProdMode, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxButtonModule, DxFileUploaderComponent, DxFileUploaderModule } from 'devextreme-angular';
import { Service, Lezioni } from './app.service';
import { FormsModule } from '@angular/forms';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AteneoModel, CorsiDiStudioModel, CorsiModel, MateriaModel, SyllabusModel, UserClaims } from '../anagrafiche-models';
import { HttpClient } from '@angular/common/http';
import { CommonUtilities } from '../_helpers';
import { TokenService } from '../_services/token.service';
import { UploadErrorEvent, UploadedEvent, ValueChangedEvent } from 'devextreme/ui/file_uploader';
import { ColumnEditCellTemplateData } from 'devextreme/ui/tree_list';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-newcorso',
  templateUrl: 'newcorso.component.html',
  styleUrls: ['newcorso.component.css'],
  providers: [Service],
})
export class NewCorsoComponent implements OnInit {
  corsoSelected: string = "";
  materiaSelected: string = "";
  inputVisible: boolean = false;
  dataSource: Lezioni[];
  isCorsoSelected: boolean = false;
  isMateriaSelected: boolean = false;
  corsiDiStudi: any[] = [];
  materie: any[] = [];
  userClaims: UserClaims | undefined;
  apiUrl: string = environment.UrlApi;

  currentId: number | undefined = undefined;

  isEditing: boolean = false;

  @ViewChild('fileUploader') fileUploaderRef!: DxFileUploaderComponent;


  events: Array<string> = [];

  constructor(service: Service, private _http: HttpClient, public tokenService: TokenService,
    private router: Router, private route: ActivatedRoute
  ) {
    this.dataSource = service.getLezioni();
  }
  ngOnInit(): void {
    this.GetCorsi().subscribe(res => {
      this.corsiDiStudi = res;
    })

    this.route.queryParams.subscribe((params) => {
      this.currentId = +params.id;
      if (isNaN(this.currentId))
        this.currentId = 0;
      console.log("this.currentId", this.currentId);
      this.isEditing = this.currentId != 0;
      if (this.isEditing) {
        this._http.get(environment.UrlApi + '/Syllabus/GetSyllabusFromCorso/'+params.id).subscribe((data: any) => {
          this.dataSource = data.map((x: any) => ({
            IdCorso: x.idCorso,
            NumLezione: x.numLezione,
            ArgomentoLezione: x.argomentoLezione
          }));
          console.log("this.dataSource", this.dataSource, data);
        });

        this._http.get(environment.UrlApi + `/Corso/CorsoDetail/` + params.id).pipe(
          map(res => {
            return res as CorsiModel;
          }),
          catchError(err => {
            return throwError(err);
          })
        ).subscribe((data) => {
          console.log("subscribe", data);
          this.corsoSelected = ""+data.materia?.idCorsoDiStudi;
          this.GetMaterie().subscribe((res) => {
            this.isCorsoSelected = this.isMateriaSelected = true;
            console.log("getting materie")
            this.materie = res;
            this.materiaSelected = ""+data.idMateria
          });
        });
      }
    });

    if (this.tokenService.isUserLoggedIn()) {
      let token = localStorage.getItem('AuthToken');
      if (token != null) {
        this.userClaims = CommonUtilities.getDataObjectFromAuthToken(token) as UserClaims;
        console.log("DataObj: ", this.userClaims.nome)
      }

    }

  }

  onValueChanged(e: ValueChangedEvent): void {
    console.log("value changed");
  }

  onUploaded(e: UploadedEvent): void {
    console.log("uploaded");
   }

  onUploadError(e: UploadErrorEvent): void {
    const xhttp = e.request;
    if (xhttp.status === 400) {
      e.message = e.error.responseText;
    }
    if (xhttp.readyState === 4 && xhttp.status === 0) {
      e.message = 'Connection refused';
    }
   }

  logEvent(eventName: string) {
    this.events.unshift(eventName);
  }

  clearEvents() {
    this.events = [];
  }

  onCorsoSelectChange() {
    this.isCorsoSelected = true;
    this.GetMaterie().subscribe(res => {
      this.materie = res;
    })
  }


  onMateriaSelectChange() {
    if (this.materiaSelected === 'customOption') {
      this.inputVisible = true;
      setTimeout(() => {
        const inputElement = document.getElementById('form12');
        if (inputElement) {
          inputElement.removeAttribute('disabled');
          inputElement.focus();
        }
      });
    } else {
      this.inputVisible = false;
      this.isMateriaSelected = true;
    }
  }

  GetCorsi(): Observable<CorsiDiStudioModel[]> {
    return this._http.get(environment.UrlApi + `/CorsoDiStudi/CorsiDiStudiList`).pipe(
      map(res => {
        return res as CorsiDiStudioModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  GetMaterie(): Observable<MateriaModel[]> {
    return this._http.get(environment.UrlApi + `/Materia/GetMaterieOfCorso/` + this.corsoSelected).pipe(
      map(res => {
        return res as MateriaModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  hideInput() {
    console.log("materiaSelected: ", this.materiaSelected);

    console.log("corsoSelected: ", this.corsoSelected);


    const formData = {
      nome: this.materiaSelected,
      idCorsoDiStudi: this.corsoSelected
    };

    this._http.post<any>(environment.UrlApi + '/Materia/CreateMateria', formData).subscribe(
      (response: any) => {
        console.log('CreateMateria successful:', response);

        let newMateria = {
          id: response.id,
          nome: this.materiaSelected,
          idCorsoDiStudi: parseInt(this.corsoSelected)

        } as MateriaModel;

        this.materie.push(newMateria);
        this.materiaSelected = response.id;
        this.inputVisible = false;
        this.isMateriaSelected = true;

      },
      (error: any) => {
        // Handle error from the server (if needed)
        console.error('Error during CreateMateria:', error);
      }
    );





    // 
    // if (!this.inputVisible) {
    //   this.materiaSelected = '1';
    // }

  }


  ModificaCorso() {
    const formData = {
      id: this.currentId,
      idUtente: this.userClaims?.id,
      idMateria: this.materiaSelected
    };

    this._http.post<any>(environment.UrlApi + '/Corso/UpdateCorso', formData, { params: { id: ""+this.currentId } }).subscribe(
      (response: any) => {
        console.log('CreateCorso successful:', response);
        //associo Syllabus a corso
        const formData = {};
        this.dataSource.forEach(x => x.IdCorso = this.currentId);
        this._http.post<any>(environment.UrlApi + '/Syllabus/UpdateSyllabusList', this.dataSource, { params: { idCorso: "" + this.currentId } }).subscribe(
          (response: any) => {
            console.log('CreateSyllabus successful:', response);

            this.router.navigate(['/corsi'], { queryParams: { id: this.currentId } });
          },
          (error: any) => {
            // Handle error from the server (if needed)
            console.error('Error during CreateSyllabus:', error);
          }
        );

      },
      (error: any) => {
        // Handle error from the server (if needed)
        console.error('Error during CreateMateria:', error);
      }
    );
  }

  CreaCorso() {

    console.log("CreaCorso: ", this.dataSource);
    //creo il corso:
    const formData = {
      idUtente: this.userClaims?.id,
      idMateria: this.materiaSelected
    };

    this._http.post<any>(environment.UrlApi + '/Corso/CreateCorso', formData).subscribe(
      (response: any) => {
        console.log('CreateCorso successful:', response);
        //associo Syllabus a corso
        let corsoId = response.id;
        const formData = {};
        this.dataSource.map(x => x.IdCorso = response.id);
        this._http.post<any>(environment.UrlApi + '/Syllabus/CreateSyllabusList', this.dataSource).subscribe(
          (response: any) => {
            console.log('CreateSyllabus successful:', response);

            this.router.navigate(['/corsi'], { queryParams: { id: corsoId } });
          },
          (error: any) => {
            // Handle error from the server (if needed)
            console.error('Error during CreateSyllabus:', error);
          }
        );

      },
      (error: any) => {
        // Handle error from the server (if needed)
        console.error('Error during CreateMateria:', error);
      }
    );

  }


  onFileChange(event: Event, rowData: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to the .NET API for saving
      this._http.post<any>(environment.UrlApi + '/Syllabus/UploadFile', formData).subscribe(
        response => {
          // Handle the response from the .NET API if needed
          console.log('File uploaded successfully');
          // You might want to update the grid with the uploaded file details
        },
        error => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }
}


@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxFileUploaderModule,
    DxButtonModule,
    FormsModule
  ],
  declarations: [NewCorsoComponent],
  bootstrap: [NewCorsoComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);


