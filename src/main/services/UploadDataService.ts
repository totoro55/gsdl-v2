import { AbstractGoogleSpreadsheetService } from "./GoogleSpreadsheetService";
import { JWT } from "google-auth-library";

export class UploadDataService extends AbstractGoogleSpreadsheetService {
  constructor(sheetId: string, auth: JWT) {
    super(sheetId, auth);
  }

  async getTitles(): Promise<string[] | undefined> {
    return await this.doc
      .then(d => {
        const s = d.sheetsByIndex;
        return s.map(sheet => {
          return sheet.title;
        });
      })
      .catch(err => {
        throw new Error(`Не удалось получить данные из таблицы. Ошибка ${err.message}`);
      });
  }

  async getSpreadsheetInfo(): Promise<{ spreadsheetTitle: string, titles: string[] }> {
    const d = await this.doc;
    const sheets = d.sheetsByIndex.map(sheet => {
      return sheet.title;
    });
    return { spreadsheetTitle: d.title, titles: sheets };
  }

  async removeDataFromSheet(title: string): Promise<void> {
    const d = await this.doc;
    const s = d.sheetsByTitle[title];
    await s.clearRows();
  }


  async setDataToSheet(data: Record<string, string|number>[], title: string):Promise<void> {
    const d = await this.doc;
    const s = d.sheetsByTitle[title];
    await s.addRows(data)
  }
}
