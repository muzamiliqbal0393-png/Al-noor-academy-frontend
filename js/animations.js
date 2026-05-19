/* Premium scroll + entrance animations using IntersectionObserver */

(function(){
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  function applyDelays(){
    // Optional: support data-delay attribute
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const d = el.getAttribute('data-delay');
      if(d) el.style.transitionDelay = d;
    });

    document.querySelectorAll('[data-pop]').forEach((el) => {
      const d = el.getAttribute('data-delay');
      if(d) el.style.transitionDelay = d;
    });
  }

  function initReveal(){
    applyDelays();

    // Hero entrance elements
    const heroTargets = document.querySelectorAll('.hero-entrance, .hero-bg-zoom');
    if(heroTargets.length){
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.2 });
      heroTargets.forEach(t => heroObserver.observe(t));
    }

    // General reveal
    const targets = document.querySelectorAll('[data-reveal], [data-pop], [data-fadeimg]');
    if(!targets.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(t => {
      // Ensure base classes for direction
      if(t.classList.contains('reveal-left')) t.setAttribute('data-reveal','');
      obs.observe(t);
    });
  }

  function onPageLoad(){
    // Navbar load class
    const nav = document.getElementById('navbar');
    if(nav){
      nav.classList.add('nav-loaded');
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => { onPageLoad(); initReveal(); });
  }else{
    onPageLoad();
    initReveal();
  }
})();

