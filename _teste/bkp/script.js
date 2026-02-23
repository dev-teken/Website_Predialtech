// =========================================
// PREDIALTECH – script.js (VERSÃO SIMPLIFICADA E CORRIGIDA)
// =========================================

// AGUARDAR CARREGAMENTO COMPLETO DA PÁGINA
window.addEventListener('load', function() {
  console.log('🚀 Página carregada - Iniciando scripts');
  
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

  // ===== SUBMENU - VERSÃO SIMPLIFICADA =====
  const navItem = document.querySelector('.nav__item--has-submenu');
  const submenu = navItem?.querySelector('.submenu');
  
  if (!navItem || !submenu) {
    console.log('❌ Submenu não encontrado');
    return;
  }

  console.log('✅ Submenu encontrado');

  // CRIAR OVERLAY
  let overlay = document.querySelector('.submenu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'submenu-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 80px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 998;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      pointer-events: none;
      display: block;
    `;
    document.body.appendChild(overlay);
    console.log('✅ Overlay criado');
  }

  // CONTROLE DO SUBMENU
  let closeTimer = null;

  function abrir() {
    console.log('🔓 Abrindo submenu');
    clearTimeout(closeTimer);
    navItem.classList.add('submenu-open');
    document.body.classList.add('submenu-open');
    submenu.removeAttribute('aria-hidden');
    
    // Forçar estilo do overlay
    if (overlay) {
      overlay.style.opacity = '1';
    }
  }

  function fechar() {
    console.log('🔒 Fechando submenu');
    closeTimer = setTimeout(() => {
      navItem.classList.remove('submenu-open');
      document.body.classList.remove('submenu-open');
      submenu.setAttribute('aria-hidden', 'true');
      
      // Forçar estilo do overlay
      if (overlay) {
        overlay.style.opacity = '0';
      }
    }, 400);
  }

  navItem.addEventListener('mouseenter', abrir);
  navItem.addEventListener('mouseleave', fechar);
  submenu.addEventListener('mouseenter', abrir);
  submenu.addEventListener('mouseleave', fechar);

  // ===== TRIÂNGULO =====
  function alinharTriangulo() {
    const path = document.getElementById('submenu-bg-path');
    if (!path) return;
    
    const link = navItem.querySelector('.nav__link');
    if (!link) return;
    
    const linkRect = link.getBoundingClientRect();
    const cx = Math.round(635 - (window.innerWidth - (linkRect.left + linkRect.width / 2)));
    const r = 20;
    
    const minCx = r + 10;
    const maxCx = 635 - r - 10;
    const adjustedCx = Math.max(minCx, Math.min(maxCx, cx));
    
    path.setAttribute('d', `M${adjustedCx + r} 19H635V341H0V19H${adjustedCx - r}L${adjustedCx} 0L${adjustedCx + r} 19Z`);
    console.log('📐 Triângulo ajustado');
  }
  
  alinharTriangulo();
  window.addEventListener('resize', alinharTriangulo);

  // ===== PREVIEW DAS IMAGENS =====
  const preview = submenu.querySelector('.submenu__preview');
  const items = Array.from(submenu.querySelectorAll('.submenu__item[data-img]'));
  
  if (preview && items.length > 0) {
    console.log('🖼️ Preview configurado com', items.length, 'itens');
    
    // Filtrar itens válidos
    const validItems = items.filter(item => {
      const img = item.dataset.img;
      return img && img.trim() !== '';
    });
    
    if (validItems.length > 0) {
      const firstImg = validItems[0].dataset.img;
      
      // Forçar primeira imagem
      preview.style.backgroundImage = `url('${firstImg}')`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
      preview.style.backgroundRepeat = 'no-repeat';
      console.log('🎨 Primeira imagem:', firstImg);
      
      // Eventos hover
      validItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const imgUrl = item.dataset.img;
          preview.style.backgroundImage = `url('${imgUrl}')`;
          console.log('🖱️ Hover:', imgUrl);
        });
      });
      
      // Reset ao sair
      navItem.addEventListener('mouseleave', () => {
        preview.style.backgroundImage = `url('${firstImg}')`;
      });
    }
  } else {
    console.warn('⚠️ Preview ou items não encontrados');
  }

  // HEADER SCROLL SHADOW
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (header) {
      header.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.5)' : 'none';
    }
  }, { passive: true });
  
  console.log('✅ Todos scripts carregados');
});