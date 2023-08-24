import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService, TokenService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';
import { AteneoModel, CorsiDiStudioModel } from '../anagrafiche-models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  styleUrls: ['./signup.component.css'],
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit, AfterViewInit {

  corsiDiStudi: any[] = [];
  atenei: any[] = [];

  currentStep: number = 1

  passVisibility: boolean = false;
  form: any = {
    username: null,
    password: null
  };
  isLoginFailed = false;
  errorMessage = '';

  Step2Form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),

    password: new FormControl(null, [Validators.required]),
    confermaPassword: new FormControl(null, [Validators.required]),





  })



  Step1Form: FormGroup = new FormGroup({
    dataDiNascita: new FormControl(null, [Validators.required]),
    annoImmatricolazione: new FormControl(null, [Validators.required]),
    ateneo: new FormControl(null, [Validators.required]),
    nome: new FormControl(null, [Validators.required]),
    cognome: new FormControl(null, [Validators.required]),
    corsoDiStudi: new FormControl(null, [Validators.required]),
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    public tokenService: TokenService,
    private route: ActivatedRoute,
    private _http: HttpClient
  ) { }



  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confermaPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.redirectIfLoggedIn();
    this.route.queryParams.subscribe(() => this.redirectIfLoggedIn());
    this.GetCorsi().subscribe(res => {
      this.corsiDiStudi = res;
      console.log("this.corsoDiStudi: ", this.corsiDiStudi);

    })

    this.GetAtenei().subscribe(res => {
      this.atenei = res;
    })
  }

  ngAfterViewInit(): void {

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

  GetAtenei(): Observable<AteneoModel[]> {
    return this._http.get(environment.UrlApi + `/Ateneo/AteneiList`).pipe(
      map(res => {
        return res as AteneoModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }


  AddUser(): Observable<AteneoModel[]> {
    return this._http.get(environment.UrlApi + `/Ateneo/AteneiList`).pipe(
      map(res => {
        return res as AteneoModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  redirectIfLoggedIn() {
    if (this.tokenService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }





  Register() {
    if (this.currentStep === 1 && this.Step1Form.valid) {
      this.currentStep = 2;
      return;
    }

    if (this.currentStep === 2 && this.Step2Form.valid) {
      const formData = {
        nome: this.Step1Form.get('nome')!.value,
        cognome: this.Step1Form.get('cognome')!.value,
        dataDiNascita: this.Step1Form.get('dataDiNascita')!.value,
        annoImmatricolazione: this.Step1Form.get('annoImmatricolazione')!.value,
        idAteneo: this.Step1Form.get('ateneo')!.value,
        idCorsoDiStudi: this.Step1Form.get('corsoDiStudi')!.value,
        email: this.Step2Form.get('email')!.value,
        passwordHash: this.Step2Form.get('password')!.value,
        confermaPassword: this.Step2Form.get('confermaPassword')!.value
      };

      this._http.post<any>(environment.UrlApi + '/Utente/CreateUtente', formData).subscribe(
        (response: any) => {
          // Handle successful response from the server (if needed)
          console.log('User registration successful:', response);
          this.tokenService.saveAuthToken(response.authtoken);
          this.router.navigate(["/"])
        },
        (error: any) => {
          // Handle error from the server (if needed)
          console.error('Error during user registration:', error);
        }
      );
    }
  }
}




