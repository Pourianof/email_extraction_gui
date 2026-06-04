import { textEnrich } from '../helpers/enrichText';
import { VALID_URLS } from './validPublisherUrlls';

const helperContainer = document.getElementById('url-valid-address-help');

export function renderPublisherUrlHelper() {
  for (const validPub of VALID_URLS) {
    renderSingle(validPub);
  }
}

/**
 *
 * @param {typeof import('./validPublisherUrlls').VALID_URLS[number]} data
 */
function renderSingle(data) {
  const html = `
        <div class="extracter-url-help">
            <span class="extracter-name">${textEnrich(data.publisherName)}</span>
            ${data.valids.map(
              (v) => `
                    <span
                        data-sample-id="${v.id}"
                        sample-btn
                        class="en-in-fa btn"
                    >
                        ${v.name}
                    </span>
                `,
            )}
        </div>
    `;

  helperContainer.innerHTML += html;
}
