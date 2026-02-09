import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question2 } from 'src/app/core/models/QuestionSet';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'edit-item',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {
  @Input() show = false;
  @Input() data: Question2 = {};
  @Input() idResource: string = "";
  @Output() eventShow = new EventEmitter<boolean>(false);
  @Output() eventActionItemResource = new EventEmitter<{ action: string, object: Question2 }>();
  toggleShow() {
    this.show = !this.show;
    this.eventShow.emit(this.show)
  }


  cancel(event: any) {
    this.toggleShow()
    //TODO: delete data modal
  }

  ngAfterViewInit() {
    const formElement = document.getElementById('editItemResourceForm') as HTMLElement;
    if (formElement) {
      formElement.addEventListener('submit', (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        /* formData.forEach((value, key) => {
          value = value.toString()
          if ("question" == key) { this.data.statement = value.includes("|") ? value.split("|") : [value]; }
          if ("answer" == key) { this.data.answer = value.includes("|") ? value.split("|") : [value]; }
          if ("tags" == key) { this.data.tags = value.includes("|") ? value.split("|") : [value]; }
          if ("cycle" == key) { this.data.cycle = Number(value.toString()) }
          if ("rangeCopleted" == key) { this.data.rangeCopleted = Number(value.toString()) }
        });

        if (this.data.id == "" || this.data.id == undefined) {
          let date = new Date().getTime()
          let startDate = new Date(2023, 11, 26, 11, 36, 0, 0).getTime();
          let startId = (date - startDate);
          this.data.id = startId+""
          insertItemResourceLS(this.data, this.idResource).then(res => {
            if (!res) return
            this.toggleShow()
            this.eventActionItemResource.emit({ action: "insertItemResource", object: this.data })
          })

        } else {

          updateItemResourceLS(this.data, this.idResource).then(res => {
            if (!res) return
            this.toggleShow()
            this.eventActionItemResource.emit({ action: "updateItemResource", object: this.data })
          })
        } */

      });
    }
  }

  handleDeleteItemResource(event: any) {
    /* if (!this.data.id) return
    deleteItemResourceLS(this.data.id, this.idResource).then(res => {
      if (!res) throw new Error("Error delete item");
      this.eventActionItemResource.emit({ action: "deleteItemResource", object: this.data })
      alert("Delete list")
      this.toggleShow()
    }) */
  }
}
