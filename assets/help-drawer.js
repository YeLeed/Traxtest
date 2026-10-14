// Left-hand "what to ask Prizman" panel. Include after app.js on any demo page.
(function () {
  var GROUPS = [
    { title: '1 · Fin answers from Trax content', note: 'Resolved end to end from the Prizma user guides.', persona: 'any', prompts: [
      { text: 'How do I submit an invoice in Prizma?', watch: 'Answer cites the user guide; no handoff.' } ] },
    { title: '2 · Procedure + live data + action', note: 'Fin reads Marta\'s invoices through a data connector, then opens a dispute case.', persona: 'marta', prompts: [
      { text: 'What\'s the status of invoice INV-2026-0871?', watch: 'Short-paid, RV adjustment -$405, dispute window 30 Nov.' },
      { text: 'I want to dispute that short pay. Our contracted rate is $4,820 flat for this lane under rate reference NCG-114-OH-PA.', watch: 'Case TRX-DSP-2026-04117 returned with SLA and tracking path.' } ] },
    { title: '3 · Priority escalation', note: 'Fin stops and hands off at once; Issue category = System outage.', persona: 'any', prompts: [
      { text: 'The system is down, nobody at our company can log in to Prizma.', watch: 'Assigned to L3 Platform Support with the P1 Platform SLA; Issue category System outage.' } ] },
    { title: '4 · Triage by Fin attribute', note: 'Fin cannot answer; the Issue category routes the conversation.', persona: 'daniel', prompts: [
      { text: 'Which GL code did you allocate our Columbus to Allentown freight to this month?', watch: 'Handed to the Cost Allocation team with the L1 SLA; Issue category Cost allocation.' } ] },
    { title: '5 · Service request → ticket', note: 'Fin collects the details and creates a Rate Loading Request ticket.', persona: 'any', prompts: [
      { text: 'We need a new rate loaded for the Columbus to Harrisburg lane from 1 November.', watch: 'Fin asks for the client code and carrier SCAC, reads the request back, says it is logging it, then the Rate Loading Request ticket card appears in the Messenger.',
        then: ['Client code NCG-114, carrier SCAC MRDF.', 'Yes, confirmed.'] } ] },
    { title: '6 · Access scope guardrail', note: 'Marta asks about a client she has no relationship with.', persona: 'marta', prompts: [
      { text: 'Show me the open invoices for client ATL-208.', watch: 'Fin declines without confirming ATL-208 exists and offers NCG-114 instead.' } ] }
  ];

  var CSS = '\
.trax-help{position:fixed;top:0;left:0;bottom:0;width:320px;background:#1e2a2e;color:#e8ecee;z-index:150;display:flex;flex-direction:column;font-family:var(--font);transform:translateX(-100%);transition:transform .25s cubic-bezier(.2,.7,.2,1);border-right:3px solid #f0b541;box-shadow:2px 0 12px rgba(0,0,0,.25)}\
body.trax-help-open .trax-help{transform:none}\
body.trax-help-open{padding-left:320px}\
.trax-help-head{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,.1)}\
.trax-help-head h2{margin:0;font-size:17px;font-weight:600;display:flex;align-items:center;gap:10px}\
.trax-help-head h2:before{content:"";width:8px;height:8px;border-radius:50%;background:#f0b541;box-shadow:0 0 0 4px rgba(240,181,65,.22)}\
.trax-help-close{background:none;border:0;color:#9aa5aa;font-size:22px;line-height:1;cursor:pointer;padding:0 2px}\
.trax-help-close:hover{color:#fff}\
.trax-help-body{flex:1;overflow-y:auto;padding:16px 16px 8px}\
.trax-help-group{margin-bottom:22px}\
.trax-help-group h3{margin:0 0 4px;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#f0b541;font-weight:600}\
.trax-help-group p{margin:0 0 10px;font-size:12.5px;color:#b7c0c4;line-height:1.45}\
.trax-help-card{display:flex;flex-wrap:wrap;align-items:flex-start;gap:6px;background:#26343a;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:11px 8px 11px 12px;margin-bottom:8px;transition:background .15s,border-color .15s}\
.trax-help-card:hover{background:#2d3d44;border-color:rgba(240,181,65,.55)}\
.trax-help-card button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;text-align:left;padding:0}\
.trax-help-send{flex:1;display:flex;flex-direction:column;gap:6px}\
.trax-help-send .p{font-size:14px;line-height:1.38;color:#fff}\
.trax-help-send .w{font-size:12px;line-height:1.4;color:#b7c0c4}\
.trax-help-send .w b{color:#f0b541;font-weight:600}\
.trax-help-send .row{display:flex;align-items:center;gap:8px}\
.trax-help-send .k{font-size:10.5px;color:#cfd6d9;background:rgba(255,255,255,.1);border-radius:5px;padding:1px 6px;font-variant-numeric:tabular-nums}\
.trax-help-send .lock{font-size:10.5px;letter-spacing:.04em;text-transform:uppercase;color:#1e2a2e;background:#f0b541;border-radius:999px;padding:3px 9px;white-space:nowrap;font-weight:600}\
.trax-help-then{flex-basis:100%;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding-top:2px}\
.trax-help-then .l{font-size:11.5px;color:#f0b541;font-weight:600}\
.trax-help-then button{font-size:12px;line-height:1.3;color:#fff;background:rgba(240,181,65,.14);border:1px solid rgba(240,181,65,.5);border-radius:999px;padding:3px 9px;cursor:pointer}\
.trax-help-then button:hover{background:rgba(240,181,65,.3)}\
.trax-help-copy{color:#9aa5aa;padding:3px 6px;border-radius:6px;font-size:13px}\
.trax-help-copy:hover{background:rgba(255,255,255,.1);color:#fff}\
.trax-help-foot{padding:14px 20px;border-top:1px solid rgba(255,255,255,.1);font-size:12.5px;color:#b7c0c4;display:flex;flex-direction:column;gap:10px}\
.trax-help-foot strong{color:#fff;font-weight:600}\
.trax-help-foot .hint{display:flex;gap:6px;flex-wrap:wrap}\
.trax-help-foot .hint span{background:#26343a;border-radius:999px;padding:4px 10px;font-size:11.5px;color:#cfd6d9}\
.trax-help-tab{position:fixed;top:72px;left:0;z-index:150;background:#1e2a2e;color:#fff;border:0;border-left:3px solid #f0b541;border-radius:0 999px 999px 0;padding:9px 14px 9px 12px;font:600 13px var(--font);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)}\
.trax-help-tab:hover{background:#26343a}\
body.trax-help-open .trax-help-tab{display:none}\
body.trax-help-open .presenter-bar{left:336px}\
.trax-help-toast{position:fixed;left:50%;bottom:76px;transform:translateX(-50%);background:#1e2a2e;color:#fff;padding:10px 16px;border-radius:999px;font:13px var(--font);z-index:300;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.3)}\
.trax-help-toast.show{opacity:1}\
@media (max-width:1100px){body.trax-help-open{padding-left:0}}\
@media (prefers-reduced-motion:reduce){.trax-help,.trax-help-card{transition:none}}';

  var trax = window.traxDemo;
  if (!trax) return;
  var current = trax.currentPersona();
  var signedIn = !!(trax.isPortal() && current);
  var flat = [], follows = [];

  var esc = trax.esc;
  function firstName(key) { return trax.PERSONAS[key].name.split(' ')[0]; }
  function needsSwitch(persona) { return persona !== 'any' && (!signedIn || current !== persona); }

  var toastEl, toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  function send(item) {
    if (needsSwitch(item.persona)) {
      localStorage.setItem('trax_pending_prompt', item.text);
      toast('Signing in as ' + firstName(item.persona) + '. Prizman will be asked this next.');
      trax.signIn(item.persona);
      return;
    }
    if (!signedIn) {
      localStorage.setItem('trax_pending_prompt', item.text);
      var modal = document.getElementById('signin-modal');
      if (modal) {
        modal.classList.add('open');
        toast('Choose a demo user. Prizman will be asked this once you are signed in.');
      } else {
        location.href = 'index.html';
      }
      return;
    }
    trax.say(item.text);
    toast('Sent to Prizman. Press send in the Messenger.');
  }

  function copy(text) {
    var done = function () { toast('Copied to clipboard'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }

  function setOpen(open) {
    document.body.classList.toggle('trax-help-open', open);
    localStorage.setItem('trax_help_closed', open ? '0' : '1');
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var html = '<div class="trax-help-head"><h2>Prizman demo guide</h2><button class="trax-help-close" aria-label="Close" title="Close (?)">&times;</button></div><div class="trax-help-body">';
    GROUPS.forEach(function (g) {
      html += '<div class="trax-help-group"><h3>' + esc(g.title) + '</h3><p>' + esc(g.note) + '</p>';
      g.prompts.forEach(function (p) {
        var i = flat.length;
        flat.push({ text: p.text, persona: g.persona });
        var tail = needsSwitch(g.persona) ? '<span class="lock">Switch to ' + esc(firstName(g.persona)) + '</span>'
          : (!signedIn ? '<span class="lock">Sign in</span>' : '');
        html += '<div class="trax-help-card"><button class="trax-help-send" data-i="' + i + '" title="Ask Prizman (⌥' + (i + 1) + ')">' +
          '<span class="p">' + esc(p.text) + '</span>' +
          '<span class="w"><b>Watch:</b> ' + esc(p.watch) + '</span>' +
          '<span class="row"><span class="k">⌥' + (i + 1) + '</span>' + tail + '</span></button>' +
          '<button class="trax-help-copy" data-i="' + i + '" title="Copy">&#x2398;</button>';
        if (p.then) {
          html += '<span class="trax-help-then"><span class="l">Then say:</span>' + p.then.map(function (t) {
            follows.push({ text: t, persona: g.persona });
            return '<button data-f="' + (follows.length - 1) + '" title="Prefill this reply">' + esc(t) + '</button>';
          }).join('') + '</span>';
        }
        html += '</div>';
      });
      html += '</div>';
    });
    html += '</div><div class="trax-help-foot"><div><strong>Fin POC for Trax</strong> · ' + (signedIn ? 'signed in as ' + esc(trax.PERSONAS[current].name) : 'not signed in') + '</div>' +
      '<div class="hint"><span>⌥ 1–7 ask a prompt</span><span>? show / hide</span><span>h presenter bar</span></div></div>';

    var panel = document.createElement('aside');
    panel.className = 'trax-help';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    var tab = document.createElement('button');
    tab.className = 'trax-help-tab';
    tab.innerHTML = '&#9776;&nbsp; Demo guide';
    document.body.appendChild(tab);

    toastEl = document.createElement('div');
    toastEl.className = 'trax-help-toast';
    document.body.appendChild(toastEl);

    panel.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.classList.contains('trax-help-close')) return setOpen(false);
      if (b.dataset.f !== undefined) return send(follows[+b.dataset.f]);
      var item = flat[+b.dataset.i];
      if (!item) return;
      if (b.classList.contains('trax-help-copy')) copy(item.text); else send(item);
    });
    tab.addEventListener('click', function () { setOpen(true); });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.key === '?') { setOpen(!document.body.classList.contains('trax-help-open')); return; }
      if (e.altKey && /^Digit[1-7]$/.test(e.code)) {
        var item = flat[+e.code.slice(5) - 1];
        if (item) { e.preventDefault(); send(item); }
      }
    });

    setOpen(localStorage.getItem('trax_help_closed') !== '1');

    var pending = localStorage.getItem('trax_pending_prompt');
    if (pending && signedIn) {
      localStorage.removeItem('trax_pending_prompt');
      setTimeout(function () { trax.say(pending); toast('Asking Prizman: ' + pending); }, 1500);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
