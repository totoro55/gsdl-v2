import { PeriodType } from "./PeriodicType";
import { IndexableType } from "dexie";

export type TProject = {
  id?: IndexableType
  name: string
  created_at:string
  order:number
  default_path:string
  default_is_periodic:boolean
  default_period_type?:PeriodType
  default_period_days?:number[]
  default_period_dates?:number[]
  is_hidden:boolean
}
