import { Injectable } from "@angular/core"
import { Database, child, get, ref } from "@angular/fire/database"

@Injectable({
    providedIn: 'root'
})
export class AutService {

    constructor(private db: Database) {
    }
    
    async getVersion(): Promise<{ version: string }> {
        let version = localStorage.getItem("version") ?? "0"
        return await get(child(ref(this.db), `version`)).then((snapshot) => {
            if (!snapshot.exists()) {
                throw new Error()
            }
            version = snapshot.val()
            return { version: version }
        }).catch(error => {
            console.error('>> >>  :', error);
            return { version: version }
        })
    }

}