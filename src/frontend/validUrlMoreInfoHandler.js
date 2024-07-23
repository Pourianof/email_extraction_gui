function handle() {
  const sampleBoxBtn = document.getElementById('close-sample-hints');
  let openedSampleBox;
  sampleBoxBtn.addEventListener('click', (e) => {
    e.preventDefault();

    sampleBoxBtn.parentElement.classList.add('hidden');
  });

  const addressHintsElmnt = document.querySelector('.address-hints');

  addressHintsElmnt.addEventListener('click', (e) => {
    e.preventDefault();

    /**@type HTMLElement */
    const target = e.target;
    if (target.attributes && 'sample-btn' in target.attributes) {
      const id = target.dataset.sampleId;
      if (id.trim()) {
        sampleBoxBtn.parentElement.classList.remove('hidden');
        if (openedSampleBox) {
          openedSampleBox.classList.add('hidden');
        }
        openedSampleBox = document.querySelector(
          `.sample-valid-hints div[data-name="${id}"]`
        );

        if (openedSampleBox) {
          openedSampleBox.classList.remove('hidden');
        }
      }
    }
  });
}

handle();
