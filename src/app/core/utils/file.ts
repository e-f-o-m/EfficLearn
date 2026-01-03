import { Question2 } from "src/app/core/models/QuestionSet";

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

export async function getFileContent(file: File): Promise<string> {
  return new Promise<string>(resolve => {
    let fileReader = new FileReader();

    fileReader.onload = () => {
      resolve(fileReader.result as string);
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

export function textToQuestions(text: string, question_vault_id: number, group_id?: number): Question2[] {
  const textLines = text.split(/\r?\n/)
  const questions: Question2[] = []
  const date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')

  let isQuestion=true
  let countQuestion = 0
  let questionsBulid: {question: string, response: string, difficulty?: 0|1|2} [] = [{question: '', response: '', difficulty: 2}]
  for (let line of textLines) {
    const isNewOrBlank = line.trim().length == 0
    if(isNewOrBlank){
      isQuestion = true;
      countQuestion++;
      continue;
    }
    if(isQuestion){
      isQuestion = false;
      if(!questionsBulid[countQuestion]){
        questionsBulid[countQuestion] = {question: '', response: '', difficulty: 2}
      }
      let separator = line.includes(';') ? ';' : line.includes('|') ? '|' : null
      if(separator){
        let lineQuestionSplit = line.split(separator)
        if(lineQuestionSplit[0].length > 0){
          questionsBulid[countQuestion].question = lineQuestionSplit[0]+''
        }
        if(lineQuestionSplit[1].length > 0){
          questionsBulid[countQuestion].response = lineQuestionSplit[1]+''
        }
        if(lineQuestionSplit?.[2]?.length > 0){
          questionsBulid[countQuestion].difficulty = Number(lineQuestionSplit[2]) as 0|1|2
        }
        isQuestion = true;
        countQuestion++;
      }else{
        questionsBulid[countQuestion].question += line+''
      }
    }else{
      questionsBulid[countQuestion].response += line+''
      isQuestion = true;
    }
  }

  for (const lineObj of questionsBulid) {
      questions.push({
      entry_a: lineObj.question,
      entry_b: lineObj.response,
      /* description?: string */
      difficulty: lineObj.difficulty,
      /* tags?: string[], */
      cycle: 0,
      create_at: date,
      group_id: group_id,
      state: 'due',
      question_vault_id: question_vault_id,
    })
  }
  return questions
}
