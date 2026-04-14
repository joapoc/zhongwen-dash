"use strict";
// @ts-nocheck
var charDB = { '我': { py: 'wǒ', en: 'I, me', rad: '戈', str: 7, hsk: 1 }, '你': { py: 'nǐ', en: 'you', rad: '亻', str: 7, hsk: 1 }, '他': { py: 'tā', en: 'he', rad: '亻', str: 5, hsk: 1 }, '她': { py: 'tā', en: 'she', rad: '女', str: 6, hsk: 1 }, '是': { py: 'shì', en: 'to be', rad: '日', str: 9, hsk: 1 }, '的': { py: 'de', en: 'possessive', rad: '白', str: 8, hsk: 1 }, '了': { py: 'le', en: 'completion', rad: '乛', str: 2, hsk: 1 }, '不': { py: 'bù', en: 'not', rad: '一', str: 4, hsk: 1 }, '在': { py: 'zài', en: 'at, in', rad: '土', str: 6, hsk: 1 }, '有': { py: 'yǒu', en: 'to have', rad: '月', str: 6, hsk: 1 }, '人': { py: 'rén', en: 'person', rad: '人', str: 2, hsk: 1 }, '大': { py: 'dà', en: 'big', rad: '大', str: 3, hsk: 1 }, '小': { py: 'xiǎo', en: 'small', rad: '小', str: 3, hsk: 1 }, '中': { py: 'zhōng', en: 'middle', rad: '丨', str: 4, hsk: 1 }, '学': { py: 'xué', en: 'to study', rad: '子', str: 8, hsk: 1 }, '吃': { py: 'chī', en: 'to eat', rad: '口', str: 6, hsk: 1 }, '喝': { py: 'hē', en: 'to drink', rad: '口', str: 12, hsk: 1 }, '看': { py: 'kàn', en: 'to look', rad: '目', str: 9, hsk: 1 }, '说': { py: 'shuō', en: 'to speak', rad: '讠', str: 9, hsk: 1 }, '听': { py: 'tīng', en: 'to listen', rad: '口', str: 7, hsk: 1 }, '写': { py: 'xiě', en: 'to write', rad: '冖', str: 5, hsk: 1 }, '去': { py: 'qù', en: 'to go', rad: '厶', str: 5, hsk: 1 }, '来': { py: 'lái', en: 'to come', rad: '木', str: 7, hsk: 1 }, '好': { py: 'hǎo', en: 'good', rad: '女', str: 6, hsk: 1 }, '爱': { py: 'ài', en: 'to love', rad: '爫', str: 10, hsk: 1 }, '想': { py: 'xiǎng', en: 'to think', rad: '心', str: 13, hsk: 2 }, '明': { py: 'míng', en: 'bright', rad: '日', str: 8, hsk: 2 }, '谢': { py: 'xiè', en: 'to thank', rad: '讠', str: 12, hsk: 1 }, '语': { py: 'yǔ', en: 'language', rad: '讠', str: 9, hsk: 2 }, '休': { py: 'xiū', en: 'to rest', rad: '亻', str: 6, hsk: 2 }, '天': { py: 'tiān', en: 'day, sky', rad: '大', str: 4, hsk: 1 }, '日': { py: 'rì', en: 'sun', rad: '日', str: 4, hsk: 2 }, '月': { py: 'yuè', en: 'moon', rad: '月', str: 4, hsk: 1 }, '水': { py: 'shuǐ', en: 'water', rad: '水', str: 4, hsk: 1 }, '火': { py: 'huǒ', en: 'fire', rad: '火', str: 4, hsk: 2 }, '山': { py: 'shān', en: 'mountain', rad: '山', str: 3, hsk: 2 }, '口': { py: 'kǒu', en: 'mouth', rad: '口', str: 3, hsk: 2 }, '心': { py: 'xīn', en: 'heart', rad: '心', str: 4, hsk: 2 }, '手': { py: 'shǒu', en: 'hand', rad: '手', str: 4, hsk: 2 }, '木': { py: 'mù', en: 'wood', rad: '木', str: 4, hsk: 3 }, '女': { py: 'nǚ', en: 'woman', rad: '女', str: 3, hsk: 1 }, '子': { py: 'zǐ', en: 'child', rad: '子', str: 3, hsk: 2 }, '饭': { py: 'fàn', en: 'meal', rad: '饣', str: 7, hsk: 1 }, '茶': { py: 'chá', en: 'tea', rad: '艹', str: 9, hsk: 2 }, '花': { py: 'huā', en: 'flower', rad: '艹', str: 7, hsk: 2 }, '妈': { py: 'mā', en: 'mother', rad: '女', str: 6, hsk: 1 } };
var charKeys = Object.keys(charDB);
var wordsPersistTimer = null;
function normalizeSavedWord(word) {
    return {
        cn: word.cn,
        py: word.py,
        en: word.en,
        source: word.source || 'manual',
        sourceArticle: word.sourceArticle || '',
        addedAt: word.addedAt || new Date().toISOString(),
        inFlashcards: word.inFlashcards !== false
    };
}
function queuePersistSavedWords() {
    clearTimeout(wordsPersistTimer);
    wordsPersistTimer = setTimeout(persistSavedWords, 120);
}
function persistSavedWords() {
    fetch('/api/words', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedWords: savedWords })
    }).catch(function (err) {
        console.error('Failed to persist saved words cache.', err);
    });
}
// ===== SAVED WORDS SYSTEM =====
var savedWords = [];
var wlFilter = 'all';
function isWordSaved(cn) { return savedWords.some(function (w) { return w.cn === cn; }); }
function addWord(word) {
    if (isWordSaved(word.cn))
        return false;
    savedWords.push(normalizeSavedWord({ cn: word.cn, py: word.py, en: word.en, source: word.source, sourceArticle: word.sourceArticle, inFlashcards: false }));
    queuePersistSavedWords();
    updateWordCountDisplays();
    return true;
}
function removeWord(cn) {
    savedWords = savedWords.filter(function (w) { return w.cn !== cn; });
    flashcards = flashcards.filter(function (fc) { return fc.source !== 'saved' || fc.srcCn !== cn; });
    queuePersistSavedWords();
    updateWordCountDisplays();
}
function updateWordCountDisplays() {
    var n = savedWords.length;
    var wlBadgeCount = document.getElementById('wlBadgeCount');
    if (wlBadgeCount)
        wlBadgeCount.textContent = n;
    var statSavedWords = document.getElementById('statSavedWords');
    if (statSavedWords)
        statSavedWords.textContent = n;
    var statSavedSub = document.getElementById('statSavedSub');
    if (statSavedSub)
        statSavedSub.textContent = n + ' from articles';
    var ic = document.getElementById('immerseWordCount');
    if (ic)
        ic.textContent = n;
    var wlTotalStat = document.getElementById('wlTotalStat');
    if (wlTotalStat)
        wlTotalStat.textContent = n + ' words';
    var rssCount = savedWords.filter(function (w) { return w.source === 'rss'; }).length;
    var wlSourceStat = document.getElementById('wlSourceStat');
    if (wlSourceStat)
        wlSourceStat.textContent = rssCount + ' from RSS';
}
function showToast(cn, py, en, isRemove) {
    var c = document.getElementById('toastContainer');
    var t = document.createElement('div');
    t.className = 'toast' + (isRemove ? ' remove-toast' : '');
    t.innerHTML = '<span class="toast-icon">' + (isRemove ? '🗑' : '✅') + '</span><div class="toast-text">' + (isRemove ? 'Removed ' : 'Added ') + '<strong>' + cn + '</strong> ' + (py ? '(' + py + ') — ' : '') + (en || '') + (isRemove ? '' : ' → Word List & Flashcards') + '<div class="toast-sub">' + (isRemove ? 'Removed from word list' : 'Click 📖 Words to manage') + '</div></div>';
    c.appendChild(t);
    setTimeout(function () { if (t.parentNode)
        t.parentNode.removeChild(t); }, 3000);
}
function addWordFromVocab(cn, py, en, sourceArticle) {
    if (isWordSaved(cn)) {
        removeWord(cn);
        showToast(cn, py, en, true);
        refreshCurrentArticleVocab();
        renderWordlistContent();
        return;
    }
    var added = addWord({ cn: cn, py: py, en: en, source: 'rss', sourceArticle: sourceArticle || '' });
    if (added) {
        addSavedWordToFlashcards({ cn: cn, py: py, en: en });
        showToast(cn, py, en, false);
        refreshCurrentArticleVocab();
        renderWordlistContent();
    }
}
function addSavedWordToFlashcards(w) {
    var exists = flashcards.some(function (fc) { return fc.source === 'saved' && fc.srcCn === w.cn; });
    if (exists)
        return;
    flashcards.push({ f: w.cn, b: w.py + ' — ' + w.en, source: 'saved', srcCn: w.cn });
    var sw = savedWords.find(function (s) { return s.cn === w.cn; });
    if (sw)
        sw.inFlashcards = true;
    queuePersistSavedWords();
}
function addAllToFlashcards() {
    var count = 0;
    savedWords.forEach(function (w) {
        var exists = flashcards.some(function (fc) { return fc.source === 'saved' && fc.srcCn === w.cn; });
        if (!exists) {
            flashcards.push({ f: w.cn, b: w.py + ' — ' + w.en, source: 'saved', srcCn: w.cn });
            w.inFlashcards = true;
            count++;
        }
    });
    if (count > 0)
        queuePersistSavedWords();
    if (count > 0) {
        showToast(count + ' words', '', 'synced to flashcards', false);
        renderCard();
        renderWordlistContent();
    }
}
function rebuildSavedWordFlashcards() {
    flashcards = flashcards.filter(function (fc) { return fc.source !== 'saved'; });
    savedWords.forEach(function (w) {
        if (w.inFlashcards !== false) {
            flashcards.push({ f: w.cn, b: w.py + ' — ' + w.en, source: 'saved', srcCn: w.cn });
        }
    });
}
function loadSavedWordsCache() {
    return fetch('/api/words').then(function (r) { return r.json(); }).then(function (data) {
        var nextSavedWords = Array.isArray(data.savedWords) ? data.savedWords.map(normalizeSavedWord) : [];
        savedWords = nextSavedWords;
        rebuildSavedWordFlashcards();
        updateWordCountDisplays();
        renderCard();
        refreshCurrentArticleVocab();
        if (document.getElementById('wordlistModal').classList.contains('show'))
            renderWordlistContent();
    }).catch(function (err) {
        console.error('Failed to load saved words cache.', err);
    });
}
var currentDisplayedArticle = null;
function refreshCurrentArticleVocab() { if (currentDisplayedArticle)
    showArticle(currentDisplayedArticle); }
