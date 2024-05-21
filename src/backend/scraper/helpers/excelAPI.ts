import XLSX from 'exceljs';
import path from 'path';
export default class ExcelAPI {
  constructor(
    protected readonly path: string | (() => string | Promise<string>),
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
    return new EmailToExcel(sheet, () => this.save());
  }

  private async write() {
    return this.workBook.xlsx.writeFile(this.tempPath);
  }

  async end() {
    this.write();
    let p: string;
    if (typeof this.path == 'string') {
      p = this.path;
    } else {
      p = await this.path();
    }
    (await import('fs')).copyFileSync(this.tempPath, p);
  }

  async save() {
    return this.write();
  }
}

class EmailToExcel implements ExcelExtracterAPI {
  constructor(
    private readonly sheet: XLSX.Worksheet,
    protected saveThisSheet: () => Promise<void>,
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
  save(): Promise<void> {
    return this.saveThisSheet();
  }
}

export interface ExcelExtracterAPI {
  addEmail(emails: string[]): Promise<void>;
  addEmail(email: string): Promise<void>;
  addEmail(emails: any): Promise<void>;
  save(): Promise<void>;
}
