import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group, Question2, STATES_QUESTION } from 'src/app/core/models/QuestionSet';
import { BtnGameComponent } from 'src/app/shared/components/btn-game/btn-game.component';
import { BtnImgComponent } from 'src/app/shared/components/btn-img/btn-img.component';
import { BrPipe } from 'src/app/shared/pipes/br.pipe';
import { Router, RouterLink } from '@angular/router';
import { LocalstorageService } from 'src/app/core/services/localstorange/localstorange.service';
import { CardsService, EModes } from './cards.service';
import { GroupsComponent } from 'src/app/shared/modals/groups/groups.component';
import { speak } from 'src/app/core/services/speacking/speacking';
import { nowFormatYMDHMS } from 'src/app/shared/date-time.utils';
import { IQuestionForm, QuestionFormComponent } from 'src/app/shared/modals/question-form/question-form.component';
import { IndexeddbService } from 'src/app/core/services/indexeddb/indexeddb.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { IAlert } from 'src/app/shared/modals/alert/alert.component';
import { CardsModeComponent } from './cards-mode/cards-mode.component';

@Component({
  selector: 'app-trivial',
  standalone: true,
  imports: [CommonModule, BtnGameComponent, CardsModeComponent, BtnImgComponent, QuestionFormComponent, BrPipe, GroupsComponent, RouterLink],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  @ViewChild("frame", { static: false }) frame!: ElementRef<HTMLDivElement>;
  @ViewChild("current", { static: false }) current!: ElementRef<HTMLDivElement>;
  @ViewChild("next", { static: false }) next!: ElementRef<HTMLDivElement>;
  toastData?: { type: 's' | 'i' | 'w', timeS: number, title?: string, message?: string, end: () => void }
  groupModal?: { question_vault_id: number, accept: (field: Group) => void, cancel: () => void }
  modeModal?: IAlert
  questionForm?: IQuestionForm

  isStart = false
  isListResources = false
  isMenuOptions = false
  groupSelected: Group | null = null
  mode: string | null = null;

  likeText: any = {}
  startX = 0
  startY = 0
  moveX = 0
  moveY = 0
  posItem: number = 0
  posItemNext: number = 1
  timeS: number = 5
  stars: 0 | 1 | 2 = 2
  isEntableToggle = true
  fontSizeCard = 1.5
  speack = false
  isFront = true
  a = false
  isDragging = false;
  question_vault_id: number | null = null;

  constructor(
    private readonly toastService: ToastService,
    private readonly _indexeddbService: IndexeddbService,
    private readonly _cardsService: CardsService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly _localstorageService: LocalstorageService) {
    this._localstorageService.gameSelected = 'games/cards'
    this.question_vault_id = this._localstorageService.getQuestionVaultSelected()
    if (!this.question_vault_id) {
      this.router.navigate(['resource-manager'])
    }
  }

  async ngAfterViewInit() {
    await this.getData()
    this.startGame();
  }

  ngOnDestroy() {
    this.isStart = false;
    this.isListResources = false;
    this.isMenuOptions = false;
    this.speack = false;
  }

  //Start component, change mode
  async getData() {
    if (!this.question_vault_id) throw new Error('Error question_vault_id: ' + this.question_vault_id)
    await this._cardsService.setQuestionsToGroups(this.question_vault_id);
    this.groupSelected = this._cardsService.getCurrentGroup()
    this.mode = this._cardsService.mode;
    this.changeDetectorRef.detectChanges();
  }

  //Change group
  startGame() {
    this.posItem = 0
    this.startX = 0
    this.startY = 0
    this.moveX = 0
    this.moveY = 0
    this.posItem = 0
    this.posItemNext = 1
    this.isEntableToggle = true
    this.isFront = true
    this.isStart = false

    if (this.groupSelected?.questions?.[this.posItem]) {
      this.stars = this.groupSelected.questions[this.posItem].difficulty || 0
      this.likeText = this.current.nativeElement.children[0]
      this.initCard(this.current.nativeElement)
      this.likeText = this.current?.nativeElement?.children?.[0]
      if (this.likeText) {
        this.initCard(this.current?.nativeElement)
      }
    } else {
      this.stars = 0
    }
    this.changeDetectorRef.detectChanges();
  }

  openGroups(): void {
    this.groupModal = {
      question_vault_id: this._localstorageService.getQuestionVaultSelected()!,
      accept: (_group: Group) => {
        if (!_group) return
        this._cardsService.setPosGroup(_group.group_id);
        this.groupSelected = this._cardsService.getCurrentGroup();
        this.startGame();

        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Grupo seleccionado", message: _group.name });
        this.groupModal = undefined;
      }, cancel: () => {
        this.groupModal = undefined
      }
    }
  }

  decrease(): void {
    this.fontSizeCard = this.fontSizeCard - 0.2
  }
  increase(): void {
    this.fontSizeCard = this.fontSizeCard + 0.2
  }

  openMode(): void {
    this.modeModal = {
      title: '',
      message: this._cardsService.mode + '',
      accept: (data: EModes) => {
        if (!data) return
        this._cardsService.changeMode(data);
        this.mode = data;
        this.groupSelected = this._cardsService.getCurrentGroup();
        this.startGame();
        this.changeItem(0)
        this.isMenuOptions = false;
        this.modeModal = undefined
      }, cancel: () => {
        this.modeModal = undefined
      }
    }
  }

  routeSelectResourse(): void {
    //Ir a seleccionar otro recurso
    this.router.navigate(['resource-manager'])
  }

  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async toggleSpeack() {
    this.speack = !this.speack
    if (!this.groupSelected?.questions) { return };
    if (this.speack) {
      //pronunciar ingles
      await speak(this.groupSelected.questions[this.posItem].entry_a!, "en-US")
    }
  }

  async speak() {
    if (!this.groupSelected?.questions?.[this.posItem]) { return };
    if (!this.groupSelected.questions[this.posItem]?.entry_a) { return };
    await speak(this.groupSelected.questions[this.posItem].entry_a!, "en-US")
  }
  async startPause() {
    if (!this.groupSelected?.questions) { return };

    this.isStart = !this.isStart;
    while (this.isStart) {
      if (this.timeS < 0.5) {
        this.isStart = false; return
      }
      if (this.speack) {
        //pronunciar ingles
        await speak(this.groupSelected.questions[this.posItem].entry_a!, "en-US")
      }


      let accelerateTime = (100 * (2 - (this.groupSelected.questions[this.posItem].difficulty || 0)))
      //esperar tiempo seleccionado

      await this.sleep(this.timeS * (1000 - accelerateTime));
      if (!this.isStart) {
        return
      };

      //voltear tarjeta
      this.isEntableToggle = true;
      this.reviewed = true;
      this.toggleCard()
      this.changeDetectorRef.detectChanges();
      if (this.speack) {
        //pronunciar en español
        await speak(this.groupSelected.questions[this.posItem].entry_b!, "es-ES")
      }
      //esperar
      await this.sleep(this.timeS * (800 - accelerateTime));
      //voltear tarjeta
      this.toggleCard()
      this.changeDetectorRef.detectChanges();
      //voltear esperar
      if (!this.isStart) { return };

      await this.sleep(this.timeS * 180);
      this.isDragging = true;

      this.setTransform(50, -this.frame.nativeElement.clientHeight * 1.2, 30, 280);
      await this.sleep(180);
      this.changeItem(1)
      this.setTransform(0, 0, 0, 180);

      this.changeDetectorRef.detectChanges();
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

  reviewed = false
  countGroupsMode = 0
  countQuestionsMode = 0
  changeItem(newPos: number) {

    if (!this.groupSelected?.questions) { return };
    this.reviewed = false;

    //Mismo grupo
    if ((this.posItem + newPos) < this.groupSelected.questions.length && (this.posItem + newPos) >= 0) {
      this.posItem = (this.posItem + newPos);
      this.posItemNext = this.posItem + 1;

      if (this.posItemNext == this.groupSelected.questions.length) {
        this.posItemNext = 0;
      }
    } else {
      //Finaliza gropo
      this.posItemNext = 1;
      this.posItem = 0;
      if (this.groupSelected?.cycle) {
        this.groupSelected['cycle'] = 0;
      }
      if (this.mode == EModes.thisGroup) {
        this.toastService.setToast({ type: 'i', timeS: 1, title: 'Nuevo ciclo' });
        this.groupSelected.cycle!++;
        this.groupSelected.create_at = nowFormatYMDHMS();
        this._cardsService.updateGroup({ ...this.groupSelected });
      }
    }

    this.isFront = true;

    //Si es todos los groups, siguiente grupo, si está vacío 
    if ((this.mode == EModes.everything || this.mode == EModes.onlyHardGroups || this.mode == EModes.onlyMediumGroups || this.mode == EModes.onlyEasyGroups)) {
      //Siguiente grupo, recorrido en circulo
      if (this.posItem == 0) {
        this.groupSelected = this._cardsService.nextGroup();
        this.countQuestionsMode = 0;
      }

      //Error: No debe entrar aquí
      if (this.countGroupsMode > this._cardsService.groups.length) {
        this.toastService.setToast({ title: "Error 500: No se encontraron grupos", type: 'w', timeS: 2 })
        this.countGroupsMode = 0;
        return;
      }

      //Si el grupo no tiene preguntas, 
      if (!this.groupSelected?.questions
        || (this.groupSelected.questions && !this.groupSelected.group_id && this.mode !== EModes.everything)
        || (this.groupSelected.questions && this.groupSelected.questions.length == 0)) {

        this.countGroupsMode++;
        this.changeItem(0);
        return;
      } else {
        this.countGroupsMode = 0;
      }
    }

    if (this.mode != EModes.thisGroup) {
      if (this.countQuestionsMode > this.groupSelected.questions.length - 1) {
        this.countQuestionsMode = 0;
        this.toastService.setToast({ title: "Sin existencias", type: 'w', timeS: 1 })
        this.mode = EModes.thisGroup;
        return;
      } else if (this.mode == EModes.everything) {
        this.countQuestionsMode = 0;
      } else if ((this.mode == EModes.onlyEasyGroups || this.mode == EModes.onlyEasy) && this.groupSelected.questions[this.posItem].difficulty == 0) {
        this.countQuestionsMode = 0;
      } else if ((this.mode == EModes.onlyMediumGroups || this.mode == EModes.onlyMedium) && this.groupSelected.questions[this.posItem].difficulty == 1) {
        this.countQuestionsMode = 0;
      } else if ((this.mode == EModes.onlyHardGroups || this.mode == EModes.onlyHard) && this.groupSelected.questions[this.posItem].difficulty == 2) {
        this.countQuestionsMode = 0;
      } else {
        this.countQuestionsMode++;
        this.changeItem(1);
      }
    }
  }

  async toggleCard() {
    if (this.isEntableToggle) {
      this.isFront = !this.isFront
    }
    
    if (!this.groupSelected?.questions) { return };
    if (!this.reviewed) {
      if (this.speack) {
        //pronunciar ingles
        await speak(this.groupSelected.questions[this.posItem].entry_b!, "es-ES")
      }
    }
    this.reviewed = true;
  }

  random() {
    if (!this.groupSelected?.questions) { return };
    const shuffledArray = [...this.groupSelected.questions]; // Crear una copia del array original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Obtener un índice aleatorio
      // Intercambiar elementos
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    this.groupSelected.questions = shuffledArray
    this.isMenuOptions = false
    this.changeDetectorRef.detectChanges();
  }

  initCard = (card: any) => {
    card.addEventListener('pointerdown', this.onPointerDown)
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
      setTimeout(async () => {
        if (!this.groupSelected?.questions?.[this.posItem]) { return };
        let q = this.groupSelected.questions[this.posItem];
        this.current.nativeElement.style.transition = ''
        q.difficulty = this.stars
        q.cycle = q.cycle !== undefined ? q.cycle + 1 : 0

        if (q.difficulty > 0) {
          //Difícil y medio
          q.state = STATES_QUESTION.review
        } else if (q.difficulty === 0) {
          //Fácil
          q.state = STATES_QUESTION.completed
        }

        this.groupSelected.questions[this.posItem] = q
        this._cardsService.updateQuestion(this.groupSelected.questions[this.posItem])
        this.changeItem(1)


        this.moveX = 0
        this.moveY = 0
        this.stars = 0
        this.isEntableToggle = true
        this.changeDetectorRef.detectChanges();
        if (this.speack) {
          //pronunciar ingles
          await speak(this.groupSelected.questions[this.posItem].entry_a!, "en-US")
        }
      })
    }, 200)
  }

  editQuestion(question: Question2) {
    const originalGroupId = question.group_id;
    this.questionForm = {
      title: 'Editar pregunta',
      question: { ...question }, // Clonar para evitar mutaciones
      question_vault_id: question.question_vault_id!,
      delete: async (questionToDelete: Question2) => {
        if (!questionToDelete) return;
        this.questionForm = undefined;
        const data = await this._indexeddbService.deleteQuestion(questionToDelete.question_id!);
        if (!data) return;

        // Remover la pregunta del grupo actual en memoria
        if (this.groupSelected?.questions) {
          const questionIndex = this.groupSelected.questions.findIndex(
            q => q.question_id === questionToDelete.question_id
          );
          if (questionIndex !== -1) {
            this.groupSelected.questions.splice(questionIndex, 1);
          }
        }

        // Si el grupo quedó vacío y estamos en un modo diferente a "Este grupo", cambiar al siguiente
        if (this.mode !== EModes.thisGroup && (!this.groupSelected?.questions || this.groupSelected.questions.length === 0)) {
          this.groupSelected = this._cardsService.nextGroup();
        }

        // Ajustar posición si es necesario
        if (this.groupSelected?.questions && this.posItem >= this.groupSelected.questions.length) {
          this.posItem = Math.max(0, this.groupSelected.questions.length - 1);
          this.posItemNext = this.posItem + 1 < this.groupSelected.questions.length ? this.posItem + 1 : 0;
        }

        this.isMenuOptions = false;
        this.changeDetectorRef.detectChanges();
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta eliminada con éxito!", message: "" });
      },
      accept: async (updatedQuestion: Question2) => {
        if (!updatedQuestion) return;
        this.questionForm = undefined;
        const data = await this._indexeddbService.updateQuestion(updatedQuestion);
        if (!data) return;

        // Verificar si el grupo cambió
        const groupChanged = originalGroupId !== updatedQuestion.group_id;

        if (groupChanged) {
          // Remover la pregunta del grupo actual en memoria
          if (this.groupSelected?.questions) {
            const questionIndex = this.groupSelected.questions.findIndex(
              q => q.question_id === updatedQuestion.question_id
            );
            if (questionIndex !== -1) {
              this.groupSelected.questions.splice(questionIndex, 1);
            }
          }

          // Actualizar el grupo en el servicio también
          const targetGroup = this._cardsService.groups.find(g => g.group_id === updatedQuestion.group_id);
          if (targetGroup) {
            if (!targetGroup.questions) targetGroup.questions = [];
            targetGroup.questions.push(updatedQuestion);
          }

          // Si el grupo actual quedó vacío y estamos en un modo diferente a "Este grupo"
          if (this.mode !== EModes.thisGroup && (!this.groupSelected?.questions || this.groupSelected.questions.length === 0)) {
            this.groupSelected = this._cardsService.nextGroup();
            this.posItem = 0;
            this.posItemNext = 1;
          } else if (this.groupSelected?.questions && this.posItem >= this.groupSelected.questions.length) {
            // Ajustar posición si es necesario
            this.posItem = Math.max(0, this.groupSelected.questions.length - 1);
            this.posItemNext = this.posItem + 1 < this.groupSelected.questions.length ? this.posItem + 1 : 0;
          }
        } else {
          // Si el grupo no cambió, actualizar la pregunta en el array actual
          if (this.groupSelected?.questions) {
            const questionIndex = this.groupSelected.questions.findIndex(
              q => q.question_id === updatedQuestion.question_id
            );
            if (questionIndex !== -1) {
              this.groupSelected.questions[questionIndex] = updatedQuestion;
            }
          }
        }

        this.isMenuOptions = false;
        this.changeDetectorRef.detectChanges();
        this.toastService.setToast({ type: 's', timeS: 1.5, title: "Pregunta actualizada con éxito!", message: "" });
      }, cancel: () => {
        this.questionForm = undefined
      },

    }
  }

  /* ================= SWIPE ================= */

  setTransform = (x: number, y: number, deg: number, duration: number) => {
    this.current.nativeElement.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
    this.likeText.style.display = "flex"
    this.likeText.style.zIndex = "1000"
    this.likeText.style.opacity = Math.abs((x / innerWidth * 2.1) + (y / innerWidth * 1.2))

    if (x > 50 && y > -100 && y < 100) {
      this.likeText.className = `is-like like`
      this.stars = 0
    } else if (x < -50 && y > -100 && y < 100) {
      this.likeText.className = `is-like nope`
      this.stars = 2
    } else if (x > -80 && x < 80 && y < 0) {
      this.likeText.className = `is-like medium`
      this.stars = 1
    }

    if (duration) this.current.nativeElement.style.transition = `transform ${duration}ms`
  }

  onPointerDown = (event: PointerEvent) => {
    this.isDragging = false;
    this.startX = event.clientX
    this.startY = event.clientY
    if (this.current) {
      this.current.nativeElement.addEventListener('pointermove', this.onPointerMove)
      this.current.nativeElement.addEventListener('pointerup', this.onPointerUp)
      this.current.nativeElement.addEventListener('pointerleave', this.onPointerUp)
    }
  }

  onPointerMove = (event: PointerEvent) => {
    this.moveX = event.clientX - this.startX;
    this.moveY = event.clientY - this.startY;
    // Calcular la distancia total movida (teorema de Pitágoras)
    const distance = Math.sqrt(this.moveX * this.moveX + this.moveY * this.moveY);
    // Umbral mínimo (ej: 5px)
    const MIN_MOVE_THRESHOLD = 5;
    if (distance > MIN_MOVE_THRESHOLD) {
      this.isEntableToggle = false; // No es un click, es arrastre
      this.setTransform(this.moveX, this.moveY, this.moveX / innerWidth * 50, 0);
    } else {
      this.isEntableToggle = true;
    }
  }

  onPointerUp = () => {
    this.current.nativeElement.removeEventListener('pointermove', this.onPointerMove)
    this.current.nativeElement.removeEventListener('pointerup', this.onPointerUp)
    this.current.nativeElement.removeEventListener('pointerleave', this.onPointerUp)

    // Si no fue un drag, ejecutar toggle
    if (!this.isDragging && this.isEntableToggle !== false) {
      return
    }
    this.isDragging = false;

    if (Math.abs(this.moveY) > this.frame.nativeElement.clientHeight / 2.2) {
      this.current.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
      this.complete()
    } else if (Math.abs(this.moveX) > this.frame.nativeElement.clientWidth / 2.1) {
      this.current.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
      this.complete()
    } else this.cancel()
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


  /* Other */
  breakLine(arg0: string[]) {
    return arg0.join().replace(/\\n/g, '<br>');
  }
}
