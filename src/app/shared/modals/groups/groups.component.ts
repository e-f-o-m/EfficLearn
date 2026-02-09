import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Group } from 'src/app/core/models/QuestionSet';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  @Input() data?: { question_vault_id: number, accept: (field: Group) => void, cancel: () => void }

  groups: Group[] = [];
  search = ''

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly _indexeddbService: IndexeddbService) {
  }

  async ngOnInit() {
    this.getData()
  }

  async getData() {
    if (this.data) {
      const resGroups = await this._indexeddbService.getAllGroupsByVault(this.data?.question_vault_id)
      if (!resGroups) return
      this.groups = resGroups.data
    }
    this.groups.push({ name: 'Sin grupo', type: 'empty', questions: [] })
    this.changeDetectorRef.detectChanges()
  }

  serach(event: any) {
    this.search = event
  }

  cancel() {
    this.data?.cancel()
  }
  selectGroup(group: Group) {
    this.data?.accept(group)
  }

}
