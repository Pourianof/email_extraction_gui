import path from 'path';
import fs from 'fs';
import { downloadFile } from './fetch';
import { ExcelExtracterAPI } from './excelAPI';

export default class ExtracterUtilsAPI implements ExcelExtracterAPI {
  constructor(
    private extracterId: string,
    private tempDirPath: string,
    private readonly excelAPI: ExcelExtracterAPI,
    private opts?: { saveOnAdd?: boolean }
  ) {}
  save(): Promise<void> {
    return this.excelAPI.save(true);
  }

  addEmail(emails: string[]): Promise<void>;
  addEmail(email: string): Promise<void>;
  async addEmail(emails: any): Promise<void> {
    await this.excelAPI.addEmail(emails);
    if (this.opts?.saveOnAdd) {
      await this.save();
    }
  }

  downloadFile(url: string, fileName: string) {
    fileName = decodeURI(fileName);
    if (!this.tempDirCreated) {
      this.createTempDir();
    }

    const pdfPath = path.join(this.tempDirPath, this.extracterId, fileName);

    return downloadFile(url, pdfPath);
  }

  private tempDirCreated = false;
  private createTempDir() {
    const exctracterTempPath = path.join(this.tempDirPath, this.extracterId);
    if (!fs.existsSync(exctracterTempPath)) {
      fs.mkdirSync(exctracterTempPath);
      this.tempDirCreated = true;
      return;
    }
    this.tempDirCreated = true;
  }
}
