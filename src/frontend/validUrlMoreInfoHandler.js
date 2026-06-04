function handle() {
  const sampleBoxBtn = document.getElementById('close-sample-hints');
  let openedSampleBox;
  sampleBoxBtn.addEventListener('click', (e) => {
    e.preventDefault();

    sampleBoxBtn.parentElement.classList.add('hidden');
  });

  const addressHintsElmnt = document.querySelector('.address-hints');

  addressHintsElmnt.addEventListener('click', (e) => {
    /**@type HTMLElement */
    const target = e.target;

    if (target.attributes && 'sample-btn' in target.attributes) {
      const id = target.dataset.sampleId;
      console.log(
        target,
        target.attributes,
        target.attributes && 'sample-btn' in target.attributes,
        id,
      );
      if (id.trim()) {
        sampleBoxBtn.parentElement.classList.remove('hidden');

        if (openedSampleBox) {
          openedSampleBox.classList.add('hidden');
        }
        openedSampleBox = document.querySelector(
          `.sample-valid-hints section[data-name="${id}"]`,
        );

        console.log(openedSampleBox);

        if (openedSampleBox) {
          openedSampleBox.classList.remove('hidden');
          openedSampleBox.scrollIntoView();
        }
      }
    }
  });
}

handle();
