import XLSX from 'exceljs';
import path from 'path';
export default class ExcelAPI {
  constructor(
    protected readonly actualPath: string | (() => string | Promise<string>),
    private tempPath: string
  ) {
    this.init();
  }
  private workBook!: XLSX.Workbook;
  init() {
    this.tempPath = path.join(this.tempPath, '_temp_emails_');
    this.workBook = new XLSX.Workbook();
  }

  provideSheet(sheetName: string) {
    const sheet = this.workBook.addWorksheet(sheetName);
    sheet.columns = [{ header: 'Email', key: 'email' }];
    return new EmailToExcel(sheet, (saveToMain?: boolean) =>
      this.save(saveToMain)
    );
  }

  private async write() {
    return this.workBook.xlsx.writeFile(this.tempPath);
  }

  async end() {
    await this.write();
    let p: string;
    if (typeof this.actualPath == 'string') {
      p = this.actualPath;
    } else {
      p = await this.actualPath();
    }
    (await import('fs')).copyFileSync(this.tempPath, p);
  }

  async save(writeMain: boolean = false) {
    if (writeMain) {
      await this.end();
      return;
    }
    await this.write();
  }
}

class EmailToExcel implements ExcelExtracterAPI {
  constructor(
    private readonly sheet: XLSX.Worksheet,
    protected saveThisSheet: (saveToMain?: boolean) => Promise<void>,
    protected saveAfter: number = 10
  ) {}

  private addedEmailsCounter = 0;

  addEmail(emails: string[]): Promise<void>;
  addEmail(email: string): Promise<void>;
  async addEmail(emails: any) {
    const addIfNotEmpty = (email: string) => {
      email = email.trim();
      if (email) {
        this.sheet.addRow([email]);
        if (++this.addedEmailsCounter >= this.saveAfter) {
          return this.save();
        }
      }
    };

    if (typeof emails === 'string') {
      addIfNotEmpty(emails);
      return;
    }
    if (emails instanceof Array) {
      emails.forEach((e) => {
        addIfNotEmpty(e);
      });
    }
  }
  async save(saveToMain?: boolean): Promise<void> {
    await this.saveThisSheet(saveToMain);
    this.addedEmailsCounter = 0;
  }
}

export interface ExcelExtracterAPI {
  addEmail(emails: string[]): Promise<void>;
  addEmail(email: string): Promise<void>;
  addEmail(emails: any): Promise<void>;
  save(saveToMain?: boolean): Promise<void>;
}
