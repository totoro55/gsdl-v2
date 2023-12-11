import { PeriodType } from "./PeriodicType";
import { IndexableType } from "dexie";

export type TProjectItem = {
  id?:IndexableType
  parent_id:number
  created_at:string
  order:number

  path:string
  files:string[]
  spreadsheet_id:string
  spreadsheet_name:string
  sheet_title:string
  pre_cleaning:boolean


  is_periodic:boolean
  period_type?:PeriodType
  period_days?:number[]
  period_dates?:number[]

  status_code?:number
  status_message?:string
  status_date_time?:string
}