// ===== HIGHLIGHT VOCAB IN TEXT =====
function highlightVocabInText(text, vocabList, articleTitle) {
    // Sort vocab by length descending so longer words matched first
    var sorted = vocabList.slice().sort(function (a, b) { return b.cn.length - a.cn.length; });
    // Build an array of {start,end,vocab} matches
    var matches = [];
    sorted.forEach(function (v) {
        var idx = 0;
        while (true) {
            var pos = text.indexOf(v.cn, idx);
            if (pos === -1)
                break;
            // Check no overlap with existing matches
            var overlaps = false;
            for (var m = 0; m < matches.length; m++) {
                if (pos < matches[m].end && pos + v.cn.length > matches[m].start) {
                    overlaps = true;
                    break;
                }
            }
            if (!overlaps) {
                matches.push({ start: pos, end: pos + v.cn.length, vocab: v });
            }
            idx = pos + 1;
        }
    });
    // Sort matches by position
    matches.sort(function (a, b) { return a.start - b.start; });
    // Build highlighted HTML
    var result = '';
    var lastIdx = 0;
    matches.forEach(function (m) {
        // Add text before match
        result += escapeHtml(text.substring(lastIdx, m.start));
        // Add highlighted span
        var v = m.vocab;
        var saved = isWordSaved(v.cn);
        var eCn = v.cn.replace(/'/g, "\\'");
        var ePy = v.py.replace(/'/g, "\\'");
        var eEn = v.en.replace(/'/g, "\\'");
        var eTitle = (articleTitle || '').replace(/'/g, "\\'");
        result += '<span class="vocab-highlight' + (saved ? ' saved' : '') + '" onclick="addWordFromVocab(\'' + eCn + '\',\'' + ePy + '\',\'' + eEn + '\',\'' + eTitle + '\')">';
        result += escapeHtml(v.cn);
        result += '<span class="vocab-tooltip"><div class="vt-cn">' + v.cn + '</div><div class="vt-py">' + v.py + '</div><div class="vt-en">' + v.en + '</div><div class="vt-btn ' + (saved ? 'added' : 'add') + '">' + (saved ? '✓ Saved' : '➕ Save') + '</div></span>';
        result += '</span>';
        lastIdx = m.end;
    });
    result += escapeHtml(text.substring(lastIdx));
    return result;
}
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// ===== WORDLIST MODAL =====
function toggleWordlist() { document.getElementById('wordlistModal').classList.toggle('show'); if (document.getElementById('wordlistModal').classList.contains('show'))
    renderWordlistContent(); }
function renderWordlistContent() {
    renderWlFilters();
    var c = document.getElementById('wlContent');
    var filtered = wlFilter === 'all' ? savedWords : savedWords.filter(function (w) { return w.source === wlFilter; });
    if (!filtered.length) {
        c.innerHTML = '<div class="wl-empty"><div class="wl-empty-icon">📖</div><div>No words saved yet!<br><span style="font-size:0.72rem;color:#555;">Go to Immerse → RSS Reader and click ➕ on highlighted vocabulary words</span></div></div>';
        return;
    }
    var html = '';
    filtered.forEach(function (w) {
        var srcColor = w.source === 'rss' ? 'var(--cyan)' : 'var(--purple)';
        var srcLabel = w.source === 'rss' ? '📡 RSS' : '✏️ Manual';
        var fcIcon = w.inFlashcards ? '✓' : '🃏';
        var fcClass = w.inFlashcards ? ' fc-added' : '';
        html += '<div class="wl-item"><div class="wl-cn">' + w.cn + '</div><div class="wl-info"><div class="wl-py">' + w.py + '</div><div class="wl-en">' + w.en + '</div>' + (w.sourceArticle ? '<span class="wl-source-tag" style="background:rgba(34,211,238,0.08);color:' + srcColor + ';">' + srcLabel + (w.sourceArticle ? ' · ' + w.sourceArticle.substring(0, 20) + '…' : '') + '</span>' : '<span class="wl-source-tag" style="background:rgba(167,139,250,0.08);color:var(--purple);">' + srcLabel + '</span>') + '</div><div class="wl-actions"><button class="wl-action-btn' + fcClass + '" onclick="addSavedWordToFlashcards({cn:\'' + w.cn.replace(/'/g, "\\'") + '\',py:\'' + w.py.replace(/'/g, "\\'") + '\',en:\'' + w.en.replace(/'/g, "\\'") + '\'}); renderWordlistContent();" title="Add to Flashcards">' + fcIcon + '</button><button class="wl-action-btn delete-btn" onclick="removeWord(\'' + w.cn.replace(/'/g, "\\'") + '\'); showToast(\'' + w.cn.replace(/'/g, "\\'") + '\',\'' + w.py.replace(/'/g, "\\'") + '\',\'' + w.en.replace(/'/g, "\\'") + '\',true); renderWordlistContent(); refreshCurrentArticleVocab();" title="Remove">✕</button></div></div>';
    });
    c.innerHTML = html;
    updateWordCountDisplays();
}
function renderWlFilters() {
    var c = document.getElementById('wlFilterRow');
    var sources = [{ id: 'all', label: 'All' }, { id: 'rss', label: '📡 RSS' }, { id: 'manual', label: '✏️ Manual' }];
    c.innerHTML = '';
    sources.forEach(function (s) {
        var count = s.id === 'all' ? savedWords.length : savedWords.filter(function (w) { return w.source === s.id; }).length;
        var btn = document.createElement('button');
        btn.className = 'wl-filter-btn' + (wlFilter === s.id ? ' active' : '');
        btn.textContent = s.label + ' (' + count + ')';
        btn.onclick = function () { wlFilter = s.id; renderWordlistContent(); };
        c.appendChild(btn);
    });
}
function exportWordlist() {
    var text = savedWords.map(function (w) { return w.cn + '\t' + w.py + '\t' + w.en; }).join('\n');
    if (navigator.clipboard)
        navigator.clipboard.writeText(text).then(function () { showToast('📋', '', 'Word list copied!', false); });
}
function clearWordlist() {
    if (!savedWords.length)
        return;
    savedWords = [];
    flashcards = flashcards.filter(function (fc) { return fc.source !== 'saved'; });
    queuePersistSavedWords();
    updateWordCountDisplays();
    renderWordlistContent();
    renderCard();
    showToast('🗑', '', 'All words cleared', true);
}
function switchTab(tab, btn) { document.querySelectorAll('.tab-content').forEach(function (t) { t.classList.remove('active'); }); document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); }); document.getElementById('tab-' + tab).classList.add('active'); btn.classList.add('active'); if (tab === 'overview') {
    drawTree();
    drawWeeklyChart();
} if (tab === 'practice')
    initWritingCanvas(); if (tab === 'games')
    initMemory(); if (tab === 'immerse') {
    renderImmerse();
    loadAllFeeds();
} }
function filterWidgets(q) { q = q.toLowerCase(); document.querySelectorAll('.widget,.resource-card').forEach(function (w) { var kw = (w.getAttribute('data-keywords') || '') + ' ' + w.textContent.toLowerCase(); w.style.display = q === '' || kw.includes(q) ? '' : 'none'; }); }
function toggleNotifs() { document.getElementById('notifModal').classList.toggle('show'); }
(function () { var h = new Date().getHours(); var g = h < 6 ? '夜好' : h < 12 ? '早上好' : h < 18 ? '下午好' : '晚上好'; var greetingText = document.getElementById('greetingText'); if (greetingText)
    greetingText.innerHTML = g + ', Alex 👋'; })();
var toneMap = { a: ['ā', 'á', 'ǎ', 'à', 'a'], e: ['ē', 'é', 'ě', 'è', 'e'], i: ['ī', 'í', 'ǐ', 'ì', 'i'], o: ['ō', 'ó', 'ǒ', 'ò', 'o'], u: ['ū', 'ú', 'ǔ', 'ù', 'u'], 'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'] };
function applyTone(syl, tone) { var t = parseInt(tone) - 1; var s = syl.toLowerCase().replace(/v/g, 'ü'); if (s.includes('a'))
    return s.replace('a', toneMap.a[t]); if (s.includes('e'))
    return s.replace('e', toneMap.e[t]); if (s.includes('ou'))
    return s.replace('o', toneMap.o[t]); if (s.includes('i') && s.includes('u')) {
    return s.lastIndexOf('i') > s.lastIndexOf('u') ? s.replace('i', toneMap.i[t]) : s.replace('u', toneMap.u[t]);
} if (s.includes('i'))
    return s.replace('i', toneMap.i[t]); if (s.includes('o'))
    return s.replace('o', toneMap.o[t]); if (s.includes('u'))
    return s.replace('u', toneMap.u[t]); if (s.includes('ü'))
    return s.replace('ü', toneMap['ü'][t]); return s; }
function convertPinyin() { var r = document.getElementById('pinyinInput').value.replace(/([a-züü]+?)([1-5])/gi, function (m, s, t) { return applyTone(s, t); }); document.getElementById('pinyinOutput').textContent = r; }
convertPinyin();
function lookupChar() { var ch = document.getElementById('charLookupInput').value.trim(); if (!ch || !charDB[ch]) {
    ['clChar', 'clPinyin', 'clMeaning', 'clRadical', 'clStrokes', 'clHsk'].forEach(function (id) { document.getElementById(id).textContent = '—'; });
    if (ch)
        document.getElementById('clChar').textContent = ch;
    return;
} var d = charDB[ch]; document.getElementById('clChar').textContent = ch; document.getElementById('clPinyin').textContent = d.py; document.getElementById('clMeaning').textContent = d.en; document.getElementById('clRadical').textContent = d.rad; document.getElementById('clStrokes').textContent = d.str; document.getElementById('clHsk').textContent = 'HSK ' + d.hsk; }
var cnD = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'], cnF = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'], cnP = ['líng', 'yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ'];
function numToCn(n, f) { if (n === 0)
    return f ? cnF[0] : cnD[0]; var d = f ? cnF : cnD; var u = f ? ['', '拾', '佰', '仟', '万'] : ['', '十', '百', '千', '万']; var s = String(Math.abs(Math.floor(n))); var r = '', z = false; for (var i = 0; i < s.length; i++) {
    var dg = parseInt(s[i]), p = s.length - 1 - i;
    if (dg === 0)
        z = true;
    else {
        if (z) {
            r += d[0];
            z = false;
        }
        r += d[dg] + (u[p] || '');
    }
} return (n < 0 ? '负' : '') + r || d[0]; }
function convertNumber() { var n = parseInt(document.getElementById('numInput').value) || 0; document.getElementById('numChinese').textContent = numToCn(n); document.getElementById('numFormal').textContent = numToCn(n, true); document.getElementById('numPinyin').textContent = String(Math.abs(n)).split('').map(function (c) { return cnP[parseInt(c)]; }).join(' '); }
convertNumber();
function updateDateTime() { var now = new Date(); var weekCn = ['日', '一', '二', '三', '四', '五', '六']; var y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate(), h = now.getHours(), min = now.getMinutes(), s = now.getSeconds(); var ampm = h < 12 ? '上午' : '下午'; var h12 = h % 12 || 12; document.getElementById('dateTimeDisplay').innerHTML = '<div style="font-size:2rem;font-weight:800;font-family:\'JetBrains Mono\',monospace;background:linear-gradient(135deg,var(--pink),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">' + String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '</div><div class="cn" style="font-size:0.9rem;color:#ccc;margin:8px 0;">' + y + '年' + m + '月' + d + '日 星期' + weekCn[now.getDay()] + '</div><div class="cn" style="font-size:0.75rem;color:var(--accent2);">' + ampm + numToCn(h12) + '点' + (min > 0 ? numToCn(min) + '分' : '') + '</div>'; }
updateDateTime();
setInterval(updateDateTime, 1000);
function selectTone(t) { document.querySelectorAll('.tone-card').forEach(function (c, i) { c.classList.toggle('active', i === t - 1); }); var canvas = document.getElementById('toneCanvas'), ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height; ctx.clearRect(0, 0, w, h); ctx.strokeStyle = '#2a2d3a'; ctx.lineWidth = 1; for (var y2 = 15; y2 < h; y2 += 15) {
    ctx.beginPath();
    ctx.moveTo(0, y2);
    ctx.lineTo(w, y2);
    ctx.stroke();
} ctx.strokeStyle = '#e63946'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); var pad = 40, pw = w - pad * 2; var tones = { 1: [[0, .2], [1, .2]], 2: [[0, .7], [1, .15]], 3: [[0, .45], [.3, .8], [.5, .85], [.7, .6], [1, .2]], 4: [[0, .15], [1, .85]] }; (tones[t] || tones[1]).forEach(function (pt, i) { var px = pad + pt[0] * pw, py = 10 + pt[1] * (h - 20); if (i === 0)
    ctx.moveTo(px, py);
else
    ctx.lineTo(px, py); }); ctx.stroke(); }
selectTone(1);
var codChars = charKeys.filter(function (k) { return charDB[k].hsk <= 2; });
var codIdx = Math.floor(Math.random() * codChars.length);
function renderCOD() { var ch = codChars[codIdx], d = charDB[ch]; document.getElementById('codChar').textContent = ch; document.getElementById('codPinyin').textContent = d.py; document.getElementById('codMeaning').textContent = d.en; document.getElementById('codRadical').textContent = d.rad; document.getElementById('codStrokes').textContent = d.str; document.getElementById('codHsk').textContent = 'HSK ' + d.hsk; }
function newCOD() { codIdx = (codIdx + 1) % codChars.length; renderCOD(); }
renderCOD();
(function () { var c = document.getElementById('heatmap'); for (var w = 0; w < 13; w++) {
    var col = document.createElement('div');
    col.className = 'heatmap-col';
    for (var d = 0; d < 7; d++) {
        var cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        var daysAgo = (12 - w) * 7 + (6 - d);
        var val = Math.random();
        var lvl = daysAgo > 23 && Math.random() > 0.3 ? 0 : val < 0.2 ? 0 : val < 0.4 ? 1 : val < 0.6 ? 2 : val < 0.8 ? 3 : 4;
        if (lvl)
            cell.classList.add('l' + lvl);
        col.appendChild(cell);
    }
    c.appendChild(col);
} })();
function drawWeeklyChart() { var canvas = document.getElementById('weeklyChart'); if (!canvas)
    return; var rect = canvas.parentElement.getBoundingClientRect(); canvas.width = rect.width * 2; canvas.height = 280; var ctx = canvas.getContext('2d'); ctx.scale(2, 2); var w = rect.width, h = 140; ctx.clearRect(0, 0, w, h); var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; var data = [45, 60, 30, 75, 50, 90, 65]; var maxV = 100; var barW = w / 7 - 10; days.forEach(function (d, i) { var x = i * (w / 7) + 5; var bh = (data[i] / maxV) * (h - 30); var grad = ctx.createLinearGradient(0, h - bh - 5, 0, h - 5); grad.addColorStop(0, '#e63946'); grad.addColorStop(1, '#e6394633'); ctx.fillStyle = grad; ctx.fillRect(x + 4, h - bh - 1, barW - 4, bh); ctx.fillStyle = '#888'; ctx.font = '9px Inter'; ctx.textAlign = 'center'; ctx.fillText(d, x + barW / 2, h); ctx.fillStyle = '#ccc'; ctx.font = 'bold 9px JetBrains Mono'; ctx.fillText(data[i] + 'm', x + barW / 2, h - bh - 10); }); }
setTimeout(drawWeeklyChart, 100);
window.addEventListener('resize', drawWeeklyChart);
(function () { var c = document.getElementById('charFreqBars'); [{ ch: '的', p: 95 }, { ch: '是', p: 80 }, { ch: '了', p: 78 }, { ch: '我', p: 72 }, { ch: '不', p: 68 }, { ch: '在', p: 65 }, { ch: '人', p: 60 }, { ch: '有', p: 58 }, { ch: '他', p: 55 }, { ch: '这', p: 50 }, { ch: '大', p: 45 }, { ch: '来', p: 40 }].forEach(function (x, i) { var col = document.createElement('div'); col.className = 'traffic-bar-col'; var bar = document.createElement('div'); bar.className = 'traffic-bar'; bar.style.background = i % 2 ? '#fbbf24' : '#e63946'; bar.style.height = x.p + '%'; var lb = document.createElement('div'); lb.className = 'label'; lb.textContent = x.ch; col.appendChild(bar); col.appendChild(lb); c.appendChild(col); }); })();
var treeDefs = { '好': { char: '好', meaning: 'good', parts: [{ char: '女', meaning: 'woman' }, { char: '子', meaning: 'child' }] }, '明': { char: '明', meaning: 'bright', parts: [{ char: '日', meaning: 'sun' }, { char: '月', meaning: 'moon' }] }, '想': { char: '想', meaning: 'think', parts: [{ char: '相', meaning: 'look', parts: [{ char: '木', meaning: 'wood' }, { char: '目', meaning: 'eye' }] }, { char: '心', meaning: 'heart' }] }, '谢': { char: '谢', meaning: 'thank', parts: [{ char: '讠', meaning: 'speech' }, { char: '射', meaning: 'shoot', parts: [{ char: '身', meaning: 'body' }, { char: '寸', meaning: 'inch' }] }] }, '语': { char: '语', meaning: 'language', parts: [{ char: '讠', meaning: 'speech' }, { char: '吾', meaning: 'I', parts: [{ char: '五', meaning: 'five' }, { char: '口', meaning: 'mouth' }] }] }, '休': { char: '休', meaning: 'rest', parts: [{ char: '亻', meaning: 'person' }, { char: '木', meaning: 'tree' }] } };
var currentTree = '好';
function setTree(ch) { currentTree = ch; }
function drawTree() { var canvas = document.getElementById('topoCanvas'); if (!canvas)
    return; var rect = canvas.parentElement.getBoundingClientRect(); canvas.width = rect.width * 2; canvas.height = rect.height * 2; var ctx = canvas.getContext('2d'); ctx.scale(2, 2); var w = rect.width, h = rect.height; ctx.clearRect(0, 0, w, h); var tree = treeDefs[currentTree]; if (!tree)
    return; function dn(x, y, node, depth) { var s = depth === 0 ? 26 : depth === 1 ? 18 : 14; var tc = depth === 0 ? '#e63946' : depth === 1 ? '#fbbf24' : '#38bdf8'; ctx.fillStyle = tc + '33'; ctx.fillRect(x - s - 4, y - s / 2 - 8, 2 * (s + 4), s + 16); ctx.font = s + 'px Noto Sans SC,serif'; ctx.fillStyle = '#eee'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(node.char, x, y - 2); ctx.font = '8px Inter'; ctx.fillStyle = '#888'; ctx.fillText(node.meaning, x, y + s / 2 + 4); if (node.parts) {
    var sp = Math.max(55, w / (node.parts.length + 1) / (depth + 1));
    var sy = y + 65;
    var sx = x - (node.parts.length - 1) * sp / 2;
    node.parts.forEach(function (p, i) { var cx = sx + i * sp; ctx.strokeStyle = tc + '88'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + s / 2 + 8); ctx.lineTo(cx, sy - 12); ctx.stroke(); dn(cx, sy, p, depth + 1); });
} } dn(w / 2, 35, tree, 0); }
function animTree() { drawTree(); requestAnimationFrame(animTree); }
animTree();
var sentences = [{ parts: [{ text: '我', role: 'Subject', color: '#e63946' }, { text: '喜欢', role: 'Verb', color: '#34d399' }, { text: '中国菜', role: 'Object', color: '#38bdf8' }], tr: 'I like Chinese food.' }, { parts: [{ text: '我', role: 'Subj', color: '#e63946' }, { text: '昨天', role: 'Time', color: '#fbbf24' }, { text: '在学校', role: 'Place', color: '#a78bfa' }, { text: '学了', role: 'Verb', color: '#34d399' }, { text: '中文', role: 'Obj', color: '#38bdf8' }], tr: 'I studied Chinese at school yesterday.' }, { parts: [{ text: '我', role: 'S', color: '#e63946' }, { text: '把', role: '把', color: '#ff6ec7' }, { text: '书', role: 'O', color: '#38bdf8' }, { text: '放在', role: 'V', color: '#34d399' }, { text: '桌子上', role: 'Loc', color: '#a78bfa' }], tr: 'I put the book on the table.' }, { parts: [{ text: '他', role: 'S', color: '#e63946' }, { text: '比', role: '比', color: '#ff6ec7' }, { text: '我', role: 'Ref', color: '#f0a040' }, { text: '高', role: 'Adj', color: '#34d399' }], tr: 'He is taller than me.' }];
function showSentence(idx) { for (var i = 0; i < 4; i++) {
    var b = document.getElementById('sBtn' + i);
    if (b) {
        b.style.borderColor = i === idx ? 'var(--accent)' : 'var(--border)';
        b.style.color = i === idx ? 'var(--accent)' : 'var(--muted)';
    }
} var s = sentences[idx]; var c = document.getElementById('sentenceViz'); c.innerHTML = ''; var row = document.createElement('div'); row.className = 'pkt-row'; s.parts.forEach(function (p) { var div = document.createElement('div'); div.className = 'pkt-field cn'; div.style.background = p.color + '22'; div.style.color = p.color; div.style.fontSize = '0.9rem'; div.innerHTML = p.text + '<small>' + p.role + '</small>'; row.appendChild(div); }); c.appendChild(row); document.getElementById('sentenceInfo').textContent = s.tr; }
showSentence(0);
var questions = [{ q: '你好 means?', opts: ['Goodbye', 'Hello', 'Thanks', 'Sorry'], ans: 1, cat: 'vocab' }, { q: 'Pinyin for 学?', opts: ['shué', 'xié', 'xué', 'xuě'], ans: 2, cat: 'pinyin' }, { q: 'Radical of 好?', opts: ['子', '口', '女', '大'], ans: 2, cat: 'radicals' }, { q: '"I love you"?', opts: ['我想你', '我爱你', '我喜欢你', '我有你'], ans: 1, cat: 'vocab' }, { q: 'Which is "dipping" tone?', opts: ['1st', '2nd', '3rd', '4th'], ans: 2, cat: 'tones' }, { q: '三百四十五 = ?', opts: ['345', '354', '435', '3045'], ans: 0, cat: 'numbers' }, { q: 'Which means "water"?', opts: ['火', '山', '水', '土'], ans: 2, cat: 'characters' }, { q: '谢谢 means?', opts: ['Sorry', 'Hello', 'Please', 'Thank you'], ans: 3, cat: 'vocab' }];
var qIdx = 0, score = 0, total = 0, answered = false, activeCat = 'all';
var cats = [];
questions.forEach(function (q) { if (cats.indexOf(q.cat) === -1)
    cats.push(q.cat); });
var ltrs = ['A', 'B', 'C', 'D'];
function renderQuizCats() { var c = document.getElementById('quizCats'); c.innerHTML = '<button class="quiz-cat-btn active" onclick="setQuizCat(\'all\',this)">All</button>'; cats.forEach(function (cat) { c.innerHTML += '<button class="quiz-cat-btn" onclick="setQuizCat(\'' + cat + '\',this)">' + cat.charAt(0).toUpperCase() + cat.slice(1) + '</button>'; }); }
function setQuizCat(cat, btn) { activeCat = cat; document.querySelectorAll('.quiz-cat-btn').forEach(function (b) { b.classList.remove('active'); }); btn.classList.add('active'); qIdx = 0; nextQuestion(); }
function getFiltered() { return activeCat === 'all' ? questions : questions.filter(function (q) { return q.cat === activeCat; }); }
function renderQ() { answered = false; var f = getFiltered(); if (!f.length)
    return; var q = f[qIdx % f.length]; document.getElementById('qText').textContent = q.q; var c = document.getElementById('qOpts'); c.innerHTML = ''; q.opts.forEach(function (o, i) { var d = document.createElement('div'); d.className = 'quiz-opt'; d.innerHTML = '<span class="letter">' + ltrs[i] + '</span>' + o; d.onclick = function () { if (answered)
    return; answered = true; total++; if (i === q.ans) {
    d.classList.add('correct');
    score++;
}
else {
    d.classList.add('wrong');
    c.children[q.ans].classList.add('correct');
} document.getElementById('qScore').textContent = 'Score: ' + score + ' / ' + total; }; c.appendChild(d); }); }
function nextQuestion() { qIdx = (qIdx + 1) % getFiltered().length; renderQ(); }
renderQuizCats();
renderQ();
var flashcards = [{ f: '你好', b: 'nǐ hǎo — Hello', source: 'default' }, { f: '谢谢', b: 'xièxie — Thank you', source: 'default' }, { f: '再见', b: 'zàijiàn — Goodbye', source: 'default' }, { f: '学习', b: 'xuéxí — To study', source: 'default' }, { f: '朋友', b: 'péngyou — Friend', source: 'default' }, { f: '吃饭', b: 'chīfàn — To eat', source: 'default' }, { f: '工作', b: 'gōngzuò — Work', source: 'default' }, { f: '开心', b: 'kāixīn — Happy', source: 'default' }];
var fcIdx = 0;
var fcDeck = 'default';
function getActiveDeck() { if (fcDeck === 'default')
    return flashcards.filter(function (fc) { return fc.source === 'default'; }); if (fcDeck === 'saved')
    return flashcards.filter(function (fc) { return fc.source === 'saved'; }); return flashcards; }
function switchFCDeck(deck) { fcDeck = deck; fcIdx = 0; renderCard(); }
function renderCard() { var deck = getActiveDeck(); document.getElementById('flashInner').classList.remove('flipped'); if (!deck.length) {
    document.getElementById('fcFront').textContent = 'No cards';
    document.getElementById('fcBack').textContent = fcDeck === 'saved' ? 'Save words from RSS articles first!' : 'No cards';
    document.getElementById('fcCounter').textContent = '0/0';
    document.getElementById('fcSourceTag').textContent = '';
    return;
} fcIdx = fcIdx % deck.length; document.getElementById('fcFront').textContent = deck[fcIdx].f; document.getElementById('fcBack').textContent = deck[fcIdx].b; document.getElementById('fcCounter').textContent = (fcIdx + 1) + '/' + deck.length; var src = deck[fcIdx].source; var st = document.getElementById('fcSourceTag'); if (src === 'saved') {
    st.textContent = '📡 RSS';
    st.style.background = 'rgba(34,211,238,0.13)';
    st.style.color = 'var(--cyan)';
}
else {
    st.textContent = '📦 Default';
    st.style.background = 'rgba(167,139,250,0.13)';
    st.style.color = 'var(--purple)';
} }
function flipCard() { document.getElementById('flashInner').classList.toggle('flipped'); }
function nextCard() { var deck = getActiveDeck(); if (deck.length)
    fcIdx = (fcIdx + 1) % deck.length; renderCard(); }
function prevCard() { var deck = getActiveDeck(); if (deck.length)
    fcIdx = (fcIdx - 1 + deck.length) % deck.length; renderCard(); }
renderCard();
var fibData = [{ sentence: '我___中文。', blank: '学', choices: ['学', '吃', '喝', '看'], hint: 'I ___ Chinese.' }, { sentence: '她很___。', blank: '漂亮', choices: ['漂亮', '吃饭', '工作', '学习'], hint: 'She is very ___.' }, { sentence: '今天天气很___。', blank: '好', choices: ['人', '大', '好', '吃'], hint: 'Today weather is very ___.' }];
var fibIdx = 0;
function renderFIB() { var f = fibData[fibIdx % fibData.length]; var area = document.getElementById('fibArea'); area.innerHTML = '<div class="fib-sentence cn">' + f.sentence.replace('___', '<span class="fib-blank" id="fibBlank">?</span>') + '</div><div style="font-size:0.7rem;color:var(--muted);margin-bottom:8px;">' + f.hint + '</div><div class="fib-choices" id="fibChoices"></div>'; var cc = document.getElementById('fibChoices'); var a2 = false; f.choices.forEach(function (ch) { var btn = document.createElement('div'); btn.className = 'fib-choice cn'; btn.textContent = ch; btn.onclick = function () { if (a2)
    return; a2 = true; if (ch === f.blank) {
    btn.classList.add('selected');
    document.getElementById('fibBlank').textContent = ch;
    document.getElementById('fibBlank').style.color = 'var(--green)';
}
else {
    btn.classList.add('wrong-sel');
    cc.querySelectorAll('.fib-choice').forEach(function (b) { if (b.textContent === f.blank)
        b.classList.add('selected'); });
    document.getElementById('fibBlank').textContent = f.blank;
} }; cc.appendChild(btn); }); }
function nextFIB() { fibIdx++; renderFIB(); }
renderFIB();
var checklistData = [{ label: 'Pinyin & Tones', cat: 'Basics', done: true }, { label: 'Greetings', cat: 'Basics', done: true }, { label: 'HSK 1 Vocabulary', cat: 'Vocab', done: true }, { label: 'HSK 2 Vocabulary', cat: 'Vocab', done: true }, { label: 'Save 5 words from RSS', cat: 'Immerse', done: false }, { label: 'Review saved flashcards', cat: 'Study', done: false }];
function renderChecklist() { var c = document.getElementById('checklist'); c.innerHTML = ''; checklistData.forEach(function (item, i) { var d = document.createElement('div'); d.className = 'check-item' + (item.done ? ' done' : ''); d.innerHTML = '<div class="check-box">' + (item.done ? '✓' : '') + '</div><span class="check-label">' + item.label + '</span><span class="check-cat">' + item.cat + '</span>'; d.onclick = function () { checklistData[i].done = !checklistData[i].done; renderChecklist(); }; c.appendChild(d); }); document.getElementById('checkProgress').textContent = Math.round(checklistData.filter(function (i) { return i.done; }).length / checklistData.length * 100) + '%'; }
renderChecklist();
var tips = ['<strong>Tone pairs matter!</strong> 你好 — two 3rd tones: nǐ hǎo → ní hǎo.', '<strong>Radicals are key.</strong> 氵= water → 河 海 湖', '<strong>Save RSS vocab!</strong> Click highlighted words in articles to build your dictionary.', '<strong>Hover vocab!</strong> Highlighted words in articles show pinyin + meaning tooltip.', '<strong>把 (bǎ):</strong> 我把门关了 = "I closed the door."'];
var tipIdx = 0;
function newTip() { tipIdx = (tipIdx + 1) % tips.length; document.getElementById('tipText').innerHTML = tips[tipIdx]; }
document.getElementById('tipText').innerHTML = tips[0];
var typingTexts = ['ni hao wo shi xuesheng', 'jintian tianqi hen hao', 'wo xihuan chi zhongguo cai'];
var typingTarget = '', typingStart = 0;
function resetTyping() { typingTarget = typingTexts[Math.floor(Math.random() * typingTexts.length)]; typingStart = 0; document.getElementById('typingInput').value = ''; renderTypingDisplay(''); document.getElementById('typSpeed').textContent = '0'; document.getElementById('typAccuracy').textContent = '100%'; document.getElementById('typProgress').textContent = '0%'; }
function renderTypingDisplay(typed) { var d = document.getElementById('typingDisplay'); var html = ''; for (var i = 0; i < typingTarget.length; i++) {
    if (i < typed.length) {
        html += typed[i] === typingTarget[i] ? '<span class="typed">' + typingTarget[i] + '</span>' : '<span class="error-char">' + typingTarget[i] + '</span>';
    }
    else if (i === typed.length) {
        html += '<span class="current">' + typingTarget[i] + '</span>';
    }
    else
        html += typingTarget[i];
} d.innerHTML = html; }
function handleTyping() { var typed = document.getElementById('typingInput').value; if (!typingStart && typed.length)
    typingStart = Date.now(); renderTypingDisplay(typed); var elapsed = Math.max(1, (Date.now() - typingStart) / 60000); var correct = typed.split('').filter(function (c, i) { return c === typingTarget[i]; }).length; document.getElementById('typSpeed').textContent = Math.round(correct / elapsed) + ' CPM'; document.getElementById('typAccuracy').textContent = (typed.length ? Math.round(correct / typed.length * 100) : 100) + '%'; document.getElementById('typProgress').textContent = Math.min(Math.round(typed.length / typingTarget.length * 100), 100) + '%'; }
resetTyping();
var radicals = [{ ch: '亻', py: 'rén', en: 'person' }, { ch: '口', py: 'kǒu', en: 'mouth' }, { ch: '女', py: 'nǚ', en: 'woman' }, { ch: '子', py: 'zǐ', en: 'child' }, { ch: '日', py: 'rì', en: 'sun' }, { ch: '月', py: 'yuè', en: 'moon' }, { ch: '水', py: 'shuǐ', en: 'water' }, { ch: '火', py: 'huǒ', en: 'fire' }, { ch: '木', py: 'mù', en: 'wood' }, { ch: '土', py: 'tǔ', en: 'earth' }, { ch: '心', py: 'xīn', en: 'heart' }, { ch: '手', py: 'shǒu', en: 'hand' }, { ch: '山', py: 'shān', en: 'mountain' }, { ch: '大', py: 'dà', en: 'big' }, { ch: '艹', py: 'cǎo', en: 'grass' }, { ch: '纟', py: 'sī', en: 'silk' }];
(function () { var c = document.getElementById('radicalGrid'); radicals.forEach(function (r) { c.innerHTML += '<div class="radical-card"><div class="radical-char">' + r.ch + '</div><div class="radical-pinyin">' + r.py + '</div><div class="radical-meaning">' + r.en + '</div></div>'; }); })();
var hskVocab = { 1: [{ ch: '你好', py: 'nǐ hǎo', en: 'hello' }, { ch: '谢谢', py: 'xièxie', en: 'thank you' }, { ch: '再见', py: 'zàijiàn', en: 'goodbye' }, { ch: '请', py: 'qǐng', en: 'please' }, { ch: '是', py: 'shì', en: 'to be' }, { ch: '有', py: 'yǒu', en: 'to have' }, { ch: '吃', py: 'chī', en: 'to eat' }], 2: [{ ch: '已经', py: 'yǐjīng', en: 'already' }, { ch: '因为', py: 'yīnwèi', en: 'because' }, { ch: '所以', py: 'suǒyǐ', en: 'therefore' }, { ch: '虽然', py: 'suīrán', en: 'although' }, { ch: '但是', py: 'dànshì', en: 'but' }], 3: [{ ch: '终于', py: 'zhōngyú', en: 'finally' }, { ch: '而且', py: 'érqiě', en: 'moreover' }, { ch: '适合', py: 'shìhé', en: 'suitable' }, { ch: '提高', py: 'tígāo', en: 'improve' }] };
function showHSK(lvl, btn) { document.querySelectorAll('.hsk-btn').forEach(function (b) { b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted)'; }); btn.style.borderColor = 'var(--accent)'; btn.style.color = 'var(--accent)'; var c = document.getElementById('hskList'); c.innerHTML = ''; hskVocab[lvl].forEach(function (w) { c.innerHTML += '<div class="phrase-item"><span class="phrase-cn">' + w.ch + '</span><span class="phrase-py">' + w.py + '</span><span class="phrase-en">' + w.en + '</span></div>'; }); }
showHSK(1, document.querySelector('.hsk-btn'));
var grammarPatterns = [{ pattern: 'S + V + O', desc: 'Basic SVO', ex: '<strong>我吃饭。</strong>' }, { pattern: 'S + 很 + Adj', desc: 'Adj predicates', ex: '<strong>她很漂亮。</strong>' }, { pattern: '是...的', desc: 'Emphasis', ex: '<strong>我是昨天来的。</strong>' }, { pattern: '把 + O + V', desc: 'Disposal', ex: '<strong>请把门关上。</strong>' }, { pattern: '被 + Agent + V', desc: 'Passive', ex: '<strong>蛋糕被他吃了。</strong>' }];
(function () { var c = document.getElementById('grammarList'); grammarPatterns.forEach(function (g) { var d = document.createElement('div'); d.className = 'grammar-item'; d.innerHTML = '<div class="grammar-pattern">' + g.pattern + '</div><div class="grammar-desc">' + g.desc + '</div><div class="grammar-example">' + g.ex + '</div>'; d.onclick = function () { d.classList.toggle('expanded'); }; c.appendChild(d); }); })();
var idioms = [{ ch: '一举两得', py: 'yì jǔ liǎng dé', en: 'Two birds one stone' }, { ch: '画蛇添足', py: 'huà shé tiān zú', en: 'Over-doing it' }, { ch: '马马虎虎', py: 'mǎmahūhū', en: 'So-so' }];
(function () { var c = document.getElementById('idiomList'); idioms.forEach(function (item) { var d = document.createElement('div'); d.className = 'idiom-item'; d.innerHTML = '<div class="idiom-chars">' + item.ch + '</div><div class="idiom-py">' + item.py + '</div><div class="idiom-meaning"><strong>Meaning:</strong> ' + item.en + '</div>'; d.onclick = function () { d.classList.toggle('expanded'); }; c.appendChild(d); }); })();
var phrases2 = [{ ch: '你好', py: 'nǐ hǎo', en: 'Hello' }, { ch: '谢谢', py: 'xièxie', en: 'Thanks' }, { ch: '不客气', py: 'bú kèqi', en: 'Welcome' }, { ch: '对不起', py: 'duìbuqǐ', en: 'Sorry' }, { ch: '多少钱？', py: 'duōshao qián?', en: 'How much?' }, { ch: '加油！', py: 'jiā yóu!', en: 'Keep going!' }];
(function () { var c = document.getElementById('phraseList'); phrases2.forEach(function (p) { c.innerHTML += '<div class="phrase-item"><span class="phrase-cn">' + p.ch + '</span><span class="phrase-py">' + p.py + '</span><span class="phrase-en">' + p.en + '</span></div>'; }); })();
var cultureNotes = [{ title: '🧧 Red Envelopes', body: 'Red envelopes (红包) contain money given during New Year.' }, { title: '🏮 Chinese New Year', body: 'Biggest holiday. Family reunion, fireworks, 红包.' }, { title: '🍜 Food Culture', body: 'Communal dining. Never stick chopsticks upright in rice.' }];
(function () { var c = document.getElementById('cultureList'); cultureNotes.forEach(function (n) { var d = document.createElement('div'); d.className = 'culture-card'; d.innerHTML = '<div class="culture-title">' + n.title + '</div><div class="culture-body">' + n.body + '</div>'; d.onclick = function () { d.classList.toggle('expanded'); }; c.appendChild(d); }); })();
var pomo = { running: false, time: 25 * 60, mode: 'focus', session: 3, interval: null };
function updatePomo() { var m = String(Math.floor(pomo.time / 60)).padStart(2, '0'), s = String(pomo.time % 60).padStart(2, '0'); document.getElementById('pomoTime').textContent = m + ':' + s; document.getElementById('pomoLabel').textContent = pomo.mode === 'focus' ? '专注学习 · Focus' : '休息 · Break'; var d = document.getElementById('pomoSessions'); d.innerHTML = ''; for (var i = 0; i < 4; i++)
    d.innerHTML += '<div class="pomo-dot' + (i < pomo.session ? ' done' : '') + '"></div>'; }
function pomoAction(a) { if (a === 'start') {
    if (pomo.running)
        return;
    pomo.running = true;
    pomo.interval = setInterval(function () { pomo.time--; if (pomo.time <= 0) {
        if (pomo.mode === 'focus') {
            pomo.session++;
            pomo.mode = 'break';
            pomo.time = 5 * 60;
        }
        else {
            pomo.mode = 'focus';
            pomo.time = 25 * 60;
        }
    } updatePomo(); }, 1000);
}
else if (a === 'pause') {
    pomo.running = false;
    clearInterval(pomo.interval);
}
else if (a === 'reset') {
    pomo.running = false;
    clearInterval(pomo.interval);
    pomo.time = 25 * 60;
    pomo.mode = 'focus';
    updatePomo();
} }
updatePomo();
document.getElementById('termInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') {
    var cmd = this.value.trim();
    if (!cmd)
        return;
    processCmd(cmd);
    this.value = '';
} });
function termPrint(text, cls) { var out = document.getElementById('termOutput'); var d = document.createElement('div'); d.className = 'terminal-line' + (cls ? ' ' + cls : ''); d.innerHTML = text; out.appendChild(d); out.scrollTop = out.scrollHeight; }
function processCmd(cmd) { termPrint('<span class="prompt">> </span>' + cmd); var parts = cmd.trim().split(/\s+/); var c = parts[0].toLowerCase(); if (c === 'help') {
    termPrint('Commands: lookup, pinyin, random, quiz, answer, number, wordlist, clear, help', 'info');
}
else if (c === 'clear')
    document.getElementById('termOutput').innerHTML = '';
else if (c === 'wordlist') {
    if (!savedWords.length)
        termPrint('Word list empty. Save words from RSS!', 'warn');
    else {
        termPrint('📖 Saved Words (' + savedWords.length + '):', 'info');
        savedWords.forEach(function (w) { termPrint('  ' + w.cn + ' (' + w.py + ') — ' + w.en + ' [' + w.source + ']', 'info'); });
    }
}
else if (c === 'lookup') {
    var ch = parts[1];
    if (ch && charDB[ch]) {
        var d = charDB[ch];
        termPrint(ch + ' (' + d.py + ') — ' + d.en + ' | ' + d.rad + ' | ' + d.str + ' strokes', 'info');
    }
    else
        termPrint('Not found.', 'warn');
}
else if (c === 'random') {
    var ch6 = charKeys[Math.floor(Math.random() * charKeys.length)];
    var d6 = charDB[ch6];
    termPrint(ch6 + ' (' + d6.py + ') — ' + d6.en + ' | HSK ' + d6.hsk, 'info');
}
else if (c === 'number') {
    var n = parseInt(parts[1]);
    if (!isNaN(n))
        termPrint(n + ' → ' + numToCn(n), 'info');
    else
        termPrint('Usage: number 123', 'error');
}
else if (c === 'quiz') {
    var ch5 = charKeys[Math.floor(Math.random() * charKeys.length)];
    var d5 = charDB[ch5];
    termPrint('What does ' + ch5 + ' mean? (Type "answer")', 'info');
    window._qa = ch5 + ' (' + d5.py + ') — ' + d5.en;
}
else if (c === 'answer') {
    if (window._qa) {
        termPrint(window._qa, 'info');
        window._qa = null;
    }
    else
        termPrint('No quiz active.', 'warn');
}
else if (c === 'pinyin') {
    var t = parts.slice(1).join(' ');
    termPrint(t.replace(/([a-züü]+?)([1-5])/gi, function (m2, s2, tn) { return applyTone(s2, tn); }), 'info');
}
else
    termPrint('Unknown: ' + c + '. Type \'help\'.', 'error'); }
var writeChars = ['你', '好', '我', '是', '学', '中', '大', '小', '人', '天', '日', '月', '水', '爱', '心'];
var writeIdx = 0, isDrawing = false, lastPos = null;
function initWritingCanvas() { drawWritingGrid(); }
function drawWritingGrid() { var canvas = document.getElementById('writingCanvas'); if (!canvas)
    return; var ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height; ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0a0c10'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#2a2d3a'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke(); ctx.setLineDash([]); ctx.font = '160px Noto Sans SC,serif'; ctx.fillStyle = '#ffffff08'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(writeChars[writeIdx], w / 2, h / 2); document.getElementById('writingChar').textContent = writeChars[writeIdx]; }
function clearWriting() { drawWritingGrid(); }
function nextWriteChar() { writeIdx = (writeIdx + 1) % writeChars.length; drawWritingGrid(); }
function prevWriteChar() { writeIdx = (writeIdx - 1 + writeChars.length) % writeChars.length; drawWritingGrid(); }
(function () { var canvas = document.getElementById('writingCanvas'); if (!canvas)
    return; var ctx = canvas.getContext('2d'); function gp(e) { var r = canvas.getBoundingClientRect(); var t = e.touches ? e.touches[0] : e; return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) }; } canvas.addEventListener('mousedown', function (e) { e.preventDefault(); isDrawing = true; lastPos = gp(e); }); canvas.addEventListener('mousemove', function (e) { e.preventDefault(); if (!isDrawing)
    return; var p = gp(e); ctx.strokeStyle = '#eee'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lastPos.x, lastPos.y); ctx.lineTo(p.x, p.y); ctx.stroke(); lastPos = p; }); canvas.addEventListener('mouseup', function () { isDrawing = false; }); canvas.addEventListener('mouseleave', function () { isDrawing = false; }); canvas.addEventListener('touchstart', function (e) { e.preventDefault(); isDrawing = true; lastPos = gp(e); }, { passive: false }); canvas.addEventListener('touchmove', function (e) { e.preventDefault(); if (!isDrawing)
    return; var p = gp(e); ctx.strokeStyle = '#eee'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lastPos.x, lastPos.y); ctx.lineTo(p.x, p.y); ctx.stroke(); lastPos = p; }, { passive: false }); canvas.addEventListener('touchend', function () { isDrawing = false; }); drawWritingGrid(); })();
