import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message, User } from '../anagrafiche-models';

import { PrivateChatComponent } from '../private-chat/private-chat.component';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  myName: string = "";
  chatConenction!: HubConnection;
  onlineUsers: string[] = [];
  messages: Message[] = [];
  privateMessages: Message[] = [];
  privateMessageInitiated = false;

  @ViewChild('corsiScrollPrivateChat') private corsiScrollChat: ElementRef | undefined;


  public corsiScrollPrivateChat = new BehaviorSubject<any>(undefined);



  scrollToBottom() {
    if (this.corsiScrollPrivateChat.value != null) {
      this.corsiScrollPrivateChat.value();
    } else {
      console.log("BehaviorSubject corsiScrollPrivateChat is null");
    }
  }

  constructor(private http: HttpClient) { }

  registerUser(user: User) {
    return this.http.post(environment.UrlApi + '/chat/register-user', user, { responseType: 'text' })
  }

  async sendMessage(content: string, idCorso:number) {
    const message: Message = {
      from: this.myName,
      content,
      idCorso
    };
    const formData = {
        from: this.myName,
        idCorso,
        content

    };

    this.http.post<any>(environment.UrlApi + '/Messaggio/CreateMessaggio', formData).subscribe(
      (response: any) => {
        // Handle successful response from the server (if needed)
        console.log('CreateMessaggio successful:', response);
       
      },
      (error: any) => {
        // Handle error from the server (if needed)
        console.error('Error during CreateMessaggio', error);
      }
    );

    return this.chatConenction?.invoke("ReceiveMessage", message)
      .catch(error => console.log(error));
  }

  async sendPrivateMessage(to: string, content: string, idCorso:number) {
    const message: Message = {
      from: this.myName,
      to,
      content
    }


    const formData = {
      from: this.myName,
      idCorso,
      content,
      to

  };

  this.http.post<any>(environment.UrlApi + '/Messaggio/CreateMessaggio', formData).subscribe(
    (response: any) => {
      // Handle successful response from the server (if needed)
      console.log('CreateMessaggio successful:', response);
     
    },
    (error: any) => {
      // Handle error from the server (if needed)
      console.error('Error during CreateMessaggio', error);
    }
  );

    if (!this.privateMessageInitiated) {
      this.privateMessageInitiated = true;
      return this.chatConenction?.invoke("CreatePrivateChat", message).then(() => {
        this.privateMessages = [...this.privateMessages, message];
        this.scrollToBottom();
      })
        .catch(error => console.log(error));
    } else {
      return this.chatConenction?.invoke("ReceivePrivateMessage", message)
        .catch(error => console.log(error));
    }
  }

  async closePrivateChatMessage(otherUser: string) {
    return this.chatConenction?.invoke("RemovePrivateChat", this.myName, otherUser)
      .catch(error => console.log(error));
  }

  createChatConnection() :HubConnection{
    this.chatConenction = new HubConnectionBuilder()
      .withUrl(environment.BEUrl + '/chatHub').withAutomaticReconnect().build();

    this.chatConenction.start().catch(error => {
      console.log(error);
    });
    this.chatConenction.on("UserConnected", () => {
      console.log("The server has called here");
      this.addUserConnectionId();
    });

    this.chatConenction.on("OnlineUsers", (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];


    });

    // this.chatConenction.on("NewMessage", (newMessage: Message) => {
    //   this.messages = [...this.messages, newMessage]
    // })


    this.chatConenction.on("OpenPrivateChat", (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;
      this.scrollToBottom();
      // const modalRef = this.modalService.open(PrivateChatComponent);
      // modalRef.componentInstance.toUser = newMessage.from;
    })
    this.chatConenction.on("NewPrivateMessage", (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage]

      this.scrollToBottom();
    })

    this.chatConenction.on("ClosePrivateChat", () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];

      this.scrollToBottom();
      // this.modalService.dismissAll();

    });


    return this.chatConenction;
  }

  stopChatConnection() {
    this.chatConenction?.stop().catch(error => console.log(error))
  }

  async addUserConnectionId() {
    return this.chatConenction?.invoke("AddUserConnectionId", this.myName)
      .catch(error => console.log(error));
  }
}
