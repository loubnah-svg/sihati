/* ════════════════════════════════════════
   SIHATI — JavaScript
   - Language switcher (FR / Darija)
   - Header scroll behavior
   - Reveal animations (IntersectionObserver)
   - Counter animation
   - Form validation
   - Mobile nav
════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────
     1. LANGUAGE SWITCHER
  ──────────────────────────────────── */
  const langSwitch = document.getElementById('langSwitch');
  const langFrLabel = langSwitch?.querySelector('.lang-fr');
  const langArLabel = langSwitch?.querySelector('.lang-ar');
  let currentLang = localStorage.getItem('sihati_lang') || 'fr';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('sihati_lang', lang);

    const body = document.body;
    const frEls = document.querySelectorAll('.fr-text');
    const arEls = document.querySelectorAll('.ar-text');

    if (lang === 'ar') {
      body.classList.add('lang-ar');
      body.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
      frEls.forEach(el => el.style.display = 'none');
      arEls.forEach(el => el.style.display = '');
      langFrLabel?.classList.remove('active');
      langArLabel?.classList.add('active');
    } else {
      body.classList.remove('lang-ar');
      body.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'fr');
      frEls.forEach(el => el.style.display = '');
      arEls.forEach(el => el.style.display = 'none');
      langFrLabel?.classList.add('active');
      langArLabel?.classList.remove('active');
    }
  }

  // Apply saved lang on load
  applyLang(currentLang);

  langSwitch?.addEventListener('click', () => {
    applyLang(currentLang === 'fr' ? 'ar' : 'fr');
  });

  /* ────────────────────────────────────
     2. STICKY HEADER
  ──────────────────────────────────── */
  const header = document.getElementById('mainHeader');

  function updateHeader() {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ────────────────────────────────────
     3. MOBILE NAV
  ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  hamburger?.addEventListener('click', () => {
    const isOpen = mainNav?.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ────────────────────────────────────
     4. REVEAL ANIMATIONS
  ──────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — keep visible once triggered
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ────────────────────────────────────
     5. COUNTER ANIMATION
  ──────────────────────────────────── */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const startVal = 0;

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const target = parseInt(entry.target.dataset.target, 10);
          animateCounter(entry.target, target, 1800);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter').forEach(el => {
    counterObserver.observe(el);
  });

  /* ────────────────────────────────────
     6. FORM VALIDATION & SUBMISSION
  ──────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function showError(inputId, show) {
    const input = document.getElementById(inputId);
    const errorFr = document.getElementById(inputId + 'Error');
    const errorAr = document.getElementById(inputId + 'ErrorAr');

    if (input) input.classList.toggle('error', show);
    if (errorFr) errorFr.classList.toggle('visible', show);
    if (errorAr) errorAr.classList.toggle('visible', show);
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nom = document.getElementById('nom')?.value.trim();
    const tel = document.getElementById('tel')?.value.trim();
    let valid = true;

    // Validate nom
    if (!nom || nom.length < 2) {
      showError('nom', true);
      valid = false;
    } else {
      showError('nom', false);
    }

    // Validate tel
    const telRegex = /^[0-9\s\+\-]{8,}$/;
    if (!tel || !telRegex.test(tel)) {
      showError('tel', true);
      valid = false;
    } else {
      showError('tel', false);
    }

    if (!valid) return;

    // Simulate form submission
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;

    // Show loading state
    const btnText = submitBtn.querySelector('.fr-text') || submitBtn.querySelector('span');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0"/></svg>';

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'flex';
      }
    }, 1200);
  });

  // Add spin keyframe dynamically
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  // Clear errors on input
  ['nom', 'tel'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      showError(id, false);
    });
  });

  /* ────────────────────────────────────
     7. SMOOTH SCROLL FOR NAV LINKS
  ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = header?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ────────────────────────────────────
     8. HERO CARD TILT (desktop only)
  ──────────────────────────────────── */
  const heroVisual = document.querySelector('.hero-card-stack');

  if (heroVisual && window.innerWidth > 1024) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -4}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      heroVisual.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    });

    heroVisual.addEventListener('mouseenter', () => {
      heroVisual.style.transition = 'none';
    });
  }

  /* ────────────────────────────────────
     9. ACTIVE NAV HIGHLIGHT ON SCROLL
  ──────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.style.color = href === '#' + id ? 'var(--blue-light)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

})();
