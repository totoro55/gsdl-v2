import {GoogleSpreadsheet} from "google-spreadsheet";
import {JWT} from "google-auth-library";

export abstract class AbstractGoogleSpreadsheetService {

    doc: Promise<GoogleSpreadsheet>

    protected constructor(sheetId:string, auth:JWT) {
        this.doc = this.connect(sheetId, auth)
    }

    private async connect (sheetId:string, auth:JWT):Promise<GoogleSpreadsheet> {
        try {
            const s  = new GoogleSpreadsheet(sheetId, auth);
            await s.loadInfo()
            return s
        } catch (err) {
            if (err instanceof Error)
            throw new Error(`Ошибка подключения к документу: ${err.message}`)
        }

    }

}
