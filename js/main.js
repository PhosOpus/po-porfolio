/* ============================================================
   PHOS OPUS — main.js
   ============================================================ */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1800);
});

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
});

// Ring lags behind for smooth feel
(function animateRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

// Cursor state on hover
const hoverTargets = 'a, button, .tab, .work-card, .service-card';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ── SCROLL-SPY NAV ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ── MOBILE NAV ── */
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  toggle.setAttribute('aria-expanded', isOpen);
});
// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── PORTFOLIO FILTER ── */
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.work-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    cards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      if (show) {
        card.classList.remove('hidden');
        // Stagger re-reveal
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── PARALLAX on hero bg reel ── */
const reelStrips = document.querySelectorAll('.reel-strip');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  reelStrips.forEach((strip, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    strip.style.transform = `translateY(${y * 0.12 * dir}px)`;
  });
}, { passive: true });

/* ── TEXT SCRAMBLE on hero title hover ── */
const heroTitle = document.querySelector('.hero-title');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&';

function scramble(el, original, steps = 8, interval = 40) {
  let count = 0;
  const id = setInterval(() => {
    el.textContent = original.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (count / steps > i / original.length) return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (++count > steps + original.length) {
      el.textContent = original;
      clearInterval(id);
    }
  }, interval);
}

if (heroTitle) {
  heroTitle.addEventListener('mouseenter', () => {
    heroTitle.querySelectorAll('.line').forEach(line => {
      const orig = line.textContent.trim();
      if (orig) scramble(line, orig);
    });
  });
}

/* ── ACTIVE NAV LINK highlight on scroll ── */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--fg)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
