// =========================================
// PREDIALTECH – script.js
// =========================================

// MOBILE NAV TOGGLE
const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
}

// SUBMENU — hover com delay via JS
document.addEventListener('DOMContentLoaded', () => {
  const navItem = document.querySelector('.nav__item--has-submenu');
  const submenu = navItem?.querySelector('.submenu');
  if (!navItem || !submenu) return;

  // Cria overlay
  const overlay = document.createElement('div');
  overlay.className = 'submenu-overlay';
  document.body.appendChild(overlay);

  let closeTimer = null;

  function abrir() {
    clearTimeout(closeTimer);
    navItem.classList.add('submenu-open');
    document.body.classList.add('submenu-open');
  }

  function fechar() {
    closeTimer = setTimeout(() => {
      navItem.classList.remove('submenu-open');
      document.body.classList.remove('submenu-open');
    }, 400);
  }

  navItem.addEventListener('mouseenter', abrir);
  navItem.addEventListener('mouseleave', fechar);
  submenu.addEventListener('mouseenter', abrir);
  submenu.addEventListener('mouseleave', fechar);

  // Calcula posição X do triângulo para alinhar com o centro do link "Serviços"
  // Usa a posição do link relativa à borda direita da janela (submenu fica right:0)
  function alinharTriangulo() {
    const path = document.getElementById('submenu-bg-path');
    const gradRect = document.getElementById('submenu-grad-rect');
    if (!path) return;

    const linkServicos = navItem.querySelector('.nav__link');
    const linkRect = linkServicos.getBoundingClientRect();

    // Centro do link relativo à borda direita da janela
    const distDireita = window.innerWidth - (linkRect.left + linkRect.width / 2);
    // cx no viewBox (635px wide, right:0)
    const svgW = 635;
    const cx = Math.round(svgW - distDireita);
    const r = 20;

    path.setAttribute('d',
      `M${cx + r} 19H635V341H0V19H${cx - r}L${cx} 0L${cx + r} 19Z`
    );
  }

  window.addEventListener('load', alinharTriangulo);
  window.addEventListener('resize', alinharTriangulo, { passive: true });
});

// SUBMENU PREVIEW SWAP
document.addEventListener('DOMContentLoaded', () => {
  const items   = document.querySelectorAll('.submenu__item');
  const preview = document.querySelector('.submenu__preview');
  const parent  = document.querySelector('.nav__item--has-submenu');
  if (!items.length || !preview || !parent) return;

  const firstImg = items[0]?.dataset.img;
  if (firstImg) preview.style.backgroundImage = `url('${firstImg}')`;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (item.dataset.img) preview.style.backgroundImage = `url('${item.dataset.img}')`;
    });
  });

  parent.addEventListener('mouseleave', () => {
    if (firstImg) preview.style.backgroundImage = `url('${firstImg}')`;
  });
});

// HEADER SCROLL SHADOW
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) header.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.5)' : 'none';
}, { passive: true });