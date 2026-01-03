import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListResourcesComponent } from 'src/app/shared/modals/list-resources/list-resources.component';
import { Group, Question2, QuestionSet } from 'src/app/core/models/QuestionSet';
import { LogicGameCards } from 'src/app/core/utils/LogicGameCards';
import { BtnGameComponent } from 'src/app/shared/components/btn-game/btn-game.component';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';
import { BrPipe } from 'src/app/shared/pipes/br.pipe';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/core/services/localstorange/localstorange.service';
import { CardsService } from './cards.service';
import { GroupsComponent } from 'src/app/shared/modals/groups/groups.component';
import { speak } from 'src/app/core/services/speacking/speacking';

@Component({
  selector: 'app-trivial',
  standalone: true,
  imports: [CommonModule, ListResourcesComponent, BtnGameComponent,
    BtnImgComponent, BrPipe, GroupsComponent
  ],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  @ViewChild("frame", { static: false }) frame!: ElementRef<HTMLDivElement>;
  @ViewChild("current", { static: false }) current!: ElementRef<HTMLDivElement>;
  @ViewChild("next", { static: false }) next!: ElementRef<HTMLDivElement>;
  toastData?: { type: 's' | 'i' | 'w', timeS: number, title?: string, message?: string, end: () => void }
  groupModal?: { question_vault_id: number, accept: (field: Group) => void, cancel: () => void }

  isStart = false
  isListResources = false
  isMenuOptions = false
  listsResources: QuestionSet[] = []
  questions: Question2[] = []
  nameNext = "next"
  nameCurrent = "current"
  lgc!: LogicGameCards
  likeText: any = {}
  startX = 0
  startY = 0
  moveX = 0
  moveY = 0
  posItem: number = 0
  posItemNext: number = 1
  timeS: number = 5
  stars:0|1|2 = 2
  isEntableToggle = true
  fontSizeCard = 1.5
  speack = false
  isFront = true
  a=false

  constructor(
    private readonly _cardsService: CardsService, 
    private readonly changeDetectorRef: ChangeDetectorRef, 
    private readonly router: Router, 
    private readonly _localstorageService: LocalstorageService) {
    this._localstorageService.gameSelected = 'games/cards'
    const question_vault_id = this._localstorageService.getQuestionVaultSelected()
    if (!question_vault_id) {
      this.router.navigate(['resource-manager'])
    }
  }

  async getData() {
    const question_vault_id = this._localstorageService.getQuestionVaultSelected()
    if (!question_vault_id) throw new Error('Error question_vault_id: ' + question_vault_id)
    await this._cardsService.setQuestionsToGroups(question_vault_id)
    this.lgc = new LogicGameCards(this._cardsService.groups!)
  }

  breakLine(arg0: string[]) {
    return arg0.join().replace(/\\n/g, '<br>');
  }

  openGroups(){
    this.groupModal = {
      question_vault_id: this._localstorageService.getQuestionVaultSelected()!,
      accept: async (group: Group) => {
        if (!group) return
        this.lgc.getData(group)

        this.startX = 0
        this.startY = 0
        this.moveX = 0
        this.moveY = 0
        this.posItem = 0
        this.posItemNext = 1
        this.stars = this.lgc.itemsSelect?.questions![this.posItem]!.difficulty!
        this.isEntableToggle = true
        this.speack = false
        this.isFront = true

        this.changeDetectorRef.detectChanges();
        this.likeText = this.current.nativeElement.children[0]
        this.initCard(this.current.nativeElement)

        this.toastData = { type: 's', timeS: 1.5, title: "Grupo seleccionado", message: group.name, end: () => { this.toastData = undefined } }
        this.groupModal = undefined
      }, cancel: () => {
        this.groupModal = undefined
      }
    }
  }

  async ngAfterViewInit() {
    await this.getData()
    this.changeDetectorRef.detectChanges();
    this.likeText = this.current?.nativeElement?.children?.[0]
    if(!this.likeText) return;
    this.initCard(this.current?.nativeElement)
  }

  decrease() {
    this.fontSizeCard = this.fontSizeCard - 0.2
  }
  increase() {
    this.fontSizeCard = this.fontSizeCard + 0.2
  }
  onInputLimitDay(event: any) {
    /* this.lgc.resource.limit = Number(event.value) */
  }
  replaceCard() {
    /* this.lgc.manualStateAndReplace(this.lgc.itemsSelect[this.posItem], STATES_CARD.completed) */
  }

  nextCycle() {
    this.lgc.changeCycle(this.lgc.itemsSelect?.cycle! + 1)//.then
    this.posItem = 0
    this.posItemNext = 1
  }

  routeSelectResourse() {
    //Ir a seleccionar otro recurso
    this.router.navigate(['resource-manager'])
  }

  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async speak() {
    if(!this.lgc.itemsSelect?.questions![this.posItem]?.entry_a) { return };
    await speak(this.lgc.itemsSelect!.questions![this.posItem]!.entry_a!, "es-ES")
  }
  async startPause() {
    this.isStart = !this.isStart
    while (this.isStart) {
      if (this.timeS < 0.5) {
        this.isStart = false; return
      }
      if (this.speack) {
        //pronunciar ingles
        /* await speak(this.lgc.itemsSelect![this.posItem].statement![0], "en-EN") */
      }
      //esperar tiempo seleccionado
      await this.sleep(this.timeS * 1000);
      if (!this.isStart) {
        return
      };

      //voltear tarjeta
      this.toggleCard(this.lgc.itemsSelect!.questions![this.posItem]!)
      if (this.speack) {
        //pronunciar en español
        /* await speak(this.lgc.itemsSelect![this.posItem].answer![0], "es-ES") */
      }
      //esperar
      await this.sleep(this.timeS * 1000);
      //voltear tarjeta
      this.toggleCard(this.lgc.itemsSelect!.questions![this.posItem])
      //voltear esperar
      if (!this.isStart) { return };

      await this.sleep(this.timeS * 1000);
      this.changeItem(1)
    }
  }

  onInputTimeS(e: any) {
    if (e.value) {
      this.timeS = Number(e.value)
    }
  }

  medium = () => {
    this.moveX = 0
    this.moveY = -100
    this.complete()
  }
  easy = () => {
    this.moveX = 100
    this.moveY = 0
    this.complete()
  }
  hard = () => {
    this.moveX = -100
    this.moveY = 0
    this.complete()
  }

  changeItem(newPos: number) {
    if ((this.posItem + newPos) < this.lgc.itemsSelect!.questions!.length && (this.posItem + newPos) >= 0) {
      this.posItem = (this.posItem + newPos)
      this.posItemNext = this.posItem + 1

      if (this.posItemNext == this.lgc.itemsSelect?.questions!.length!) {
        this.posItemNext = 0
      }
    } else {
      this.posItemNext = 1
      this.posItem = 0
      //TODO: logica finalización
      this.toastData = { type: 'i', timeS: 1, title: 'Nuevo ciclo', end: () => { this.toastData = undefined } }

      this.lgc.itemsSelect!.cycle!++
      this.lgc.itemsSelect!.create_at = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')
      this._cardsService.updateGroup({ ...this.lgc.itemsSelect! })
    }
    this.isFront = true
  }

  toggleCard(data: Question2) {
    if (this.isEntableToggle) {
      this.isFront = !this.isFront
    }
  }

  random() {
    const shuffledArray = [...this.lgc.itemsSelect!.questions!]; // Crear una copia del array original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Obtener un índice aleatorio
      // Intercambiar elementos
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    this.lgc.itemsSelect!.questions! = shuffledArray
    this.isMenuOptions = false
  }

  initCard = (card: any) => {
    card.addEventListener('pointerdown', this.onPointerDown)
  }

  setTransform = (x: number, y: number, deg: number, duration: number) => {
    this.current.nativeElement.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
    this.likeText.style.display = "flex"
    this.likeText.style.zIndex = "1000"
    this.likeText.style.opacity = Math.abs((x / innerWidth * 2.1) + (y / innerWidth * 1.2))

    if (x > 50 && y > -100 && y < 100) {
      this.likeText.className = `is-like like`
      this.stars = 2
    } else if (x < -50 && y > -100 && y < 100) {
      this.likeText.className = `is-like nope`
      this.stars = 0
    } else if (x > -80 && x < 80 && y < 0) {
      this.likeText.className = `is-like medium`
      this.stars = 1
    }

    if (duration) this.current.nativeElement.style.transition = `transform ${duration}ms`
  }

  onPointerDown = (event: PointerEvent) => {
    this.startX = event.clientX
    this.startY = event.clientY
    if (this.current) {
      this.current.nativeElement.addEventListener('pointermove', this.onPointerMove)
      this.current.nativeElement.addEventListener('pointerup', this.onPointerUp)
      this.current.nativeElement.addEventListener('pointerleave', this.onPointerUp)
    }
  }

  onPointerMove = (event: PointerEvent) => {
    this.isEntableToggle = false
    this.moveX = event.clientX - this.startX
    this.moveY = event.clientY - this.startY
    this.setTransform(this.moveX, this.moveY, this.moveX / innerWidth * 50, 0)
  }

  onPointerUp = () => {
    this.current.nativeElement.removeEventListener('pointermove', this.onPointerMove)
    this.current.nativeElement.removeEventListener('pointerup', this.onPointerUp)
    this.current.nativeElement.removeEventListener('pointerleave', this.onPointerUp)
    if (Math.abs(this.moveY) > this.frame.nativeElement.clientHeight / 2.2) {
      this.current.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
      this.complete()
    } else if (Math.abs(this.moveX) > this.frame.nativeElement.clientWidth / 2.1) {
      this.current.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
      this.complete()
    } else this.cancel()
  }

  complete = () => {
    let flyX = (Math.abs(this.moveX) / this.moveX) * innerWidth * 1.3
    let flyY = (this.moveY / this.moveX) * flyX
    if (this.moveX == 0) {
      flyX = 0
      flyY = (Math.abs(this.moveY) / this.moveY) * innerHeight * 1.12
    }

    this.setTransform(flyX, flyY, flyX / innerWidth * 50, 20)
    

    setTimeout(() => {
      this.setTransform(0, 0, 0, 0)
      this.initCard(this.current.nativeElement)
      setTimeout(() => {
        this.current.nativeElement.style.transition = ''


        this.lgc.itemsSelect!.questions![this.posItem]!.difficulty = this.stars
        this.lgc.setStars(this.lgc.itemsSelect!.questions![this.posItem]!)

        this.changeItem(1)
        this._cardsService.updateQuestion(this.lgc.itemsSelect!.questions![this.posItem]!)

        this.moveX = 0
        this.moveY = 0
        this.stars = 0
        this.isEntableToggle = true
        this.changeDetectorRef.detectChanges();
      })
    }, 200)
  }

  cancel = () => {
    this.setTransform(0, 0, 0, 100)
    setTimeout(() => {
      this.current.nativeElement.style.transition = '', 100
      this.moveX = 0
      this.moveY = 0
      this.isEntableToggle = true
    })
  }


}
