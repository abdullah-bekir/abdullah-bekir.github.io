const root = document.documentElement;

// Tema
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
} catch (e) {}
document.getElementById('theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Mobil menü
const burger = document.getElementById('burger');
const links = document.getElementById('links');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Sayfa okuma ilerleme çubuğu
const bar = document.createElement('div');
bar.className = 'scroll-progress';
document.body.prepend(bar);
const onScroll = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menü kaydırınca küçülür, yukarı çık düğmesi, hero parlama efekti
const navEl = document.querySelector('.nav');
const toTop = document.createElement('button');
toTop.className = 'to-top'; toTop.setAttribute('aria-label', 'Yukarı çık'); toTop.textContent = '↑';
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(toTop);
addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', scrollY > 30);
  toTop.classList.toggle('show', scrollY > 600);
}, { passive: true });
document.querySelectorAll('.hero, .page-hero').forEach(h => {
  h.addEventListener('pointermove', e => {
    const r = h.getBoundingClientRect();
    h.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    h.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  });
});

// Yıl
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Hakkımda: dönen kelime
const rot = document.getElementById('rotator');
if (rot) {
  const words = ['yapay zeka destekli mobil uygulama', 'ürün odaklı yazılım', 'girişimci ruhlu'];
  let i = 0;
  setInterval(() => {
    rot.classList.add('out');
    setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 350);
  }, 2800);
}

// Hakkımda: profil kartı eğilme efekti
const tilt = document.querySelector('.tilt');
if (tilt && matchMedia('(hover:hover)').matches) {
  const wrap = tilt.parentElement;
  wrap.addEventListener('pointermove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  wrap.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
}

// Alt bilgi: canlı tarih ve saat (Türkiye saati)
const fDate = document.getElementById('f-date'), fTime = document.getElementById('f-time');
if (fDate && fTime) {
  const tick = () => {
    const now = new Date();
    fDate.textContent = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', timeZone: 'Europe/Istanbul' });
    fTime.textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
  };
  tick();
  setInterval(tick, 15000);
}

// Görününce animasyon + sayaç
const countUp = el => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || '';
  let n = 0;
  const t = setInterval(() => {
    n++; el.textContent = n + suffix;
    if (n >= target) clearInterval(t);
  }, 300);
};
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(en.target);
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal, .skill, .rk').forEach(el => io.observe(el));

// Uygulamalar: kategori filtresi
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.toggle('on', b === btn));
    const f = btn.dataset.f;
    document.querySelectorAll('.show').forEach(card => {
      card.hidden = f !== 'all' && card.dataset.cat !== f;
    });
  });
});

// Kart üzerinde fare ışığı
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// Yaklaşım: adım adım süreç
const steps = document.querySelectorAll('.st');
if (steps.length) {
  const panels = document.querySelectorAll('.panel');
  const fill = document.getElementById('st-fill');
  let cur = 0;
  const go = i => {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => { s.classList.toggle('on', k === cur); s.classList.toggle('done', k < cur); });
    panels.forEach((p, k) => p.classList.toggle('on', k === cur));
    fill.style.width = (cur / (steps.length - 1) * 100) + '%';
    document.getElementById('p-prev').style.visibility = cur === 0 ? 'hidden' : 'visible';
    document.getElementById('p-next').style.visibility = cur === steps.length - 1 ? 'hidden' : 'visible';
  };
  steps.forEach((s, k) => s.addEventListener('click', () => go(k)));
  document.getElementById('p-prev').addEventListener('click', () => go(cur - 1));
  document.getElementById('p-next').addEventListener('click', () => go(cur + 1));
  go(0);
}

