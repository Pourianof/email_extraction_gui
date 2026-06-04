import { renderPublisherUrlHelper } from './addressHelpers/renderPublisherUrlHelper';
import { renderHints } from './addressHints/renderHints';

export function dynamicRender() {
  renderHints();
  renderPublisherUrlHelper();
}
