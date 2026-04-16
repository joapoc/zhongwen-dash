"use strict";
// @ts-nocheck
(function () {
    var TEXT_CLIPPER_DICT = {
        '最近': { p: 'zuìjìn', e: 'recently' }, '人工智能': { p: 'réngōng zhìnéng', e: 'AI' }, '发展': { p: 'fāzhǎn', e: 'to develop' },
        '得': { p: 'de', e: '(complement)' }, '非常': { p: 'fēicháng', e: 'very' }, '快': { p: 'kuài', e: 'fast' }, '很多': { p: 'hěnduō', e: 'many' },
        '人': { p: 'rén', e: 'person' }, '都': { p: 'dōu', e: 'all' }, '在': { p: 'zài', e: 'at, in' }, '讨论': { p: 'tǎolùn', e: 'to discuss' },
        '它': { p: 'tā', e: 'it' }, '会': { p: 'huì', e: 'can, will' }, '怎么': { p: 'zěnme', e: 'how, why' }, '改变': { p: 'gǎibiàn', e: 'to change' },
        '我们': { p: 'wǒmen', e: 'we, us' }, '的': { p: 'de', e: '(possessive particle)' }, '生活': { p: 'shēnghuó', e: 'life' }, '有些': { p: 'yǒuxiē', e: 'some' },
        '觉得': { p: 'juéde', e: 'to feel, think' }, '帮助': { p: 'bāngzhù', e: 'to help' }, '提高': { p: 'tígāo', e: 'to improve' }, '工作': { p: 'gōngzuò', e: 'work' },
        '效率': { p: 'xiàolǜ', e: 'efficiency' }, '也': { p: 'yě', e: 'also' }, '有人': { p: 'yǒurén', e: 'someone' }, '担心': { p: 'dānxīn', e: 'to worry' },
        '取代': { p: 'qǔdài', e: 'to replace' }, '传统': { p: 'chuántǒng', e: 'traditional' }, '不管怎么样': { p: 'bùguǎn zěnmeyàng', e: 'no matter what' },
        '不管': { p: 'bùguǎn', e: 'no matter' }, '怎么样': { p: 'zěnmeyàng', e: 'how about' }, '应该': { p: 'yīnggāi', e: 'should' }, '保持': { p: 'bǎochí', e: 'to maintain' },
        '开放': { p: 'kāifàng', e: 'open' }, '心态': { p: 'xīntài', e: 'mindset' }, '积极': { p: 'jījí', e: 'positive' }, '学习': { p: 'xuéxí', e: 'to study' },
        '新': { p: 'xīn', e: 'new' }, '技术': { p: 'jìshù', e: 'technology' }, '和': { p: 'hé', e: 'and' }, '技能': { p: 'jìnéng', e: 'skill' },
        '毕竟': { p: 'bìjìng', e: 'after all' }, '能够': { p: 'nénggòu', e: 'to be able to' }, '适应': { p: 'shìyìng', e: 'to adapt' }, '变化': { p: 'biànhuà', e: 'change' },
        '才能': { p: 'cáinéng', e: 'only then can' }, '未来': { p: 'wèilái', e: 'future' }, '社会': { p: 'shèhuì', e: 'society' }, '中': { p: 'zhōng', e: 'middle' },
        '取得': { p: 'qǔdé', e: 'to achieve' }, '成功': { p: 'chénggōng', e: 'success' }, '你': { p: 'nǐ', e: 'you' }, '呢': { p: 'ne', e: '(particle)' },
        '我': { p: 'wǒ', e: 'I, me' }, '他': { p: 'tā', e: 'he, him' }, '她': { p: 'tā', e: 'she, her' }, '是': { p: 'shì', e: 'to be' }, '有': { p: 'yǒu', e: 'to have' },
        '做': { p: 'zuò', e: 'to do' }, '去': { p: 'qù', e: 'to go' }, '来': { p: 'lái', e: 'to come' }, '想': { p: 'xiǎng', e: 'to think, want' }, '要': { p: 'yào', e: 'to want, will' },
        '能': { p: 'néng', e: 'can' }, '可以': { p: 'kěyǐ', e: 'can, may' }, '知道': { p: 'zhīdào', e: 'to know' }, '看': { p: 'kàn', e: 'to look, watch' }, '说': { p: 'shuō', e: 'to say' },
        '听': { p: 'tīng', e: 'to listen' }, '读': { p: 'dú', e: 'to read' }, '写': { p: 'xiě', e: 'to write' }, '吃': { p: 'chī', e: 'to eat' }, '喝': { p: 'hē', e: 'to drink' },
        '买': { p: 'mǎi', e: 'to buy' }, '用': { p: 'yòng', e: 'to use' }, '问': { p: 'wèn', e: 'to ask' }, '学': { p: 'xué', e: 'to study' }, '时间': { p: 'shíjiān', e: 'time' },
        '今天': { p: 'jīntiān', e: 'today' }, '明天': { p: 'míngtiān', e: 'tomorrow' }, '现在': { p: 'xiànzài', e: 'now' }, '以后': { p: 'yǐhòu', e: 'later' }, '文章': { p: 'wénzhāng', e: 'article' },
        '新闻': { p: 'xīnwén', e: 'news' }, '视频': { p: 'shìpín', e: 'video' }, '内容': { p: 'nèiróng', e: 'content' }, '中文': { p: 'zhōngwén', e: 'Chinese' }, '汉字': { p: 'hànzì', e: 'character' },
        '翻译': { p: 'fānyì', e: 'translate' }, '练习': { p: 'liànxí', e: 'practice' }, '搜索': { p: 'sōusuǒ', e: 'to search' }, '评论': { p: 'pínglùn', e: 'comment' }, '发布': { p: 'fābù', e: 'to publish' },
        '更新': { p: 'gēngxīn', e: 'to update' }, '点击': { p: 'diǎnjī', e: 'to click' }, '链接': { p: 'liànjiē', e: 'link' }, '平台': { p: 'píngtái', e: 'platform' }, '应用': { p: 'yìngyòng', e: 'app' },
        '软件': { p: 'ruǎnjiàn', e: 'software' }, '用户': { p: 'yònghù', e: 'user' }, '微博': { p: 'wēibó', e: 'Weibo' }, '微信': { p: 'wēixìn', e: 'WeChat' }, '直播': { p: 'zhíbō', e: 'livestream' },
        '话题': { p: 'huàtí', e: 'topic' }, '城市': { p: 'chéngshì', e: 'city' }, '学校': { p: 'xuéxiào', e: 'school' }, '医院': { p: 'yīyuàn', e: 'hospital' }, '天气': { p: 'tiānqì', e: 'weather' },
        '名字': { p: 'míngzi', e: 'name' }, '电话': { p: 'diànhuà', e: 'telephone' }, '朋友': { p: 'péngyou', e: 'friend' }, '老师': { p: 'lǎoshī', e: 'teacher' }, '学生': { p: 'xuésheng', e: 'student' },
        '好': { p: 'hǎo', e: 'good' }, '大': { p: 'dà', e: 'big' }, '小': { p: 'xiǎo', e: 'small' }, '多': { p: 'duō', e: 'many' }, '少': { p: 'shǎo', e: 'few' }, '重要': { p: 'zhòngyào', e: 'important' },
        '有趣': { p: 'yǒuqù', e: 'interesting' }, '漂亮': { p: 'piàoliang', e: 'beautiful' }, '方便': { p: 'fāngbiàn', e: 'convenient' }, '加油': { p: 'jiāyóu', e: 'go for it!' }
    };
    var TEXT_CLIPPER_SAMPLE = '最近人工智能发展得非常快，很多人都在讨论它会怎么改变我们的生活。有些人觉得AI会帮助我们提高工作效率，也有人担心它会取代很多传统的工作。不管怎么样，我们都应该保持开放的心态，积极学习新的技术和技能。毕竟，能够适应变化的人才能在未来的社会中取得成功。你觉得呢？';
    var TEXT_CLIPPER_STORAGE_KEY = 'zhongwen-text-clipper-bank';
    var textClipperState = {
        view: 'input',
        inputText: '',
        sourceTag: '',
        segments: [],
        fullText: '',
        src: '',
        selectedIndex: -1,
        selected: null,
        pos: { x: 0, y: 0 },
        saved: [],
        translations: [],
        flashSaved: false,
        loading: false,
        status: 'Local CC-CEDICT ready as fallback-aware enrichment.',
        apiAvailable: true
    };
    var tcDictionaryCache = {};
    function tcEscapeHtml(value) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function tcEscapeAttr(value) { return tcEscapeHtml(value).replace(/'/g, '&#39;'); }
    function tcLoadSaved() {
        try {
            var raw = localStorage.getItem(TEXT_CLIPPER_STORAGE_KEY);
            var parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        }
        catch (err) {
            console.error('Failed to load text clipper bank.', err);
            return [];
        }
    }
    function tcPersistSaved() {
        try {
            localStorage.setItem(TEXT_CLIPPER_STORAGE_KEY, JSON.stringify(textClipperState.saved));
        }
        catch (err) {
            console.error('Failed to persist text clipper bank.', err);
        }
    }
    function tcIsCN(c) {
        var d = c.charCodeAt(0);
        return d >= 0x4e00 && d <= 0x9fff;
    }
    function tcHasChinese(text) {
        return !!text && Array.from(text).some(tcIsCN);
    }
    function tcGetLocalEntry(word) {
        if (!TEXT_CLIPPER_DICT[word])
            return null;
        return { p: TEXT_CLIPPER_DICT[word].p, e: TEXT_CLIPPER_DICT[word].e, hsk: null, entries: [] };
    }
    function tcFormatDictionaryEntry(entry) {
        return {
            traditional: entry.traditional || '',
            simplified: entry.simplified || '',
            pinyin: entry.pinyin || '',
            english: Array.isArray(entry.english) ? entry.english : [],
            hsk: entry.hsk || null
        };
    }
    function tcEntryToDisplay(entry) {
        return {
            p: entry.pinyin || '',
            e: Array.isArray(entry.english) ? entry.english.join('; ') : '',
            hsk: entry.hsk || null,
            entries: [tcFormatDictionaryEntry(entry)]
        };
    }
    function tcChooseBestEntry(query, results) {
        if (!Array.isArray(results) || !results.length)
            return null;
        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            if (item && (item.simplified === query || item.traditional === query)) {
                return tcEntryToDisplay(item);
            }
        }
        return tcEntryToDisplay(results[0]);
    }
    function tcLookupCached(word) {
        return tcDictionaryCache[word] || null;
    }
    async function tcLookupDictionary(word) {
        if (!word)
            return null;
        if (tcDictionaryCache[word] !== undefined)
            return tcDictionaryCache[word];
        try {
            var response = await fetch('/api/language/dictionary/search?query=' + encodeURIComponent(word) + '&limit=8');
            if (!response.ok)
                throw new Error('Dictionary search failed.');
            var payload = await response.json();
            var best = tcChooseBestEntry(word, payload.results);
            tcDictionaryCache[word] = best || tcGetLocalEntry(word);
            return tcDictionaryCache[word];
        }
        catch (err) {
            textClipperState.apiAvailable = false;
            tcDictionaryCache[word] = tcGetLocalEntry(word);
            return tcDictionaryCache[word];
        }
    }
    async function tcLookupAll(words) {
        var unique = [];
        var seen = {};
        words.forEach(function (word) {
            if (!word || seen[word])
                return;
            seen[word] = true;
            unique.push(word);
        });
        await Promise.all(unique.map(tcLookupDictionary));
    }
    function tcSegmentFallback(text) {
        var result = [];
        var i = 0;
        while (i < text.length) {
            if (!tcIsCN(text[i])) {
                var j = i;
                while (j < text.length && !tcIsCN(text[j]))
                    j++;
                result.push({ t: text.slice(i, j), s: i, cn: false });
                i = j;
                continue;
            }
            var found = false;
            for (var len = Math.min(6, text.length - i); len > 0; len--) {
                var word = text.slice(i, i + len);
                var local = tcGetLocalEntry(word);
                if (local) {
                    result.push({ t: word, s: i, cn: true, p: local.p, e: local.e, hsk: local.hsk, entries: local.entries, unk: false });
                    i += len;
                    found = true;
                    break;
                }
            }
            if (!found) {
                result.push({ t: text[i], s: i, cn: true, unk: true, p: '', e: '', hsk: null, entries: [] });
                i++;
            }
        }
        return result;
    }
    function tcBuildSegmentsFromTokens(text, tokens) {
        if (!Array.isArray(tokens) || !tokens.length)
            return tcSegmentFallback(text);
        var sorted = tokens.filter(function (token) {
            return token && typeof token.word === 'string' && typeof token.start === 'number' && typeof token.end === 'number' && token.end > token.start;
        }).sort(function (a, b) { return a.start - b.start || b.end - a.end; });
        var result = [];
        var cursor = 0;
        sorted.forEach(function (token) {
            if (token.start < cursor)
                return;
            if (token.start > cursor) {
                result.push({ t: text.slice(cursor, token.start), s: cursor, cn: false });
            }
            var word = text.slice(token.start, token.end);
            var lookup = tcLookupCached(word) || tcGetLocalEntry(word);
            result.push({
                t: word,
                s: token.start,
                cn: tcHasChinese(word),
                p: lookup ? lookup.p : '',
                e: lookup ? lookup.e : '',
                hsk: lookup ? lookup.hsk : null,
                entries: lookup ? lookup.entries : [],
                unk: tcHasChinese(word) && !lookup
            });
            cursor = token.end;
        });
        if (cursor < text.length) {
            result.push({ t: text.slice(cursor), s: cursor, cn: false });
        }
        return result;
    }
    async function tcSegmentWithApi(text) {
        try {
            var response = await fetch('/api/language/segment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });
            if (!response.ok)
                throw new Error('Segmentation failed.');
            var payload = await response.json();
            var tokens = Array.isArray(payload.tokens) ? payload.tokens : [];
            var words = tokens.filter(function (token) { return tcHasChinese(token.word); }).map(function (token) { return token.word; });
            await tcLookupAll(words);
            return tcBuildSegmentsFromTokens(text, tokens);
        }
        catch (err) {
            textClipperState.apiAvailable = false;
            return tcSegmentFallback(text);
        }
    }
    function tcGetSentence(text, start) {
        var ends = { '。': true, '！': true, '？': true, '\n': true, '；': true };
        var a = start;
        while (a > 0 && !ends[text[a - 1]])
            a--;
        var b = start;
        while (b < text.length && !ends[text[b]])
            b++;
        if (b < text.length)
            b++;
        return text.slice(a, b).trim();
    }
    function tcSelectedIsSaved() {
        if (!textClipperState.selected)
            return false;
        return textClipperState.saved.some(function (item) { return item.t === textClipperState.selected.t && item.sentence === textClipperState.selected.sentence; });
    }
    function tcUnknownSet() {
        var seen = {};
        var items = [];
        textClipperState.segments.forEach(function (segment) {
            if (segment.cn && segment.unk && !seen[segment.t]) {
                seen[segment.t] = true;
                items.push(segment.t);
            }
        });
        return items;
    }
    function tcKnownPct() {
        var cnSegs = textClipperState.segments.filter(function (segment) { return segment.cn; });
        if (!cnSegs.length)
            return 0;
        return Math.round(cnSegs.filter(function (segment) { return !segment.unk; }).length / cnSegs.length * 100);
    }
    function tcBuildSentenceUnits() {
        var text = textClipperState.fullText || '';
        if (!text)
            return [];
        var lines = [];
        var start = 0;
        for (var i = 0; i < text.length; i++) {
            var char = text[i];
            if (char !== '。' && char !== '！' && char !== '？' && char !== '；' && char !== '\n')
                continue;
            var end = i + 1;
            var sentence = text.slice(start, end).trim();
            if (sentence) {
                lines.push({
                    source: sentence,
                    translation: ''
                });
            }
            start = end;
        }
        var tail = text.slice(start).trim();
        if (tail) {
            lines.push({
                source: tail,
                translation: ''
            });
        }
        return lines;
    }
    async function tcFetchTranslations() {
        var units = tcBuildSentenceUnits();
        textClipperState.translations = units;
        if (!units.length)
            return;
        try {
            var response = await fetch('/api/language/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texts: units.map(function (unit) { return unit.source; }) })
            });
            var payload = await response.json();
            if (!response.ok || !payload.ok) {
                throw new Error(payload && payload.message ? payload.message : 'DeepL translation failed.');
            }
            textClipperState.translations = units.map(function (unit, index) {
                return {
                    source: unit.source,
                    translation: payload.translations && payload.translations[index]
                        ? payload.translations[index]
                        : 'No DeepL translation returned.'
                };
            });
            textClipperState.status = textClipperState.apiAvailable
                ? 'Enriched with local CC-CEDICT + jieba segmentation. Translation provider: DeepL.'
                : 'Segmentation fallback active. Translation provider: DeepL.';
        }
        catch (err) {
            textClipperState.translations = units.map(function (unit) {
                return {
                    source: unit.source,
                    translation: 'DeepL unavailable for this text right now.'
                };
            });
            textClipperState.status = 'DeepL translation failed. Check DEEPL_AUTH_KEY or server connectivity.';
        }
    }
    function tcOpenBaidu(term) {
        if (term)
            window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(term), '_blank', 'noopener');
    }
    function tcUpdateProcessButtonState() {
        var input = document.getElementById('clipperInput');
        var button = document.getElementById('clipperProcessBtn');
        if (!button)
            return;
        var hasText = !!(input && typeof input.value === 'string' && input.value.trim());
        button.disabled = !hasText || !!textClipperState.loading;
    }
    function tcSetView(view) {
        textClipperState.view = view;
        textClipperState.selected = null;
        textClipperState.selectedIndex = -1;
        renderTextClipperZone();
    }
    function tcReset() {
        textClipperState.view = 'input';
        textClipperState.inputText = '';
        textClipperState.sourceTag = '';
        textClipperState.segments = [];
        textClipperState.translations = [];
        textClipperState.fullText = '';
        textClipperState.src = '';
        textClipperState.selected = null;
        textClipperState.selectedIndex = -1;
        textClipperState.flashSaved = false;
        textClipperState.loading = false;
        textClipperState.status = 'Local CC-CEDICT ready as fallback-aware enrichment.';
        renderTextClipperZone();
    }
    function tcLoadSample() {
        textClipperState.inputText = TEXT_CLIPPER_SAMPLE;
        textClipperState.sourceTag = 'tech blog';
        renderTextClipperZone();
    }
    async function tcProcessText() {
        var input = document.getElementById('clipperInput');
        var source = document.getElementById('clipperSource');
        var text = (input && typeof input.value === 'string' ? input.value : textClipperState.inputText || '').trim();
        textClipperState.inputText = text;
        textClipperState.sourceTag = source && typeof source.value === 'string' ? source.value : textClipperState.sourceTag;
        if (!text)
            return;
        textClipperState.loading = true;
        textClipperState.status = 'Processing with local segmentation and CC-CEDICT...';
        renderTextClipperZone();
        var segments = await tcSegmentWithApi(text);
        textClipperState.segments = segments;
        textClipperState.fullText = text;
        textClipperState.src = (textClipperState.sourceTag || '').trim();
        textClipperState.view = 'reader';
        textClipperState.selected = null;
        textClipperState.selectedIndex = -1;
        textClipperState.flashSaved = false;
        textClipperState.loading = false;
        textClipperState.status = textClipperState.apiAvailable
            ? 'Enriched with local CC-CEDICT + jieba segmentation.'
            : 'Local API unavailable, using built-in fallback dictionary.';
        await tcFetchTranslations();
        renderTextClipperZone();
    }
    function tcHandleTextInput(value) {
        textClipperState.inputText = value;
        tcUpdateProcessButtonState();
    }
    function tcHandleSourceInput(value) { textClipperState.sourceTag = value; }
    function tcSelectSegment(index, event) {
        var segment = textClipperState.segments[index];
        if (!segment || !segment.cn)
            return;
        if (event && typeof event.stopPropagation === 'function')
            event.stopPropagation();
        var rect = event.currentTarget.getBoundingClientRect();
        var x = Math.max(16, Math.min(rect.left, window.innerWidth - 316));
        var y = rect.bottom + 10;
        if (y + 320 > window.innerHeight)
            y = Math.max(12, rect.top - 328);
        textClipperState.selectedIndex = index;
        textClipperState.selected = {
            t: segment.t,
            s: segment.s,
            p: segment.p || '',
            e: segment.e || '',
            hsk: segment.hsk || (segment.entries && segment.entries[0] ? segment.entries[0].hsk : null) || null,
            unk: !!segment.unk,
            sentence: tcGetSentence(textClipperState.fullText, segment.s),
            src: textClipperState.src,
            entries: Array.isArray(segment.entries) ? segment.entries : []
        };
        textClipperState.pos = { x: x, y: y };
        textClipperState.flashSaved = false;
        renderTextClipperZone();
    }
    function tcClosePopup() {
        textClipperState.selected = null;
        textClipperState.selectedIndex = -1;
        textClipperState.flashSaved = false;
        renderTextClipperZone();
    }
    function tcSaveSelected() {
        if (!textClipperState.selected || tcSelectedIsSaved())
            return;
        textClipperState.saved.push({
            t: textClipperState.selected.t,
            p: textClipperState.selected.p,
            e: textClipperState.selected.e,
            hsk: textClipperState.selected.hsk || null,
            sentence: textClipperState.selected.sentence,
            src: textClipperState.selected.src,
            date: new Date().toLocaleDateString()
        });
        textClipperState.flashSaved = true;
        tcPersistSaved();
        renderTextClipperZone();
    }
    function tcDeleteSaved(index) {
        textClipperState.saved.splice(index, 1);
        tcPersistSaved();
        renderTextClipperZone();
    }
    function tcRenderStatus() {
        return '<div class="clipper-panel"><div class="clipper-section-title">Dictionary Status</div><div class="clipper-lead" style="margin:0">' + tcEscapeHtml(textClipperState.status) + '</div></div>';
    }
    function tcRenderProviderLine() {
        return '<div class="clipper-provider-line"><span class="clipper-provider-pill">Translation: DeepL</span><span class="clipper-provider-sub">Lookup: CC-CEDICT + HSK 3.0</span></div>';
    }
    function tcRenderInputView() {
        return '<div class="clipper-shell">' +
            tcRenderStatus() +
            tcRenderProviderLine() +
            '<div class="clipper-panel">' +
            '<p class="clipper-lead">Paste Chinese text from articles, comments, or videos. The clipper now uses your local language API for segmentation and CC-CEDICT enrichment, with the built-in list only acting as backup.</p>' +
            '<div class="clipper-field-row"><label class="clipper-label" for="clipperSource">Source tag</label><input id="clipperSource" class="clipper-input" value="' + tcEscapeAttr(textClipperState.sourceTag) + '" oninput="tcHandleSourceInput(this.value)" placeholder="e.g. YouTube, Weibo, tech blog"></div>' +
            '<div class="clipper-field-row"><label class="clipper-label" for="clipperInput">Text</label><textarea id="clipperInput" class="clipper-textarea" oninput="tcHandleTextInput(this.value)" placeholder="粘贴中文文本...">' + tcEscapeHtml(textClipperState.inputText) + '</textarea></div>' +
            '<div class="clipper-actions"><button id="clipperProcessBtn" class="btn-primary" onclick="tcProcessText()" ' + (!textClipperState.inputText.trim() || textClipperState.loading ? 'disabled' : '') + '>' + (textClipperState.loading ? 'Processing…' : 'Process Text') + '</button><button class="btn-secondary" onclick="tcLoadSample()">Try Sample</button>' + (textClipperState.saved.length ? '<button class="btn-secondary" onclick="tcSetView(\'bank\')">Open Word Bank (' + textClipperState.saved.length + ')</button>' : '') + '</div>' +
            '</div></div>';
    }
    function tcRenderReaderText() {
        return textClipperState.segments.map(function (segment, index) {
            if (!segment.cn)
                return '<span class="clipper-plain">' + tcEscapeHtml(segment.t).replace(/\n/g, '<br>') + '</span>';
            var saved = textClipperState.saved.some(function (item) { return item.t === segment.t; });
            var cls = 'clipper-token';
            if (segment.unk)
                cls += ' unknown';
            else if (saved)
                cls += ' saved';
            if (textClipperState.selectedIndex === index)
                cls += ' active';
            return '<button type="button" class="' + cls + '" onclick="tcSelectSegment(' + index + ', event)">' + tcEscapeHtml(segment.t) + '</button>';
        }).join('');
    }
    function tcRenderGlossList(glosses, className) {
        if (!Array.isArray(glosses) || !glosses.length)
            return '';
        return '<div class="' + className + '">' + glosses.slice(0, 6).map(function (gloss) {
            return '<div class="' + className + '-line">' + tcEscapeHtml(gloss) + '</div>';
        }).join('') + '</div>';
    }
    function tcRenderPopupEntries() {
        if (!textClipperState.selected || !textClipperState.selected.entries || !textClipperState.selected.entries.length)
            return '';
        return '<div class="clipper-popup-altlist">' + textClipperState.selected.entries.slice(0, 4).map(function (entry) {
            var hsk = entry.hsk ? '<span class="clipper-hsk-badge">HSK ' + tcEscapeHtml(entry.hsk) + '</span>' : '';
            var trad = entry.traditional && entry.traditional !== entry.simplified ? '<span class="clipper-popup-alttrad">' + tcEscapeHtml(entry.traditional) + '</span>' : '';
            return '<div class="clipper-popup-alt"><div class="clipper-popup-altword">' + tcEscapeHtml(entry.simplified || textClipperState.selected.t) + trad + hsk + '</div><div class="clipper-popup-altmeta">' + tcEscapeHtml(entry.pinyin || '') + '</div>' + tcRenderGlossList(entry.english || [], 'clipper-popup-altgloss') + '</div>';
        }).join('') + '</div>';
    }
    function tcRenderPopup() {
        if (!textClipperState.selected || textClipperState.view !== 'reader')
            return '';
        var hsk = textClipperState.selected.hsk ? '<span class="clipper-hsk-badge">HSK ' + tcEscapeHtml(textClipperState.selected.hsk) + '</span>' : '';
        var primaryGlosses = '';
        if (textClipperState.selected.entries && textClipperState.selected.entries.length) {
            primaryGlosses = tcRenderGlossList(textClipperState.selected.entries[0].english || [], 'clipper-popup-meaning-list');
        }
        return '<div class="clipper-popup" style="left:' + textClipperState.pos.x + 'px;top:' + textClipperState.pos.y + 'px" onclick="event.stopPropagation()">' +
            '<button class="clipper-popup-close" onclick="tcClosePopup()">×</button>' +
            '<div class="clipper-popup-word">' + tcEscapeHtml(textClipperState.selected.t) + hsk + (textClipperState.selected.p ? '<span>' + tcEscapeHtml(textClipperState.selected.p) + '</span>' : '') + '</div>' +
            (primaryGlosses || (textClipperState.selected.e ? '<div class="clipper-popup-meaning">' + tcEscapeHtml(textClipperState.selected.e) + '</div>' : '<div class="clipper-popup-meaning warn">No exact dictionary entry found for this token.</div>')) +
            (textClipperState.selected.sentence ? '<div class="clipper-popup-sentence">' + tcEscapeHtml(textClipperState.selected.sentence) + '</div>' : '') +
            tcRenderPopupEntries() +
            (textClipperState.selected.src ? '<div class="clipper-popup-src">Source: ' + tcEscapeHtml(textClipperState.selected.src) + '</div>' : '') +
            '<div class="clipper-popup-actions"><button class="btn-primary" onclick="tcSaveSelected()" ' + (tcSelectedIsSaved() ? 'disabled' : '') + '>' + (tcSelectedIsSaved() || textClipperState.flashSaved ? 'Saved' : 'Save') + '</button><button class="btn-secondary" onclick="tcOpenBaidu(\'' + tcEscapeAttr(textClipperState.selected.t) + '\')">Baidu</button></div>' +
            '</div>';
    }
    function tcRenderReaderView() {
        var unknowns = tcUnknownSet();
        var translations = textClipperState.translations || [];
        return '<div class="clipper-shell">' +
            tcRenderStatus() +
            tcRenderProviderLine() +
            '<div class="clipper-nav"><button class="clipper-view-btn active" onclick="tcSetView(\'reader\')">Reader</button><button class="clipper-view-btn" onclick="tcSetView(\'bank\')">Bank' + (textClipperState.saved.length ? ' (' + textClipperState.saved.length + ')' : '') + '</button><button class="clipper-reset" onclick="tcReset()">Reset</button></div>' +
            '<div class="clipper-meta-row">' + (textClipperState.src ? '<span class="clipper-stat-badge">Tag: ' + tcEscapeHtml(textClipperState.src) + '</span>' : '') + '<span class="clipper-stat-badge">' + textClipperState.segments.filter(function (segment) { return segment.cn; }).length + ' Chinese tokens</span><span class="clipper-stat-badge ' + (tcKnownPct() >= 90 ? 'good' : tcKnownPct() >= 70 ? 'mid' : 'warn') + '">' + tcKnownPct() + '% known</span>' + (unknowns.length ? '<span class="clipper-stat-badge warn">' + unknowns.length + ' unknown</span>' : '') + '</div>' +
            '<div class="clipper-panel"><div class="clipper-reader" onclick="tcClosePopup()">' + tcRenderReaderText() + '</div>' +
            (translations.length ? '<div class="clipper-translation-row"><div class="clipper-translation-head"><div class="clipper-section-title">Translation</div><span class="clipper-provider-badge">DeepL</span></div><div class="clipper-translation-list">' + translations.map(function (line) {
                return '<div class="clipper-translation-item"><div class="clipper-translation-source cn">' + tcEscapeHtml(line.source) + '</div><div class="clipper-translation-text">' + tcEscapeHtml(line.translation) + '</div></div>';
            }).join('') + '</div></div>' : '') +
            '</div>' +
            (unknowns.length ? '<div class="clipper-panel"><div class="clipper-section-title">Unknown characters</div><div class="clipper-chip-row">' + unknowns.map(function (char) { return '<button class="clipper-chip warn" onclick="tcOpenBaidu(\'' + tcEscapeAttr(char + ' 意思') + '\')">' + tcEscapeHtml(char) + '</button>'; }).join('') + '</div></div>' : '') +
            tcRenderPopup() +
            '</div>';
    }
    function tcRenderBankView() {
        var items = textClipperState.saved.slice().reverse();
        return '<div class="clipper-shell">' +
            tcRenderStatus() +
            tcRenderProviderLine() +
            '<div class="clipper-nav"><button class="clipper-view-btn" onclick="tcSetView(\'reader\')">Reader</button><button class="clipper-view-btn active" onclick="tcSetView(\'bank\')">Bank (' + textClipperState.saved.length + ')</button><button class="clipper-reset" onclick="tcReset()">Reset</button></div>' +
            '<div class="clipper-panel">' +
            (!items.length
                ? '<div class="clipper-empty"><div class="clipper-empty-title">No saved words yet.</div><div class="clipper-empty-sub">Click any segmented word in the reader to save it with sentence context.</div></div>'
                : '<div class="clipper-bank-list">' + items.map(function (item, index) {
                    var originalIndex = textClipperState.saved.length - 1 - index;
                    return '<div class="clipper-bank-item"><div class="clipper-bank-head"><div><div class="clipper-bank-word">' + tcEscapeHtml(item.t) + (item.hsk ? '<span class="clipper-hsk-badge">HSK ' + tcEscapeHtml(item.hsk) + '</span>' : '') + (item.p ? '<span>' + tcEscapeHtml(item.p) + '</span>' : '') + '</div>' + (item.e ? '<div class="clipper-bank-meaning">' + tcEscapeHtml(item.e) + '</div>' : '<div class="clipper-bank-meaning warn">No dictionary gloss saved for this item</div>') + '</div><button class="clipper-mini-btn danger" onclick="tcDeleteSaved(' + originalIndex + ')">Delete</button></div>' + (item.sentence ? '<div class="clipper-bank-sentence">' + tcEscapeHtml(item.sentence) + '</div>' : '') + '<div class="clipper-bank-meta">' + (item.src ? '<span>' + tcEscapeHtml(item.src) + '</span>' : '') + (item.date ? '<span>' + tcEscapeHtml(item.date) + '</span>' : '') + '<button class="clipper-mini-btn" onclick="tcOpenBaidu(\'' + tcEscapeAttr(item.t) + '\')">Baidu</button></div></div>';
                }).join('') + '</div>') +
            '</div></div>';
    }
    function renderTextClipperZone() {
        var container = document.getElementById('widgets-textclipper');
        if (!container)
            return;
        container.innerHTML = textClipperState.view === 'input'
            ? tcRenderInputView()
            : textClipperState.view === 'reader'
                ? tcRenderReaderView()
                : tcRenderBankView();
    }
    function initTextClipperZone() {
        if (!textClipperState.saved.length)
            textClipperState.saved = tcLoadSaved();
        renderTextClipperZone();
    }
    window.tcHandleTextInput = tcHandleTextInput;
    window.tcHandleSourceInput = tcHandleSourceInput;
    window.tcProcessText = tcProcessText;
    window.tcLoadSample = tcLoadSample;
    window.tcSetView = tcSetView;
    window.tcReset = tcReset;
    window.tcSelectSegment = tcSelectSegment;
    window.tcClosePopup = tcClosePopup;
    window.tcSaveSelected = tcSaveSelected;
    window.tcDeleteSaved = tcDeleteSaved;
    window.tcOpenBaidu = tcOpenBaidu;
    window.renderTextClipperZone = renderTextClipperZone;
    window.initTextClipperZone = initTextClipperZone;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTextClipperZone);
    }
    else {
        initTextClipperZone();
    }
})();
