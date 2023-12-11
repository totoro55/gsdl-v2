import { IndexableType } from "dexie";

export type TCredentials = {
  id?:IndexableType
  client_email:string
  private_key:string
  is_valid:boolean
}
