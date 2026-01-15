import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import { Question2 } from 'src/app/core/models/QuestionSet';
import {IndexeddbService} from '../../../core/services/indexeddb/indexeddb.service';
import {LocalstorageService} from '../../../core/services/localstorange/localstorange.service';
import {Router} from '@angular/router';
import {BrPipe} from '../../../shared/pipes/br.pipe';
import { CardsService } from '../cards/cards.service';

@Component({
  selector: 'app-multiplecards',
  standalone: true,
  imports: [CommonModule, BrPipe],
  templateUrl: './multiplecards.component.html',
  styleUrls: ['./multiplecards.component.scss']
})
export class MultiplecardsComponent {
  data: Question2[] = []

  constructor(private readonly _indexeddbService: IndexeddbService,
              private readonly _localstorageService: LocalstorageService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly router: Router,
              private readonly _cardsService: CardsService 
            ) {
  }

  async ngOnInit() {
    const question_vault_id = this._localstorageService.getQuestionVaultSelected()
    if (!question_vault_id) {
      this.router.navigate(['resource-manager']);
      return
    }
    const auxData = await this._indexeddbService.getAllQuestionByVault(question_vault_id)
    if (!auxData) {
      return
    }
    this.data = auxData.data.sort((a, b) => (b.difficulty || 0) - (a.difficulty || 0))
    this.changeDetectorRef.detectChanges()
  }


  toggleCard(data: Question2, index?: number): void {
    if (data.state == 'due' || data.state == 'completed') {
      data.state = 'review'
    } else {
      data.state = 'completed'
    }
    this.changeDetectorRef.detectChanges();
  }

  getMaxText(item: Question2): string {
    const textA = item.entry_a || '';
    const textB = item.entry_b || '';
    return textA.length > textB.length ? textA : textB;
  }

  /* =================================== */

  private dragStartX = 0;
  private isDragging = false;
  private currentIndex = -1;

  startDrag(event: any, index: number): void {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    this.dragStartX = clientX;
    this.currentIndex = index;
    this.isDragging = false;
  }

  dragCount = 0
  checkDrag(event: any): void {
    this.dragCount++
    if (this.currentIndex === -1) return;
    
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    if (Math.abs(clientX - this.dragStartX) > 15) {
      this.isDragging = true;
    }
  }

  endDrag(event: any, item: any, index: number): void {
    if (this.currentIndex !== index) return;
    
    const clientX = event.changedTouches ? 
    event.changedTouches[0].clientX : 
    event.clientX;
    const deltaX = clientX - this.dragStartX;
    
    if (this.isDragging && Math.abs(deltaX) > 59 && this.dragCount > 37) {
      event.preventDefault();
      deltaX > 0 ? this.swipeRight(item) : this.swipeLeft(item);
    }
    
    this.dragCount=0
    this.currentIndex = -1;
    this.isDragging = false;
  }

  cancelDrag(): void {
    this.currentIndex = -1;
    this.isDragging = false;
  }

  onCardClick(item: any, index: number): void {
    // Solo si no estábamos arrastrando
    if (!this.isDragging && this.currentIndex === -1) {
      this.toggleCard(item, index);
    }
  }

  swipeLeft(item: Question2): void {
    item.difficulty = 2; // marcar como dificil
    item.animation = 'left-swiped';
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      item.animation = undefined;
      this._cardsService.updateQuestion(item);
      setTimeout(() => {
        item.animation = 'left-swiped';
      }, 20);
    }, 300);
  }
  
  swipeRight(item: Question2): void {
    item.animation = 'right-swiped';
    item.difficulty = 0; // marcar como facil
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      item.animation = undefined;
      this._cardsService.updateQuestion(item);
      setTimeout(() => {
        item.animation = 'right-swiped';
      }, 20);
    }, 300);
  }


  getDificultyClass(difficulty: number | undefined): string {
    switch (difficulty) {
      case 0:
        return 'difficulty-easy';
      case 1:
        return 'difficulty-medium';
      case 2:
        return 'difficulty-hard';
      default:
        return '';
    }
  }
}
