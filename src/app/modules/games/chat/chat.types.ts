export interface IMessage {
  createAt: number;
  user: string;
  userName: string;
  state: "readed" | "sent" | "failed";
  type: "class" | "normal";
  value: string;
  first?: boolean;
  last?: boolean;
}

export interface IClass {
  createAt: number;        // timestamp (Date.now())
  type: string;            // "string", "image", "file", etc
  state: "readed" | "sent" | "failed";  // ESTADO del mensaje
  values: {
    lang: string;   // "en", "es", etc
    text: string;
    type: string;
  }[]; // Traducciones o representaciones
}

export interface IRoom {
  mode: string | null,
  chat: { [messageKey: string]: IMessage },
  class: { [messageKey: string]: IClass }
}


/*{ ".read": "auth != null", ".write": "auth != null",
  users: { user1:
  { rooms: [ "roomname1" ] } },
  chat_learn: {

    rooms:
      { name: "roomname1",
      chat: {
        "user_name1": {
          createAt: Date.now(),
          type: "string", state: "readed", values:
      [{ lang: "en" text: "message" },
      { lang: "es" text: "mensaje" }, ] } }, } } }
}*/
