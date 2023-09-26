import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IData, IFullData } from '@core/models/IData';

@Component({
  selector: 'app-list-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-builder.component.html',
  styleUrls: ['./list-builder.component.scss']
})
export class ListBuilderComponent {

  ngAfterViewInit(){
  }
  
  cancel(){
    
  }
  accept(){
    let dataList = document.querySelector(".data-list") as HTMLTextAreaElement;
    let nameList = document.querySelector(".name-list") as HTMLInputElement;
    let isNameInsideList = document.querySelector(".is-name-inside-list") as HTMLInputElement;


    let finalData: IFullData = {
      id: '',
      name: '',
      list: []
    }
    let arDataList = dataList.value.split("\n")
    if(isNameInsideList.checked){
      finalData.name = arDataList.shift()!
    }else{
      finalData.name = nameList.value
    }

    if(arDataList.length < 1){
      alert("Error")
      return
    }else{
      if(arDataList[0].split(";").length <=1){
        alert("Error")
        return
      }
    }
    

    arDataList.forEach(line => {
      let arLine = line.split(";")
      finalData.list.push({
        isQuestion: true,
        question: arLine[0],
        answer: arLine[1]
      })
    });


    let date = new Date().getTime()
    finalData.id = "listID"+date
    localStorage.setItem(finalData.id, JSON.stringify(finalData));

    alert("Creado")

  }
}
