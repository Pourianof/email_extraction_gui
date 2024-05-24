import { IPCMessage } from './IPCMessage';
import Author from '../shared/models/author';
export default interface ContextApi {
  extractURLs: (urls: string[]) => Promise<IPCMessage>;
  listenToExtractionProgress: (
    cb: (state: { author: Author; totalAuthorRecieved: number }) => any
  ) => void;
  listenToExtractionEnd: (cb?: () => any) => void;
}
