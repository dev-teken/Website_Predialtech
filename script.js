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

// =========================================
// SEGMENTOS — cascade scroll animation (mobile only)
// =========================================
(function () {
  function initCascade() {
    const cards = document.querySelectorAll('.segment-card');
    if (!cards.length) return;

    if (window.innerWidth > 768) {
      // Desktop/tablet: garante visibilidade sem animação
      cards.forEach(c => {
        c.style.opacity = '';
        c.style.transform = '';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card  = entry.target;
          const index = parseInt(card.dataset.cascadeIndex || 0);
          setTimeout(() => {
            card.classList.add('is-visible');
          }, index * 80); // 60ms entre cada item = cascata rápida
          observer.unobserve(card);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    });

    cards.forEach((card, i) => {
      card.dataset.cascadeIndex = i;
      card.classList.remove('is-visible');
      observer.observe(card);
    });
  }

  document.addEventListener('DOMContentLoaded', initCascade);
  window.addEventListener('resize', initCascade, { passive: true });
})();
// =========================================
(function () {
  const slider = document.getElementById('clientsSlider');
  if (!slider) return;

  // Só ativa em mobile
  function isMobile() { return window.innerWidth <= 768; }

  const track  = document.getElementById('clientsSlidesTrack');
  const dots   = document.querySelectorAll('.clients__dot');
  const TOTAL  = 2;       // número de slides
  const DELAY  = 4000;    // ms entre slides automáticos

  let current    = 0;
  let autoTimer  = null;
  let touchStartX = 0;
  let touchEndX   = 0;
  let active     = false;

  function goTo(index) {
    current = (index + TOTAL) % TOTAL;
    track.style.transform = `translateX(-${current * 50}%)`;
    dots.forEach((d, i) => d.classList.toggle('clients__dot--active', i === current));
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    if (!active) return;
    stopAuto();
    autoTimer = setInterval(next, DELAY);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function init() {
    if (isMobile()) {
      active = true;
      goTo(0);
      startAuto();
    } else {
      active = false;
      stopAuto();
    }
  }

  // Dots clicáveis
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto(); // reinicia timer
    });
  });

  // Swipe touch
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    stopAuto();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) { // threshold 40px
      diff > 0 ? next() : goTo(current - 1);
    }
    startAuto();
  }, { passive: true });

  // Pausa ao hover (desktop não ativa, mas por segurança)
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // Init e resize
  init();
  window.addEventListener('resize', init, { passive: true });
})();
// =========================================
// HERO TEXT — versão curta no mobile
// =========================================
(function () {
  function applyMobileText() {
    const p = document.querySelector('.hero__text[data-mobile-text]');
    if (!p) return;
    if (window.innerWidth <= 768) {
      p.textContent = p.dataset.mobileText;
    } else {
      // Restaura texto completo se redimensionar pra desktop
      if (p._fullText) p.textContent = p._fullText;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const p = document.querySelector('.hero__text[data-mobile-text]');
    if (p) p._fullText = p.textContent.trim();
    applyMobileText();
  });

  window.addEventListener('resize', applyMobileText, { passive: true });
})();