import Author from './models/author';

export default interface ExtractionProgressState {
  author: Author;
  totalAuthorRecieved: number;
}
