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

// SUBMENU
document.addEventListener('DOMContentLoaded', () => {
  const navItem = document.querySelector('.nav__item--has-submenu');
  const submenu = navItem?.querySelector('.submenu');
  if (!navItem || !submenu) return;

  const overlay = document.createElement('div');
  overlay.className = 'submenu-overlay';
  document.body.appendChild(overlay);

  let closeTimer   = null;
  let overlayTimer = null;

  function abrir() {
    clearTimeout(closeTimer);
    clearTimeout(overlayTimer);
    navItem.classList.add('submenu-open');
    document.body.classList.add('submenu-open');
  }

  function fechar() {
    closeTimer = setTimeout(() => {
      navItem.classList.remove('submenu-open');
      currentImg = firstImg;
      overlayTimer = setTimeout(() => {
        document.body.classList.remove('submenu-open');
      }, 120);
    }, 100);
  }

  navItem.addEventListener('mouseenter', abrir);
  navItem.addEventListener('mouseleave', fechar);
  submenu.addEventListener('mouseenter', abrir);
  submenu.addEventListener('mouseleave', fechar);

  // Preview swap
  const items    = navItem.querySelectorAll('.submenu__item');
  const preview  = navItem.querySelector('.submenu__preview');
  const firstImg = items[0]?.dataset.img;
  let currentImg = firstImg;
  let animFrame  = null;

  const SHADOW   = 'drop-shadow(0px 4px 12px #131313)';
  const DURATION = 6400;  // ms
  const BLUR_MAX = 2;    // px

  // expoente 8 = começa muito rápido, termina muito devagar
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 8);
  }

  if (preview && firstImg) {
    preview.style.backgroundImage = `url('${firstImg}')`;
    preview.style.filter = `grayscale(0) blur(0px) ${SHADOW}`;
  }

  function swapPreview(img) {
    if (!preview || !img || img === currentImg) return;
    currentImg = img;

    if (animFrame) cancelAnimationFrame(animFrame);

    preview.style.transition = 'none';
    preview.style.filter     = `grayscale(1) blur(${BLUR_MAX}px) ${SHADOW}`;

    setTimeout(() => {
      preview.style.backgroundImage = `url('${img}')`;

      const start = performance.now();

      function animate(now) {
        const t     = Math.min((now - start) / DURATION, 1);
        const eased = easeOut(t);
        const gray  = (1 - eased).toFixed(3);
        const blur  = (BLUR_MAX * (1 - eased)).toFixed(2);
        preview.style.filter = `grayscale(${gray}) blur(${blur}px) ${SHADOW}`;
        if (t < 1) {
          animFrame = requestAnimationFrame(animate);
        } else {
          preview.style.filter = `grayscale(0) blur(0px) ${SHADOW}`;
        }
      }

      animFrame = requestAnimationFrame(animate);
    }, 50);
  }

  items.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('mouseenter', () => swapPreview(item.dataset.img));
    }
  });

  navItem.addEventListener('mouseleave', () => swapPreview(firstImg));
});

// HEADER SCROLL SHADOW
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) header.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.5)' : 'none';
}, { passive: true });