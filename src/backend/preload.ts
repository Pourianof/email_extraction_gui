import { contextBridge, ipcRenderer } from 'electron';

import ContextApi from '../shared/contextApi';
import { Events } from './events';
import Author from '../shared/models/author';

let scheduledForRemovingListeners = false;

function removeProgressListeners() {
  ipcRenderer.removeAllListeners(Events.EXTRACT_PROGRESS);
  ipcRenderer.removeAllListeners(Events.EXTRACT_END);
  scheduledForRemovingListeners = false;
}

export const contextApi: ContextApi = {
  async copyToClipBoard(opts) {
    return ipcRenderer.invoke(Events.COPY_TEXT, JSON.stringify(opts));
  },
  async extractURLs(urls) {
    const result = await ipcRenderer.invoke(
      Events.EXTRACT_URLS,
      JSON.stringify(urls)
    );
    removeProgressListeners();
    return result;
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
      removeProgressListeners();
    });
  },
  openExcelFile: function (filePath: string): void {
    ipcRenderer.send(Events.OPEN_EXCEL, filePath);
  },
  getExtractedItems: async function (): Promise<
    { filePath: string; date: number }[]
  > {
    const result = JSON.parse(await ipcRenderer.invoke(Events.GET_EXTRACTED));
    if (result.status && result.code < 0) {
      throw new Error(result.status.message);
    }

    return result.data;
  },
  openLink: function (linkName: string): void {
    ipcRenderer.send(Events.OPEN_LINK, linkName);
  },
  operateWindowActions: function (action: 'close' | 'max' | 'min'): void {
    ipcRenderer.send(Events.WIN_ACTIONS, action);
  },
  stopExtraction: function (): void {
    ipcRenderer.send(Events.STOP_EXTRACTION, {});
  },
};

contextBridge.exposeInMainWorld('context', contextApi);
