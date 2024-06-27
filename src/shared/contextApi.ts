import { IPCMessage } from './IPCMessage';
import ExtractionProgressState from './extractionsProgressState';
export default interface ContextApi {
  extractURLs: (urls: string[]) => Promise<IPCMessage>;
  listenToExtractionProgress: (
    cb: (state: ExtractionProgressState) => any
  ) => void;
  listenToExtractionEnd: (cb?: () => any) => void;
  getExtractedItems: () => Promise<{ filePath: string; date: number }[]>;
  openExcelFile: (filePath: string) => void;
  openLink: (linkName: string) => void;
}
