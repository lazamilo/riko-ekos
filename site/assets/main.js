(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  if (!hasGsap) document.documentElement.classList.add('no-js');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* Reference logos marquee */
  const logos = Array.from({ length: 32 }, (_, i) => `assets/orig/riko-ekos-reference__${String(i + 1).padStart(2, '0')}.jpg`);
  document.querySelectorAll('.marquee').forEach((m, idx) => {
    const set = idx === 0 ? logos.slice(0, 16) : logos.slice(16);
    const html = set.map(src => `<span><img src="${src}" alt="" loading="lazy"></span>`).join('');
    const track = m.querySelector('.marquee-track');
    track.innerHTML = html + html;
    if (reduce || !hasGsap) return;
    const dir = m.classList.contains('reverse') ? 1 : -1;
    const tween = gsap.fromTo(track, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, duration: 60, ease: 'none', repeat: -1 });
    m.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0.15, duration: 0.6 }));
    m.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
  });


  /* Statement: split into words for scroll fill */
  const st = document.querySelector('[data-fill]');
  if (st) st.innerHTML = st.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');

  /* Nav: solid + hide on scroll, mega menu, mobile menu */
  const nav = document.getElementById('nav');
  const megaBtn = document.querySelector('.has-mega');
  const mega = document.getElementById('mega');
  const setMega = open => { mega.classList.toggle('is-open', open); megaBtn.setAttribute('aria-expanded', open); if (open) nav.classList.add('is-solid'); else onScroll(); };
  megaBtn.addEventListener('click', () => setMega(!mega.classList.contains('is-open')));
  megaBtn.addEventListener('mouseenter', () => setMega(true));
  nav.addEventListener('mouseleave', () => setMega(false));
  mega.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMega(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMega(false); });

  const burger = document.querySelector('.burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  let lastY = 0;
  function onScroll(y = window.scrollY) {
    const megaOpen = mega.classList.contains('is-open');
    nav.classList.toggle('is-solid', y > 60 || megaOpen);
    nav.classList.toggle('is-hidden', y > lastY && y > 500 && !megaOpen && !document.body.classList.contains('menu-open'));
    lastY = y;
  }

  /* Smooth scroll */
  let lenis = null;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', e => { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener('scroll', () => onScroll(), { passive: true });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); return; }
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: id === '#top' ? 0 : -60 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  if (!hasGsap) return;

  /* Loader + hero intro */
  const intro = gsap.timeline();
  if (reduce) {
    gsap.set('.loader', { display: 'none' });
  } else {
    intro.to('.loader img', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('.loader-bar i', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.3')
      .to('.loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.1')
      .set('.loader', { display: 'none' })
      .to('.hero-media img', { scale: 1, duration: 2.2, ease: 'power3.out' }, '-=0.7')
      .from('.hero-title .line>span', { yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, '-=2.0')
      .from('.hero-bottom > *, .hero-facts li', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.8')
      .from('.nav > *:not(.mega)', { y: -20, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, '<');
  }

  if (reduce) return;

  /* Hero parallax */
  gsap.to('.hero-media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-content', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });

  /* Statement fill */
  const words = gsap.utils.toArray('.statement-text .w');
  ScrollTrigger.create({
    trigger: '.statement', start: 'top 75%', end: 'bottom 55%', scrub: true,
    onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); }
  });

  /* Section heads reveal */
  gsap.utils.toArray('.h2, .section-lead, .numbers-intro, .contact-title').forEach(el => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* Product cards */
  gsap.from('.product', { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.product-grid', start: 'top 82%' } });

  /* Material mini parallax inside frames */
  gsap.utils.toArray('.material-img img').forEach(img => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.material', { y: 70, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.material-grid', start: 'top 82%' } });

  /* Numbers */
  gsap.fromTo('.numbers-img img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.numbers', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('[data-count]').forEach(el => {
    const end = +el.dataset.count; const start = end > 1000 ? end - 40 : 0; const o = { v: start };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' }, onUpdate: () => el.textContent = Math.round(o.v) });
  });
  gsap.from('.num', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.numbers-list', start: 'top 70%' } });

  /* Process: conveyor line fills with scroll */
  const mm = gsap.matchMedia();
  const flowLis = gsap.utils.toArray('.flow-steps li');
  const segs = flowLis.map(li => li.querySelector('.seg i'));
  const nSeg = flowLis.length - 1;
  ScrollTrigger.create({
    trigger: '.flow-steps', start: 'top 80%', end: () => window.innerWidth <= 640 ? 'bottom 60%' : 'top 20%', invalidateOnRefresh: true, scrub: 0.4,
    onUpdate: self => {
      const p = self.progress * nSeg;
      segs.forEach((sg, k) => sg.style.setProperty('--f', Math.max(0, Math.min(1, p - k)).toFixed(3)));
      flowLis.forEach((li, k) => li.classList.toggle('on', p >= k - 0.02 && self.progress > 0));
    }
  });
  gsap.from('.flow-steps li > :not(.seg):not(.dot)', { y: 30, opacity: 0, duration: 0.9, stagger: 0.03, ease: 'power3.out', scrollTrigger: { trigger: '.flow-steps', start: 'top 80%' } });

  /* Advantages list */
  gsap.utils.toArray('.adv-list li').forEach(li => gsap.from(li, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 88%' } }));

  /* History: pinned era slideshow (desktop) */
  const histItems = gsap.utils.toArray('.hist-item');
  const yTrack = document.querySelector('.hist-years-track');
  yTrack.innerHTML = histItems.map(it => `<span>${it.dataset.year}</span>`).join('');
  const ySpans = [...yTrack.children];
  let histIdx = -1;
  const setHist = i => {
    if (i === histIdx) return; histIdx = i;
    histItems.forEach((it, k) => it.classList.toggle('on', k === i));
    ySpans.forEach((sp, k) => sp.classList.toggle('on', k === i));
    yTrack.style.transform = `translateY(${-ySpans[i].offsetTop}px)`;
  };
  setHist(0);
  mm.add('(min-width: 1025px)', () => {
    const n = histItems.length;
    const st = ScrollTrigger.create({
      trigger: '.hist-pin', start: 'top top', end: () => '+=' + window.innerHeight * 0.75 * n, pin: true,
      onUpdate: self => { setHist(Math.min(n - 1, Math.floor(self.progress * n * 0.999))); gsap.set('.hist-line i', { scaleX: self.progress }); }
    });
    ySpans.forEach((sp, k) => sp.addEventListener('click', () => {
      const y = st.start + (st.end - st.start) * ((k + 0.5) / n);
      lenis ? lenis.scrollTo(y) : window.scrollTo(0, y);
    }));
    gsap.from('.hist-heading', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.history', start: 'top 70%' } });
    return () => st.kill();
  });
  mm.add('(max-width: 1024px)', () => {
    histItems.forEach(it => gsap.from(it, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: it, start: 'top 88%' } }));
  });

  /* News */
  gsap.from('.news-item', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.news-list', start: 'top 82%' } });

  /* Contact background parallax */
  gsap.fromTo('.contact-media img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
