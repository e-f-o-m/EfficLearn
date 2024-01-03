import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, IFullData } from '@core/models/IData';
import { LS_LISTS } from '@core/constants/constants';

@Component({
  selector: 'list-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-builder.component.html',
  styleUrls: ['./list-builder.component.scss']
})
export class ListBuilderComponent {
  @Input() show = false;
  @Output() eventShow = new EventEmitter<boolean>(false);

  ngAfterViewInit() {
  }

  cancel() {
    this.toggleShow()
    //TODO: delete data modal
  }
  accept() {
    let dataList = document.querySelector(".data-list") as HTMLTextAreaElement;
    let nameList = document.querySelector(".name-list") as HTMLInputElement;

    let finalData: IFullData = {
      id: '',
      name: '',
      list: []
    }
    let arDataList = dataList.value.split("\n")
    finalData.name = nameList.value

    if (arDataList.length < 1) {
      alert("Error")
      return
    } else {
      if (arDataList[0].split(";").length <= 1) {
        alert("Error")
        return
      }
    }

    let date = new Date().getTime()
    let startDate = new Date(2023, 11, 26, 11, 36, 0, 0).getTime();
    let startId = (date - startDate);


    arDataList.forEach((line, i) => {
      if (line.trim().length > 2) {

        let arLine = line.split(";")
        finalData.list!.push({
          isQuestion: true,
          question: arLine,
          answer: arLine,
          id: startId + "" + i,
          rangeCopleted: 0,
          observation: "",
          type: 0,
          state: "active",
        })
      }
    });

    finalData.description = ""
    finalData.quantity = finalData.list?.length
    finalData.completed = 0
    finalData.id = LS_LISTS.listResourceLanguageID + startId
    localStorage.setItem(finalData.id, JSON.stringify(finalData));

    //TODO: toast
    this.toggleShow()
  }

  toggleShow() {
    this.show = !this.show;
    this.eventShow.emit(this.show)
  }

}