// ---------- İletişim sayfası ----------
const form = document.getElementById('contact-form');
if (form) {
  const $ = id => document.getElementById(id);

  // Konu butonları
  const topics = document.querySelectorAll('#topics button');
  const konu = $('konu');
  topics.forEach(b => b.addEventListener('click', () => {
    topics.forEach(x => x.classList.toggle('on', x === b));
    konu.value = b.dataset.t;
    check('konu');
  }));

  // Karakter sayacı
  $('mesaj').addEventListener('input', () => { $('cnt').textContent = $('mesaj').value.length; });

  // E-postayı kopyala
  const copyBtn = $('copy');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('mail').textContent.trim());
      copyBtn.textContent = 'Kopyalandı ✓';
    } catch (e) { copyBtn.textContent = 'Kopyalanamadı'; }
    setTimeout(() => { copyBtn.textContent = 'Kopyala'; }, 1800);
  });

  // ---- Ülke kodları (ISO: arama kodu) ----
  const DIAL = 'AF:93,AX:358,AL:355,DZ:213,AS:1684,AD:376,AO:244,AI:1264,AG:1268,AR:54,AM:374,AW:297,AU:61,AT:43,AZ:994,BS:1242,BH:973,BD:880,BB:1246,BY:375,BE:32,BZ:501,BJ:229,BM:1441,BT:975,BO:591,BQ:599,BA:387,BW:267,BR:55,IO:246,VG:1284,BN:673,BG:359,BF:226,BI:257,KH:855,CM:237,CA:1,CV:238,KY:1345,CF:236,TD:235,CL:56,CN:86,CX:61,CC:61,CO:57,KM:269,CG:242,CD:243,CK:682,CR:506,CI:225,HR:385,CU:53,CW:599,CY:357,CZ:420,DK:45,DJ:253,DM:1767,DO:1809,EC:593,EG:20,SV:503,GQ:240,ER:291,EE:372,SZ:268,ET:251,FK:500,FO:298,FJ:679,FI:358,FR:33,GF:594,PF:689,GA:241,GM:220,GE:995,DE:49,GH:233,GI:350,GR:30,GL:299,GD:1473,GP:590,GU:1671,GT:502,GG:44,GN:224,GW:245,GY:592,HT:509,HN:504,HK:852,HU:36,IS:354,IN:91,ID:62,IR:98,IQ:964,IE:353,IM:44,IL:972,IT:39,JM:1876,JP:81,JE:44,JO:962,KZ:7,KE:254,KI:686,XK:383,KW:965,KG:996,LA:856,LV:371,LB:961,LS:266,LR:231,LY:218,LI:423,LT:370,LU:352,MO:853,MG:261,MW:265,MY:60,MV:960,ML:223,MT:356,MH:692,MQ:596,MR:222,MU:230,YT:262,MX:52,FM:691,MD:373,MC:377,MN:976,ME:382,MS:1664,MA:212,MZ:258,MM:95,NA:264,NR:674,NP:977,NL:31,NC:687,NZ:64,NI:505,NE:227,NG:234,NU:683,NF:672,KP:850,MK:389,MP:1670,NO:47,OM:968,PK:92,PW:680,PS:970,PA:507,PG:675,PY:595,PE:51,PH:63,PL:48,PT:351,PR:1787,QA:974,RE:262,RO:40,RU:7,RW:250,BL:590,SH:290,KN:1869,LC:1758,MF:590,PM:508,VC:1784,WS:685,SM:378,ST:239,SA:966,SN:221,RS:381,SC:248,SL:232,SG:65,SX:1721,SK:421,SI:386,SB:677,SO:252,ZA:27,KR:82,SS:211,ES:34,LK:94,SD:249,SR:597,SJ:47,SE:46,CH:41,SY:963,TW:886,TJ:992,TZ:255,TH:66,TL:670,TG:228,TK:690,TO:676,TT:1868,TN:216,TR:90,TM:993,TC:1649,TV:688,VI:1340,UG:256,UA:380,AE:971,GB:44,US:1,UY:598,UZ:998,VU:678,VA:39,VE:58,VN:84,WF:681,EH:212,YE:967,ZM:260,ZW:263';
  let names;
  try { names = new Intl.DisplayNames(['tr'], { type: 'region' }); } catch (e) { names = { of: c => c }; }
  const norm = s => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  const countries = DIAL.split(',').map(x => {
    const [iso, code] = x.split(':');
    let name = iso;
    try { name = names.of(iso) || iso; } catch (e) {}
    return { iso, code, name, key: norm(name + ' ' + iso + ' +' + code) };
  }).sort((a, b) => a.iso === 'TR' ? -1 : b.iso === 'TR' ? 1 : a.name.localeCompare(b.name, 'tr'));

  const flag = iso => `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;
  let current = countries[0];
  const list = $('cc-list'), panel = $('cc-panel'), btn = $('cc-btn'), search = $('cc-search');

  const setCountry = c => {
    current = c;
    $('cc-flag').src = flag(c.iso);
    $('cc-flag').alt = c.name;
    $('cc-code').textContent = '+' + c.code;
  };
  const render = q => {
    const k = norm(q || '').trim();
    const items = countries.filter(c => !k || c.key.includes(k));
    list.innerHTML = '';
    if (!items.length) { list.innerHTML = '<li class="none">Sonuç bulunamadı</li>'; return; }
    items.forEach(c => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      if (c.iso === current.iso) li.className = 'sel';
      li.innerHTML = `<img src="${flag(c.iso)}" alt="" width="22" height="16" loading="lazy"><span></span><b>+${c.code}</b>`;
      li.querySelector('span').textContent = c.name;
      li.addEventListener('click', () => { setCountry(c); closePanel(); check('tel'); $('tel').focus(); });
      list.appendChild(li);
    });
  };
  const openPanel = () => {
    panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
    search.value = ''; render(''); search.focus();
    const sel = list.querySelector('.sel'); if (sel) sel.scrollIntoView({ block: 'center' });
  };
  function closePanel() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
  search.addEventListener('input', () => render(search.value));
  document.addEventListener('click', e => { if (!$('cc').contains(e.target)) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  setCountry(countries[0]);

  // ---- Doğrulama kuralları (hepsi zorunlu) ----
  const RULES = {
    ad: v => /^[\p{L}][\p{L}\s'’.-]*$/u.test(v.trim()) && v.trim().length >= 2 ? '' : 'Lütfen adını yaz (en az 2 harf).',
    soyad: v => /^[\p{L}][\p{L}\s'’.-]*$/u.test(v.trim()) && v.trim().length >= 2 ? '' : 'Lütfen soyadını yaz (en az 2 harf).',
    eposta: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Geçerli bir e-posta adresi yaz (örn. ornek@mail.com).',
    tel: v => {
      if (!v.trim()) return 'Telefon numaranı yaz.';
      if (!/^[0-9\s()-]+$/.test(v)) return 'Telefon numarası sadece rakam içermeli.';
      const n = v.replace(/\D/g, '').length;
      return n >= 6 && n <= 14 ? '' : 'Geçerli bir telefon numarası yaz (6-14 rakam).';
    },
    konu: v => v.trim().length >= 2 ? '' : 'Lütfen bir konu seç veya yaz.',
    mesaj: v => v.trim().length >= 10 ? '' : 'Mesajın en az 10 karakter olmalı.'
  };
  const touched = new Set();
  function check(name) {
    const wrap = form.querySelector(`.field[data-f="${name}"]`);
    const input = wrap.querySelector('input:not(#cc-search), textarea');
    const msg = RULES[name](input.value);
    wrap.classList.toggle('bad', !!msg);
    wrap.classList.toggle('good', !msg);
    wrap.querySelector('.err').textContent = msg;
    return !msg;
  }
  Object.keys(RULES).forEach(name => {
    const input = form.querySelector(`.field[data-f="${name}"] input:not(#cc-search), .field[data-f="${name}"] textarea`);
    input.addEventListener('blur', () => { touched.add(name); check(name); });
    input.addEventListener('input', () => { if (name === 'tel') input.value = input.value.replace(/[^0-9\s()-]/g, ''); if (touched.has(name)) check(name); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const note = $('form-note');
    const results = Object.keys(RULES).map(n => { touched.add(n); return [n, check(n)]; });
    const bad = results.find(r => !r[1]);
    if (bad) {
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      form.classList.remove('sent');
      note.textContent = 'Lütfen kırmızı ile işaretli zorunlu alanları doldur. Form eksik bilgiyle gönderilemez.';
      note.style.color = '#ef4444';
      form.querySelector(`.field[data-f="${bad[0]}"] input:not(#cc-search), .field[data-f="${bad[0]}"] textarea`).focus();
      return;
    }
    note.style.color = '';
    const d = new FormData(form);
    const fields = {
      Ad: d.get('ad').trim(), Soyad: d.get('soyad').trim(), 'E-posta': d.get('eposta').trim(),
      Telefon: `+${current.code} ${d.get('tel').trim()} (${current.name})`,
      Konu: d.get('konu').trim(), Mesaj: d.get('mesaj').trim()
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    const fallback = () => {
      const body = `Merhaba Abdullah,\n\n${fields.Mesaj}\n\n— ${fields.Ad} ${fields.Soyad}\nE-posta: ${fields['E-posta']}\nTelefon: ${fields.Telefon}`;
      location.href = 'mailto:abdullahbekir780@gmail.com?subject=' + encodeURIComponent(fields.Konu) + '&body=' + encodeURIComponent(body);
      form.classList.add('sent');
      note.textContent = 'Mesajı doğrudan gönderemedik, e-posta uygulaman hazır mesajla açıldı. Oradan gönderebilirsin.';
    };
    submitBtn.disabled = true; submitBtn.textContent = 'Gönderiliyor...';
    fetch('https://formsubmit.co/ajax/abdullahbekir780@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: 'Web sitesinden yeni mesaj: ' + fields.Konu, _replyto: fields['E-posta'], _template: 'table', ...fields })
    }).then(r => r.json()).then(res => {
      if (String(res.success) !== 'true') throw new Error('fail');
      form.reset(); $('cnt').textContent = '0';
      form.querySelectorAll('.field').forEach(f => f.classList.remove('good', 'bad'));
      touched.clear(); konu.value = 'Mobil uygulama fikri';
      topics.forEach((x, i) => x.classList.toggle('on', i === 0));
      form.classList.add('sent');
      note.textContent = '✓ Mesajın gönderildi. Teşekkürler, en kısa sürede dönüş yapacağım.';
    }).catch(fallback).finally(() => { submitBtn.disabled = false; submitBtn.textContent = 'Mesajı Gönder →'; });
  });
}