/* Language switch and one small scroll refinement. The page reads and
   works without this file; nothing here is required for the layout,
   the colours or the links. */

(function () {
  'use strict';

  var COPY = {
    tr: {
      title: 'Numan Ozan',
      description: 'Numan Ozan — İşi anlamak, iyileştirmeyi doğru yerden başlatmak. Veri analizi, yazılım ve otomasyonla işletmelere uyarlanan çözümler.',
      button: 'English',
      buttonLang: 'en',
      buttonLabel: 'Switch to English',
      sending: 'Gönderiliyor…',
      sent: 'Mesajınız ulaştı. En kısa sürede dönüş yapacağım.',
      failed: 'Mesaj gönderilemedi. Doğrudan <a href="mailto:numanozan80@gmail.com">e-posta</a> ile de yazabilirsiniz.'
    },
    en: {
      title: 'Numan Ozan',
      description: 'Numan Ozan — Understanding the work, starting improvement in the right place. Solutions fitted to a business with data analysis, software and automation.',
      button: 'Türkçe',
      buttonLang: 'tr',
      buttonLabel: 'Türkçe’ye geç',
      sending: 'Sending…',
      sent: 'Your message has arrived. I will get back to you soon.',
      failed: 'The message could not be sent. You can also write to me by <a href="mailto:numanozan80@gmail.com">email</a>.'
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
  var heading = document.querySelector('.contact h2');
  var links = document.querySelector('.links');
  /* The form posts to Web3Forms on its own, so it works with scripting
     off; with scripting on it is sent in place and answered inline. */
  var form = document.querySelector('.reach');
  var note = form && form.querySelector('.reach-note');

  if (form && note && window.fetch && window.FormData) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      note.innerHTML = COPY[current].sending;
      if (button) { button.disabled = true; }

      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      }).then(function (response) {
        if (!response.ok) { throw new Error(String(response.status)); }
        return response.json();
      }).then(function () {
        note.innerHTML = COPY[current].sent;
        form.reset();
      }).catch(function () {
        note.innerHTML = COPY[current].failed;
      }).then(function () {
        if (button) { button.disabled = false; }
      });
    });
  }

  /* The contact copy always arrives at the bottom edge of the screen,
     which is the dimmest part of the lit surface, so a beam pinned to
     one spot lights the empty surface while the copy is read against
     the dark. The beam follows the block instead — still nothing but
     scroll position, and by the end the block sits where the beam was
     anyway, so the settled screen is unchanged. */
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var from = 0;
  var to = 1;
  var home = 0.42;

  function measure() {
    /* The dissolve runs across the whole page: it starts with the first
       pixel of scroll and finishes at the very bottom. */
    var vh = window.innerHeight;
    var limit = Math.max(1, document.documentElement.scrollHeight - vh);
    from = 0;
    /* It finishes as the contact section arrives rather than at the last
       pixel of the page: the block is a screenful of copy now, and it
       has to be lit by the time it is read. The rest of the scroll is
       spent reading it in full light. */
    to = limit;
    if (heading) {
      var arrives = heading.getBoundingClientRect().top + window.pageYOffset - vh * 0.62;
      to = Math.min(limit, Math.max(arrives, limit * 0.45));
    }
    if (surface) {
      surface.style.removeProperty('--beam-y');
      var set = getComputedStyle(surface).getPropertyValue('--beam-y').trim();
      home = parseFloat(set) / 100 || 0.42;
    }
  }

  function paint() {
    pending = false;
    var vh = window.innerHeight;
    var y = window.pageYOffset;
    var p = to > from ? (y - from) / (to - from) : (y > from ? 1 : 0);
    p = Math.min(Math.max(p, 0), 1);
    /* Mostly gentle, steepest through the middle where the screen is
       empty, so copy is never read against a half-lit surface — but it
       still moves from the very first pixel of scroll. */
    var smoother = p * p * p * (p * (6 * p - 15) + 10);
    var eased = 0.28 * p + 0.72 * smoother;
    if (surface) {
      /* the spot arrives a little ahead of the field leaving, so the
         centre is already lit while the corners are still low */
      surface.style.setProperty('--field', String(1 - eased));
      surface.style.setProperty('--spot', String(Math.min(1, eased * 1.3)));
      surface.style.setProperty('--open', String(eased));
      if (heading && links) {
        var block = (heading.getBoundingClientRect().top + links.getBoundingClientRect().bottom) / 2 / vh;
        /* eased in over the second half of the scroll, so the early and
           middle of the dissolve look exactly as they did before */
        var follow = Math.min(Math.max((p - 0.4) / 0.3, 0), 1);
        var beamY = home + (block - home) * follow * follow * (3 - 2 * follow);
        beamY = Math.min(Math.max(beamY, 0.3), 1.02);
        surface.style.setProperty('--beam-y', (beamY * 100).toFixed(1) + '%');
      }
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
