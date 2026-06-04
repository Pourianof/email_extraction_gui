import i18next from 'i18next';
import { sampleHints } from './sampleHints';

function renderSingleHint(name, data) {
  const t = i18next.t(data.translation, {
    returnObjects: true,
    lng: i18next.language,
  });

  const html = `
    <section class="sample-hint hidden" data-name="${name}">

      <div class="--svu-title--">
        ${t.title}
      </div>

      <div class="sample-valid-url --svu-book--">
        <div class="--svu-url--">
          ${data.urlParts
            .map((part) => {
              if (!part.type) {
                return part.value;
              }

              return `
                <span
                  class="--svu-${part.type}-- --svu-part--"
                >
                  ${part.value}
                </span>
              `;
            })
            .join('')}

        </div>
      </div>

      <div class="--svu-more-info--">
        ${t.items
          .map(
            (item) => `
              <div class="--svu-info-item--">
                ${item}
              </div>
            `,
          )
          .join('')}

        ${
          t.hint
            ? `
              <div class="--svu-hint--">
                ${t.hint}
              </div>
            `
            : ''
        }

      </div>

    </section>
  `;

  document.getElementById('sample-hint-container').innerHTML += html;
}

export function renderHints() {
  i18next.on('languageChanged', render);
  render();
}

function render() {
  for (const [key, val] of Object.entries(sampleHints)) {
    if (!val) continue;

    renderSingleHint(key, val);
  }
}
