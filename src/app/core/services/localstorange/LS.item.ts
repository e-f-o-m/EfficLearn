/* import { LS_LISTS } from 'src/app/core/constants/constants';
import { Question, QuestionSet } from 'src/app/core/models/QuestionSet';

export function getItemResourceLS(idList: string, idItem: string): Question {
    let data: Question = {};
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idList) {
            let res = localStorage.getItem(clave)
            if (res != undefined && res != "undefined" && res != "") {
                const lists = JSON.parse(res) as QuestionSet
                lists.questions?.forEach(res => {
                    if (res.id == idItem) {
                        data = res
                        return
                    }
                })
            }
            break
        }
    }
    return data
}


export async function updateItemResourceLS(data: Question, idResource: string): Promise<boolean> {
    let statusReturn = false
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idResource) {
            let res = localStorage.getItem(clave)
            if (res == undefined || res == "undefined" || res == "") break
            const lists = JSON.parse(res) as QuestionSet
            if (!lists.questions) break

            let count = 0
            for (let itemList of lists.questions) {
                if (itemList.id == data.id) {
                    lists.questions[count] = data
                    statusReturn = true
                    localStorage.setItem(clave, JSON.stringify(lists))
                    break
                }
                count++
            }
        }
    }
    return statusReturn
}

export async function deleteItemResourceLS(idItem:string, idResource: string): Promise<boolean> {
    let statusReturn = false
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idResource) {
            let res = localStorage.getItem(clave)
            if (res == undefined || res == "undefined" || res == "") break
            const lists = JSON.parse(res) as QuestionSet
            if (!lists.questions) break

            let auxList:Question[] = lists.questions
            lists.questions=[]
            for(const itemList of auxList) {
                if (itemList.id != idItem) {
                    lists.questions.push(itemList)
                }else{
                    statusReturn = true;
                }
            }
            localStorage.setItem(clave, JSON.stringify(lists))
        }
    }
    return statusReturn
}


export async function insertItemResourceLS(data: Question, idResource: string): Promise<boolean> {
    let statusReturn = false
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idResource) {
            let res = localStorage.getItem(clave)
            if (res == undefined || res == "undefined" || res == "") break
            const lists = JSON.parse(res) as QuestionSet
            if (!lists.questions) break
            lists.questions.push(data)
            statusReturn = true
            localStorage.setItem(clave, JSON.stringify(lists))
        }
    }
    return statusReturn
}
 */