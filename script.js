// =====================================================
// Da3watak — Wedding invitation interactions
// =====================================================

/* ---------- Intro skip ---------- */
const intro = document.getElementById('intro');
const skipBtn = document.getElementById('skipIntro');
if (skipBtn && intro) {
  skipBtn.addEventListener('click', () => {
    intro.style.transition = 'opacity .4s ease';
    intro.style.opacity = '0';
    setTimeout(() => { intro.style.display = 'none'; }, 400);
  });
}
// Fully remove the intro from the accessibility tree once its CSS animation ends
if (intro) {
  intro.addEventListener('animationend', () => {
    intro.style.display = 'none';
  });
}

/* ---------- Countdown ---------- */
(function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  // EDIT ME: تاريخ العرس الحقيقي بصيغة YYYY-MM-DDTHH:MM:SS
  const targetDate = new Date(el.dataset.weddingDate).getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minsEl.textContent = '0';
      secsEl.textContent = '0';
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minsEl.textContent = mins;
    secsEl.textContent = secs;
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ---------- RSVP form ---------- */
(function initRsvp() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;
  const confirmMsg = document.getElementById('rsvpConfirm');

  // EDIT ME: بدّلي هاد الإيميل بإيميلكم الحقيقي عشان توصلكم ردود الحضور
  const COUPLE_EMAIL = 'your-email@example.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvpName').value.trim();
    const attend = document.getElementById('rsvpAttend').value;
    const guests = document.getElementById('rsvpGuests').value;
    const note = document.getElementById('rsvpNote').value.trim();

    const subject = encodeURIComponent(`تأكيد حضور: ${name}`);
    const body = encodeURIComponent(
      `الاسم: ${name}\nالحضور: ${attend}\nعدد المرافقين: ${guests}\nملاحظات: ${note || '—'}`
    );

    // Opens the guest's email app with the RSVP pre-filled.
    // For a fully automated inbox, connect this form to a service like
    // Google Forms, Formspree, or a simple backend instead.
    window.location.href = `mailto:${COUPLE_EMAIL}?subject=${subject}&body=${body}`;

    confirmMsg.hidden = false;
    form.reset();
  });
})();

/* ---------- Wishes wall ---------- */
(function initWishes() {
  const form = document.getElementById('wishForm');
  const list = document.getElementById('wishesList');
  if (!form || !list) return;

  const STORAGE_KEY = 'da3watak_wishes';

  function loadWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (err) {
      // Storage unavailable (private browsing, etc.) — fail silently.
    }
  }

  function renderWishes() {
    const wishes = loadWishes();
    list.innerHTML = '';
    wishes.slice().reverse().forEach((w) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      const strong = document.createElement('strong');
      strong.textContent = w.name;
      const p = document.createElement('p');
      p.textContent = w.message;
      card.appendChild(strong);
      card.appendChild(p);
      list.appendChild(card);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wishName').value.trim();
    const message = document.getElementById('wishMsg').value.trim();
    if (!name || !message) return;

    const wishes = loadWishes();
    wishes.push({ name, message });
    saveWishes(wishes);
    renderWishes();
    form.reset();
  });

  renderWishes();
})();