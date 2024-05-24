import { contextBridge, ipcRenderer } from 'electron';

import ContextApi from '../shared/contextApi';
import { Events } from './events';
import Author from '../shared/models/author';

let scheduledForRemovingListeners = false;

export const contextApi: ContextApi = {
  extractURLs(urls) {
    return ipcRenderer.invoke(Events.EXTRACT_URLS, JSON.stringify(urls));
  },
  listenToExtractionProgress: function (
    cb: (state: { author: Author; totalAuthorRecieved: number }) => any
  ): void {
    ipcRenderer.addListener(Events.EXTRACT_PROGRESS, (_, data) => {
      const state = JSON.parse(data);
      cb(state);
    });
    if (!scheduledForRemovingListeners) {
      this.listenToExtractionEnd();
      scheduledForRemovingListeners = true;
    }
  },

  listenToExtractionEnd: function (cb?: () => any): void {
    ipcRenderer.addListener(Events.EXTRACT_END, () => {
      cb?.();
      ipcRenderer.removeAllListeners(Events.EXTRACT_PROGRESS);
      ipcRenderer.removeAllListeners(Events.EXTRACT_END);
      scheduledForRemovingListeners = false;
    });
  },
};

contextBridge.exposeInMainWorld('context', contextApi);
