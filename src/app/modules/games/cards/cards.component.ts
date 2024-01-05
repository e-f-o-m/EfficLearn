import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListResourcesComponent } from '@shared/modals/list-resources/list-resources.component';
import { IData, IFullData, STATES_CARD } from '@core/models/IData';
import { deleteSelectsResourceLS, getLastListsLS, getListLS, getNameListsLS, getSelectsResourceLS, insertResourceLS } from '@core/services/localstorange/LS.list';
import { speak } from '@core/services/speacking/speacking';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LogicGameCards } from '@core/utils/LogicGameCards';
import { BtnDifficultyComponent } from '@shared/components/btn-difficulty/btn-difficulty.component';
import { BtnImgComponent } from '@shared/components/btn-img/btn-img.component';
import { BrPipe } from '@shared/pipes/br.pipe';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, ListResourcesComponent, ButtonComponent, BtnDifficultyComponent,
    BtnImgComponent, BrPipe
  ],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  @ViewChild("frame", { static: false }) frame!: ElementRef<HTMLDivElement>;
  @ViewChild("current", { static: false }) current!: ElementRef<HTMLDivElement>;
  @ViewChild("next", { static: false }) next!: ElementRef<HTMLDivElement>;
  isStart = false
  isListResources = false
  isMenuOptions = false
  listsResources: IFullData[] = []
  nameNext = "next"
  nameCurrent = "current"
  startX = 0
  startY = 0
  moveX = 0
  moveY = 0

  lgc!: LogicGameCards
  posItem: number = 0
  posItemNext: number = 1
  timeS: number = 5
  likeText: any = {}
  stars = 0
  isEntableToggle = true
  fontSizeCard = 1.5
  speack = false

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
  breakLine(arg0: string[]) {
    return arg0.join().replace(/\\n/g, '<br>');
  }

  ngAfterViewInit() {
    this.listsResources = getNameListsLS()
    let list: IFullData = {}

    getSelectsResourceLS().then(res => {

      getListLS(res.id!).then(_resource => {

        res.list?.forEach(_itemSelect => {
          _resource.list?.forEach(_itemResource => {
            if (_itemResource.id == _itemSelect.id) {
              _itemResource = _itemSelect
              return
            }
          })
        });
        insertResourceLS(_resource)
        deleteSelectsResourceLS()
      })
    }).catch(res => {
      list = getLastListsLS()
    }).finally(() => {
      this.lgc = new LogicGameCards()
      this.lgc.getData(list).then(_=> {
        if (this.lgc.itemsSelect.length > 1) {
          this.changeDetectorRef.detectChanges();
          this.likeText = this.current.nativeElement.children[0]
          this.initCard(this.current.nativeElement)
        }
      })
      
    })
    this.changeDetectorRef.detectChanges();

  }

  decrease() {
    this.fontSizeCard = this.fontSizeCard - 0.2
  }
  increase() {
    this.fontSizeCard = this.fontSizeCard + 0.2
  }
  onInputLimitDay(event: any) {
    this.lgc.resource.limit = Number(event.value)
  }
  replaceCard() {
    this.lgc.manualStateAndReplace(this.lgc.itemsSelect[this.posItem], STATES_CARD.completed)
  }


  nextCycle() {
    this.lgc.changeCycle(this.lgc.resource.currentCycle! + 1)//.then
    this.posItem = 0
    this.posItemNext = 1
  }

  onSelectList(event: { action: string, id: string }) {
    this.isMenuOptions = false
    getListLS(event.id).then(list => {
      this.posItem = 0
      this.posItemNext = 1
      this.lgc = new LogicGameCards()
      this.lgc.getData(list)
    })
  }

  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async startPause() {
    this.isStart = !this.isStart
    while (this.isStart) {
      if (this.timeS < 0.5) { this.isStart = false; return };
      if (this.speack) {
        //pronunciar ingles
        await speak(this.lgc.itemsSelect![this.posItem].question![0], "en-EN")
        //esperar tiempo seleccionado
        await this.sleep(this.timeS * 1000);
        if (!this.isStart) { 
          return 
        };
        
        //voltear tarjeta
        this.toggleCard(this.lgc.itemsSelect![this.posItem])
        //pronunciar en español
        await speak(this.lgc.itemsSelect![this.posItem].answer![0], "es-ES")
        //esprar
        /* await this.sleep(this.timeS * 1000); */
        //voltear tarjeta
        this.toggleCard(this.lgc.itemsSelect![this.posItem])
        //voltear esperar
        if (!this.isStart) { return };
      }
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
    if ((this.posItem + newPos) < this.lgc.itemsSelect!.length && (this.posItem + newPos) >= 0) {
      this.posItem = (this.posItem + newPos)
      this.posItemNext = this.posItem + 1

      if (this.posItemNext == this.lgc.itemsSelect!.length) {
        this.posItemNext = 0
      }
    } else {
      this.posItemNext = 1
      this.posItem = 0
    }
  }

  toggleCard(data: IData) {

    if (this.isEntableToggle) {
      this.lgc.itemsSelect.forEach(res => {
        if (res.id === data.id) {
          res.isQuestion = !data.isQuestion
        }
      })
    }
  }

  random() {
    const shuffledArray = [...this.lgc.itemsSelect!]; // Crear una copia del array original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Obtener un índice aleatorio
      // Intercambiar elementos
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    this.lgc.itemsSelect = shuffledArray
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
      this.stars = 5
    } else if (x < -50 && y > -100 && y < 100) {
      this.likeText.className = `is-like nope`
      this.stars = 1
    } else if (x > -80 && x < 80 && y < 0) {
      this.likeText.className = `is-like medium`
      this.stars = 3
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

    this.setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth)

    setTimeout(() => {
      this.setTransform(0, 0, 0, 2000)
      this.initCard(this.current.nativeElement)
      setTimeout(() => {
        this.current.nativeElement.style.transition = '', 10

        //TODO: mover logica
        this.lgc.itemsSelect[this.posItem].rangeCopleted = this.stars
        this.lgc.setStars(this.lgc.itemsSelect[this.posItem])
        this.changeItem(1)
        //

        this.moveX = 0
        this.moveY = 0
        this.stars = 0
        this.isEntableToggle = true
      })
    }, 300)
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
