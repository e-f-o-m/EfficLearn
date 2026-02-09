import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardGameComponent } from 'src/app/shared/components/card-game/card-game.component';
import { FirebaseService } from 'src/app/core/firebase/firebase.service';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterModule, CardGameComponent],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {
  isLogin = false;
  
  constructor(private readonly firebaseServices: FirebaseService){
    this.firebaseServices.auth$.subscribe(res=>{
      if(res.loading) return
      if(!res.user) return
      this.isLogin = true;
    })
  }
}
