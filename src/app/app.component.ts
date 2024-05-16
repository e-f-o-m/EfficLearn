import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AutService } from '@core/services/auth/aut.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet ]
})
export class AppComponent {
  title = 'randomlearn';
  autService =  inject(AutService)  

  constructor(){
    this.autService.getVersion().then(res => {
      let verionAux = localStorage.getItem("version")
      if(verionAux !== res.version){
        localStorage.setItem("version", res.version)
        window.location.href = environment.url + "?v=" + res.version;
      }
    }).catch(res => {
      console.log('>> >>  2 ofline:', res);
    })
  }
  
}
