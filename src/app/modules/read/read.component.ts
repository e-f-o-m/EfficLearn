import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILineLyrics } from '@core/models/ILineLyrics';
import { fileToLinesLyric } from '@core/utils/file';
import { InputFileComponent } from '@shared/components/input-file/input-file.component';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

interface InfoPagination {
    page: number,
    sizeEn: number,
    sizeEs: number,
    nSplit: number
}


@Component({
    selector: 'app-read',
    standalone: true,
    imports: [CommonModule, InputFileComponent],
    templateUrl: './read.component.html',
    styleUrls: ['./read.component.scss']
})
export class ReadComponent {
    private router = inject(Router);
    en: ILineLyrics[] = [];
    es: ILineLyrics[] = [];
    enFilter: ILineLyrics[] = [];
    esFilter: ILineLyrics[] = [];
    isUpFiles = [false, false];
    isShowOptions = false;
    isShowNav = true;
    isEn = true;
    isLoading = false;
    fontSize = 0.8;
    nameFiles: string[] = ["", ""];
    lineLyricsSelected: { en?: ILineLyrics, es?: ILineLyrics } = { en: undefined, es: undefined }
    selecteds: [number, number] = [0, 0];
    pagination: InfoPagination = {
        page: 0,
        sizeEn: 0,
        sizeEs: 0,
        nSplit: 40
    }

