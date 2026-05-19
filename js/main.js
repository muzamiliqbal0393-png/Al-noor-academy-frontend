(function(){
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('data-')) node.setAttribute(k, v);
      else if (k in node) node[k] = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  };

  const formatMoney = (n) => `$${Number(n).toFixed(0)}`;

  function starString(rating){
    const full = Math.max(0, Math.round(rating));
    return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5-full);
  }

  function renderCourses(){
    const grid = $('#coursesGrid');
    if(!grid || !window.NOOR_DATA) return;

    const cards = window.NOOR_DATA.courses.map((c) => {
      const card = el('div', { class: 'course-card', role: 'button' });
      card.tabIndex = 0;
      const badge = c.badge ? el('div', { class: 'badge-vip', html: c.badge }) : null;
      const thumb = el('div', { class: 'course-thumb', html: '📘' });
      if(badge) thumb.appendChild(badge);

      const level = el('div', { class: 'course-level', html: c.level });
      const title = el('div', { class: 'course-title', html: c.title });

      const info = el('div', { class: 'course-info' });
      info.appendChild(el('div', { class: 'c-info', html: `⏱ ${c.duration}` }));
      info.appendChild(el('div', { class: 'c-info', html: `👥 ${c.students} students` }));

      const ratingRow = el('div', { class: 'rating-row' });
      ratingRow.appendChild(el('div', { class: 'stars', html: starString(c.rating) }));
      ratingRow.appendChild(el('div', { class: 'rating-num', html: c.rating.toFixed(1) }));
      ratingRow.appendChild(el('div', { class: 'rating-count', html: `(${c.reviews} reviews)` }));

      const body = el('div', { class: 'course-body' }, [level, title, info, ratingRow]);

      const footer = el('div', { class: 'course-footer' });
      footer.appendChild(el('div', { class: 'course-price', html: '' }));
      const priceEl = footer.querySelector('.course-price');
      footer.appendChild(el('div', { class: 'enroll-btn', html: 'Enroll →' }));

      // default monthly price, updated by pricing toggle in renderPricing.
      const priceMonthly = c.priceMonthly ?? 0;
      const priceAnnual = c.priceAnnual ?? priceMonthly * 10;
      priceEl.dataset.courseMonthly = priceMonthly;
      priceEl.dataset.courseAnnual = priceAnnual;
      priceEl.textContent = formatMoney(priceMonthly);

      card.appendChild(thumb);
      card.appendChild(body);
      card.appendChild(footer);

      function openDetails(){
        // Simple UX: scroll to pricing and show alert.
        $('#pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      card.addEventListener('click', openDetails);
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') openDetails();
      });

      return card;
    });

    grid.innerHTML = '';
    cards.forEach(c => grid.appendChild(c));
  }

  function renderTeachers(){
    const grid = $('#teachersGrid');
    if(!grid || !window.NOOR_DATA) return;

    grid.innerHTML = '';
    window.NOOR_DATA.teachers.forEach((t) => {
      const card = el('div', { class: 'teacher-card', role: 'button' });
      card.tabIndex = 0;

      const avatar = el('div', { class: 't-avatar' });
      // single letter placeholder
      avatar.appendChild(el('span', { class: 'status', html: '' }));

      const badge = el('div', { class: 't-badge', html: t.badge || 'Certified' });
      const name = el('div', { class: 't-name', html: t.name });
      const spec = el('div', { class: 't-spec', html: t.spec });

      const stats = el('div', { class: 't-stats' });
      const s1 = el('div', { class: 't-stat' }, [el('strong', { html: t.rating.toFixed(1) }), el('span', { html: 'Rating' })]);
      const s2 = el('div', { class: 't-stat' }, [el('strong', { html: t.students }), el('span', { html: 'Students' })]);
      stats.appendChild(s1); stats.appendChild(s2);

      card.appendChild(badge);
      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(spec);
      card.appendChild(stats);

      function open(){ $('#courses')?.scrollIntoView({behavior:'smooth'}); }
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') open(); });

      grid.appendChild(card);
    });
  }

  function setCoursePrices(mode){
    const courseCards = document.querySelectorAll('#coursesGrid .course-price');
    courseCards.forEach((p) => {
      const monthly = Number(p.dataset.courseMonthly || 0);
      const annual = Number(p.dataset.courseAnnual || monthly * 10);
      p.textContent = formatMoney(mode === 'annual' ? annual : monthly);
    });
  }

  function renderPricing(){
    const grid = $('#pricingGrid');
    if(!grid || !window.NOOR_DATA) return;

    const mode = window.__NOOR_PRICING_MODE || 'monthly';
    const plans = mode === 'annual' ? window.NOOR_DATA.pricing.annual : window.NOOR_DATA.pricing.monthly;

    grid.innerHTML = '';
    plans.forEach((plan) => {
      const card = el('div', { class: `price-card${plan.featured ? ' featured' : ''}` });
      card.appendChild(el('div', { class: 'plan-icon', html: plan.featured ? '⭐' : '🎓' }));
      card.appendChild(el('div', { class: 'plan-name', html: plan.name }));
      const price = el('div', { class: 'plan-price' });
      price.appendChild(el('span', { html: formatMoney(plan.price).replace('$','') }));
      if(mode==='monthly') {
        price.innerHTML = `<span>${formatMoney(plan.price).replace('$','')}</span><sup>/mo</sup>`;
      } else {
        price.innerHTML = `<span>${formatMoney(plan.price).replace('$','')}</span><sup>/yr</sup>`;
      }
      card.appendChild(price);

      card.appendChild(el('div', { class: 'plan-desc', html: plan.desc }));

      const ul = el('ul', { class: 'plan-features' });
      plan.features.forEach((f) => {
        ul.appendChild(el('li', { html: `<span class="check">✓</span>${f}` }));
      });
      card.appendChild(ul);

      const btnClass = plan.featured ? 'plan-btn plan-btn-gold' : 'plan-btn plan-btn-outline';
      card.appendChild(el('button', { class: btnClass, type: 'button', html: 'Get Started →' }));
      grid.appendChild(card);
    });
  }

  function renderReviews(){
    const grid = $('#reviewsGrid');
    if(!grid || !window.NOOR_DATA) return;
    grid.innerHTML = '';

    window.NOOR_DATA.reviews.forEach((r) => {
      const card = el('div', { class: 'review-card' });
      card.appendChild(el('div', { class: 'review-stars', html: `★ ${r.rating.toFixed(1)}` }));
      card.appendChild(el('div', { class: 'quote-icon', html: '“' }));
      card.appendChild(el('div', { class: 'review-text', html: r.text }));
      const author = el('div', { class: 'review-author' });
      author.appendChild(el('div', { class: 'r-avatar', html: r.name.trim().slice(0,1) }));
      author.appendChild(el('div', {}, [
        el('div', { class: 'r-name', html: r.name }),
        el('div', { class: 'r-location', html: r.location })
      ]));
      card.appendChild(author);
      grid.appendChild(card);
    });
  }

  function renderFAQ(){
    const grid = $('#faqGrid');
    if(!grid || !window.NOOR_DATA) return;
    grid.innerHTML = '';

    window.NOOR_DATA.faq.forEach((item, idx) => {
      const card = el('div', { class: 'faq-item', role: 'button', 'data-open': 'false' });
      const q = el('div', { class: 'faq-q' });
      const qText = el('div', { html: item.q });
      const icon = el('div', { class: 'faq-icon', html: '+' });
      q.appendChild(qText);
      q.appendChild(icon);

      const aWrap = el('div', { class: 'faq-a' });
      aWrap.appendChild(el('p', { html: item.a }));

      card.appendChild(q);
      card.appendChild(aWrap);

      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        // close others
        grid.querySelectorAll('.faq-item.open').forEach(x => x.classList.remove('open'));
        if(!isOpen) card.classList.add('open');
      });

      grid.appendChild(card);
      if(idx === 0) card.classList.add('open');
    });
  }

  function renderPrayerTimes(){
    const grid = $('#prayerGrid');
    if(!grid || !window.NOOR_DATA) return;
    grid.innerHTML = '';
    window.NOOR_DATA.prayerTimes.forEach((p) => {
      const cls = p.highlight ? 'prayer-item next' : 'prayer-item';
      const card = el('div', { class: cls });
      card.appendChild(el('div', { class: 'prayer-name', html: p.name }));
      card.appendChild(el('div', { class: 'prayer-time', html: p.time }));
      grid.appendChild(card);
    });
  }

  function renderDailyPlayer(){
    // UI only; if audioUrl later exists, play it.
    const audioUrl = window.NOOR_DATA?.dailyRecitation?.audioUrl || '';
    window.__NOOR_AUDIO = new Audio(audioUrl || '');
    window.__NOOR_IS_PLAYING = false;

    const playBtn = $('#playBtn');
    if(!playBtn) return;

    window.togglePlay = function(){
      const btn = playBtn;
      // If no audio url, simulate progress.
      if(!audioUrl){
        window.__NOOR_IS_PLAYING = !window.__NOOR_IS_PLAYING;
        btn.style.transform = window.__NOOR_IS_PLAYING ? 'scale(1.05)' : 'scale(1)';
        btn.textContent = window.__NOOR_IS_PLAYING ? '⏸' : '▶';
        return;
      }

      const a = window.__NOOR_AUDIO;
      if(!a.src){
        btn.textContent = '▶';
        return;
      }
      if(window.__NOOR_IS_PLAYING){ a.pause(); btn.textContent = '▶'; }
      else { a.play(); btn.textContent = '⏸'; }
      window.__NOOR_IS_PLAYING = !window.__NOOR_IS_PLAYING;
    };

    window.seekAudio = function(e){
      const fill = $('#playerFill');
      const timeEl = $('#playerTime');
      if(!fill || !timeEl) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      fill.style.width = pct + '%';
      // simulate time display
      timeEl.textContent = '0:' + Math.round(pct*0.5).toString().padStart(2,'0');
    };
  }

  // Navbar: theme toggle/menu
  window.toggleMenu = function(){
    const m = $('#mobileMenu');
    if(!m) return;
    m.classList.toggle('open');
  };

  window.toggleTheme = function(){
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  };

  // Pricing toggle
  window.togglePricing = function(toggleEl){
    const mode = (window.__NOOR_PRICING_MODE || 'monthly') === 'monthly' ? 'annual' : 'monthly';
    window.__NOOR_PRICING_MODE = mode;
    // animation hint
    const t = $('#pricingToggle');
    if(t){
      t.classList.toggle('yearly', mode === 'annual');
    }
    renderPricing();
    setCoursePrices(mode);
  };

  // Contact form
  window.handleContactSubmit = function(event){
    event.preventDefault();
    const form = $('#contactForm');
    if(!form) return;

    const fd = new FormData(form);
    const first = fd.get('First Name') || fd.get('first') || fd.get('First');
    // No backend; show toast/alert.
    alert('Message sent! (Demo)');
    form.reset();
  };

  // Chat bubble (minimal)
  window.toggleChat = function(){
    // Open Django chat backend in a new tab.
    // Your chat route is configured as: /chat/ (per ai_webapp/chat/urls.py + ai_webapp/ai_webapp/urls.py)
    window.open('http://127.0.0.1:8000/chat/', '_blank');
  };


  // Boot
  function init(){
    // ensure mode
    window.__NOOR_PRICING_MODE = 'monthly';
    const t = $('#pricingToggle');
    if(t) t.classList.remove('yearly');

    renderCourses();
    renderTeachers();
    renderPricing();
    renderReviews();
    renderFAQ();
    renderPrayerTimes();
    renderDailyPlayer();

    // Theme init
    if(!document.documentElement.getAttribute('data-theme')){
      document.documentElement.setAttribute('data-theme','light');
    }

    // Simple navbar scroll
    const nav = $('#navbar');
    window.addEventListener('scroll', () => {
      if(!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });

    // Fade-in visibility
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en => {
        if(en.isIntersecting) en.target.classList.add('visible');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(x => obs.observe(x));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

