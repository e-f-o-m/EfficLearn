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

/* 
identificador unico
statemnts enunciados de la pregunta
answers respuetas de la pregunta en el mismo orden
rangeCompleted Logrado o completado 5 estrellas
observaciones de la pregunta, separar texto explicativo por ejemplo
state 

*/

export interface Group {
    group_id?: number,
    name?: string,
    cycle?: number,
    create_at?: string,
    type?: string,
    question_vault_id?: number
    questions?: Question2[],
}

export interface Question_vault {
    question_vault_id?: number
    name?: string
    quantity?: number
    completed?: number
}

export interface Question2 {
    question_id?: number
    description?: string
    entry_a?: string
    entry_b?: string
    difficulty?: 0|1|2
    tags?: string[] 
    cycle?: number
    create_at?: string
    group_id?: number
    state?: 'review'|'due'|'completed'|'suspend'
    question_vault_id?: number
    //OTHERS
    reviewCount?: number
    animation?: string
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

export enum STATES_QUESTION {
    review = "review",
    due = "due",
    completed = "completed",
    suspend = "suspend",
}

export const STATES_CARD = {
    review: "review",
    due: "due",
    completed: "completed",
    suspend: "suspend",
}
export const TAGS_CARD = {
    hard: "hard",
    favorite: "favorite",
}


export enum StoreQuestion {
    tableName = 'Question',
    question_id = 'question_id',
    description = 'description',
    entry_a = 'entry_a',
    entry_b = 'entry_b',
    difficulty = 'difficulty',
    tags = 'tags',
    cycle = 'cycle',
    create_at = 'create_at',
    group_id = 'group_id',
    state = 'state',
    question_vault_id = 'question_vault_id',
}
export enum StoreGroup {
    tableName ='Group',
    group_id = 'group_id',
    name = 'name',
    cycle = 'cycle',
    create_at = 'create_at',
    type = 'type',
}
export enum StoreTag {
    tableName = 'Tag',
    tag_id = 'tag_id',
    name = 'name',
    color = 'color',
}
export enum StoreQuestion_vault {
    tableName = 'Question_vault',
    question_vault_id = 'question_vault_id',
    name = 'name',
    quantity = 'quantity',
    completed = 'completed',
}