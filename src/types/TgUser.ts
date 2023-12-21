export type TgUser = {
  id?:number
  name:string
  active:boolean
  chat_id:string
  admin:boolean
  follow?:number[]
  notifications?:number[]
}
