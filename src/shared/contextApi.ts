import { IPCMessage } from './IPCMessage';
import ExtractionProgressState from './extractionsProgressState';
export default interface ContextApi {
  extractURLs: (urls: string[]) => Promise<IPCMessage>;
  listenToExtractionProgress: (
    cb: (state: ExtractionProgressState) => any
  ) => void;
  listenToExtractionEnd: (cb?: () => any) => void;
  openExcelFile: (filePath: string) => void;
}
