// db.ts
import Dexie, { Table } from 'dexie';
import { TProject } from "../../../types/TPoject";
import { TProjectItem } from "../../../types/TProjectItem";
import { TCredentials } from "../../../types/TCredentials";
import { Timer } from "../../../types/Timer";


export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  projects!: Table<TProject>;
  projectItems!:Table<TProjectItem>
  credentials!:Table<TCredentials>
  timer!:Table<Timer>

  constructor() {
    super('gsdl');
    this.version(5).stores({
      projects: '++id, name, created_at, order, default_path, default_is_periodic, default_period_type, default_period_days, default_period_dates, is_hidden', // Primary key and indexed props
      projectItems:'++id, parent_id, created_at, order, path, files, spreadsheet_id, spreadsheet_name, sheet_title, pre_cleaning, is_periodic, period_type, period_days, period_dates, status_code, status_message, status_date_time',
      credentials:'++id, client_email, private_key, is_valid',
      timer:'++id, active, hh, mm',
    });
  }
}

export const db = new MySubClassedDexie();