var dialogues = [{ scene: '🏪 At a store', messages: [{ who: '店员', text: '你好！欢迎光临！' }, { who: '你', text: '(Greet)' }], choices: [{ text: '你好！我想买东西。', correct: true, reply: '好的！你想买什么？' }, { text: '再见！', correct: false, reply: '啊？你要走了？' }] }, { scene: '🍜 Restaurant', messages: [{ who: '服务员', text: '请问要点什么？' }, { who: '你', text: '(Order)' }], choices: [{ text: '我要一碗面条。', correct: true, reply: '好的！还要别的吗？' }, { text: '你好吗？', correct: false, reply: '我很好...你要点菜吗？' }] }];
var dlgIdx = 0;
function renderDialogue() { var d = dialogues[dlgIdx]; document.getElementById('dialogueScene').textContent = d.scene; var msgs = document.getElementById('dialogueMessages'); msgs.innerHTML = ''; d.messages.forEach(function (m) { var isy = m.who === '你'; msgs.innerHTML += '<div style="padding:8px 10px;background:' + (isy ? 'rgba(230,57,70,0.1)' : 'var(--surface)') + ';border-radius:8px;font-size:0.78rem;font-family:\'Noto Sans SC\',sans-serif;"><strong style="color:' + (isy ? 'var(--accent)' : 'var(--blue)') + ';">' + m.who + ':</strong> ' + m.text + '</div>'; }); var cc = document.getElementById('dialogueChoices'); cc.innerHTML = ''; d.choices.forEach(function (ch, i) { var btn = document.createElement('div'); btn.className = 'quiz-opt'; btn.style.fontFamily = "'Noto Sans SC','Inter',sans-serif"; btn.innerHTML = '<span class="letter">' + ltrs[i] + '</span>' + ch.text; btn.onclick = function () { cc.querySelectorAll('.quiz-opt').forEach(function (b) { b.style.pointerEvents = 'none'; }); btn.classList.add(ch.correct ? 'correct' : 'wrong'); var r = document.createElement('div'); r.style.cssText = 'padding:8px;background:var(--surface);border-radius:8px;font-size:0.78rem;margin-top:6px;font-family:"Noto Sans SC",sans-serif;'; r.innerHTML = '<strong style="color:var(--blue);">Reply:</strong> ' + ch.reply; document.getElementById('dialogueMessages').appendChild(r); }; cc.appendChild(btn); }); }
function nextDialogue() { dlgIdx = (dlgIdx + 1) % dialogues.length; renderDialogue(); }
renderDialogue();
var memCards = [], memFlipped = [], memMatched = 0, memMoves = 0, memLock = false;
function initMemory() { var pool = charKeys.filter(function (k) { return charDB[k].str <= 8; }).sort(function () { return Math.random() - .5; }).slice(0, 8); var pairs = []; pool.forEach(function (ch) { pairs.push({ type: 'char', value: ch, id: ch }); pairs.push({ type: 'meaning', value: charDB[ch].en, id: ch }); }); memCards = pairs.sort(function () { return Math.random() - .5; }); memFlipped = []; memMatched = 0; memMoves = 0; memLock = false; document.getElementById('memScore').textContent = 'Moves: 0'; var g = document.getElementById('memGrid'); g.innerHTML = ''; memCards.forEach(function (c2, i) { var d = document.createElement('div'); d.className = 'mem-card'; d.textContent = c2.type === 'char' ? c2.value : c2.value; d.dataset.idx = i; d.onclick = function () { flipMem(i); }; g.appendChild(d); }); }
function flipMem(idx) { if (memLock)
    return; var cards = document.querySelectorAll('.mem-card'); var card = cards[idx]; if (card.classList.contains('flipped') || card.classList.contains('matched'))
    return; card.classList.add('flipped'); memFlipped.push(idx); if (memFlipped.length === 2) {
    memMoves++;
    document.getElementById('memScore').textContent = 'Moves: ' + memMoves;
    memLock = true;
    var a = memFlipped[0], b = memFlipped[1];
    if (memCards[a].id === memCards[b].id && a !== b) {
        cards[a].classList.add('matched');
        cards[b].classList.add('matched');
        memMatched += 2;
        memFlipped = [];
        memLock = false;
    }
    else {
        setTimeout(function () { cards[a].classList.remove('flipped'); cards[b].classList.remove('flipped'); memFlipped = []; memLock = false; }, 800);
    }
} }
initMemory();
var toneScore = 0;
var toneWords = [{ ch: '妈', tone: 1 }, { ch: '麻', tone: 2 }, { ch: '马', tone: 3 }, { ch: '骂', tone: 4 }, { ch: '花', tone: 1 }, { ch: '人', tone: 2 }, { ch: '水', tone: 3 }, { ch: '大', tone: 4 }];
function newToneGame() { var w = toneWords[Math.floor(Math.random() * toneWords.length)]; var area = document.getElementById('toneGameArea'); area.innerHTML = '<div class="cn" style="font-size:3rem;font-weight:800;color:#eee;margin:10px;">' + w.ch + '</div><div style="font-size:0.75rem;color:var(--muted);margin-bottom:12px;">What tone?</div><div style="display:flex;gap:8px;justify-content:center;" id="toneGameBtns"></div><div style="margin-top:10px;"><button class="btn-secondary btn-small" onclick="newToneGame()">Next →</button></div>'; var btns = document.getElementById('toneGameBtns'); var ans = false; [1, 2, 3, 4].forEach(function (t) { var b = document.createElement('button'); b.className = 'btn-secondary'; b.textContent = t === 1 ? '1st ¯' : t === 2 ? '2nd ´' : t === 3 ? '3rd ˇ' : '4th `'; b.onclick = function () { if (ans)
    return; ans = true; if (t === w.tone) {
    b.style.borderColor = 'var(--green)';
    b.style.color = 'var(--green)';
    toneScore++;
    document.getElementById('toneGameScore').textContent = 'Score: ' + toneScore;
}
else {
    b.style.borderColor = 'var(--red)';
    b.style.color = 'var(--red)';
    btns.children[w.tone - 1].style.borderColor = 'var(--green)';
    btns.children[w.tone - 1].style.color = 'var(--green)';
} }; btns.appendChild(b); }); }
newToneGame();
var scramScore = 0;
var scramWords = [{ ch: '你好', en: 'hello' }, { ch: '谢谢', en: 'thank you' }, { ch: '学习', en: 'study' }, { ch: '中国', en: 'China' }, { ch: '朋友', en: 'friend' }];
function newScramble() { var w = scramWords[Math.floor(Math.random() * scramWords.length)]; var chars = w.ch.split('').sort(function () { return Math.random() - .5; }); var area = document.getElementById('scrambleArea'); area.innerHTML = '<div style="font-size:0.8rem;color:var(--muted);margin-bottom:8px;">Unscramble: <strong>' + w.en + '</strong></div><div style="display:flex;gap:8px;justify-content:center;margin-bottom:10px;" id="scramBtns"></div><div class="cn" style="font-size:1.5rem;font-weight:700;min-height:40px;color:var(--accent2);" id="scramResult"></div><div style="display:flex;gap:6px;justify-content:center;margin-top:8px;"><button class="btn-secondary btn-small" onclick="scramClear()">Clear</button><button class="btn-secondary btn-small" onclick="scramCheck()">Check</button><button class="btn-secondary btn-small" onclick="newScramble()">Next →</button></div>'; window._scramAns = w.ch; window._scramPicked = []; var btns = document.getElementById('scramBtns'); chars.forEach(function (c3) { var b = document.createElement('button'); b.className = 'btn-secondary cn'; b.style.fontSize = '1.3rem'; b.style.minWidth = '44px'; b.textContent = c3; b.dataset.used = '0'; b.onclick = function () { if (b.dataset.used === '1')
    return; b.dataset.used = '1'; b.style.opacity = '0.3'; window._scramPicked.push(c3); document.getElementById('scramResult').textContent = window._scramPicked.join(''); }; btns.appendChild(b); }); }
