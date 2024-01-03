import { LS_LISTS } from '@core/constants/constants';
import { IData, IFullData } from '@core/models/IData';

export function getNameListsLS(): IFullData[] {
    let lists: IFullData[] = [];
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave.includes(LS_LISTS.listResourceLanguageID)) {
            let res = localStorage.getItem(clave)
            if (res != undefined && res != "undefined" && res != "") {
                let data: IFullData = JSON.parse(res)
                let _data: IFullData = {
                    name: data.name,
                    id: data.id,
                    description: data.description,
                    quantity: data.quantity,
                    completed: data.completed,
                    list: []
                }
                lists.push(_data)
            }
        }
    }
    return lists
}

export async function getListLS(id: string): Promise<IFullData> {
    let lists: IFullData = {};
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

export function getLastListsLS(): IFullData {
    let lists: IFullData = {};

    let selectedId = localStorage.getItem(LS_LISTS.listSelectedId)

    if (selectedId) {
        let res = localStorage.getItem(selectedId)
        if (res != undefined && res != "undefined" && res != "") {
            lists = JSON.parse(res)
        }
    }
    return lists
}


export async function insertResourceLS(data: IFullData): Promise<boolean> {
    if (!data.id) return false
    localStorage.setItem(data.id!, JSON.stringify(data))
    return true
}

export async function insertSelectsResourceLS(data: IFullData): Promise<boolean> {
    if (!data.id) return false
    localStorage.setItem(LS_LISTS.tempItemsSelected, JSON.stringify(data))
    return true
}

export async function deleteSelectsResourceLS(): Promise<boolean> {
    localStorage.removeItem(LS_LISTS.tempItemsSelected)
    return true
}
export async function getSelectsResourceLS(): Promise<IFullData> {
    const data = localStorage.getItem(LS_LISTS.tempItemsSelected)
    if (!data) throw new Error("Error")
    try {
        const json = JSON.parse(data)
        return json
    } catch (error) {
        throw new Error("Error");
    }
}