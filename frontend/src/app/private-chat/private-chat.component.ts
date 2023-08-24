import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';import { ChatService } from '../_helpers/chat.service';
import { RowTemplateData } from 'devextreme/ui/data_grid';
import { Router } from '@angular/router';


@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit, AfterViewInit ,  OnDestroy {
  @Input() toUser = '';
  @Input() idCorso = 0;
  content: string = '';
  constructor(public chatService: ChatService, private router: Router) { }


  @ViewChild('corsiScrollPrivateChat') private corsiScrollChat: ElementRef | undefined;

  scrollToBottom() {
    setTimeout(() => {
      if (this.corsiScrollChat != null)
        this.corsiScrollChat.nativeElement.scrollTop = this.corsiScrollChat.nativeElement.scrollHeight;
      else
        console.log("is null");
    }, 0);
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    console.log("DESTROY");
    this.chatService.closePrivateChatMessage(this.toUser)
  }
  ngAfterViewInit(): void {
    console.log("setting next");
    this.chatService.corsiScrollPrivateChat.next(() => this.scrollToBottom());
  }
  sendMessage() {
    this.chatService.sendPrivateMessage(this.toUser, this.content, this.idCorso);
    this.content = "";
  }

  openCall(){
    let studentName = this.chatService.myName;
    this.router.navigate(['session-call/' + studentName],{ queryParams: { room:  studentName } });

  }
}
