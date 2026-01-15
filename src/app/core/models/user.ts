export interface IUserDB {
  userName: string | null;
  rooms?: string[];
  last_update: number | null
}
