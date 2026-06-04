/**
 * @type {{
 * publisherName: string,
 * valids: { name: string, id: string }[],
 * }[]
 * }
 */
export const VALID_URLS = [
  {
    publisherName: 'Elsevier',
    valids: [
      { name: 'Volume', id: 'elsevier-volume' },
      { name: 'Book', id: 'elsevier-book' },
    ],
  },
  {
    publisherName: 'Springer',
    valids: [
      { name: 'Issue', id: 'springer-issue' },
      { name: 'Volume', id: 'springer-volume' },
      { name: 'Article', id: 'springer-articles' },
    ],
  },
  {
    publisherName: 'John Wiley',
    valids: [
      { name: 'Volume', id: 'wiley-volume' },
      { name: 'Issue', id: 'wiley-issue' },
      { name: 'Article', id: 'wiley-articles' },
    ],
  },
  {
    publisherName: 'World Scientific',
    valids: [
      { name: 'Issue', id: 'ws-issue' },
      { name: 'Journal Main Page', id: 'ws-main-page' },
    ],
  },
  {
    publisherName: 'Taylor & Francis',
    valids: [{ name: 'Issue', id: 'tf-issue' }],
  },
];
