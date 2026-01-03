import {ChangeDetectorRef, Component, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataSnapshot, onValue, ref } from 'firebase/database';
import { User } from 'firebase/auth';
import { ChatServices } from './chat.service';
import { IMessage, IRoom} from './chat.types';
import { FirebaseService } from 'src/app/core/firebase/firebase.service';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { db } from 'src/app/core/firebase/firebase.config';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  inputValue = ""
  messages: IMessage[] = []
  chatServices: ChatServices
  roomName: string | null = null
  rooms: string[] = []
  room: IRoom | null = null
  isLoggedIn: boolean = false;
  user: User | null = null;
  userName: string | null = null;
  toastData?: { type: 's' | 'i' | 'w', timeS: number, title?: string, message: string, end: () => void }
  openMenu = false;
  //chat: IChatLearn

  constructor(private firebaseService: FirebaseService, private _changeDetectorRef: ChangeDetectorRef) {
    this.chatServices = new ChatServices();
  }

  ngAfterViewInit() {
    this.firebaseService.auth$.subscribe(state  => {
      if (state.loading) {
        return;
      }
      if (state.user) {
        console.log('Logged in');
        this.user = state.user;
        this.isLoggedIn = true
        this.getMyRooms();

        this.firebaseService.userDB$.subscribe(userDBFB => {
          this.userName = userDBFB.userName
        })

        this._changeDetectorRef.detectChanges();
      }
    });
  }

  protected signin(_user: string){
    this.firebaseService.openGoogle()
  }

  protected getMyRooms() {
    this.firebaseService.getSnapshot(`users/${this.user?.uid}/rooms`).then((snapshot: DataSnapshot | null) => {
      if(!snapshot) return
      this.rooms = []
      snapshot.forEach((room) => {
        this.rooms.push(room.val())
      })
      this._changeDetectorRef.detectChanges();
    })
  }

  protected handleInputChat(input: any | null) {
    this.inputValue = input.value
    this._changeDetectorRef.detectChanges();
  }

  protected async sendSMS() {
    if (!this.inputValue) {
      this.openMenu = true;
    }else{
      const message: IMessage = {
        createAt: Date.now(),
        user: this.user!!.uid,
        userName: this.userName ?? '',
        state: "sent",
        type: "normal",
        value: this.inputValue
      }
      this.messages.push(message);
      this.firebaseService.pushData(`chat_learn/rooms/${this.roomName}/chat/`, message)
      this.inputValue = ""
    }
  }

  protected async addRoom(){
    const inputAddRoom: HTMLInputElement | null = document.getElementById('add-room-input') as HTMLInputElement
    if(!inputAddRoom) return
    const valueRoom = inputAddRoom.value
    if(valueRoom == null) return

    const existRoomUser  = await this.firebaseService.getData(`users/${this.user?.uid}/rooms/${valueRoom}`)
    if(existRoomUser) {
      this.toastData = { type: 'w', timeS: 1.5, title: "La sala ya existe", message: "", end: () => {
        this.toastData = undefined;
        this._changeDetectorRef.detectChanges();
      }}
    }else {
      this.firebaseService.setData(`users/${this.user?.uid}/rooms/${valueRoom}`, valueRoom).then((data) => {
        this.toastData = { type: 's', timeS: 1.5, title: "¡Sala creada con exito!", message: "", end: () => {
          this.toastData = undefined;
          this._changeDetectorRef.detectChanges();
        }}
      })
    }
    this._changeDetectorRef.detectChanges();
  }

  createClass(){
    /*const valueSend = {
      createAt: Date.now(),
      type: "x",
      state: "start",
      values: [{
        lang: "es",
        text: valueRoom
      }]
    }*/
    //this.firebaseService.setData(`chat_learn/rooms/${this.room}/chat/${this.user?.displayName}_${Date.now()}/`, )
  }

  protected async openRoom(roomItem: string) {
    const existRoomUser  = await this.firebaseService.getData(`chat_learn/rooms/${roomItem}/`) as IRoom;
    if(!existRoomUser) {
      await this.firebaseService.setData(`chat_learn/rooms/${roomItem}/mode/`, 'normal')
      this.roomName = roomItem;
      this._changeDetectorRef.detectChanges();
      return
    }
    this.room = {
      chat: {},
      class: {},
      mode: null
    }
    this.roomName = roomItem;
    this.room.mode = existRoomUser.mode
    /*if(existRoomUser?.chat != null) {
      Object.entries(existRoomUser.chat).forEach(([userName, messageData], index) => {
        this.room!!.chat[index+""] = messageData;
      });
    }*/

    if(existRoomUser?.class != null) {
      Object.entries(existRoomUser.class).forEach(([userName, messageData], index) => {
        this.room!!.class[index+""] = messageData;
      });
    }

    this._changeDetectorRef.detectChanges();


    const refChat = ref(db, `chat_learn/rooms/${this.roomName}/chat/`)
    onValue(refChat, (snapshot) => {
      if (snapshot.exists()) {
        let data: IMessage[] = []
        let previous : IMessage | null = null
        let count = 0;
        snapshot.forEach((_event) => {
          count++;
          let item: IMessage = _event.val() as IMessage;
          if(item.user != previous?.user) {
            item.first = true;
            item.last = false;
            if(previous){
              previous.last = true;
            }
          }else{
            if(count == snapshot.size) {
              item.first = false;
              item.last = true;
            }
          }
          data.push(item);
          previous = item;
        });
        this.messages = data;
        this._changeDetectorRef.detectChanges();
      }
    })
  }
}
