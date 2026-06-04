export const sampleHints = {
  'elsevier-book': {
    translation: 'addressHelper.elsevierBook',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'sciencedirect.com' },
      { type: 'path', value: '/book/9781455728657' },
      { value: '/abeloffs-clinical-oncology' },
    ],
  },
  'elsevier-volume': {
    translation: 'addressHelper.elsevierBook',
    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'sciencedirect.com' },
      { type: 'path', value: '/journal/linear-algebra-and-its-applications' },
      { type: 'path', value: '/vol/699' },
      { value: '/suppl/C' },
    ],
  },
  'springer-issue': {
    translation: 'addressHelper.springerIssue',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'link.springer.com' },
      { type: 'path', value: '/journal/11356' },
      { type: 'path', value: '/volumes-and-issues/31-32' },
    ],
  },
  'springer-articles': {
    translation: 'addressHelper.springerArticles',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'link.springer.com' },
      { type: 'path', value: '/journal/11356' },
      { type: 'path', value: '/volumes-and-issues/31-32' },
    ],
  },
  'wiley-volume': {
    translation: 'addressHelper.wileyVolume',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'onlinelibrary.wiley.com' },
      { type: 'path', value: '/loi/10991506' },
      { type: 'path', value: '/year/2024' },
    ],
  },
  'wiley-issue': {
    translation: 'addressHelper.wileyIssue',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'onlinelibrary.wiley.com' },
      { type: 'path', value: '/toc/10991506 ' },
      { value: '/2024' },
      { type: 'path', value: '/31' },
      { type: 'path', value: '/4' },
    ],
  },
  'wiley-articles': {
    translation: 'addressHelper.wileyArticles',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'onlinelibrary.wiley.com' },
      { type: 'path', value: '/index' },
      { type: 'path', value: '/5708' },
    ],
  },

  'ws-issue': {
    translation: 'addressHelper.wsIssue',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'worldscientific.com' },
      { type: 'path', value: '/toc' },
      { type: 'path', value: '/jaa' },
      { type: 'path', value: '/23' },
      { type: 'path', value: '/07' },
    ],
  },

  'ws-main-page': {
    translation: 'addressHelper.wsMainPage',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'worldscientific.com' },
      { type: 'path', value: '/worldscinet' },
      { type: 'path', value: '/jaa' },
    ],
  },

  'tf-issue': {
    translation: 'addressHelper.tfIssue',

    urlParts: [
      { type: 'protocol', value: 'https://' },
      { value: 'www.' },
      { type: 'domain', value: 'tandfonline.com' },
      { type: 'path', value: '/toc/rrob20' },
      { type: 'path', value: '/11' },
      { type: 'path', value: '/4' },
    ],
  },
};