function scramClear() { window._scramPicked = []; document.getElementById('scramResult').textContent = ''; document.querySelectorAll('#scramBtns button').forEach(function (b) { b.dataset.used = '0'; b.style.opacity = '1'; }); }
function scramCheck() { var r = document.getElementById('scramResult'); if (window._scramPicked.join('') === window._scramAns) {
    r.style.color = 'var(--green)';
    scramScore++;
    document.getElementById('scrambleScore').textContent = 'Score: ' + scramScore;
}
else {
    r.style.color = 'var(--red)';
    setTimeout(function () { r.textContent = window._scramAns; r.style.color = 'var(--green)'; }, 1000);
} }
newScramble();
// ===== RSS READER =====
var rssFeeds = [{ id: 'bbc', name: 'BBC 中文', nameCn: 'BBC中文网', color: '#e63946', url: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml', icon: '🇬🇧' }, { id: 'rfi', name: 'RFI 中文', nameCn: '法广中文', color: '#38bdf8', url: 'https://www.rfi.fr/cn/rss', icon: '🇫🇷' }, { id: 'dw', name: 'DW 中文', nameCn: '德国之声', color: '#fbbf24', url: 'https://rss.dw.com/xml/rss-chi-all', icon: '🇩🇪' }, { id: 'voa', name: 'VOA 中文', nameCn: '美国之音', color: '#34d399', url: 'https://www.voachinese.com/api/zmgqoe$moi', icon: '🇺🇸' }, { id: 'zaobao', name: '联合早报', nameCn: '联合早报', color: '#f0a040', url: 'https://www.zaobao.com/rss', icon: '🇸🇬' }, { id: 'nyt', name: 'NYT 中文', nameCn: '纽约时报', color: '#a78bfa', url: 'https://cn.nytimes.com/rss/', icon: '🗽' }];
var allRssArticles = [];
var activeRssFeed = 'all';
var rssLoaded = false;
function extractVocab() {
    var vocabBank = [{ cn: '国际', py: 'guójì', en: 'international' }, { cn: '经济', py: 'jīngjì', en: 'economy' }, { cn: '政府', py: 'zhèngfǔ', en: 'government' }, { cn: '发展', py: 'fāzhǎn', en: 'develop' }, { cn: '社会', py: 'shèhuì', en: 'society' }, { cn: '问题', py: 'wèntí', en: 'problem' }, { cn: '报道', py: 'bàodào', en: 'report' }, { cn: '世界', py: 'shìjiè', en: 'world' }, { cn: '技术', py: 'jìshù', en: 'technology' }, { cn: '安全', py: 'ānquán', en: 'safety' }, { cn: '合作', py: 'hézuò', en: 'cooperation' }, { cn: '影响', py: 'yǐngxiǎng', en: 'influence' }, { cn: '环境', py: 'huánjìng', en: 'environment' }, { cn: '文化', py: 'wénhuà', en: 'culture' }, { cn: '教育', py: 'jiàoyù', en: 'education' }, { cn: '关系', py: 'guānxi', en: 'relationship' }, { cn: '市场', py: 'shìchǎng', en: 'market' }, { cn: '历史', py: 'lìshǐ', en: 'history' }, { cn: '记者', py: 'jìzhě', en: 'journalist' }, { cn: '消息', py: 'xiāoxi', en: 'news' }, { cn: '表示', py: 'biǎoshì', en: 'express' }, { cn: '分析', py: 'fēnxī', en: 'analyze' }, { cn: '领导', py: 'lǐngdǎo', en: 'leader' }, { cn: '决定', py: 'juédìng', en: 'decide' }, { cn: '情况', py: 'qíngkuàng', en: 'situation' }, { cn: '研究', py: 'yánjiū', en: 'research' }, { cn: '增长', py: 'zēngzhǎng', en: 'growth' }, { cn: '政策', py: 'zhèngcè', en: 'policy' }, { cn: '贸易', py: 'màoyì', en: 'trade' }, { cn: '公司', py: 'gōngsī', en: 'company' }];
    return vocabBank.sort(function () { return Math.random() - .5; }).slice(0, Math.floor(Math.random() * 4) + 4);
}
function fetchRSS(feed, callback) {
    var proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed.url);
    fetch(proxyUrl).then(function (r) { return r.json(); }).then(function (data) {
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            var articles = data.items.slice(0, 15).map(function (item, idx) {
                var desc = (item.description || item.content || '').replace(/<[^>]+>/g, '').trim();
                var pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
                return { id: feed.id + '_' + idx, feedId: feed.id, feedName: feed.name, feedNameCn: feed.nameCn, feedColor: feed.color, feedIcon: feed.icon, title: item.title || '无标题', snippet: desc.substring(0, 200), body: desc || desc.substring(0, 200), link: item.link || feed.url, date: pubDate, dateStr: formatTimeAgo(pubDate), vocab: extractVocab(), live: true };
            });
            callback(articles);
        }
        else
            callback([]);
    }).catch(function () { callback([]); });
}
function formatTimeAgo(date) { var now = new Date(); var diff = Math.floor((now - date) / 1000); if (diff < 60)
    return 'Just now'; if (diff < 3600)
    return Math.floor(diff / 60) + 'm ago'; if (diff < 86400)
    return Math.floor(diff / 3600) + 'h ago'; if (diff < 604800)
    return Math.floor(diff / 86400) + 'd ago'; return date.toLocaleDateString('zh-CN'); }
