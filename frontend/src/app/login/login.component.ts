import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService, TokenService } from '../_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

export class LoginComponent{

  passVisibility:boolean = false;
  form: any = {
    username: null,
    password: null
  };
  isLoginFailed = false;
  errorMessage = '';

  PasswordForm: FormGroup = new FormGroup({
    username:new FormControl(null,[Validators.required]),
    password:new FormControl(null,[Validators.required]),
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    public tokenService: TokenService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.redirectIfLoggedIn();
    this.route.queryParams.subscribe(() => this.redirectIfLoggedIn());
  }

  redirectIfLoggedIn() {
    if (this.tokenService.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  Accedi(): void {


    this.authService.login(this.PasswordForm.value.username, this.PasswordForm.value.password).subscribe(
      () => {
        this.isLoginFailed = false;
        this.router.navigate(["/"])
      },
      err => {
        this.errorMessage = err;
        this.isLoginFailed = true;
      }
    );

  }



}




