

import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxScrollViewModule, DxTabPanelModule, DxTabsModule, DxTemplateModule, DxTooltipModule } from 'devextreme-angular';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './_helpers';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor, ErrorInterceptor, JwtInterceptor } from './_interceptors';
import { AngularResizeEventModule } from 'angular-resize-event';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { CorsiComponent } from './corsi/corsi.component';
import { InsegnaComponent } from './insegna/insegna.component';
import { NewCorsoComponent } from './newcorso/newcorso.component';
import { ChatService } from './_helpers/chat.service';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { chatsComponent } from './chats/chats.component';
import { SessionCallComponent } from './components/session-call/session-call.component';
import { SessionCallMeshComponent } from './components/session-call-mesh/session-call-mesh.component';
import { HomeCallComponent } from './components/home/home.component';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

registerLocaleData(localeIt);

@NgModule({
  declarations: [
    SpinnerComponent,
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    CorsiComponent,
    InsegnaComponent,
    PrivateChatComponent,
    chatsComponent,
    HomeCallComponent,
    SessionCallComponent,
    SessionCallMeshComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DxButtonModule,
    DxTooltipModule,
    DxTemplateModule,
    DxScrollViewModule,
    DxPopupModule,
    // Angular Material
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    DxTabsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, title: "Home - LearnUniVerse", pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: "Accedi - LearnUniVerse", data: { upperTitle: "Login" } },
      { path: 'signup', component: SignupComponent, title: "Registrati - LearnUniVerse", data: { upperTitle: "Signup" } },
      { path: 'corsi', component: CorsiComponent, title: "Corsi - LearnUniVerse", canActivate: [AuthGuard] },
      { path: 'insegna', component: InsegnaComponent, title: "Insegna su LearnUniVerse", canActivate: [AuthGuard] },
      { path: 'newcorso', component: NewCorsoComponent, title: "Crea Corso - LearnUniVerse", canActivate: [AuthGuard] },

      { path: 'chats', component: chatsComponent, title: "Private Chats - LearnUniVerse", canActivate: [AuthGuard] },
      { path: 'home-call', component: HomeCallComponent },
      { path: 'session-call/:room', component: SessionCallComponent },
      { path: 'session-call/mesh/:room', component: SessionCallMeshComponent },

      { path: '**', redirectTo: '' }
    ], { scrollPositionRestoration: undefined }),
    DxDataGridModule,
    AngularResizeEventModule,
    DxTabPanelModule,
    DxPopupModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      // registrationStrategy: 'registerWhenStable:30000'
      registrationStrategy: 'registerImmediately'
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "it-IT" },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


