'use strict';
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.dataset.open = 'false';
  menuButton.querySelector('span').textContent = 'Menú';
}

if (menuButton && navigation) {
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
    menuButton.querySelector('span').textContent = open ? 'Cerrar' : 'Menú';
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
}

const filterGroup = document.querySelector('.filters');
if (filterGroup) {
  filterGroup.hidden = false;
  const buttons = [...filterGroup.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.archive .post-card')];
  const counter = document.querySelector('#results-count');
  const allowed = buttons.map((button) => button.dataset.filter);

  function applyFilter(category) {
    const selected = allowed.includes(category) ? category : 'todos';
    let count = 0;
    cards.forEach((card) => {
      card.hidden = selected !== 'todos' && card.dataset.category !== selected;
      if (!card.hidden) count++;
    });
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === selected));
    });
    counter.textContent = `${count} ${count === 1 ? 'publicación' : 'publicaciones'}`;
  }

  applyFilter(new URLSearchParams(location.search).get('categoria'));
  buttons.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    const url = new URL(location.href);
    if (category === 'todos') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', category);
    history.replaceState(null, '', url);
    applyFilter(category);
  }));
}
