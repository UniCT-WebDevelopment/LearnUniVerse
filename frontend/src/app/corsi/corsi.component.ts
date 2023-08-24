import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieModel, CorsiModel, CorsoDTOModel, MateriaDTOModel, Message, MessaggioModel, SyllabusModel, UserClaims } from '../anagrafiche-models';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonUtilities } from '../_helpers';
import { TokenService } from '../_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatService } from '../_helpers/chat.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrivateChatComponent } from '../private-chat/private-chat.component';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { SignalrService } from '../_services/signalr.service';

@Component({
  selector: 'app-corsi',
  templateUrl: './corsi.component.html',
  styleUrls: ['./corsi.component.css']
})
export class CorsiComponent implements OnInit {

  @ViewChild('corsiScrollChat') private corsiScrollChat: ElementRef | undefined;

  categorie: CategorieModel[] = [];
  materie: MateriaDTOModel[] = [];
  tutors: CorsoDTOModel[] = [];


  userForm: FormGroup = new FormGroup({});
  submitted = false;
  content: string = '';
  popupVisible = false;


  corso!: CorsiModel;
  contenuti!: SyllabusModel[];
  actualCorsoId = 0;
  categoriaSelezionata: any;
  materiaSelezionata: any;
  tutorSelezionato: any;
  apiErrorMessages: string[] = [];
  openChat: boolean = false;
  toUser!: string;
  iAmTheTutor: boolean = false;
  userClaims!: UserClaims;
  messages: Message[] = [];
  private chatConenction?: HubConnection;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _http: HttpClient,
    public chatService: ChatService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private signaling: SignalrService
  ) { }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.corsiScrollChat != null)
        this.corsiScrollChat.nativeElement.scrollTop = this.corsiScrollChat.nativeElement.scrollHeight;
    }, 0);
  }

  initializeForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

  submitForm(name: string) {
    this.submitted = true;
    this.apiErrorMessages = [];
    const formData = {
      name: name
    }

    this.chatService.registerUser(formData).subscribe({
      next: () => {
        console.log("opne chat");
        this.chatService.myName = name
        this.openChat = true;


        //get old messages
        this.GetMessaggiCorso(this.corso.id).subscribe(res => {


          this.messages = res;
          this.scrollToBottom();


          this.submitted = false;
          var chatConnection = this.chatService.createChatConnection();

          chatConnection.on("NewMessage", (newMessage: Message) => {
            console.log("newMessage", newMessage);
            this.messages = [...this.messages, newMessage]
            this.scrollToBottom();
          })
        })


      },
      error: error => {
        if (typeof (error.error) !== 'object') {
          this.apiErrorMessages.push(error.error);
        }
      }
    })

  }


  onModificaCorsoClick() {
    this.router.navigate(['/newcorso'], { queryParams: { id: this.corso.id } })
  }

  backToHome() {
    this.openChat = false;
    this.chatService.stopChatConnection();

  }

  sendMessage() {
    if (this.content.trim() !== "") {
      this.chatService.sendMessage(this.content, this.corso.id);
    }

    this.content = '';
  }

  openPrivateChat(toUser: string) {
    // const modalRef = this.modalService.open(PrivateChatComponent);
    // modalRef.componentInstance.toUser = toUser;
    this.toUser = toUser;

    this.popupVisible = true;
    this.chatService.scrollToBottom();

  }

  openPrivateChats(){
    this.router.navigate(['/chats']);
  }

  ngOnInit(): void {

    this.signaling.connect('/auth', false).then(() => {
      if (this.signaling.isConnected()) {
        this.signaling.invoke('Authorize').then((token: string) => {
          if (token) {
            sessionStorage.setItem('token', token);
          }
        });
      }
    });


    this.initializeForm();

    if (this.tokenService.isUserLoggedIn()) {
      let token = localStorage.getItem('AuthToken');
      if (token != null) {
        this.userClaims = CommonUtilities.getDataObjectFromAuthToken(token) as UserClaims;
        console.log("DataObj: ", this.userClaims.nome)

      }

    }


    this.GetCategorie().subscribe(res => {
      this.categorie = res;


    })

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id) {
        // TODO RICHIESTA
        this.GetCorsoDetail(params.id).subscribe(res => {
          this.corso = res;
          this.submitForm("" + this.userClaims.nome + " " + this.userClaims.cognome);


          if (this.corso.utente?.id == parseInt(this.userClaims.id)) {
            this.iAmTheTutor = true;
          }

          this.GetSyllabusDetail(this.corso.id).subscribe(res => {
            this.contenuti = res;

          })


        })




      }
    });
  }


  //CHAT SERVICE







  downloadFile(filename: string | undefined, idcorso: number) {
    this.download(filename + ".mp4", idcorso).subscribe(
      (response: ArrayBuffer) => {
        // Trigger file download by creating a blob from the response and creating an anchor element
        const blob = new Blob([response], { type: 'video/mp4' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename + '.mp4'; // Set the desired file name here
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        // Handle error if any
        console.error('File download failed:', error);
      }
    );
  }
  download(filename: string | undefined, idcorso: number): Observable<any> {
    // Replace "http://your-dotnet-backend/api/download" with the actual API endpoint URL
    return this._http.get(environment.UrlApi + `/Corso/getVideo/` + filename + "/" + idcorso, { responseType: 'arraybuffer' });
  }
  closeAll() {
    this.categoriaSelezionata = this.materiaSelezionata = this.tutorSelezionato = null;
  }

  onCategoriaSelect(categoria: any) {
    this.categoriaSelezionata = categoria;

    this.GetMaterie(this.categoriaSelezionata.id).subscribe(res => {
      this.materie = res;


    })

    // TODO RICHIESTA
  }
  onMateriaSelect(materia: any) {
    this.materiaSelezionata = materia;
    this.GetTutor(this.materiaSelezionata.id).subscribe(res => {
      this.tutors = res;


    })
    // TODO RICHIESTA
  }
  onTutorSelect(tutor: any) {
    this.tutorSelezionato = tutor;
    // TODO RICHIESTA
    this.router.navigate(['/corsi'], { queryParams: { id: tutor.id } });
  }
  GetCorsoDetail(id: number): Observable<CorsiModel> {
    return this._http.get(environment.UrlApi + `/Corso/CorsoDetail/` + id).pipe(
      map(res => {
        return res as CorsiModel;
      }), catchError(err => {
        return throwError(err);
      })
    );
  }


  GetCategorie(): Observable<CategorieModel[]> {
    return this._http.get(environment.UrlApi + `/Corso/GetCategorieDisponibili`).pipe(
      map(res => {
        return res as CategorieModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }


  GetMaterie(id: number): Observable<MateriaDTOModel[]> {
    return this._http.get(environment.UrlApi + `/Corso/GetCorsiOfCategoria/` + id).pipe(
      map(res => {
        return res as MateriaDTOModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  GetTutor(id: number): Observable<CorsoDTOModel[]> {
    return this._http.get(environment.UrlApi + `/Corso/GetTutorOfMateria/` + id).pipe(
      map(res => {
        return res as CorsoDTOModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  GetSyllabusDetail(id: number): Observable<SyllabusModel[]> {
    return this._http.get(environment.UrlApi + `/Syllabus/GetSyllabusFromCorso/` + id).pipe(
      map(res => {
        return res as SyllabusModel[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }


  GetMessaggiCorso(id: number): Observable<Message[]> {
    return this._http.get(environment.UrlApi + `/Messaggio/GetMessaggiCorso/` + id).pipe(
      map(res => {
        return res as Message[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }






}
