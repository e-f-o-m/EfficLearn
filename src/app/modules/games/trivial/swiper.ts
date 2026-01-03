export class Swiper {
    frame: any;
    current: any;
    next: any;
    nameNext = "next"
    nameCurrent = "current"
    count = 0
    startX = 0
    startY = 0
    moveX = 0
    moveY = 0
    imgCount = 0
    cloudUrl = 'https://djjjk9bjm164h.cloudfront.net/'

    data = [
        { img: `${this.cloudUrl}tender01.jpg`, name: 'Korean Fried', price: '20', distance: '2' },
        { img: `${this.cloudUrl}tender02.jpg`, name: 'Grilled', price: '23', distance: '5' },
        { img: `${this.cloudUrl}tender03.jpg`, name: 'Fried', price: '25', distance: '11' },
        { img: `${this.cloudUrl}tender04.jpg`, name: 'Deep Fried', price: '23', distance: '6' }
    ]

    likeText: any = {}
    constructor() {}
    start(current: any, frame: any) {
        this.current = current
        this.frame = frame
        this.likeText = this.current.nativeElement.children[0]
        this.initCard(this.current.nativeElement)
    }

    initCard = (card: any) => {
        card.addEventListener('pointerdown', this.onPointerDown)
    }

    setTransform = (x: number, y: number, deg: number, duration: number) => {
        this.current.nativeElement.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`
        this.likeText.style.opacity = Math.abs((x / innerWidth * 2.1))
        this.likeText.className = `is-like ${x > 0 ? 'like' : 'nope'}`
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
        this.moveX = event.clientX - this.startX
        this.moveY = event.clientY - this.startY
        this.setTransform(this.moveX, this.moveY, this.moveX / innerWidth * 50, 0)
    }

    onPointerUp = () => {
        this.current.nativeElement.removeEventListener('pointermove', this.onPointerMove)
        this.current.nativeElement.removeEventListener('pointerup', this.onPointerUp)
        this.current.nativeElement.removeEventListener('pointerleave', this.onPointerUp)
        if (Math.abs(this.moveX) > this.frame.nativeElement.clientWidth / 2) {
            this.current.nativeElement.removeEventListener('pointerdown', this.onPointerDown)
            this.complete()
        } else this.cancel()
    }

    complete = () => {
        const flyX = (Math.abs(this.moveX) / this.moveX) * innerWidth * 1.3
        const flyY = (this.moveY / this.moveX) * flyX
        this.setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth)
        setTimeout(() => {
            this.setTransform(0, 0, 0, 2200)
            this.initCard(this.current.nativeElement)
            setTimeout(() => this.current.nativeElement.style.transition = '', 10)
            this.nameNext = this.data[this.count + 1].name
            this.nameCurrent = this.data[this.count].name
            this.count++
        }, 300)
    }

    cancel = () => {
        this.setTransform(0, 0, 0, 100)
        setTimeout(() => this.current.nativeElement.style.transition = '', 100)
    }
}