export interface QuestionSet {
    id?: string
    name?: string
    description?: string
    limit?: number
    currentCycle?: number
    time?: number
    questions?: Question[]
    practiceMode?: string //Id o identifier mode game
    
    quantity?: number
    completed?: number
}

export interface Question {
    id?: string
    statement?: string[]
    answer?: string[]
    rangeCopleted?: number
    observation?: string
    state?: string //STATES_CARD
    reviewType?: number //Current Previous Old
    tags?: string[] //Default tag "hard" si se selecciona una vez difcil 
    cycle?: number
    currentCycle?: number
    isStatement?: boolean
    reviewCount?: number
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