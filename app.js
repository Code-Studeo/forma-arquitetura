document.documentElement.classList.add('js-enabled');

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function closeMenu(returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mainNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  mainNav.classList.toggle('is-open', opening);
  document.body.classList.toggle('menu-open', opening);
  if (opening) mainNav.querySelector('a').focus();
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.13, rootMargin: '0px 0px -28px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
}

if (!reduceMotion && window.matchMedia('(min-width: 651px)').matches) {
  const heroImage = document.querySelector('[data-parallax]');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      heroImage.style.setProperty('--parallax', `${Math.min(window.scrollY, window.innerHeight) * 0.035}px`);
      ticking = false;
    });
  }, { passive: true });
}

const filters = document.querySelectorAll('.filter-chip');
const projectCards = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => card.classList.toggle('is-hidden', filter !== 'todos' && card.dataset.category !== filter));
}));

const projectDetails = {
  horizonte: {
    category: 'Arquitetura residencial',
    title: 'Residência Horizonte',
    description: 'Residência que aproxima os ambientes da luz natural. Concreto, pedra e madeira organizam a fachada e criam uma transição gradual entre a casa e o jardim.'
  },
  patio: {
    category: 'Casa e paisagem',
    title: 'Casa Pátio',
    description: 'Uma casa pensada em torno do pátio. A área externa prolonga a sala e torna o jardim parte do cotidiano, com materiais naturais e iluminação discreta.'
  },
  loft: {
    category: 'Interiores',
    title: 'Loft Linear',
    description: 'Interiores que usam a escada como eixo de circulação. A luz percorre a altura do ambiente e acompanha a continuidade dos materiais.'
  },
  sala: {
    category: 'Interiores residenciais · recorte da Casa Pátio',
    title: 'Sala e Jardim',
    description: 'Um recorte de interiores da Casa Pátio: madeira, texturas suaves e uma abertura ampla para o verde compõem uma sala feita para o uso diário.'
  },
  comercial: {
    category: 'Interiores comerciais',
    title: 'Interiores comerciais',
    description: 'Um projeto de interiores comerciais que explora planta e materialidade para equilibrar circulação e áreas de permanência. O desenho explora circulação, áreas de permanência e uma paleta tátil.'
  }
};

const projectDialog = document.querySelector('#project-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCategory = document.querySelector('#dialog-category');
const dialogDescription = document.querySelector('#dialog-description');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projectDetails[button.dataset.project];
  if (!project) return;
  dialogCategory.textContent = project.category;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  projectDialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => {
  if (event.target === projectDialog) projectDialog.close();
});

const processSteps = {
  briefing: {
    number: '01', title: 'O começo é entender.',
    body: 'Conversamos sobre rotina, desejos, limites e prioridades. O briefing organiza o que precisa caber no espaço — e o que deve ser sentido nele.',
    note: 'Primeiro, as pessoas. Depois, a planta.'
  },
  leitura: {
    number: '02', title: 'O espaço também fala.',
    body: 'Observamos luz, orientação, circulação, proporções e o que já existe. Essa leitura orienta decisões que respondem ao lugar, em vez de competir com ele.',
    note: 'Reparar antes de propor.'
  },
  estudo: {
    number: '03', title: 'Escolhas com intenção.',
    body: 'Estudamos possibilidades de layout, materiais e atmosfera. Cada escolha é comparada com o uso previsto e com as prioridades combinadas no início.',
    note: 'Menos ruído, mais coerência.'
  },
  desenho: {
    number: '04', title: 'Uma ideia que ganha forma.',
    body: 'O projeto se organiza em desenhos e especificações, tornando as decisões mais fáceis de compreender e avaliar.',
    note: 'Clareza do conceito ao detalhe.'
  }
};
const processTabs = [...document.querySelectorAll('.process-tab')];
const processPanel = document.querySelector('#step-panel');
function selectProcessStep(id, moveFocus = false) {
  const step = processSteps[id];
  if (!step) return;
  processTabs.forEach(tab => {
    const active = tab.dataset.step === id;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && moveFocus) tab.focus();
  });
  processPanel.setAttribute('aria-labelledby', `step-tab-${id}`);
  processPanel.innerHTML = `<span class="process-panel-number">${step.number}</span><h3>${step.title}</h3><p>${step.body}</p><span class="process-panel-note">${step.note}</span>`;
}
processTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProcessStep(tab.dataset.step));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % processTabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + processTabs.length) % processTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = processTabs.length - 1;
    else return;
    event.preventDefault();
    selectProcessStep(processTabs[next].dataset.step, true);
  });
});

const briefingForm = document.querySelector('#brief-form');
briefingForm.addEventListener('submit', event => {
  event.preventDefault();
  const nameInput = briefingForm.elements.name;
  const nameError = document.querySelector('#name-error');
  const result = document.querySelector('#form-result');
  nameError.textContent = nameInput.value.trim().length < 2 ? 'Informe um nome com pelo menos 2 caracteres.' : '';
  result.textContent = '';
  if (!briefingForm.reportValidity() || nameError.textContent) return;
  result.textContent = `Dados revisados, ${nameInput.value.trim()}. O formulário ainda não está conectado; nada foi enviado.`;
  briefingForm.reset();
});
