import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatServices } from './chat.service';
import { Database, ref, get, child, update, push, DatabaseReference, onValue } from '@angular/fire/database';

type Message = {
  /* role?: string; */
  user?: string;
  text?: string;
  /* time?: string; */
  /* group?: string; */
  state?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  idSesion = "sesion1"
  user = ""
  inputValue = ""
  messages: Message[] = []
  chatServices: ChatServices

  constructor(private db: Database, private changeDetectorRef: ChangeDetectorRef) {
    this.chatServices = new ChatServices(db);
  }

  ngAfterViewInit() {
    let _user = localStorage.getItem("user_chat")
    if(!_user) return
    this.user = _user
    this.getData()
    this.changeDetectorRef.detectChanges();

  }
  
  setUser(_user: string){
    this.user = _user;
    localStorage.setItem("user_chat", _user)
    this.getData()
  }

  getData() {
    let mRef = ref(this.db, `games/chat/sessions/${this.idSesion}/`);
    onValue(mRef, (snapshot) => {
      if (snapshot.exists()) {
        let data: any = []
        snapshot.forEach((_event) => {
          let item: any = _event.val() as { text: string, user: string };
          data.push(item);
        });
        this.messages = data;
      }
    })
  }

  ngOnInit(): void {
    /* setInterval(() => {
      this.loadMessages(this.tempmessages[this.count]);
      this.count++
    }, 2000); */
  }

  loadMessages(message: any, user: string): void {
    if (!message) return
    this.messages.push({ text: message, user: user });
  }

  handleInputChat(input: any | null) {
    if (!input.value) return
    this.inputValue = input.value
  }
  async sendSMS() {
    if (!this.inputValue) return
    this.loadMessages(this.inputValue, this.user)
    this.chatServices.setMessage(this.idSesion, { text: this.inputValue, user: this.user })
    this.inputValue = ""
  }

}
