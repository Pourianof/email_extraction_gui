import path from 'path';
import fs from 'fs';
import { downloadFile } from './fetch';
import { ExcelExtracterAPI } from './excelAPI';

export default class ExtracterUtilsAPI implements ExcelExtracterAPI {
  constructor(
    private extracterId: string,
    private tempDirPath: string,
    private readonly excelAPI: ExcelExtracterAPI
  ) {}
  save(): Promise<void> {
    return this.excelAPI.save();
  }

  addEmail(emails: string[]): Promise<void>;
  addEmail(email: string): Promise<void>;
  addEmail(emails: any): Promise<void> {
    return this.excelAPI.addEmail(emails);
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
