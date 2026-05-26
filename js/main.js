/* ============================================================
   PAWS & PLAY — PREMIUM JS v4
   Loader | Cursor | Navbar | Reveal | Counter | Gallery
   Mobile Menu | Form | Tilt | Parallax | Back-to-Top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PAGE LOADER ─────────────────────────── */
  const loader = document.getElementById('loader');
  const hideLoader = () => loader?.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(hideLoader, 1600));
  setTimeout(hideLoader, 3500); // hard fallback

  /* ── CUSTOM CURSOR (desktop only) ────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasHover && cursor && follower) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const animateCursor = () => {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    const magnetEls = document.querySelectorAll('a, button, .svc-card, .gal-item, .breed-chip, .trust-item');
    magnetEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        follower.style.width = '48px'; follower.style.height = '48px';
        follower.style.borderColor = 'rgba(232,25,125,0.7)';
      });
      el.addEventListener('mouseleave', () => {
        follower.style.width = '30px'; follower.style.height = '30px';
        follower.style.borderColor = 'rgba(232,25,125,0.45)';
      });
    });
  }

  /* ── NAVBAR SCROLL ───────────────────────── */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Scrolled class
    navbar?.classList.toggle('scrolled', scrollY > 50);

    // Back to top visibility
    backTop?.classList.toggle('visible', scrollY > 400);

    // Navbar hide on scroll down (mobile UX)
    if (window.innerWidth < 768) {
      if (scrollY > lastScroll && scrollY > 120) {
        navbar?.classList.add('nav-hidden');
      } else {
        navbar?.classList.remove('nav-hidden');
      }
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Back to top click
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── MOBILE MENU ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  const openMenu = () => {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ── SCROLL REVEAL ───────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--sd') || 0) * 1000;
      const siblings = [...(el.parentElement?.children || [])].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      setTimeout(() => el.classList.add('visible'), delay + idx * 75);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── ANIMATED COUNTERS ───────────────────── */
  const countEls = document.querySelectorAll('.count');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === 'true';
      const duration = 2200;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = isDecimal ? (val / 10).toFixed(1) : Math.floor(val).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => counterObs.observe(el));

  /* ── GALLERY SLIDER ──────────────────────── */
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galPrev');
  const nextBtn = document.getElementById('galNext');
  const dotsWrap = document.getElementById('galDots');

  if (track) {
    const items = [...track.querySelectorAll('.gal-item')];
    const ITEM_W = 313; // 295 width + 18 gap
    let cur = 0;
    let autoTimer;

    // Create dots
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gal-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap?.appendChild(dot);
    });

    const updateDots = () => {
      dotsWrap?.querySelectorAll('.gal-dot').forEach((d, i) => {
        d.classList.toggle('active', i === cur);
        d.setAttribute('aria-selected', i === cur);
      });
    };

    const goTo = (idx) => {
      cur = Math.max(0, Math.min(idx, items.length - 1));
      track.scrollTo({ left: cur * ITEM_W, behavior: 'smooth' });
      updateDots();
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo((cur + 1) % items.length), 4000);
    };
    const stopAuto = () => clearInterval(autoTimer);

    prevBtn?.addEventListener('click', () => { goTo(cur - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(cur + 1); startAuto(); });
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(cur + 1) : goTo(cur - 1); }
    }, { passive: true });

    // Sync dots on manual scroll
    track.addEventListener('scroll', () => {
      cur = Math.round(track.scrollLeft / ITEM_W);
      updateDots();
    }, { passive: true });

    startAuto();
  }

  /* ── SERVICE CARD 3D TILT ────────────────── */
  if (hasHover) {
    document.querySelectorAll('.svc-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
        card.style.transform = `translateY(-10px) perspective(900px) rotateX(${-y}deg) rotateY(${x}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── PAWS PARALLAX ───────────────────────── */
  if (hasHover) {
    const paws = document.querySelectorAll('.paw');
    document.addEventListener('mousemove', e => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 30;
      const cy = (e.clientY / window.innerHeight - 0.5) * 30;
      paws.forEach((p, i) => {
        const f = (i + 1) * 0.3;
        p.style.transform = `translate(${cx * f}px, ${cy * f}px)`;
      });
    }, { passive: true });
  }

  /* ── CONTACT FORM ────────────────────────── */
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate API — replace with real endpoint
    setTimeout(() => {
      successEl.style.display = 'flex';
      successEl.style.alignItems = 'center';
      successEl.style.gap = '8px';
      form.reset();
      btn.innerHTML = originalText;
      btn.disabled = false;
      setTimeout(() => { successEl.style.display = 'none'; }, 6000);
    }, 1400);
  });

  /* ── ACTIVE NAV HIGHLIGHT ────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => highlightObs.observe(s));

  /* ── SMOOTH ANCHOR SCROLLING ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

});

/* ── TOUCH CURSOR — Mobile circle on touch ────── */
const touchCursor = document.getElementById('touchCursor');

if (touchCursor && window.matchMedia('(hover: none)').matches) {

  // Show circle where finger touches
  document.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchCursor.style.left = touch.clientX + 'px';
    touchCursor.style.top  = touch.clientY + 'px';
    touchCursor.classList.remove('tap');
    touchCursor.classList.add('active');
  }, { passive: true });

  // Move circle with finger
  document.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    touchCursor.style.left = touch.clientX + 'px';
    touchCursor.style.top  = touch.clientY + 'px';
  }, { passive: true });

  // Burst effect on lift
  document.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    touchCursor.style.left = touch.clientX + 'px';
    touchCursor.style.top  = touch.clientY + 'px';
    touchCursor.classList.remove('active');
    touchCursor.classList.add('tap');
    setTimeout(() => touchCursor.classList.remove('tap'), 400);
  }, { passive: true });
}
