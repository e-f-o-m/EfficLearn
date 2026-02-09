import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
  selector: 'app-porcent-chart-xs',
  standalone: true,
  imports: [],
  template: `<div class="pie-container relative w-[65px] h-[65px]   border-white/20 border-2 rounded-full aspect-square flex justify-center items-center">                
    <div class="pie-inner w-[45px] h-[45px] border-white/20 border-2 rounded-full aspect-square flex justify-center items-center">
        <div class="number text-green-100/70 text-xs">
            @if(data){
              {{porcentCalcu()}}%
            }
        </div>
    </div>
    
    <svg class="absolute top-0 left-0 -rotate-90" xmlns="http://www.w3.org/2000/svg" version="1.1" width="65px" height="65px">
        <defs>
            <linearGradient id="GradientColor">
                <stop offset="0%" stop-color="#57AA4D" />
                <stop offset="100%" stop-color="#00E7BD" />
            </linearGradient>
        </defs>
        <circle stroke-linecap="round" class="fill-none stroke-[6px] stroke-[url(#GradientColor)]" cx="34" cy="30" r="20" fill="url(#GradientColor)"
          [attr.stroke-dashoffset]="porcent"
          [attr.stroke-dasharray]="dasharray"
        />
        <circle #circle cx="0" cy="0" r="5" stroke="#ffffff" stroke-width="1" fill="#57AA4D" />
    </svg>
  </div>`,
})
export class PorcentChartComponentXs {
  @Input('data') data: {value?:number, goal?: number,type?:'porcent'|'fraction', size?: number }={value:0,goal:0, type:'fraction', size: 12}
  @ViewChild('circle') circle!: ElementRef<SVGCircleElement>
  dasharray = 122
  porcent = (this.dasharray-(this.dasharray*(0/100)))
  x = 0
  y = 0

  constructor(private readonly ref: ChangeDetectorRef){}

  porcentCalcu(): number{
    return Math.round(100*(this.data!.value!/(this.data!.goal || 1)))
  }

  ngAfterViewInit(){
    if(this.data !== undefined && this.circle){
      this.setXYCircle(this.porcentCalcu())
      this.ref.detectChanges()
    }
  }

  setXYCircle(porcent: number){
    if(porcent==0 || porcent==null) {
      porcent = 0.1
    }
    this.porcent = Math.round(this.dasharray-(this.dasharray*(porcent/100)))
    const deg = (360*porcent)/100
    const x = 30+Math.round((20 * ( Math.sin( deg * (Math.PI/180.0) )  )))
    const y = 34+Math.round((20 * ( Math.cos( deg * (Math.PI/180.0) )  )))
    
    this.circle.nativeElement.setAttribute('cx', (y)+'');
    this.circle.nativeElement.setAttribute('cy', (x)+'');
      this.ref.detectChanges()
  }
}



