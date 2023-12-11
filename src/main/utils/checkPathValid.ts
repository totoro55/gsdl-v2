import {access, constants} from "fs";

export const checkPathValid = (value: string):string|void => {
  console.log('check path', value)
  try {
    access(value, constants.R_OK | constants.W_OK, (err) => {
      if (err) {
        console.log('check path', 'error in access')
        throw new Error(`Произошла ошибка:${err.message} при получении доступа к папке: ${value}`)
      } else {
        console.log('check path', 'ok')
        return 'Ok'
      }
    })
  } catch (err) {
    console.log('check path', 'error out access')
    if (err instanceof Error)
      throw new Error(`Произошла ошибка:${err.message} при получении доступа к папке: ${value}`)
  }


}

module.exports = checkPathValid
