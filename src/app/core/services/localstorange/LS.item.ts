import { LS_LISTS } from '@core/constants/constants';
import { IData, IFullData } from '@core/models/IData';

export function getItemResourceLS(idList: string, idItem: string): IData {
    let data: IData = {};
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idList) {
            let res = localStorage.getItem(clave)
            if (res != undefined && res != "undefined" && res != "") {
                const lists = JSON.parse(res) as IFullData
                lists.list?.forEach(res => {
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


export async function updateItemResourceLS(data: IData, idResource: string): Promise<boolean> {
    let statusReturn = false
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idResource) {
            let res = localStorage.getItem(clave)
            if (res == undefined || res == "undefined" || res == "") break
            const lists = JSON.parse(res) as IFullData
            if (!lists.list) break

            let count = 0
            for (let itemList of lists.list) {
                if (itemList.id == data.id) {
                    lists.list[count] = data
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
            const lists = JSON.parse(res) as IFullData
            if (!lists.list) break

            let auxList:IData[] = lists.list
            lists.list=[]
            for(const itemList of auxList) {
                if (itemList.id != idItem) {
                    lists.list.push(itemList)
                }else{
                    statusReturn = true;
                }
            }
            localStorage.setItem(clave, JSON.stringify(lists))
        }
    }
    return statusReturn
}


export async function insertItemResourceLS(data: IData, idResource: string): Promise<boolean> {
    let statusReturn = false
    const clavesLocalStorage = Object.keys(localStorage);
    for (const clave of clavesLocalStorage) {
        if (clave == idResource) {
            let res = localStorage.getItem(clave)
            if (res == undefined || res == "undefined" || res == "") break
            const lists = JSON.parse(res) as IFullData
            if (!lists.list) break
            lists.list.push(data)
            statusReturn = true
            localStorage.setItem(clave, JSON.stringify(lists))
        }
    }
    return statusReturn
}