var fallbackArticles = [
    { feedId: 'bbc', title: '中国经济增长放缓引发全球关注', snippet: '最新数据显示，中国第一季度GDP增速低于预期，分析人士认为这可能对全球经济产生重要影响。', body: '最新数据显示，中国第一季度GDP增速低于预期，分析人士认为这可能对全球经济产生重要影响。国际货币基金组织呼吁各国加强合作，共同应对经济下行压力。专家指出，中国政府正在采取一系列政策措施来刺激内需，促进社会发展。市场分析师表示，技术创新将是推动经济增长的关键因素。' },
    { feedId: 'bbc', title: '人工智能安全峰会在北京举行', snippet: '来自全球各地的科技领导和政策制定者齐聚北京，讨论人工智能技术的安全发展。', body: '来自全球各地的科技领导和政策制定者齐聚北京，讨论人工智能技术的安全发展与监管框架问题。与会者一致认为，需要建立国际合作机制来确保技术的安全和负责任发展。研究人员分析了当前的情况，并提出了具体建议。' },
    { feedId: 'rfi', title: '气候变化：亚太地区面临严峻挑战', snippet: '联合国最新报道指出，亚太地区是全球受气候变化影响最严重的地区之一。', body: '联合国最新报道指出，亚太地区是全球受气候变化影响最严重的地区之一。环境问题日益严重，国际社会呼吁各国政府采取更积极的政策。专家表示，合作是解决问题的关键。世界各国需要加强文化交流和教育合作。' },
    { feedId: 'rfi', title: '中法文化交流年活动正式启动', snippet: '中法两国宣布启动文化交流年系列活动，旨在加深两国人民之间的相互了解和关系。', body: '中法两国宣布启动文化交流年系列活动，旨在加深两国人民之间的关系。首批活动包括艺术展览、电影节和学术论坛。教育部门表示将加强合作，推动社会文化发展。这一决定得到了双方的积极响应。' },
    { feedId: 'dw', title: '欧盟讨论对华贸易新政策', snippet: '欧盟委员会正在审议一系列新的对华贸易政策建议。', body: '欧盟委员会正在审议一系列新的对华贸易政策建议，旨在平衡经济利益与安全考量。部分领导主张加强与中国的经济合作，而另一些国家则强调需要减少对中国市场的依赖。分析人士认为，这一决定将对国际贸易关系产生深远影响。' },
    { feedId: 'dw', title: '科技创新：中国量子计算取得突破', snippet: '中国研究人员宣布在量子计算领域取得重大突破。', body: '中国研究人员宣布在量子计算领域取得重大突破，成功研发出新一代量子处理器。这项技术将对世界产生深远影响。公司和政府都在加大投资力度。记者报道说，这一消息引发了国际社会的广泛关注。' },
    { feedId: 'voa', title: '教育改革：双语教学模式受到关注', snippet: '随着全球化深入发展，越来越多的国家开始推广双语教育模式。', body: '随着全球化深入发展，越来越多的国家开始推广双语教育模式。研究表明，早期语言学习对儿童认知发展有显著促进作用。教育部门决定加大投入，推动社会文化发展。这一政策得到了广泛支持。' },
    { feedId: 'voa', title: '太空探索：嫦娥七号任务计划公布', snippet: '中国国家航天局公布嫦娥七号月球探测任务的详细情况。', body: '中国国家航天局公布嫦娥七号月球探测任务的详细情况。该任务将对月球南极进行全面研究。技术团队表示，国际合作是成功的关键。这一消息引起了世界各国的广泛关注。分析师认为，这将推动全球太空技术的发展。' },
    { feedId: 'zaobao', title: '东南亚经济一体化进程加速', snippet: '东盟各国领导承诺加快区域经济一体化进程。', body: '东盟各国领导承诺加快区域经济一体化进程，推动贸易合作和市场便利化。政府部门表示将采取新的政策措施。分析人士认为，这一决定将对地区经济增长产生积极影响。' },
    { feedId: 'zaobao', title: '新加坡推出新一轮华语学习计划', snippet: '新加坡教育部宣布推出新一轮华语学习推广计划。', body: '新加坡教育部宣布推出新一轮华语学习推广计划。该计划鼓励更多年轻人学习和使用华语。研究表明，语言学习对社会文化发展有重要影响。政府决定加大教育投入。' },
    { feedId: 'nyt', title: '全球粮食安全问题日益突出', snippet: '联合国粮农组织报道，全球粮食安全情况正在恶化。', body: '联合国粮农组织报道，全球粮食安全情况正在恶化。多个地区面临严重的问题。国际社会呼吁各国政府加强合作，共同应对挑战。分析人士表示，技术创新和政策改革是解决问题的关键。' },
    { feedId: 'nyt', title: '中国传统文化走向世界', snippet: '中医药在全球范围内的影响不断扩大。', body: '中医药在全球范围内的影响不断扩大。世界卫生组织最近发布了关于传统医学的历史性报道。研究人员表示，国际合作是推动文化交流的关键。教育机构也在积极参与。市场分析显示，相关公司的增长前景良好。' }
];
function buildFallbackArticles() { var now = new Date(); return fallbackArticles.map(function (a, i) { var feed = rssFeeds.find(function (f) { return f.id === a.feedId; }); var d = new Date(now.getTime() - (Math.floor(Math.random() * 48) + 1) * 3600000); return { id: a.feedId + '_fb_' + i, feedId: a.feedId, feedName: feed.name, feedNameCn: feed.nameCn, feedColor: feed.color, feedIcon: feed.icon, title: a.title, snippet: a.snippet, body: a.body, link: '#', date: d, dateStr: formatTimeAgo(d), vocab: extractVocab(), live: false }; }).sort(function (a, b) { return b.date - a.date; }); }
function renderRssFeedBtns() { var c = document.getElementById('rssFeedBtns'); c.innerHTML = ''; var allBtn = document.createElement('button'); allBtn.className = 'rss-feed-btn' + (activeRssFeed === 'all' ? ' active' : ''); allBtn.innerHTML = '<span class="feed-dot" style="background:var(--cyan);"></span>All'; allBtn.onclick = function () { activeRssFeed = 'all'; renderRssFeedBtns(); renderRssList(); }; c.appendChild(allBtn); rssFeeds.forEach(function (f) { var btn = document.createElement('button'); btn.className = 'rss-feed-btn' + (activeRssFeed === f.id ? ' active' : ''); btn.innerHTML = '<span class="feed-dot" style="background:' + f.color + ';"></span>' + f.icon + ' ' + f.name; btn.onclick = function () { activeRssFeed = f.id; renderRssFeedBtns(); renderRssList(); }; c.appendChild(btn); }); }
function renderRssList() { var list = document.getElementById('rssList'); var filtered = activeRssFeed === 'all' ? allRssArticles : allRssArticles.filter(function (a) { return a.feedId === activeRssFeed; }); list.innerHTML = ''; if (!filtered.length) {
    list.innerHTML = '<div class="rss-loading">No articles found.</div>';
    return;
} document.getElementById('rssArticleCount').textContent = filtered.length + ' articles'; filtered.forEach(function (art) { var item = document.createElement('div'); item.className = 'rss-item'; item.dataset.artId = art.id; item.innerHTML = '<div class="rss-item-source"><span class="src-dot" style="background:' + art.feedColor + ';"></span><span class="src-name">' + art.feedIcon + ' ' + art.feedName + '</span><span class="src-time">' + art.dateStr + '</span></div><div class="rss-item-title">' + art.title + '</div><div class="rss-item-snippet">' + art.snippet + '</div><div class="rss-item-tags">' + (art.live ? '<span class="rit" style="background:rgba(52,211,153,0.1);color:var(--green);">LIVE</span>' : '<span class="rit" style="background:rgba(251,191,36,0.1);color:var(--accent2);">CACHED</span>') + '<span class="rit" style="background:rgba(230,57,70,0.1);color:var(--accent);">' + art.feedNameCn + '</span></div>'; item.onclick = function () { document.querySelectorAll('.rss-item').forEach(function (i2) { i2.classList.remove('active'); }); item.classList.add('active'); showArticle(art); }; list.appendChild(item); }); }
function showArticle(art) {
    currentDisplayedArticle = art;
    var detail = document.getElementById('rssDetail');
    // Highlight vocab words in title and body
    var highlightedTitle = highlightVocabInText(art.title, art.vocab, art.title);
    var bodyParagraphs = art.body.split('\n').filter(function (p) { return p.trim(); });
    var highlightedBody = bodyParagraphs.map(function (p) {
        return '<p>' + highlightVocabInText(p, art.vocab, art.title) + '</p>';
    }).join('');
    var vocabHtml = art.vocab.map(function (v) {
        var isSaved = isWordSaved(v.cn);
        var eCn = v.cn.replace(/'/g, "\\'");
        var ePy = v.py.replace(/'/g, "\\'");
        var eEn = v.en.replace(/'/g, "\\'");
        var eTitle = art.title.replace(/'/g, "\\'");
        return '<span class="rss-vocab-chip' + (isSaved ? ' added' : '') + '" onclick="addWordFromVocab(\'' + eCn + '\',\'' + ePy + '\',\'' + eEn + '\',\'' + eTitle + '\')" title="' + (isSaved ? 'Click to remove' : 'Click to add') + '"><span class="vc-cn">' + v.cn + '</span><span class="vc-py">' + v.py + '</span><span class="vc-en">' + v.en + '</span><span class="vc-add">' + (isSaved ? '✓' : '+') + '</span></span>';
    }).join('');
    var addAllSaved = art.vocab.every(function (v) { return isWordSaved(v.cn); });
    detail.innerHTML = '<div class="rss-detail-header"><div class="rss-detail-source"><span class="rds-name" style="background:' + art.feedColor + '22;color:' + art.feedColor + ';">' + art.feedIcon + ' ' + art.feedName + '</span><span class="rds-time">' + art.dateStr + (art.live ? ' · 🟢 Live' : '') + '</span></div><div class="rss-detail-title">' + highlightedTitle + '</div></div>' +
        '<div class="vocab-highlight-legend"><div class="vhl-item"><div class="vhl-swatch" style="background:var(--accent2);"></div><span>Vocab word (hover for details)</span></div><div class="vhl-item"><div class="vhl-swatch" style="background:var(--green);"></div><span>Already saved ✓</span></div></div>' +
        '<div class="rss-detail-body">' + highlightedBody + '</div>' +
        '<div class="rss-vocab"><div class="rss-vocab-title">📝 Key Vocabulary · <span style="font-weight:400;color:var(--muted);">Click ➕ to save</span></div><div class="rss-vocab-list">' + vocabHtml + '</div>' + (art.vocab.length > 1 && !addAllSaved ? '<button class="add-all-btn" onclick="addAllVocabFromArticle()">➕ Add All Words to List</button>' : '') + (addAllSaved && art.vocab.length > 0 ? '<div style="font-size:0.65rem;color:var(--green);margin-top:8px;">✅ All words from this article saved!</div>' : '') + '</div>' + (art.link && art.link !== '#' ? '<a class="rss-detail-link" href="' + art.link + '" target="_blank" rel="noopener noreferrer">🔗 Read Full on ' + art.feedName + ' →</a>' : '');
}
function addAllVocabFromArticle() {
    if (!currentDisplayedArticle)
        return;
    var count = 0;
    currentDisplayedArticle.vocab.forEach(function (v) {
        if (!isWordSaved(v.cn)) {
            addWord({ cn: v.cn, py: v.py, en: v.en, source: 'rss', sourceArticle: currentDisplayedArticle.title });
            addSavedWordToFlashcards({ cn: v.cn, py: v.py, en: v.en });
            count++;
        }
    });
    if (count > 0) {
        showToast(count + ' words', '', 'added to word list & flashcards', false);
        refreshCurrentArticleVocab();
        renderCard();
    }
}
var feedsLoaded = 0;
var feedsFailed = 0;
function loadAllFeeds() { if (rssLoaded)
    return; allRssArticles = []; feedsLoaded = 0; feedsFailed = 0; document.getElementById('rssLoading').style.display = 'flex'; renderRssFeedBtns(); rssFeeds.forEach(function (feed) { fetchRSS(feed, function (articles) { feedsLoaded++; if (articles.length > 0)
    allRssArticles = allRssArticles.concat(articles);
else
    feedsFailed++; if (feedsLoaded >= rssFeeds.length) {
    if (allRssArticles.length === 0)
        allRssArticles = buildFallbackArticles();
    else if (feedsFailed > 0) {
        var liveFeedIds = allRssArticles.map(function (a) { return a.feedId; });
        allRssArticles = allRssArticles.concat(buildFallbackArticles().filter(function (a) { return liveFeedIds.indexOf(a.feedId) === -1; }));
    }
    allRssArticles.sort(function (a, b) { return b.date - a.date; });
    rssLoaded = true;
    document.getElementById('rssLoading').style.display = 'none';
    document.getElementById('rssLastUpdate').textContent = new Date().toLocaleTimeString();
    renderRssList();
} }); }); setTimeout(function () { if (!rssLoaded) {
    allRssArticles = buildFallbackArticles();
    rssLoaded = true;
    document.getElementById('rssLoading').style.display = 'none';
    document.getElementById('rssLastUpdate').textContent = new Date().toLocaleTimeString() + ' (offline)';
    renderRssList();
} }, 8000); }
// ===== IMMERSE RESOURCES =====
var immerseResources = [{ name: '哔哩哔哩 Bilibili', cat: 'video', icon: '📱', color: '#38bdf8', desc: 'China\'s biggest video community.', tags: ['video', 'social'], level: 'easy', url: 'https://www.bilibili.com/', tip: 'Search 学中文 for learner content.' }, { name: 'CCTV 中文国际', cat: 'tv', icon: '📺', color: '#e63946', desc: 'China\'s main state broadcaster.', tags: ['live', 'video'], level: 'hard', url: 'https://tv.cctv.com/live/cctv4/', tip: 'Watch 新闻联播 for standardized Mandarin.' }, { name: '微博 Weibo', cat: 'social', icon: '💬', color: '#f472b6', desc: 'China\'s Twitter — real opinions.', tags: ['social', 'text'], level: 'med', url: 'https://weibo.com/', tip: 'Follow @人民日报 and check 热搜.' }, { name: '知乎 Zhihu', cat: 'social', icon: '❓', color: '#38bdf8', desc: 'China\'s Quora. Great for reading.', tags: ['text', 'community'], level: 'hard', url: 'https://www.zhihu.com/', tip: 'Search topics you know well.' }, { name: '喜马拉雅 Ximalaya', cat: 'audio', icon: '🎧', color: '#a78bfa', desc: 'Biggest podcast platform.', tags: ['audio', 'podcast'], level: 'med', url: 'https://www.ximalaya.com/', tip: 'Start with 儿童故事.' }, { name: 'Mandarin Corner', cat: 'learning', icon: '🎓', color: '#34d399', desc: 'YouTube street interviews and lessons.', tags: ['video', 'learning'], level: 'easy', url: 'https://www.youtube.com/@MandarinCorner', tip: 'Street interviews are amazing.' }];
var immerseCats = [{ id: 'all', label: '🌏 All' }, { id: 'tv', label: '📺 TV' }, { id: 'video', label: '▶️ Video' }, { id: 'social', label: '💬 Social' }, { id: 'audio', label: '🎧 Audio' }, { id: 'learning', label: '🎓 Learning' }];
var activeImmerseCat = 'all';
function renderImmerse() { renderImmerseCats(); renderResources(); renderDCProgress(); }
function renderImmerseCats() { var bar = document.getElementById('immerseCatBar'); bar.innerHTML = ''; immerseCats.forEach(function (cat) { var btn = document.createElement('button'); btn.className = 'immerse-cat-btn' + (activeImmerseCat === cat.id ? ' active' : ''); btn.textContent = cat.label; btn.onclick = function () { activeImmerseCat = cat.id; renderImmerseCats(); renderResources(); }; bar.appendChild(btn); }); }
function renderResources() { var grid = document.getElementById('resourceGrid'); grid.innerHTML = ''; var filtered = activeImmerseCat === 'all' ? immerseResources : immerseResources.filter(function (r) { return r.cat === activeImmerseCat; }); filtered.forEach(function (res) { var lc = res.level === 'easy' ? 'level-easy' : res.level === 'med' ? 'level-med' : 'level-hard'; var ll = res.level === 'easy' ? 'Beginner' : res.level === 'med' ? 'Intermediate' : 'Advanced'; var tags = res.tags.map(function (t) { var tc = t === 'video' ? 'type-video' : t === 'text' ? 'type-text' : t === 'audio' ? 'type-audio' : t === 'social' ? 'type-social' : t === 'live' ? 'type-live' : ''; return '<span class="resource-tag ' + tc + '">' + t + '</span>'; }).join('') + '<span class="resource-tag ' + lc + '">' + ll + '</span>'; var card = document.createElement('div'); card.className = 'resource-card'; card.innerHTML = '<div class="resource-thumb" style="background:' + res.color + '11;"><span style="position:relative;">' + res.icon + '</span></div><div class="resource-body"><div class="resource-name">' + res.icon + ' ' + res.name + '</div><div class="resource-desc">' + res.desc + '</div><div class="resource-tags">' + tags + '</div><div style="background:var(--bg);border-radius:8px;padding:8px 10px;margin-top:10px;font-size:0.68rem;color:var(--accent2);line-height:1.5;">💡 ' + res.tip + '</div><a class="resource-link" href="' + res.url + '" target="_blank" rel="noopener noreferrer">🔗 Open →</a></div>'; grid.appendChild(card); }); }
function renderDCProgress() { var c = document.getElementById('dcProgress'); if (!c)
    return; c.innerHTML = ''; var tasks = ['📺 Watch', '📰 Read', '💾 Save 5', '🃏 Review']; if (!window._dcDone)
    window._dcDone = [false, false, false, false]; tasks.forEach(function (t, i) { var dot = document.createElement('div'); dot.className = 'dc-dot' + (window._dcDone[i] ? ' done' : ''); dot.textContent = window._dcDone[i] ? '✓' : ''; dot.title = t; dot.onclick = function () { window._dcDone[i] = !window._dcDone[i]; renderDCProgress(); }; c.appendChild(dot); if (i < tasks.length - 1) {
    var label = document.createElement('span');
    label.style.cssText = 'font-size:0.6rem;color:var(--muted);';
    label.textContent = t;
    c.appendChild(label);
} }); }
renderImmerse();
updateWordCountDisplays();
loadSavedWordsCache();
setTimeout(function () { loadAllFeeds(); }, 1500);
