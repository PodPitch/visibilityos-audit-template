'use strict';

const choices = [...document.querySelectorAll('.choices button')];

for (const button of choices) {
  button.addEventListener('click', () => {
    for (const choice of choices) {
      const selected = choice === button;
      choice.setAttribute('aria-pressed', String(selected));
      document.getElementById(choice.getAttribute('aria-controls')).hidden = !selected;
    }
  });
}
