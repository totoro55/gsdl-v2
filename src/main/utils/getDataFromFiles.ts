import path from "path";
import getDataFromExcel from "./getDataFromExcel";


export const getDataFromFiles = (folderPath:string,files: string[]):Record<string,string|number>[] => {
    if (files.length > 1) {
        let res: Record<string, string|number>[] = []
        files.map(f => {
            const filePath = path.join(folderPath + '/' + f)
            const data = getDataFromExcel(filePath)
            res = res.concat(data)
        })
        return res
    } else {
        const filePath = path.join(folderPath + '/' + files[0])
        return getDataFromExcel(filePath)
    }
}
