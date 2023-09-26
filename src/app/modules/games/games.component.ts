import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFullData } from '@core/models/IData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  constructor(private router: Router) {}

  lists: IFullData[] = [];

  ngOnInit() {
    this.searchLocalStorange("listID")
  }

  searchLocalStorange(patron: string) {
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
      if (clave.includes(patron)) {
        let res = localStorage.getItem(clave)
        if(res != undefined && res != "undefined" && res != ""){
          let data = JSON.parse(res)
          this.lists.push( data )
        }
      }
    }
  }

  selectList(item: IFullData){
    console.log('>> >>  :', item);
    //localStorage.setItem("listSelected", item.id)
    //this.router.navigate(['/multiplecards']);
  }
}
