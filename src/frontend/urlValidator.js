import { replaceAll } from '../shared/replaceAll';

/**
 * @param {string} url
 * @param {string} hostDomain
 */
function testHost(url, hostDomain) {
  const { hostname } = new URL(url);
  const host = replaceAll(hostDomain, '.', '\\.');
  return new RegExp(`^(www\\.)?${host}$`, 'g').test(hostname);
}

/** @param {string} url */
export function isSpringer(url) {
  return testHost(url, '(link.)?springer.com');
}
/** @param {string} url */
export function isSpringerIssue(url) {
  const { pathname } = new URL(url);
  return (
    /^\/?journal/g.test(pathname) &&
    /volumes-and-issues\/\d+-\d+$/g.test(pathname)
  );
}
/** @param {string} url */
export function isSpringerArticles(url) {
  const { pathname } = new URL(url);
  return isSpringer(url) && /^\/?journal\/[\d\w]+\/articles/g.test(pathname);
}
/** @param {string} url */
export function isSpringerMainPage(url) {
  const { pathname } = new URL(url);
  return isSpringer(url) && /^\/?journal\/[\d\w]+/g.test(pathname);
}

/** @param {string} url */
export function isElsevier(url) {
  return testHost(url, 'sciencedirect.com');
}
/** @param {string} url */
export function isElsevierIssue(url) {
  const { pathname } = new URL(url);
  return (
    isElsevier(url) &&
    ((/^\/journal\//g.test(pathname) &&
      /vol\/\d+(\/issue\/\d+)?(\/suppl\/\w)?\/?$/g.test(pathname)) ||
      /^\/?book\/\d+\/?([\w\d-]+)?\/?$/g.test(pathname))
  );
}

/** @param {string} url */

export function isWiley(url) {
  return testHost(url, 'onlinelibrary.wiley.com');
}
/** @param {string} url */
export function isWileyVolume(url) {
  const { pathname } = new URL(url);
  return isWiley(url) && /^\/?loi\/[\d\w]+(\/year\/\d+)?/g.test(pathname);
}
/** @param {string} url */
export function isWileyIssue(url) {
  const { pathname } = new URL(url);
  return isWiley(url) && /^\/?toc\/[\d\w]+\/(\d+\/)?\d+\/\d+/g.test(pathname);
}
/** @param {string} url */
export function isWileyMainPage(url) {
  const { pathname } = new URL(url);
  return isWiley(url) && /^\/?journal\/[\w\d]+\/?$/g.test(pathname);
}
/** @param {string} url */
export function isWileyArticles(url) {
  const { pathname } = new URL(url);
  return isWiley(url) && /^\/?index\/[\d\w]+\/?$/g.test(pathname);
}
