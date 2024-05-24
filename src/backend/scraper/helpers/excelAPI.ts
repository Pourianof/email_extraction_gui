import XLSX from 'exceljs';
import path from 'path';
import Notifier from './notifier';
import Author from '../models/author';
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
    sheet.columns = [
      { header: 'First name', key: 'name' },
      { header: 'Last name', key: 'lastName' },
      { header: 'Affiliations', key: 'affiliations' },
      { header: 'Addresses', key: 'address' },
      { header: 'Email', key: 'email' },
    ];
    return new AuthorToExcel(sheet, (saveToMain?: boolean) =>
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

abstract class BaseEmailToExcel implements ExcelExtracterAPI {
  protected notifier: Notifier<'newemail'> = new Notifier();
  addAuthor(emails: Author[]): Promise<void>;
  addAuthor(email: Author): Promise<void>;
  addAuthor(emails: any): Promise<void>;
  async addAuthor(emails: unknown): Promise<void> {
    this.notifier.trigger('newemail', emails);
  }
  onNewAuthor(handler: (info: Author) => any) {
    this.notifier.addListener('newemail', (event) => handler(event.data));
  }
  abstract save(saveToMain?: boolean | undefined): Promise<void>;
}

class AuthorToExcel extends BaseEmailToExcel {
  constructor(
    private readonly sheet: XLSX.Worksheet,
    protected saveThisSheet: (saveToMain?: boolean) => Promise<void>,
    protected saveAfter: number = 10
  ) {
    super();
  }

  private addedEmailsCounter = 0;

  addAuthor(authorData: Author[]): Promise<void>;
  addAuthor(authorData: Author): Promise<void>;
  async addAuthor(authorData: any) {
    const addIfNotEmpty = (data: Author) => {
      if (data) {
        this.sheet.addRow({
          name: data.name,
          lastName: data.lastName,
          affiliations: data.affiliations?.join(', ') ?? '',
          address: data.address?.join(', ') ?? '',
          email: data.email?.join(', ') ?? '',
        });
        super.addAuthor(data);
        if (++this.addedEmailsCounter >= this.saveAfter) {
          return this.save();
        }
      }
    };

    if (authorData instanceof Array) {
      authorData.forEach((e) => {
        addIfNotEmpty(e);
      });
    } else {
      addIfNotEmpty(authorData);
      return;
    }
  }
  async save(saveToMain?: boolean): Promise<void> {
    await this.saveThisSheet(saveToMain);
    this.addedEmailsCounter = 0;
  }
}

export interface NewDataNotifier {
  onNewAuthor(handler: (newAuthor: Author) => any): void;
}

export interface ExcelExtracterAPI extends NewDataNotifier {
  addAuthor(authroData: Author[]): Promise<void>;
  addAuthor(authroData: Author): Promise<void>;
  addAuthor(authroData: any): Promise<void>;
  save(saveToMain?: boolean): Promise<void>;
}
