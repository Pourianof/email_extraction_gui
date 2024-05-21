import { IPCMessage } from './IPCMessage';
export default interface ContextApi {
  extractURLs: (urls: string[]) => Promise<IPCMessage>;
}
