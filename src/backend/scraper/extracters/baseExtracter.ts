import ExtracterUtilsAPI from '../helpers/ExtracterUtils';
import { ConstrainedBrowser } from '../helpers/browserManager';
import { LinkedListHandler } from '../helpers/linkedList';

enum ExtracterState {
  EXTRACTING,
  IDOL,
}

export default abstract class BaseExtracter {
  protected urlsToExtract: LinkedListHandler<string> = new LinkedListHandler();
  constructor(
    protected browser: ConstrainedBrowser,
    protected utilsAPI: ExtracterUtilsAPI,
    protected maxJournals: number = -1,
    protected maxVolumes: number = 10,
    urls?: string[]
  ) {
    this.addAll(urls);
  }

  private state = ExtracterState.IDOL;
  private waiter?: Promise<void>;

  async extract(): Promise<void> {
    if (this.state == ExtracterState.EXTRACTING) {
      return this.waiter!;
    }
    this.state = ExtracterState.EXTRACTING;
    if (this.urlsToExtract.length) {
      this.waiter = new Promise<void>(async (res, rej) => {
        let urlWrapper = this.urlsToExtract.first;
        while (urlWrapper) {
          const url = urlWrapper.item;
          await this.extractSingleURL(url);

          urlWrapper = urlWrapper.next;
        }
        this.state = ExtracterState.IDOL;
        res();
      });
    } else {
      throw new Error('No url to extract.');
    }
  }

  waitForExtraction() {
    return this.waiter;
  }

  protected abstract extractSingleURL(url: string): Promise<void>;

  addURL(url: string[]): void;
  addURL(url: string): void;
  addURL(url: any, beginExtract = true): void {
    if (typeof url == 'string') {
      this.urlsToExtract.adopt(url);
    } else if (url instanceof Array) {
      this.addAll(url);
    }
    if (beginExtract) this.extract();
  }

  private addAll(urls?: string[]) {
    if (urls && urls.length) {
      for (let u of urls) {
        this.urlsToExtract.adopt(u);
      }
    } else {
      return;
    }

    this.extract();
  }
}
