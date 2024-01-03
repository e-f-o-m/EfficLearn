import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IFullData } from '@core/models/IData';
import { LS_LISTS } from '@core/constants/constants';

@Component({
  selector: 'list-resources',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './list-resources.component.html',
  styleUrls: ['./list-resources.component.scss']
})
export class ListResourcesComponent {
  @Input() show = false;
  @Input() lists: IFullData[] = [];
  @Output() eventShow = new EventEmitter<boolean>(false);
  @Output() onSelectList = new EventEmitter<{action: string, id: string}>();
  
  toggleShow() { 
    this.show = !this.show; 
    this.eventShow.emit(this.show)
  }

  selectList(item: IFullData){
    if(!item.id) return
    localStorage.setItem(LS_LISTS.listSelectedId, item.id)
    this.onSelectList.emit({action: "selectItem", id: item.id})
    this.toggleShow()
  }
}
