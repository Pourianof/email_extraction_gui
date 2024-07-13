export function backURLFormToInitialState() {
  const journalForm = document.forms['journal-form'];
  const extractBtn =
    journalForm.previousElementSibling.previousElementSibling.lastElementChild;

  journalForm.replaceChildren([]);
  const extractOptionsForm = extractBtn.previousElementSibling;

  extractOptionsForm['only-email'].checked = false;
  extractOptionsForm['only-main'].checked = false;
  extractOptionsForm['author-count'].value = '';
}
