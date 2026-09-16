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

  /* The scroll cue steps back once the reader has started scrolling.
     Position based, reversible, and skipped when motion is reduced. */
  var cue = document.querySelector('.cue');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  if (cue && !(reduced && reduced.matches)) {
    var pending = false;

    var update = function () {
      pending = false;
      var span = window.innerHeight * 0.4;
      var progress = span > 0 ? Math.min(Math.max(window.pageYOffset / span, 0), 1) : 0;
      cue.style.setProperty('--cue-opacity', String(1 - progress));
    };

    var onScroll = function () {
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
})();
