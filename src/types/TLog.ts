import { TProjectItem } from './TProjectItem'
import { TProject } from './TPoject'
import { TgUser } from './TgUser'
import { Timer } from './Timer'

export type TLog = {
  id?:number
  parent_id?:number
  created_at:Date
  type:string
  description:string
  isError:boolean
  stored?: {
    type:LogStoredDataTypes
    data:TProjectItem[]|TProject[]|TgUser[]|Timer[]
  }
}

export enum LogStoredDataTypes {
  projects = 'Projects',
  projectItems = 'ProjectItems',
  tgUsers = 'TgUsers',
  timers = 'Timers',
}