    constructor() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
            this.setStateNav(event.url)
        });
        this.router.navigate([], { queryParams: { nav: this.isShowNav } });
        this.setStateNav(this.router.url);
    }
    setStateNav(url: any) {
        let dataUrl = this.router.parseUrl(url).queryParams;
        if (dataUrl["nav"]) {
            this.isShowNav = "true" == dataUrl["nav"]
        }
    }



    setFile(files: FileList, identifier: string) {
        this.isLoading = true;
        this.fontSize = Number(localStorage.getItem("fontSize")) || 0.8;

        let file: File = files[0];
        let isEnglish: boolean = identifier == "engFile";

        if (file) {
            if (document.readyState !== 'complete') return;
            if (isEnglish) {
                this.nameFiles[0] = file.name;
                fileToLinesLyric(file).then(res => {
                    this.en = res
                    this.isUpFiles[0] = true;
                    this.isLoading = false;
                    this.pagination.sizeEn = this.en.length;
                    this.enFilter = this.en.slice(this.pagination.page * this.pagination.nSplit, (this.pagination.page + 1) * this.pagination.nSplit);
                })
            }
            if (files.length > 1 || !isEnglish) {
                file = files[files.length - 1]
                this.nameFiles[1] = file.name;
                fileToLinesLyric(file)
                fileToLinesLyric(file).then(res => {
                    this.es = res
                    this.isUpFiles[1] = true;
                    this.isLoading = false;
                    this.pagination.sizeEs = this.es.length;
                    this.goPage()
                })

            }
        }
    }

    toggleLang() {
        const aux = this.nameFiles[0];
        this.nameFiles[0] = this.nameFiles[1]
        this.nameFiles[1] = aux;
        const aux2 = this.es;
        this.es = this.en;
        this.en = aux2;
        const aux3 = this.esFilter;
        this.esFilter = this.enFilter;
        this.enFilter = aux3;
    }

    nextPage() {
        this.pagination.page++;
        this.goPage();
    }
    previousPage() {
        this.pagination.page--;
        this.goPage();
    }
    goPageInput(event: any) {
        this.pagination.page = event.value as number || 0;
        this.goPage();
    }
    goPage() {
        this.enFilter = this.en.slice(this.pagination.page * this.pagination.nSplit, (this.pagination.page + 1) * this.pagination.nSplit);
        this.esFilter = this.es.slice(this.enFilter[0].idOther, this.enFilter[this.enFilter.length - 1].idOther + 1);
    }


    changeId(direction: number) {
        if (direction === 1) {
            //Actualizar "this.es [actual] idOther" al anterior desde "this.en"
            this.es[this.lineLyricsSelected.es!.id].idOther = this.es[this.en[this.lineLyricsSelected.en!.id - direction].idOther].idOther;
        }

        let idNextEs = this.lineLyricsSelected.es!.id + direction;

        //actulizar actual "en" al siguiente other
        this.en[this.lineLyricsSelected.en!.id].idOther = idNextEs;

        //siguiente o anterior de "es" es igual al actual es + drección
        this.es[idNextEs].idOther = this.lineLyricsSelected.en!.id + 0;

        // ==== [seleccionados] ====
        //solo cambia el other según la dirección, "en" se mantiene la posición (id)
        this.lineLyricsSelected.en!.idOther = idNextEs;

        //"es.id" es el siguiente o anterior "es.id". al intercalar de "en" a "es" debe hacer scroll hasta el es.id
        this.lineLyricsSelected.es!.id = idNextEs;
        //de igual forma, al pasar de "es" a "en" toma el "en.id" y hace scroll hasta esa posición o id
        this.lineLyricsSelected.es!.idOther = this.lineLyricsSelected.en!.id;

        let count = 0;
        for (let i = this.lineLyricsSelected.es!.id + 1; i < this.es.length; i++) {
            count++;
            this.es[i].idOther = this.lineLyricsSelected.es!.idOther + count;
        }
        count = 0;
        for (let i = this.lineLyricsSelected.en!.id + 1; i < this.en.length; i++) {
            count++;
            this.en[i].idOther = this.lineLyricsSelected.en!.idOther + count;
        }

        document.getElementById("es" + this.selecteds[1])?.classList.remove("selected");
        let lineEl = document.getElementById("es" + this.lineLyricsSelected.es!.id);
        lineEl?.classList.add("selected");

        this.selecteds = [this.lineLyricsSelected.en!.id, this.lineLyricsSelected.es!.id];
        this.goPage();
    }

    scroll(_isEn: boolean, lineLyrics: ILineLyrics) {
        if (this.es.length < 2) return;
        //sobreponer uno encima de otro texto
        let read_content_en = document.getElementById("read_content_en");
        let read_content_es = document.getElementById("read_content_es");
        read_content_en!.style.zIndex = _isEn ? '1' : '2';
        read_content_en!.style.opacity = _isEn ? '0' : '1';

        read_content_es!.style.zIndex = _isEn ? '2' : '1';
        read_content_es!.style.opacity = _isEn ? '1' : '0';

        //Seleccionados en y es (azul)
        if (_isEn) {
            this.lineLyricsSelected.en = Object.assign({}, lineLyrics);
            const esOtherElement = this.esFilter.find(res => res.id == lineLyrics.idOther);
            this.lineLyricsSelected.es! = Object.assign({}, esOtherElement);
            //El seleccionado es igual al pos other de la otra lista
            this.lineLyricsSelected.es!.idOther = lineLyrics.id;
        } else {
            this.lineLyricsSelected.es! = Object.assign({}, lineLyrics);
            const enOtherElement = this.enFilter.find(res => res.id == lineLyrics.idOther);
            this.lineLyricsSelected.en! = Object.assign({}, enOtherElement);
        }


        //Scroll a la posición del id relacionado en el otro texto al hacer toggle
        let itemEn = read_content_en?.querySelector("#en" + this.lineLyricsSelected.en!.id);
        let itemEs = read_content_es?.querySelector("#es" + this.lineLyricsSelected.es!.id);
        const enPosition = itemEn!.getBoundingClientRect();
        const esPosition = itemEs!.getBoundingClientRect();


        let dif = 0;
        let direction = 1;
        if ((esPosition.top > enPosition.top)) {
            direction = this.isEn ? -1 : 1;
            dif = (enPosition.top - esPosition.top);
        } else {
            direction = this.isEn ? 1 : -1;
            dif = (esPosition.top - enPosition.top);
        }
        window.scrollTo({
            top: window.scrollY + (dif * direction)
        });

        document.getElementById("en" + this.selecteds[0])?.classList.remove("selected");
        document.getElementById("es" + this.selecteds[1])?.classList.remove("selected");

        //Cambio de color de los dos textos relacinoados
        itemEn?.classList.add("selected");
        itemEs?.classList.add("selected");
        this.selecteds = [this.lineLyricsSelected.en!.id, this.lineLyricsSelected.es!.id];

        //Toggle book
        this.isEn = !_isEn;
        this.saveLocalPage();
    }


    saveLocalPage() {
        localStorage.setItem('pageId', JSON.stringify(this.lineLyricsSelected.en!.id));
        localStorage.setItem('fontSize', this.fontSize.toString());
    }

    downloadBook() {
        let content: string[] = [];
        content.push(`{${this.en[0].idOther}}` + this.en[0].text);
        for (let i = 1; i < this.en.length; i++) {
            content.push(`|{${this.en[i].idOther}}` + this.en[i].text);
        }
        this.downloadFile(this.getDataMD_HM() + "_" + this.nameFiles[0], content);
        content = [];
        content.push(`{${this.es[0].idOther}}` + this.es[0].text);
        for (let i = 1; i < this.es.length; i++) {
            content.push(`|{${this.es[i].idOther}}` + this.es[i].text);
        }
        this.downloadFile(this.getDataMD_HM() + "_" + this.nameFiles[1], content);
    }
    downloadFile(nameFile: string, content: string[]) {
        const blob = new Blob(content, { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = nameFile;

        // Simular un clic en el enlace para descargar el archivo
        link.click();

        // Liberar el objeto URL
        URL.revokeObjectURL(url);
    }
    getDataMD_HM() {
        const fechaActual = new Date();
        const year = (fechaActual.getFullYear()).toString();
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 porque los meses son base 0
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const hora = fechaActual.getHours().toString().padStart(2, '0');
        const minuto = fechaActual.getMinutes().toString().padStart(2, '0');
        return `${year}${mes}${dia}_${hora}${minuto}`;
    }

    goToSavedPage() {
        let idItem = localStorage.getItem('pageId');
        let item = this.en.find(res => res.id == Number(idItem));
        if (item) {
            let itemEn = document.querySelector("#en" + item.id);
            const enPosition = itemEn!.getBoundingClientRect();
            window.scrollTo({
                top: window.scrollY + enPosition.top - 40
            });
        }
    }
}
