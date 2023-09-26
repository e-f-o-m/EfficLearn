export async function fileToLinesLyric(file: File): Promise<Array<{ id: number, text: string, idOther: number }>> {
    return new Promise<Array<{ id: number, text: string, idOther: number }>>(resolve => {
        let fileReader = new FileReader();

        fileReader.onload = () => {
            let result: string = fileReader.result as string;
            let linesLyric: Array<{ id: number, text: string, idOther: number }> = strToLinesLyric(result);
            resolve(linesLyric);
        };

        fileReader.readAsText(file, 'UTF-8');
    });
}


export function strToLinesLyric(result: string): Array<{ id: number, text: string, idOther: number }> {
    let linesLyric: Array<{ id: number, text: string, idOther: number }> = [];

    let split = result.split('|')
    if (split.length <= 2) {
        //First upload file
        split = transformNewTxt(result);
    }

    split.forEach((res, index) => {
        const match = res.split(/\{([^}]+)\}/);
        const posLine = match[1] ? Number(match[1]) : -1;
        const text = match[2] ? match[2] : '\n';
        linesLyric.push({
            id: index, //identificador unico del item = posición
            text: text,
            idOther: posLine //identificador de la posición del opuesto
        })
    })
    return linesLyric;
}

export function transformNewTxt(text: string): string[] {
    let arText = text.replaceAll(/[.]\n|[.]( *\n)+/g, '.<br>').split(/(?<=[.,:?;]|(?=[-*+])|<br>)/g);
    

    let content: string[] = [];
    let count = -1;
    for (let i = 0; i < arText.length; i++) {
        let text = arText[i]//?.trim() ?? '';
        
        if (text === '<br>' || text === "") {
            content[content.length - 1] += "\n";
            continue;
        } else if (text === '.' || text === ',' || text === ':' || text === '-') {
            continue;
        } else {
            count++;
            content.push(`|{${count}}`);
            content[content.length - 1] += text//.replaceAll("\n", '') + ' ';
        }
    }
    return content;
}

