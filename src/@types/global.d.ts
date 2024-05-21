import ContextApi from '../shared/contextApi';

declare global {
  interface Window {
    context: ContextApi;
  }
}
