/* ══════════════════════════════════════════════════════════
   我的前任是逃犯 · 阅读器
   内容以 PBKDF2 + AES-256-GCM 加密存放，密码正确后本地解密
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var root = document.documentElement;

  var gate = $('gate'), gateForm = $('gateForm'), pw = $('pw'), gateBtn = $('gateBtn'),
      gateMsg = $('gateMsg'), remember = $('remember'), eye = $('eye');
  var app = $('app'), content = $('content'), loading = $('loading');
  var toc = $('toc'), tocList = $('tocList'), tocBtn = $('tocBtn'), tocClose = $('tocClose'), scrim = $('scrim');
  var themeBtn = $('themeBtn'), fontBtn = $('fontBtn'), lockBtn = $('lockBtn');
  var progressBar = $('progressBar'), toTop = $('toTop'), topTitle = $('topTitle');
  var lightbox = $('lightbox'), lbImg = $('lbImg'), lbClose = $('lbClose');

  var KEY_STORE = 'xfz.pw';
  var MAX_TRIES = 5;
  var LOCK_MS = 30000;
  var tries = 0, lockedUntil = 0, unlocked = false;

  var FONTS = ['sm', 'md', 'lg', 'xl'];
  var FONTS_CN = { sm: '小', md: '标准', lg: '大', xl: '特大' };
  var FALLBACK_TITLE = '我的前任是逃犯';   // 标题亦在密文内，未解密时用页面标题兜底

  /* ───────── 存储helpers ───────── */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function clearPw() {
    try { localStorage.removeItem(KEY_STORE); sessionStorage.removeItem(KEY_STORE); } catch (e) {}
  }
  function storedPw() {
    try { return sessionStorage.getItem(KEY_STORE) || localStorage.getItem(KEY_STORE); } catch (e) { return null; }
  }

  /* ───────── 主题 ───────── */
  function systemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(mode) {
    root.dataset.theme = mode === 'auto' ? (systemDark() ? 'dark' : 'light') : mode;
  }
  applyTheme(root.dataset.theme || 'auto');

  themeBtn.addEventListener('click', function () {
    var isDark = root.dataset.theme === 'dark';
    var next = isDark ? 'light' : 'dark';
    root.dataset.theme = next;
    lsSet('xfz.theme', next);
    themeBtn.setAttribute('title', '当前：' + (next === 'dark' ? '深色' : '浅色'));
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function () { if (root.dataset.theme === 'auto') applyTheme('auto'); };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);
    else if (mq.addListener) mq.addListener(onScheme);
  }

  /* ───────── 字号 ───────── */
  function cycleFont() {
    var cur = root.dataset.font || 'md';
    var i = FONTS.indexOf(cur);
    var next = FONTS[(i + 1) % FONTS.length];
    root.dataset.font = next;
    lsSet('xfz.font', next);
    fontBtn.setAttribute('title', '字号：' + FONTS_CN[next]);
    flash(fontBtn, FONTS_CN[next]);
  }
  fontBtn.addEventListener('click', cycleFont);

  var flashTimer;
  function flash(el, text) {
    var prev = el.getAttribute('title');
    el.setAttribute('title', text);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.setAttribute('title', prev || text); }, 1200);
  }

  /* ───────── 密码可见切换 ───────── */
  eye.addEventListener('click', function () {
    var show = pw.type === 'password';
    pw.type = show ? 'text' : 'password';
    eye.style.color = show ? 'var(--accent)' : '';
    pw.focus();
  });

  /* ───────── 解密 ───────── */
  function b64ToBytes(b64) {
    var bin = atob(b64), n = bin.length, arr = new Uint8Array(n);
    for (var i = 0; i < n; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }
  function toHex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }

  var envCache = null;
  function loadEnvelope() {
    if (envCache) return Promise.resolve(envCache);
    return fetch('assets/content.bin', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('内容包缺失（HTTP ' + r.status + '）');
      return r.json();
    }).then(function (env) { envCache = env; return env; });
  }

  function tryUnlock(password) {
    return loadEnvelope().then(function (env) {
      if (!window.crypto || !crypto.subtle) throw new Error('当前环境不支持解密（需 HTTPS）');
      var enc = new TextEncoder();
      return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
        .then(function (km) {
          return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: b64ToBytes(env.salt), iterations: env.iter, hash: 'SHA-256' },
            km,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
          );
        })
        .then(function (key) {
          var data = b64ToBytes(env.data), tag = b64ToBytes(env.tag);
          var packed = new Uint8Array(data.length + tag.length);
          packed.set(data, 0); packed.set(tag, data.length);
          return crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: b64ToBytes(env.iv), tagLength: 128 },
            key, packed
          );
        })
        .then(function (plain) {
          return { env: env, html: new TextDecoder('utf-8').decode(plain) };
        })
        .catch(function (e) {
          if (e && e.name === 'OperationError') throw new Error('密码不正确');
          throw e;
        });
    });
  }

  /* ───────── 提交解锁 ───────── */
  gateForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = pw.value;
    if (!v) { say('请输入密码'); return; }
    if (Date.now() < lockedUntil) { say('尝试过多，请稍后再试'); return; }

    gateBtn.disabled = true;
    gateBtn.textContent = '验证中…';
    say('');

    tryUnlock(v).then(function (res) {
      tries = 0;
      clearPw();
      if (remember.checked) lsSet(KEY_STORE, v); else ssSet(KEY_STORE, v);
      enter(res);
    }).catch(function (err) {
      tries++;
      if (tries >= MAX_TRIES) {
        lockedUntil = Date.now() + LOCK_MS;
        tries = 0;
        say('错误次数过多，请 30 秒后再试');
      } else {
        say(err && err.message === '密码不正确' ? '密码不正确' : (err && err.message) || '解密失败');
      }
      gate.classList.remove('shake');
      void gate.offsetWidth;
      gate.classList.add('shake');
      pw.select();
    }).then(function () {
      gateBtn.disabled = false;
      gateBtn.textContent = '进入阅读';
    });
  });

  function say(msg) { gateMsg.textContent = msg || ''; }

  /* ───────── 进入阅读 ───────── */
  function enter(res) {
    unlocked = true;
    content.innerHTML = res.html;

    // 标题同样保存在密文内，解密后从正文里取
    var h1 = content.querySelector('.book-title');
    var title = (h1 && h1.textContent.trim()) || FALLBACK_TITLE;
    topTitle.textContent = title;
    if (title !== document.title) document.title = title;

    buildToc();
    loading.hidden = true;
    gate.hidden = true;
    app.hidden = false;
    toc.hidden = false;

    enhance();
    measure();
    window.scrollTo(0, 0);
    updateScroll();
  }

  /* ───────── 目录 ───────── */
  var sections = [];
  function buildToc() {
    sections = Array.prototype.slice.call(content.querySelectorAll('.chapter'));
    tocList.innerHTML = '';
    sections.forEach(function (sec, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.target = sec.id;
      var n = document.createElement('span');
      n.className = 'n';
      n.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      var t = document.createElement('span');
      t.className = 't';
      var h = sec.querySelector('.chapter-title');
      t.textContent = h ? h.textContent : sec.id;
      btn.appendChild(n);
      btn.appendChild(t);
      btn.addEventListener('click', function () {
        goTo(sec.id);
        if (isNarrow()) closeToc();
      });
      li.appendChild(btn);
      tocList.appendChild(li);
    });
    tocButtons = Array.prototype.slice.call(tocList.querySelectorAll('button'));
  }
  var tocButtons = [];

  /* 立即跳转到指定位置（绕过 CSS 的 scroll-behavior: smooth，避免排队/过冲） */
  function jumpNow(y) {
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    root.style.scrollBehavior = prev;
  }

  /* 平滑滚动 + 兜底：某些环境（后台标签页 / 不支持平滑滚动）下动画会卡住或过冲，
     若位置连续两次采样都无变化或已越过目标，则直接跳到目标处。 */
  function scrollToY(y) {
    y = Math.max(0, Math.round(y));
    var reduced = false;
    try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduced) { jumpNow(y); return; }
    try { window.scrollTo({ top: y, behavior: 'smooth' }); } catch (e) { jumpNow(y); return; }

    var last = window.pageYOffset, stalled = 0, tries = 0;
    var timer = setInterval(function () {
      var now = window.pageYOffset;
      tries++;
      if (Math.abs(now - y) < 6) { clearInterval(timer); return; }
      // 已经越过目标位置（平滑动画异常过冲）→ 立刻纠正
      var overshoot = (y - last > 0 && now > y + 24) || (y - last < 0 && now < y - 24);
      if (Math.abs(now - last) < 1) stalled++; else stalled = 0;
      last = now;
      if (overshoot || stalled >= 2 || tries > 60) { clearInterval(timer); jumpNow(y); }
    }, 220);
  }

  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var head = parseInt(getComputedStyle(root).getPropertyValue('--topbar-h'), 10) || 54;
    var y = el.getBoundingClientRect().top + window.pageYOffset - head - 12;
    scrollToY(y);
  }

  /* 正文内的站内跳转 */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a[data-jump]') : null;
    if (!a) return;
    ev.preventDefault();
    goTo(a.dataset.jump);
    if (isNarrow()) closeToc();
  });

  /* ───────── 抽屉 ───────── */
  function isNarrow() { return window.innerWidth < 1024; }
  function openToc() {
    toc.classList.add('open');
    if (isNarrow()) scrim.hidden = false;
    tocBtn.setAttribute('aria-expanded', 'true');
  }
  function closeToc() {
    toc.classList.remove('open');
    scrim.hidden = true;
    tocBtn.setAttribute('aria-expanded', 'false');
  }
  tocBtn.addEventListener('click', function () {
    toc.classList.contains('open') ? closeToc() : openToc();
  });
  tocClose.addEventListener('click', closeToc);
  scrim.addEventListener('click', closeToc);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!lightbox.hidden) closeLightbox();
      else if (toc.classList.contains('open')) closeToc();
    }
  });
  window.addEventListener('resize', function () {
    if (!isNarrow()) scrim.hidden = true;
  });

  /* ───────── 锁定 ───────── */
  lockBtn.addEventListener('click', function () {
    clearPw();
    unlocked = false;
    content.innerHTML = '';
    sections = []; tocButtons = [];
    tocList.innerHTML = '';
    window.scrollTo(0, 0);
    app.hidden = true;
    gate.hidden = false;
    pw.value = '';
    gate.classList.remove('shake');
    say('');
    pw.focus();
  });

  /* ───────── 滚动进度 / 高亮 ───────── */
  var pending = null;
  function measure() { pending = null; updateScroll(); }

  /* rAF 在后台标签页 / 无合成环境下会被暂停，因此同时挂一个定时器兜底，
     保证进度条与目录高亮不会“卡住不动”。 */
  function scheduleScroll() {
    if (pending) return;
    pending = setTimeout(function () { pending = null; updateScroll(); }, 100);
    requestAnimationFrame(function () {
      if (pending) { clearTimeout(pending); pending = null; updateScroll(); }
    });
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', function () { scheduleScroll(); });
  window.addEventListener('orientationchange', function () { scheduleScroll(); });

  function updateScroll() {
    var y = window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
    toTop.hidden = y < 520;

    if (!sections.length) return;
    var head = parseInt(getComputedStyle(root).getPropertyValue('--topbar-h'), 10) || 54;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top - head - 40 <= 0) idx = i;
    }
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      idx = sections.length - 1;
    }
    for (var j = 0; j < tocButtons.length; j++) {
      var on = j === idx;
      tocButtons[j].classList.toggle('active', on);
      tocButtons[j].classList.toggle('read', j < idx);
    }
  }

  toTop.addEventListener('click', function () { scrollToY(0); });

  /* ───────── 图片灯箱 ───────── */
  function enhance() {
    content.querySelectorAll('.fig img, .extra img').forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || '';
        lightbox.hidden = false;
      });
    });
  }
  function closeLightbox() { lightbox.hidden = true; lbImg.removeAttribute('src'); }
  lightbox.addEventListener('click', function (e) { if (e.target !== lbImg) closeLightbox(); });
  lbClose.addEventListener('click', closeLightbox);

  /* ───────── 启动：尝试已保存的密码 ───────── */
  var saved = storedPw();
  if (saved) {
    tryUnlock(saved).then(function (res) {
      enter(res);
    }).catch(function () {
      clearPw();
      initGate();
    });
  } else {
    initGate();
  }

  function initGate() {
    gate.hidden = false;
    app.hidden = true;
    setTimeout(function () { try { pw.focus({ preventScroll: true }); } catch (e) { pw.focus(); } }, 60);
  }
})();
