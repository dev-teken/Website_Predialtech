// =========================================
// PREDIALTECH – script.js
// =========================================

// ---- Mobile Nav Toggle ----
const toggle = document.getElementById('nav-toggle');
const nav    = document.getElementById('main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Fechar ao clicar em um link
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Fechar ao clicar fora do menu (mobile)
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    const target = e.target;
    if (!nav.contains(target) && !toggle.contains(target)) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
}

// ---- Submenu preview swap (desktop) ----
document.addEventListener('DOMContentLoaded', () => {
  const submenuItems = document.querySelectorAll('.submenu__item');
  const preview = document.querySelector('.submenu__preview');
  const parent = document.querySelector('.nav__item--has-submenu');

  if (!submenuItems.length || !preview || !parent) return;

  // set initial preview (first item)
  const firstImg = submenuItems[0].dataset.img;
  if (firstImg) preview.style.backgroundImage = `url('${firstImg}')`;

  submenuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const img = item.dataset.img;
      if (img) preview.style.backgroundImage = `url('${img}')`;
    });
    // keyboard accessibility
    item.addEventListener('focusin', () => {
      const img = item.dataset.img;
      if (img) preview.style.backgroundImage = `url('${img}')`;
    });
  });

  // When submenu closes, reset preview to first image
  parent.addEventListener('mouseleave', () => {
    if (firstImg) preview.style.backgroundImage = `url('${firstImg}')`;
  });
});

// ---- Align submenu right edge to the 'FALE CONOSCO' link ----
function alignSubmenuToFale() {
  const submenu = document.querySelector('.nav__item--has-submenu .submenu');
  const lastLink = document.querySelector('.nav__list li:last-child a');
  
  if (!submenu || !lastLink) return;

  // Garantir que o submenu tenha largura definida para o cálculo
  const submenuWidth = submenu.offsetWidth || 760;
  const viewportWidth = window.innerWidth;
  
  // Posição do link "FALE CONOSCO" em relação à viewport
  const lastLinkRect = lastLink.getBoundingClientRect();
  
  // A posição DIREITA do link "FALE CONOSCO"
  const lastLinkRight = lastLinkRect.right;
  
  // Calcular a posição left necessária para que o right do submenu
  // se alinhe EXATAMENTE com o right do link "FALE CONOSCO"
  // left = right do link - largura do submenu
  let leftPosition = lastLinkRight - submenuWidth;
  
  // Garantir que não ultrapasse a borda esquerda da tela (com margem de segurança)
  leftPosition = Math.max(20, leftPosition);
  
  // Garantir que não ultrapasse a borda direita da tela (com margem de segurança)
  const maxLeft = viewportWidth - submenuWidth - 20;
  if (leftPosition > maxLeft) {
    leftPosition = maxLeft;
  }
  
  // Aplicar o posicionamento
  submenu.style.left = `${leftPosition}px`;
  submenu.style.right = 'auto';
}

// Executar após carregar tudo
window.addEventListener('load', alignSubmenuToFale);

// Executar também após um pequeno delay para garantir que tudo carregou
setTimeout(alignSubmenuToFale, 100);
setTimeout(alignSubmenuToFale, 500); // Segundo delay para garantir

// Executar no redimensionamento com debounce
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(alignSubmenuToFale, 100);
});

// Observar mudanças no DOM que possam afetar o posicionamento
const observer = new MutationObserver(alignSubmenuToFale);
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class']
});

// ---- Header scroll shadow ----
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) {
    header.style.boxShadow = window.scrollY > 20
      ? '0 2px 20px rgba(0,0,0,0.5)'
      : 'none';
  }
});