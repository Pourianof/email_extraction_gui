import { contextBridge, ipcRenderer } from 'electron';

import ContextApi from '../shared/contextApi';
import { Events } from './events';

export const contextApi: ContextApi = {
  extractURLs(urls) {
    return ipcRenderer.invoke(Events.EXTRACT_URLS, JSON.stringify(urls));
  },
};

contextBridge.exposeInMainWorld('context', contextApi);
