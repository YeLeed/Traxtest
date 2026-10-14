(function () {
  var APP_ID = 'jtwcfhlr';
  var API = 'https://mockingbird.intercom.workers.dev/jtwcfhlr/trax';
  var PERSONAS = {
    marta:  { user_id: 'MRDF-usr_8f21c40a', email: 'm.kowalski@meridianfreight.com', name: 'Marta Kowalski', org: 'Meridian Freight Lines', role: 'Billing analyst · Carrier · SCAC MRDF', initials: 'MK', kind: 'carrier' },
    daniel: { user_id: 'NCG-usr_3b77e1c2', email: 'd.reyes@northwindcg.com', name: 'Daniel Reyes', org: 'Northwind Consumer Goods', role: 'Freight Payables Manager · Client NCG-114', initials: 'DR', kind: 'client' }
  };
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var BASE = { app_id: APP_ID, hide_default_launcher: true, custom_launcher_selector: '#prizman-launcher', alignment: 'right', horizontal_padding: 20, vertical_padding: 20 };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function longDate(iso) { var p = iso.split('-'); return +p[2] + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0]; }
  function money(n) { return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function settingsFor(key) {
    var s = {}; for (var k in BASE) s[k] = BASE[k];
    if (key && PERSONAS[key]) { s.user_id = PERSONAS[key].user_id; s.email = PERSONAS[key].email; s.name = PERSONAS[key].name; }
    return s;
  }
  function contextUrl(key) { return API + '/carrier-context/' + encodeURIComponent(PERSONAS[key].email); }
  function currentPersona() { return localStorage.getItem('trax_persona'); }
  function isPortal() { return /\/portal\.html$/i.test(location.pathname); }
  function setIdentity(key) { localStorage.setItem('trax_messenger_identity', key || 'visitor'); }
  function parsePersonaParam(search) {
    var m = /[?&]persona=([^&]+)/.exec(search || '');
    var key = m && decodeURIComponent(m[1]);
    return (key && PERSONAS[key]) ? key : null;
  }
  function withoutPersonaParam(href) { var u = new URL(href); u.searchParams.delete('persona'); return u.toString(); }
  function reloadClean() { location.replace(withoutPersonaParam(location.href)); }

  // Intercom sets cookies with a Domain attribute on real hostnames; a host-only delete never matches them.
  function clearIntercomCookies() {
    var parts = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n.indexOf('intercom-') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }
  function reboot(key) {
    if (window.Intercom) window.Intercom('shutdown');
    clearIntercomCookies();
    setIdentity(key);
    window.intercomSettings = settingsFor(key);
    setTimeout(function () { if (window.Intercom) window.Intercom('boot', window.intercomSettings); }, 400);
  }
  function signIn(key) { localStorage.setItem('trax_persona', key); reboot(key); if (!isPortal()) location.href = 'portal.html'; else reloadClean(); }
  function signOut() { ['trax_persona', 'trax_pending_prompt', 'trax_help_closed'].forEach(function (k) { localStorage.removeItem(k); }); reboot(null); location.href = 'index.html'; }
  function composer() {
    try {
      var f = document.querySelector('iframe[name="intercom-messenger-frame"]');
      return (f && f.contentDocument && f.contentDocument.querySelector('[contenteditable="true"]')) || null;
    } catch (e) { return null; }
  }
  // showNewMessage is dropped while the Messenger boots and ignored while a restored draft sits in the composer.
  function say(text) {
    var tries = 0;
    (function attempt() {
      var el = composer();
      if (el && el.textContent.indexOf(text) >= 0) return;
      if (el && el.textContent.trim()) {
        el.focus();
        el.ownerDocument.execCommand('selectAll', false, null);
        el.ownerDocument.execCommand('delete', false, null);
      }
      window.Intercom('showNewMessage', text);
      tries += 1;
      if (tries < 25) setTimeout(attempt, 1200);
    })();
  }

  window.traxDemo = { PERSONAS: PERSONAS, settingsFor: settingsFor, contextUrl: contextUrl, currentPersona: currentPersona, isPortal: isPortal,
    signIn: signIn, signOut: signOut, reboot: reboot, say: say, clearIntercomCookies: clearIntercomCookies, reloadClean: reloadClean,
    parsePersonaParam: parsePersonaParam, withoutPersonaParam: withoutPersonaParam, money: money, longDate: longDate, esc: esc };

  if (window.TRAX_TEST) return;

  var urlPersona = parsePersonaParam(location.search);
  if (urlPersona) localStorage.setItem('trax_persona', urlPersona);

  // The sign-in page never boots the Messenger: Prizman is for signed-in users only.
  if (!isPortal()) { if (localStorage.getItem('trax_messenger_identity') !== 'visitor') clearIntercomCookies(); setIdentity(null); return; }
  var bootPersona = currentPersona();
  if (!bootPersona) return;
  if (localStorage.getItem('trax_messenger_identity') !== bootPersona) clearIntercomCookies();
  setIdentity(bootPersona);
  window.intercomSettings = settingsFor(bootPersona);
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/'+APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else{w.addEventListener('load',l,false);}}})();
})();
