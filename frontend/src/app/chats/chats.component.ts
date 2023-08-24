import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieModel, Chats, CorsiModel, CorsoDTOModel, MateriaDTOModel, Message, MessaggioModel, SyllabusModel, UserClaims } from '../anagrafiche-models';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonUtilities } from '../_helpers';
import { TokenService } from '../_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatService } from '../_helpers/chat.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrivateChatComponent } from '../private-chat/private-chat.component';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class chatsComponent implements OnInit , AfterViewInit {


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

  chats:Chats[] = [];
  currentChat!:Chats;

  @ViewChild('corsiScrollChats') private corsiScrollChat: ElementRef | undefined;

  ngAfterViewInit(): void {
    this.chatService.corsiScrollPrivateChat.next(() => this.scrollToBottom());
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.corsiScrollChat != null)
        this.corsiScrollChat.nativeElement.scrollTop = this.corsiScrollChat.nativeElement.scrollHeight;
    }, 0);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _http: HttpClient,
    public chatService: ChatService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) { }


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
      },
      error: error => {
        if (typeof (error.error) !== 'object') {
          this.apiErrorMessages.push(error.error);
        }
      }
    })

  }


  backToHome() {
    this.openChat = false;
    this.chatService.stopChatConnection();

  }

  sendMessage(){
    this.chatService.sendPrivateMessage(this.currentChat.from, this.content, 19999);
    this.content = '';
   }

  // sendMessage() {
  //   if (this.content.trim() !== "") {
  //     this.chatService.sendMessage(this.content, this.corso.id);
  //   }

  //   this.content = '';
  // }

  openPrivateChat(toUser: string) {

    this.toUser = toUser;

    this.popupVisible = true;
    //console.log("opening popup")

    //this.chatService.scrollToBottom();

  }


  Call(studentName:string){
    console.log("stdname: ", studentName);
    this.content = "CALL";
    this.sendMessage();

    //window.open("/session-call/" + studentName+"?room="+studentName, "_blank");
     this.router.navigate(['session-call/' + studentName],{ queryParams: { room:  studentName } });
    
  }



  ngOnInit(): void {


    if (this.tokenService.isUserLoggedIn()) {
      let token = localStorage.getItem('AuthToken');
      if (token != null) {
        this.userClaims = CommonUtilities.getDataObjectFromAuthToken(token) as UserClaims;
        this.chatService.myName = this.userClaims.nome + " "+ this.userClaims.cognome;

        console.log("DataObj: ", this.userClaims.nome)

        this.GetListOfChat(this.userClaims.nome+" "+this.userClaims.cognome).subscribe(res => {

          // this.messages = res;
          this.chats = res;
          
          console.log("private message", res);

        })

        // this.chatService.chatConenction.on("OpenPrivateChat", (newMessage: Message) => {
        //   this.chatService.privateMessages = [...this.chatService.privateMessages, newMessage];
        //   this.chatService.privateMessageInitiated = true;
        //   // const modalRef = this.modalService.open(PrivateChatComponent);
        //   // modalRef.componentInstance.toUser = newMessage.from;
        // })
        // this.chatService.chatConenction.on("NewPrivateMessage", (newMessage: Message) => {
        //   this.chatService.privateMessages = [...this.chatService.privateMessages, newMessage]
        // })
    
        // this.chatService.chatConenction.on("ClosePrivateChat", () => {
        //   this.chatService.privateMessageInitiated = false;
        //   this.chatService.privateMessages = [];
        //   // this.modalService.dismissAll();
    
        // });

      }

    }


    
  }


  chatChoosed(chat:Chats){
    this.submitForm("" + this.userClaims.nome + " " + this.userClaims.cognome);

    if(this.openChat){
      this.chatService.closePrivateChatMessage(this.currentChat.from)
    }
    console.log("chatt", chat);
    this.currentChat = chat;
    
    this.chatService.privateMessages = this.currentChat.messages;
    this.scrollToBottom();

    this.openChat= true;
  }


  GetMessaggiToMe(name: string): Observable<Message[]> {
    return this._http.get(environment.UrlApi + `/Messaggio/GetMessaggiToMe/` + name).pipe(
      map(res => {
        return res as Message[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }

  GetListOfChat(name: string): Observable<any[]> {
    return this._http.get(environment.UrlApi + `/Messaggio/GetListOfChat/` + name).pipe(
      map(res => {
        return res as any[];
      }), catchError(err => {
        return throwError(err);
      })
    );
  }
  

 










}
