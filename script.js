/* Language switch and one small scroll refinement. The page reads and
   works without this file; nothing here is required for the layout,
   the colours or the links. */

(function () {
  'use strict';

  var COPY = {
    tr: {
      title: 'Numan Ozan',
      description: 'Numan Ozan — İşlerin nasıl yürüdüğünü anlamak, daha iyi yollarını bulmak. Endüstri mühendisliği, veri analizi ve yazılım.',
      button: 'English',
      buttonLang: 'en',
      buttonLabel: 'Switch to English'
    },
    en: {
      title: 'Numan Ozan',
      description: 'Numan Ozan — Understanding how things work, and finding better ways. Industrial engineering, data analysis and software.',
      button: 'Türkçe',
      buttonLang: 'tr',
      buttonLabel: 'Türkçe’ye geç'
    }
  };

  document.documentElement.classList.add('js');

  var button = document.getElementById('language');
  var description = document.querySelector('meta[name="description"]');
  var translatable = document.querySelectorAll('[data-tr][data-en]');
  var current = 'tr';

  function store(language) {
    try { localStorage.setItem('lang', language); } catch (error) { /* ignore */ }
  }

  function restore() {
    try { return localStorage.getItem('lang'); } catch (error) { return null; }
  }

  function setLanguage(language) {
    var copy = COPY[language] || COPY.tr;
    current = COPY[language] ? language : 'tr';

    document.documentElement.lang = current;
    for (var i = 0; i < translatable.length; i++) {
      translatable[i].innerHTML = translatable[i].dataset[current];
    }
    document.title = copy.title;
    if (description) { description.setAttribute('content', copy.description); }
    if (button) {
      button.textContent = copy.button;
      button.setAttribute('lang', copy.buttonLang);
      button.setAttribute('aria-label', copy.buttonLabel);
    }
  }

  if (button) {
    button.addEventListener('click', function () {
      var next = current === 'tr' ? 'en' : 'tr';
      setLanguage(next);
      store(next);
    });
  }

  if (restore() === 'en') { setLanguage('en'); }

  /* The surface follows the scroll position and nothing else. The
     dissolve is scheduled for the quiet stretch between the two blocks
     of copy: it starts once the intro copy has left the top edge and is
     finished by the time the contact heading reaches the bottom edge, so
     no text is ever read against a half-lit surface. Scrolling back up
     runs the same mapping in reverse. */
  var surface = document.querySelector('.surface');
  var cue = document.querySelector('.cue');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var from = 0;
  var to = 1;

  function measure() {
    var vh = window.innerHeight;
    var offset = window.pageYOffset;
    var copy = document.querySelectorAll('.intro-text p');
    var quietStart = 0;
    for (var i = 0; i < copy.length; i++) {
      quietStart = Math.max(quietStart, copy[i].getBoundingClientRect().bottom + offset);
    }
    var heading = document.querySelector('.contact h2');
    var quietEnd = heading ? heading.getBoundingClientRect().top + offset - vh : quietStart + vh;
    /* Light copy stays comfortable until the surface is about a fifth of
       the way up, and dark copy from a little under halfway, so the ramp
       only has to keep its middle third clear of either block. */
    var window_ = quietEnd - quietStart;
    var span = Math.max(window_ / 0.36, vh * 0.3);
    var limit = document.documentElement.scrollHeight - vh;
    from = quietStart - span * 0.22;
    to = from + span;
    if (to > limit) {
      to = limit;
      from = Math.max(0, limit - span);
    }
  }

  function paint() {
    pending = false;
    var vh = window.innerHeight;
    var y = window.pageYOffset;
    var p = to > from ? (y - from) / (to - from) : (y > from ? 1 : 0);
    p = Math.min(Math.max(p, 0), 1);
    var eased = p * p * (3 - 2 * p);
    if (surface) {
      /* the spot arrives a little ahead of the field leaving, so the
         centre is already lit while the corners are still low */
      surface.style.setProperty('--field', String(1 - eased));
      surface.style.setProperty('--spot', String(Math.min(1, eased * 1.35)));
      surface.style.setProperty('--open', String(eased));
    }
    if (cue) {
      var span = vh * 0.4;
      var gone = span > 0 ? Math.min(Math.max(y / span, 0), 1) : 0;
      cue.style.setProperty('--cue-opacity', String(1 - gone));
    }
  }

  var pending = false;
  function request() {
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(paint);
    }
  }

  measure();
  paint();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { measure(); request(); });
  window.addEventListener('load', function () { measure(); paint(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { measure(); paint(); });
  }
})();
