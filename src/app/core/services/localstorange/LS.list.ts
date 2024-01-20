import { LS_LISTS } from '@core/constants/constants';
import { Question, QuestionSet } from '@core/models/QuestionSet';

export function getNameListsLS(): QuestionSet[] {
    let lists: QuestionSet[] = [];
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave.includes(LS_LISTS.listResourceLanguageID)) {
            let res = localStorage.getItem(clave)
            if (res != undefined && res != "undefined" && res != "") {
                let data: QuestionSet = JSON.parse(res)
                let _data: QuestionSet = {
                    name: data.name,
                    id: data.id,
                    description: data.description,
                    quantity: data.quantity,
                    completed: data.completed,
                    questions: []
                }
                lists.push(_data)
            }
        }
    }
    return lists
}

export async function getListLS(id: string): Promise<QuestionSet> {
    let lists: QuestionSet = {};
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == id) {
            let res = localStorage.getItem(clave)
            if (res != undefined && res != "undefined" && res != "") {
                lists = JSON.parse(res)
            }
        }
    }
    return lists
}

export function getLastListsLS(): QuestionSet {
    let lists: QuestionSet = {};

    let selectedId = localStorage.getItem(LS_LISTS.listSelectedId)

    if (selectedId) {
        let res = localStorage.getItem(selectedId)
        if (res != undefined && res != "undefined" && res != "") {
            lists = JSON.parse(res)
        }
    }
    return lists
}


export async function insertResourceLS(data: QuestionSet): Promise<boolean> {
    if (!data.id) return false
    localStorage.setItem(data.id!, JSON.stringify(data))
    return true
}

export async function insertSelectsResourceLS(data: QuestionSet): Promise<boolean> {
    if (!data.id) return false
    localStorage.setItem(LS_LISTS.tempItemsSelected, JSON.stringify(data))
    return true
}

export async function deleteSelectsResourceLS(): Promise<boolean> {
    localStorage.removeItem(LS_LISTS.tempItemsSelected)
    return true
}
export async function getSelectsResourceLS(): Promise<QuestionSet> {
    const data = localStorage.getItem(LS_LISTS.tempItemsSelected)
    if (!data) throw new Error("Error")
    try {
        const json = JSON.parse(data)
        return json
    } catch (error) {
        throw new Error("Error");
    }
}