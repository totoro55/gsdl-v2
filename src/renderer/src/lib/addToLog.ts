import { db } from '../db/db'
import { TLog } from '../../../types/TLog'


const addToLog = async (log:TLog):Promise<void> => {
  await db.logs.add(log)
}

export {addToLog}
