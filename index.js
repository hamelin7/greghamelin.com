/* ===================================================
   GREG HAMELIN — Site JavaScript
   Example concierge conversations, concierge widget, footer year
   =================================================== */

/*
  CONCIERGE_ENDPOINT: leave empty until the AI version is live.
  When it's ready, set this to your server-side function URL (for example an AWS Lambda
  function URL). The function receives { message, history } as JSON and returns { reply }.
  Never put an API key in this file. It is public.
*/
const CONCIERGE_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', () => {

  // ===== FOOTER YEAR =====
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ===== EXAMPLE CONVERSATIONS (hero phone) =====
  const scenarios = {
    paint: {
      biz: 'Example Painting Co.',
      items: [
        ['time', 'Tonight · 10:14 pm'],
        ['c', "Hi, do you paint kitchen cabinets? We're in Agawam."],
        ['a', 'Yes, cabinet refinishing is one of our services, and Agawam is in our service area. Want a free estimate? I just need a few details.'],
        ['c', 'Sure. About 20 doors, going white. Can I send a photo?'],
        ['a', "Please do! What's the best number to reach you? The owner will call you tomorrow morning."],
        ['lead', 'New estimate request · 10:16 pm', 'Cabinet refinishing · ~20 doors · white · Agawam · photo attached · sent to your phone']
      ]
    },
    spa: {
      biz: 'Example Day Spa',
      items: [
        ['time', 'Sunday · 9:48 pm'],
        ['c', 'How much is a lash lift? Any Saturday openings?'],
        ['a', 'A lash lift with tint is $95 on our menu. Saturdays fill up fast, so the best way to see live openings is online booking.', 'See Saturday times'],
        ['c', 'Perfect. Can I get a gift card for my sister too?'],
        ['a', 'Of course! You can buy an eGift card online. Anything else I can help with?', 'Shop gift cards'],
        ['lead', 'Sent to booking · 9:50 pm', 'Lash lift · looking at Saturday · gift card link opened']
      ]
    }
  };

  const thread = document.getElementById('demo-thread');
  const bizName = document.getElementById('demo-biz');
  const scenButtons = document.querySelectorAll('.scen button');

  function renderScenario(key, animate) {
    const s = scenarios[key];
    if (!s || !thread) return;
    bizName.textContent = s.biz;
    thread.textContent = '';
    thread.classList.remove('play');
    s.items.forEach((item) => {
      const [type, text, extra] = item;
      let el;
      if (type === 'time') {
        el = document.createElement('span');
        el.className = 'time';
        el.textContent = text;
      } else if (type === 'lead') {
        el = document.createElement('div');
        el.className = 'leadcard';
        const b = document.createElement('b');
        b.textContent = text;
        const span = document.createElement('span');
        span.textContent = extra;
        el.append(b, span);
      } else {
        el = document.createElement('div');
        el.className = 'b ' + type;
        el.textContent = text;
        if (extra) {
          const link = document.createElement('a');
          link.href = '#concierge';
          link.textContent = ' ' + extra;
          el.append(link);
        }
      }
      thread.appendChild(el);
    });
    if (animate) {
      void thread.offsetWidth; // restart the animation
      thread.classList.add('play');
    }
    scenButtons.forEach((b) => b.setAttribute('aria-pressed', b.dataset.scen === key ? 'true' : 'false'));
  }

  scenButtons.forEach((b) => b.addEventListener('click', () => renderScenario(b.dataset.scen, true)));
  renderScenario('paint', false);

  // ===== CONCIERGE WIDGET =====
  const cwBtn = document.getElementById('cw-btn');
  const cwPanel = document.getElementById('cw-panel');
  const cwClose = document.getElementById('cw-x');
  const cwLog = document.getElementById('cw-log');
  const cwForm = document.getElementById('cw-form');
  const cwInput = document.getElementById('cw-input');
  const history = [];

  // Label the widget honestly: it only calls itself AI once the AI endpoint is live.
  if (CONCIERGE_ENDPOINT) {
    document.getElementById('cw-sub').textContent = "AI concierge · answers from Greg's info";
    document.getElementById('cw-disclose').textContent =
      "I'm an AI concierge. I answer from Greg's own info, and I'll hand you to Greg for anything else.";
  }

  function openChat() {
    cwPanel.hidden = false;
    cwBtn.setAttribute('aria-expanded', 'true');
    cwInput.focus();
  }
  function closeChat() {
    cwPanel.hidden = true;
    cwBtn.setAttribute('aria-expanded', 'false');
    cwBtn.focus();
  }
  cwBtn.addEventListener('click', () => (cwPanel.hidden ? openChat() : closeChat()));
  cwClose.addEventListener('click', closeChat);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cwPanel.hidden) closeChat();
  });

  function addMessage(who, text, link) {
    const msg = document.createElement('div');
    msg.className = 'cw-msg ' + who;
    msg.textContent = text;
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = ' ' + link.label;
      a.addEventListener('click', () => { if (link.href.startsWith('#')) closeChat(); });
      msg.append(a);
    }
    cwLog.appendChild(msg);
    cwLog.scrollTop = cwLog.scrollHeight;
  }

  const bookLink = { href: '#book', label: 'Book a free call' };

  // Scripted answers (used until CONCIERGE_ENDPOINT is set).
  // Keep these prices in sync with the pricing section in index.html.
  const answers = {
    cost: ['Packages start at $2,500 for up to 5 pages, and you get a fixed price before any work starts. Want to scope yours on a free call?', bookLink],
    time: ['Most sites launch 3–6 weeks after the first call, depending on size and how quickly photos and text come together. You get a timeline before any work starts.', bookLink],
    ai: ["An AI concierge sits on your website like a front desk. It greets visitors, answers their questions from your own info, and sends them to book, call, or request a quote. Setup starts at $1,000 plus $75/month.", { href: '#concierge', label: 'See an example' }],
    book: ['Great! Leave your name and email in the form and Greg will reply to set up a 20-minute call.', bookLink],
    own: ['Yes. Your domain, your content, and your code are yours. Website management plans are month-to-month.', null],
    diy: ["Wix and Squarespace are fine if you have time to build and maintain the site yourself. Greg builds sites planned around getting customers, and he keeps them current for you.", bookLink],
    work: ['Recent work includes Lush Aesthetics & Beauty in Westfield and Get Custom Paint on the NH and Maine Seacoast.', { href: '#work', label: 'See the work' }],
    fallback: ["I don't have a good answer for that one. Greg can help on a free 20-minute call.", bookLink]
  };

  const quickLabels = {
    cost: 'What does a website cost?',
    time: 'How long does it take?',
    ai: "What's an AI concierge?",
    book: 'Book a call'
  };

  function matchTopic(text) {
    const t = text.toLowerCase();
    if (/(price|cost|how much|\$|budget|expensive|afford)/.test(t)) return 'cost';
    if (/(how long|timeline|weeks|when can|how soon|turnaround)/.test(t)) return 'time';
    if (/(\bai\b|concierge|chat|bot|assistant)/.test(t)) return 'ai';
    if (/(book|call|talk|meet|schedule|appointment|contact)/.test(t)) return 'book';
    if (/(own|domain|contract|cancel|lock)/.test(t)) return 'own';
    if (/(wix|squarespace|godaddy|diy|myself)/.test(t)) return 'diy';
    if (/(work|portfolio|example|clients?|built)/.test(t)) return 'work';
    return 'fallback';
  }

  function scriptedReply(topic) {
    const [text, link] = answers[topic];
    setTimeout(() => addMessage('bot', text, link), 350);
  }

  async function aiReply(message) {
    try {
      const res = await fetch(CONCIERGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: history.slice(-10) })
      });
      if (!res.ok) throw new Error('Bad response');
      const data = await res.json();
      const reply = (data && data.reply) || answers.fallback[0];
      history.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);
    } catch (err) {
      addMessage('bot', "Sorry, I can't answer right now. You can still book a free call with Greg.", bookLink);
    }
  }

  function ask(text, topicHint) {
    addMessage('me', text);
    history.push({ role: 'user', content: text });
    if (CONCIERGE_ENDPOINT && !topicHint) {
      aiReply(text);
    } else {
      scriptedReply(topicHint || matchTopic(text));
    }
  }

  document.querySelectorAll('#cw-quick button').forEach((btn) => {
    btn.addEventListener('click', () => ask(quickLabels[btn.dataset.q], btn.dataset.q));
  });

  cwForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = cwInput.value.trim();
    if (!text) return;
    cwInput.value = '';
    ask(text);
  });

  // ===== KEEP THE CONCIERGE BUTTON OFF THE FOOTER =====
  // When the footer scrolls into view, lift the button (and its panel) so they sit above it.
  const siteFooter = document.querySelector('footer');
  const mobileBar = document.querySelector('.mbar');
  function liftForFooter() {
    if (!siteFooter) return;
    const barHeight = mobileBar && getComputedStyle(mobileBar).display !== 'none' ? mobileBar.offsetHeight : 0;
    const overlap = Math.max(0, (window.innerHeight - barHeight) - siteFooter.getBoundingClientRect().top);
    document.documentElement.style.setProperty('--cw-lift', Math.round(overlap) + 'px');
  }
  let liftQueued = false;
  window.addEventListener('scroll', () => {
    if (liftQueued) return;
    liftQueued = true;
    requestAnimationFrame(() => { liftForFooter(); liftQueued = false; });
  }, { passive: true });
  window.addEventListener('resize', liftForFooter);
  liftForFooter();

  // ===== BOOKING FORM =====
  // The form posts straight to Formspree (standard submission, no fetch), which handles
  // Formspree's spam check reliably. This only shows a sending state.
  const bookForm = document.getElementById('book-form');
  if (bookForm) {
    bookForm.addEventListener('submit', () => {
      const btn = document.getElementById('book-submit');
      if (btn) btn.textContent = 'Sending...';
    });
  }
});
