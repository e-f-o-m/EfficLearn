import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBuilderComponent } from '@shared/modals/list-builder/list-builder.component';
import { IFullData } from '@core/models/IData';

@Component({
  selector: 'app-library-manager',
  standalone: true,
  imports: [CommonModule, ListBuilderComponent],
  templateUrl: './library-manager.component.html',
  styleUrls: ['./library-manager.component.scss']
})
export class LibraryManagerComponent {
  lists: IFullData[] = [];


  ngOnInit() {
    this.searchLocalStorange("listID")
  }
  ngAfterViewInit() {
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
    localStorage.setItem("listSelected", item.id)
    alert("List Selected")
  }
  
  delete(){
    let idList = localStorage.getItem("listSelected")
    localStorage.removeItem(idList!.toString())
    this.lists = this.lists.filter((elemento) => elemento.id !== idList);
    alert("Delete list")
  }
}
