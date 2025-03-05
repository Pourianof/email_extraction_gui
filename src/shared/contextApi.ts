import { type ExtractResource } from '../backend/authoractor/authoractor';
import { type ExtractOptions } from './extractOptions';
import { IPCMessage } from './IPCMessage';
import ExtractionProgressState from './extractionsProgressState';

export default interface ContextApi {
  extractURLs: (options: {
    urls: ExtractResource[];
    options: ExtractOptions;
  }) => Promise<IPCMessage>;
  listenToExtractionProgress: (
    cb: (state: ExtractionProgressState) => any
  ) => void;
  listenToExtractionEnd: (cb?: () => any) => void;
  getExtractedItems: () => Promise<{ filePath: string; date: number }[]>;
  openExcelFile: (filePath: string) => void;
  openLink: (linkName: string) => void;
  operateWindowActions(action: 'max' | 'min' | 'close'): void;
  copyToClipBoard(opt: { text: string }): Promise<void>;
  stopExtraction(): void;
}
