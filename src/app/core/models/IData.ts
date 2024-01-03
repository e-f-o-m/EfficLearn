export interface IData {
    id?: string
    question?: string[]
    answer?: string[]
    rangeCopleted?: number
    observation?: string
    state?: string
    //"new-due" "new-review" "repeat-due" "repeat-review" "completed" "suspend"
    type?: number
    //Current Previous Old
    tags?: string[]
    //Default tag "hard" si se selecciona una vez difcil 
    cycle?: number
    currentCycle?: number
    isQuestion?: boolean
    reviewCount?: number
}

export interface IFullData {
    id?: string
    name?: string
    description?: string
    limit?: number
    quantity?: number
    completed?: number
    currentCycle?: number
    time?: number
    list?: IData[]
}

export const STATES_CARD = {
    newDue: "new-due",
    newReview: "new-review",
    repeatDue: "repeat-due",
    repeatReview: "repeat-review",
    completed: "completed",
    suspend: "suspend",
}
export const TAGS_CARD = {
    hard: "hard",
    favorite: "favorite",
}