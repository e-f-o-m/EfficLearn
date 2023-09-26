export interface IData {
    isQuestion: boolean,
    question: string,
    answer: string
}

export interface IFullData {
    id: string,
    name: string,
    list: IData[]
}