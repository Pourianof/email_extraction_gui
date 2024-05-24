import { NewDataNotifier } from './helpers/excelAPI';
import Author from './models/author';

export class AuthorsProgressStateNotifier {
  constructor(
    private progressUpdateHandler: (state: {
      newAuthorData: Author;
      totalAuthorRecieved: number;
    }) => any,
    private lasProvider?: NewDataNotifier
  ) {}

  private catchedDataCounter = 0;
  setProvider(provider: NewDataNotifier) {
    this.lasProvider = provider;
    this.lasProvider.onNewAuthor(this.onNewAuthor);
  }

  private onNewAuthor = (data: Author) => {
    this.progressUpdateHandler({
      newAuthorData: data,
      totalAuthorRecieved: ++this.catchedDataCounter,
    });
  };
}
