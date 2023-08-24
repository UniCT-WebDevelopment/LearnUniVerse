import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService, TokenService } from '../_services';
import { confirm, custom } from 'devextreme/ui/dialog';
import { filter } from 'rxjs/operators';
import { AnimationConfig } from 'devextreme/animation/fx';
import { CommonUtilities } from '../_helpers';
import { UserClaims } from '../anagrafiche-models';

@HostListener('window:beforeinstallprompt', ['$event'])
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  nome:string = "";
  isProfilePopupVisible: boolean = false;
  profilePopupAnimation = {
    show: {
      type: 'pop',
      duration: 300,
      from: {
        scale: 0.55
      }
    } as AnimationConfig,
    hide: {
      type: 'pop',
      duration: 300,
      to: {
        opacity: 0,
        scale: 0.55
      },
      from: {
        opacity: 1,
        scale: 1
      }
    } as AnimationConfig
  };

  constructor(
    public authService: AuthService,
    public tokenService: TokenService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 768 && this.isProfilePopupVisible) {
      this.router.navigate(["/mobile-settings"], { queryParams: { 'openProfileModal': true } });
    }
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.isProfilePopupVisible = !!params['openProfileModal'];
      if (this.isProfilePopupVisible)
        this.profilePopupAnimation.show.duration = 0;
    });

    if (this.tokenService.isUserLoggedIn()) {
      let token = localStorage.getItem('AuthToken');
      if (token != null) {
         var userClaims: UserClaims = CommonUtilities.getDataObjectFromAuthToken(token) as UserClaims;
         this.nome = userClaims.nome;
        console.log("DataObj: ", userClaims.nome)
      }

    }
  }

  ChiudiProfilo() {
    this.router.navigate([], { queryParams: { 'openProfileModal': null }, queryParamsHandling: 'merge' });
  }

  public get windowWidth() {
    return window.innerWidth;
  }

  ApriProfilo() {
    this.profilePopupAnimation.show.duration = 300;
    setTimeout(() => {
      this.router.navigate([], { queryParams: { 'openProfileModal': true }, queryParamsHandling: 'merge' });
    }, 0);
  }



  logoutConfirmDialog() {
    let myDialog = custom({
      title: "Logout",
      messageHtml: "Sei sicuro di voler effettuare il logout?",
      buttons: [
        {
          text: "Si",
          onClick: function () { return 1; }
        },
        {
          text: "No",
          onClick: function () { return 2; }
        }
      ]
    });
    myDialog.show().done((result: any) => {
      if (result == 1) {
        this.authService.logout();
      }
    });
  }

  // -- PWA --

  public promptEvent: any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    e.preventDefault();
    this.promptEvent = e;
  }

  public installPWA() {
    this.promptEvent.prompt();
  }

  public shouldInstall(): boolean {
    return !this.isRunningStandalone() && this.promptEvent;
  }

  public isRunningStandalone(): boolean {
    return (window.matchMedia('(display-mode: standalone)').matches);
  }

}
function getDataaObjectFromAuthToken(token: string | null) {
  throw new Error('Function not implemented.');
}

