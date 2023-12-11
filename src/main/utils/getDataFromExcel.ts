import fs from "fs";
import excelToJson from "convert-excel-to-json";


const getDataFromExcel = (path:string):Record<string, string|number>[] => {
        const fileBuffer = fs.readFileSync(path) // fs.readFileSync return a Buffer
        const data = excelToJson({
            source: fileBuffer, //Buffer used as a source of data
            header:{
                rows: 1
            },
            columnToKey:{
                '*':'{{columnHeader}}'
            }}
        );
        return data.TDSheet
}

export default getDataFromExcel
