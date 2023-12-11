import { PeriodType } from "../../../../../types/PeriodicType"
import { TProjectItem } from "src/types/TProjectItem";

export default function filterItems(items: TProjectItem[], todayDate:number, todayDay:number): TProjectItem[] {
  return items
    .filter(item=>item.is_periodic)
    .filter(item=>{
      if (item.period_type === PeriodType.dates && item.period_dates?.includes(todayDate)){
        return true
      } else if (item.period_days?.includes(todayDay)){
        return true
      } else return false
    })
}
