import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";


@Component({
  selector: 'app-porcent-chart',
  standalone: true,
  imports: [],
  template: `<div class="pie-container relative w-[140px] h-[140px]   border-white/20 border-2 rounded-full aspect-square flex justify-center items-center">                
    <div class="pie-inner w-[100px] h-[100px] border-white/20 border-2 rounded-full aspect-square flex justify-center items-center">
        <div class="number">
            @if(data){
              {{data.value}}/{{data.goal}}
            }
        </div>
    </div>
    
    <svg class="absolute top-0 left-0 -rotate-90" xmlns="http://www.w3.org/2000/svg" version="1.1" width="140px" height="140px">
        <defs>
            <linearGradient id="GradientColor">
                <stop offset="0%" stop-color="#57AA4D" />
                <stop offset="100%" stop-color="#00E7BD" />
            </linearGradient>
        </defs>
        <circle id="xxx" stroke-linecap="round" class="fill-none stroke-[17px] stroke-[url(#GradientColor)]" cx="70" cy="70" r="50" fill="url(#GradientColor)" 
        style="stroke-dashoffset: {{porcent}}; stroke-dasharray:{{dasharray}}"
        />
        <circle #circle cx="0" cy="0" r="11" stroke="#ffffff" stroke-width="2" fill="#57AA4D" />
    </svg>
  </div>`,
})
export class PorcentChartComponent {
  @Input('data') data: {value?:number, goal?: number,type?:'porcent'|'fraction', size?: number }={value:0,goal:0, type:'fraction', size: 12}
  @ViewChild('circle') circle!: ElementRef<SVGCircleElement>
  dasharray = 310
  porcent = (this.dasharray-(this.dasharray*(0/100)))
  x = 0
  y = 0

  constructor(private ref: ChangeDetectorRef){
  }

  ngAfterViewInit(){
    if(this.data !== undefined && this.circle){
      this.setXYCircle(  Math.round((100*(this.data.value!/this.data.goal!))  ))
    }
  }

  setXYCircle(porcent: number){
    if(porcent==0 || !porcent) {
      porcent = 0.1
    }
    this.porcent = (this.dasharray-(this.dasharray*(porcent/100)))
    const deg = (360*porcent)/100
    const x = 70+Math.round((50 * ( Math.sin( deg * (Math.PI/180.0) )  )))
    const y = 70+Math.round((50 * ( Math.cos( deg * (Math.PI/180.0) )  )))
    this.circle.nativeElement.setAttribute('cx', (y)+'');
    this.circle.nativeElement.setAttribute('cy', (x)+'');
    this.ref.detectChanges()
  }
}



