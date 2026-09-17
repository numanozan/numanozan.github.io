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
      failed: 'Mesaj gönderilemedi. Doğrudan <a href="mailto:numanozan80@gmail.com">e-posta</a> ile de yazabilirsiniz.',
      tooFast: 'Formu biraz yavaş doldurup tekrar deneyin.',
      tooSoon: 'Bir mesaj az önce gönderildi. Bir dakika sonra tekrar deneyebilirsiniz.'
    },
    en: {
      title: 'Numan Ozan',
      description: 'Numan Ozan — Understanding the work, starting improvement in the right place. Solutions fitted to a business with data analysis, software and automation.',
      button: 'Türkçe',
      buttonLang: 'tr',
      buttonLabel: 'Türkçe’ye geç',
      sending: 'Sending…',
      sent: 'Your message has arrived. I will get back to you soon.',
      failed: 'The message could not be sent. You can also write to me by <a href="mailto:numanozan80@gmail.com">email</a>.',
      tooFast: 'Please take a moment filling the form in and try again.',
      tooSoon: 'A message was just sent. You can try again in a minute.'
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

  var count = form && form.querySelector('.count');
  var message = form && form.querySelector('#reach-note');
  var opened = Date.now();

  if (count && message) {
    var limit = parseInt(message.getAttribute('maxlength'), 10) || 1000;
    var tally = function () {
      var left = limit - message.value.length;
      count.textContent = message.value.length ? left + ' / ' + limit : '';
      count.className = left < 120 ? 'count near' : 'count';
    };
    message.addEventListener('input', tally);
    tally();
  }

  if (form && note && window.fetch && window.FormData) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');

      /* Two guards a reader never notices: nothing filled in and sent
         inside three seconds is a machine, and one message a minute is
         enough for a person. Neither stops a determined attacker — the
         service's own filtering does that. */
      if (Date.now() - opened < 3000) {
        note.innerHTML = COPY[current].tooFast;
        return;
      }
      var last = 0;
      try { last = parseInt(localStorage.getItem('sent') || '0', 10); } catch (error) { last = 0; }
      if (Date.now() - last < 60000) {
        note.innerHTML = COPY[current].tooSoon;
        return;
      }
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
        if (count) { count.textContent = ''; }
        try { localStorage.setItem('sent', String(Date.now())); } catch (error) { /* ignore */ }
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
      /* --finish says how much earlier than the contact block's arrival
         the dissolve settles, in screenfuls; 0 runs it to the last pixel. */
      var early = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--finish'));
      if (isNaN(early)) { early = 0.62; }
      var arrives = heading.getBoundingClientRect().top + window.pageYOffset - vh * early;
      to = Math.min(limit, Math.max(arrives, limit * 0.45));
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
      var rush = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rush'));
      if (isNaN(rush)) { rush = 1.3; }
      surface.style.setProperty('--spot', String(Math.min(1, eased * rush)));
      surface.style.setProperty('--open', String(eased));
    }
    if (cue) {
      var span = vh * 0.4;
      var gone = span > 0 ? Math.min(Math.max(y / span, 0), 1) : 0;
      cue.style.setProperty('--cue-opacity', String(1 - gone));
    }
  }

  /* The cue glides down instead of jumping. It is a click, not the
     page taking the scroll over: the reader's own wheel, touch or key
     cancels it at once, and with motion reduced it lands immediately. */
  if (cue && heading) {
    cue.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) { return; }
      event.preventDefault();

      var margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
      var limit = document.documentElement.scrollHeight - window.innerHeight;
      var target = Math.min(limit, Math.max(0, heading.getBoundingClientRect().top + window.pageYOffset - margin));
      var start = window.pageYOffset;
      var span = target - start;

      if (history.pushState) { history.pushState(null, '', '#contact'); }

      if ((reduced && reduced.matches) || Math.abs(span) < 8) {
        window.scrollTo(0, target);
        return;
      }

      var began = 0;
      var stop = false;
      var halt = function () { stop = true; };
      var events = ['wheel', 'touchstart', 'keydown', 'mousedown'];
      for (var i = 0; i < events.length; i++) {
        window.addEventListener(events[i], halt, { passive: true });
      }
      var release = function () {
        for (var j = 0; j < events.length; j++) { window.removeEventListener(events[j], halt); }
      };

      var glide = function (now) {
        if (!began) { began = now; }
        var through = Math.min((now - began) / 1100, 1);
        if (stop) { release(); return; }
        var softened = 1 - Math.pow(1 - through, 3);
        window.scrollTo(0, Math.round(start + span * softened));
        if (through < 1) { window.requestAnimationFrame(glide); } else { release(); }
      };
      window.requestAnimationFrame(glide);
    });
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
