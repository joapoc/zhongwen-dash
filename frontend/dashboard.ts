// @ts-nocheck

var charDB={'我':{py:'wǒ',en:'I, me',rad:'戈',str:7,hsk:1},'你':{py:'nǐ',en:'you',rad:'亻',str:7,hsk:1},'他':{py:'tā',en:'he',rad:'亻',str:5,hsk:1},'她':{py:'tā',en:'she',rad:'女',str:6,hsk:1},'是':{py:'shì',en:'to be',rad:'日',str:9,hsk:1},'的':{py:'de',en:'possessive',rad:'白',str:8,hsk:1},'了':{py:'le',en:'completion',rad:'乛',str:2,hsk:1},'不':{py:'bù',en:'not',rad:'一',str:4,hsk:1},'在':{py:'zài',en:'at, in',rad:'土',str:6,hsk:1},'有':{py:'yǒu',en:'to have',rad:'月',str:6,hsk:1},'人':{py:'rén',en:'person',rad:'人',str:2,hsk:1},'大':{py:'dà',en:'big',rad:'大',str:3,hsk:1},'小':{py:'xiǎo',en:'small',rad:'小',str:3,hsk:1},'中':{py:'zhōng',en:'middle',rad:'丨',str:4,hsk:1},'学':{py:'xué',en:'to study',rad:'子',str:8,hsk:1},'吃':{py:'chī',en:'to eat',rad:'口',str:6,hsk:1},'喝':{py:'hē',en:'to drink',rad:'口',str:12,hsk:1},'看':{py:'kàn',en:'to look',rad:'目',str:9,hsk:1},'说':{py:'shuō',en:'to speak',rad:'讠',str:9,hsk:1},'听':{py:'tīng',en:'to listen',rad:'口',str:7,hsk:1},'写':{py:'xiě',en:'to write',rad:'冖',str:5,hsk:1},'去':{py:'qù',en:'to go',rad:'厶',str:5,hsk:1},'来':{py:'lái',en:'to come',rad:'木',str:7,hsk:1},'好':{py:'hǎo',en:'good',rad:'女',str:6,hsk:1},'爱':{py:'ài',en:'to love',rad:'爫',str:10,hsk:1},'想':{py:'xiǎng',en:'to think',rad:'心',str:13,hsk:2},'明':{py:'míng',en:'bright',rad:'日',str:8,hsk:2},'谢':{py:'xiè',en:'to thank',rad:'讠',str:12,hsk:1},'语':{py:'yǔ',en:'language',rad:'讠',str:9,hsk:2},'休':{py:'xiū',en:'to rest',rad:'亻',str:6,hsk:2},'天':{py:'tiān',en:'day, sky',rad:'大',str:4,hsk:1},'日':{py:'rì',en:'sun',rad:'日',str:4,hsk:2},'月':{py:'yuè',en:'moon',rad:'月',str:4,hsk:1},'水':{py:'shuǐ',en:'water',rad:'水',str:4,hsk:1},'火':{py:'huǒ',en:'fire',rad:'火',str:4,hsk:2},'山':{py:'shān',en:'mountain',rad:'山',str:3,hsk:2},'口':{py:'kǒu',en:'mouth',rad:'口',str:3,hsk:2},'心':{py:'xīn',en:'heart',rad:'心',str:4,hsk:2},'手':{py:'shǒu',en:'hand',rad:'手',str:4,hsk:2},'木':{py:'mù',en:'wood',rad:'木',str:4,hsk:3},'女':{py:'nǚ',en:'woman',rad:'女',str:3,hsk:1},'子':{py:'zǐ',en:'child',rad:'子',str:3,hsk:2},'饭':{py:'fàn',en:'meal',rad:'饣',str:7,hsk:1},'茶':{py:'chá',en:'tea',rad:'艹',str:9,hsk:2},'花':{py:'huā',en:'flower',rad:'艹',str:7,hsk:2},'妈':{py:'mā',en:'mother',rad:'女',str:6,hsk:1}};
var charKeys=Object.keys(charDB);
var wordsPersistTimer=null;

function normalizeSavedWord(word){
  return {
    cn:word.cn,
    py:word.py,
    en:word.en,
    source:word.source||'manual',
    sourceArticle:word.sourceArticle||'',
    addedAt:word.addedAt||new Date().toISOString(),
    inFlashcards:word.inFlashcards!==false
  };
}

function queuePersistSavedWords(){
  clearTimeout(wordsPersistTimer);
  wordsPersistTimer=setTimeout(persistSavedWords,120);
}

function persistSavedWords(){
  fetch('/api/words',{
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({savedWords:savedWords})
  }).catch(function(err){
    console.error('Failed to persist saved words cache.',err);
  });
}

// ===== SAVED WORDS SYSTEM =====
var savedWords=[];var wlFilter='all';
function isWordSaved(cn){return savedWords.some(function(w){return w.cn===cn;});}
function addWord(word){
  if(isWordSaved(word.cn))return false;
  savedWords.push(normalizeSavedWord({cn:word.cn,py:word.py,en:word.en,source:word.source,sourceArticle:word.sourceArticle,inFlashcards:false}));
  queuePersistSavedWords();
  updateWordCountDisplays();return true;
}
function removeWord(cn){
  savedWords=savedWords.filter(function(w){return w.cn!==cn;});
  flashcards=flashcards.filter(function(fc){return fc.source!=='saved'||fc.srcCn!==cn;});
  queuePersistSavedWords();
  updateWordCountDisplays();
}
function updateWordCountDisplays(){
  var n=savedWords.length;
  var wlBadgeCount=document.getElementById('wlBadgeCount');if(wlBadgeCount)wlBadgeCount.textContent=n;
  var statSavedWords=document.getElementById('statSavedWords');if(statSavedWords)statSavedWords.textContent=n;
  var statSavedSub=document.getElementById('statSavedSub');if(statSavedSub)statSavedSub.textContent=n+' from articles';
  var ic=document.getElementById('immerseWordCount');if(ic)ic.textContent=n;
  var wlTotalStat=document.getElementById('wlTotalStat');if(wlTotalStat)wlTotalStat.textContent=n+' words';
  var rssCount=savedWords.filter(function(w){return w.source==='rss';}).length;
  var wlSourceStat=document.getElementById('wlSourceStat');if(wlSourceStat)wlSourceStat.textContent=rssCount+' from RSS';
}
function showToast(cn,py,en,isRemove){
  var c=document.getElementById('toastContainer');
  var t=document.createElement('div');
  t.className='toast'+(isRemove?' remove-toast':'');
  t.innerHTML='<span class="toast-icon">'+(isRemove?'🗑':'✅')+'</span><div class="toast-text">'+(isRemove?'Removed ':'Added ')+'<strong>'+cn+'</strong> '+(py?'('+py+') — ':'')+(en||'')+(isRemove?'':' → Word List & Flashcards')+'<div class="toast-sub">'+(isRemove?'Removed from word list':'Click 📖 Words to manage')+'</div></div>';
  c.appendChild(t);
  setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},3000);
}
function addWordFromVocab(cn,py,en,sourceArticle){
  if(isWordSaved(cn)){removeWord(cn);showToast(cn,py,en,true);refreshCurrentArticleVocab();renderWordlistContent();return;}
  var added=addWord({cn:cn,py:py,en:en,source:'rss',sourceArticle:sourceArticle||''});
  if(added){addSavedWordToFlashcards({cn:cn,py:py,en:en});showToast(cn,py,en,false);refreshCurrentArticleVocab();renderWordlistContent();}
}
function addSavedWordToFlashcards(w){
  var exists=flashcards.some(function(fc){return fc.source==='saved'&&fc.srcCn===w.cn;});
  if(exists)return;
  flashcards.push({f:w.cn,b:w.py+' — '+w.en,source:'saved',srcCn:w.cn});
  var sw=savedWords.find(function(s){return s.cn===w.cn;});if(sw)sw.inFlashcards=true;
  queuePersistSavedWords();
}
function addAllToFlashcards(){
  var count=0;
  savedWords.forEach(function(w){
    var exists=flashcards.some(function(fc){return fc.source==='saved'&&fc.srcCn===w.cn;});
    if(!exists){flashcards.push({f:w.cn,b:w.py+' — '+w.en,source:'saved',srcCn:w.cn});w.inFlashcards=true;count++;}
  });
  if(count>0)queuePersistSavedWords();
  if(count>0){showToast(count+' words','','synced to flashcards',false);renderCard();renderWordlistContent();}
}
function rebuildSavedWordFlashcards(){
  flashcards=flashcards.filter(function(fc){return fc.source!=='saved';});
  savedWords.forEach(function(w){
    if(w.inFlashcards!==false){
      flashcards.push({f:w.cn,b:w.py+' — '+w.en,source:'saved',srcCn:w.cn});
    }
  });
}
function loadSavedWordsCache(){
  return fetch('/api/words').then(function(r){return r.json();}).then(function(data){
    var nextSavedWords=Array.isArray(data.savedWords)?data.savedWords.map(normalizeSavedWord):[];
    savedWords=nextSavedWords;
    rebuildSavedWordFlashcards();
    updateWordCountDisplays();
    renderCard();
    refreshCurrentArticleVocab();
    if(document.getElementById('wordlistModal').classList.contains('show'))renderWordlistContent();
  }).catch(function(err){
    console.error('Failed to load saved words cache.',err);
  });
}
var currentDisplayedArticle=null;
function refreshCurrentArticleVocab(){if(currentDisplayedArticle)showArticle(currentDisplayedArticle);}

// ===== HIGHLIGHT VOCAB IN TEXT =====
function highlightVocabInText(text, vocabList, articleTitle){
  // Sort vocab by length descending so longer words matched first
  var sorted=vocabList.slice().sort(function(a,b){return b.cn.length-a.cn.length;});
  // Build an array of {start,end,vocab} matches
  var matches=[];
  sorted.forEach(function(v){
    var idx=0;
    while(true){
      var pos=text.indexOf(v.cn,idx);
      if(pos===-1)break;
      // Check no overlap with existing matches
      var overlaps=false;
      for(var m=0;m<matches.length;m++){
        if(pos<matches[m].end && pos+v.cn.length>matches[m].start){overlaps=true;break;}
      }
      if(!overlaps){matches.push({start:pos,end:pos+v.cn.length,vocab:v});}
      idx=pos+1;
    }
  });
  // Sort matches by position
  matches.sort(function(a,b){return a.start-b.start;});
  // Build highlighted HTML
  var result='';var lastIdx=0;
  matches.forEach(function(m){
    // Add text before match
    result+=escapeHtml(text.substring(lastIdx,m.start));
    // Add highlighted span
    var v=m.vocab;
    var saved=isWordSaved(v.cn);
    var eCn=v.cn.replace(/'/g,"\\'");var ePy=v.py.replace(/'/g,"\\'");var eEn=v.en.replace(/'/g,"\\'");
    var eTitle=(articleTitle||'').replace(/'/g,"\\'");
    result+='<span class="vocab-highlight'+(saved?' saved':'')+'" onclick="addWordFromVocab(\''+eCn+'\',\''+ePy+'\',\''+eEn+'\',\''+eTitle+'\')">';
    result+=escapeHtml(v.cn);
    result+='<span class="vocab-tooltip"><div class="vt-cn">'+v.cn+'</div><div class="vt-py">'+v.py+'</div><div class="vt-en">'+v.en+'</div><div class="vt-btn '+(saved?'added':'add')+'">'+(saved?'✓ Saved':'➕ Save')+'</div></span>';
    result+='</span>';
    lastIdx=m.end;
  });
  result+=escapeHtml(text.substring(lastIdx));
  return result;
}
function escapeHtml(text){
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ===== WORDLIST MODAL =====
function toggleWordlist(){document.getElementById('wordlistModal').classList.toggle('show');if(document.getElementById('wordlistModal').classList.contains('show'))renderWordlistContent();}
function renderWordlistContent(){
  renderWlFilters();
  var c=document.getElementById('wlContent');
  var filtered=wlFilter==='all'?savedWords:savedWords.filter(function(w){return w.source===wlFilter;});
  if(!filtered.length){c.innerHTML='<div class="wl-empty"><div class="wl-empty-icon">📖</div><div>No words saved yet!<br><span style="font-size:0.72rem;color:#555;">Go to Immerse → RSS Reader and click ➕ on highlighted vocabulary words</span></div></div>';return;}
  var html='';
  filtered.forEach(function(w){
    var srcColor=w.source==='rss'?'var(--cyan)':'var(--purple)';
    var srcLabel=w.source==='rss'?'📡 RSS':'✏️ Manual';
    var fcIcon=w.inFlashcards?'✓':'🃏';
    var fcClass=w.inFlashcards?' fc-added':'';
    html+='<div class="wl-item"><div class="wl-cn">'+w.cn+'</div><div class="wl-info"><div class="wl-py">'+w.py+'</div><div class="wl-en">'+w.en+'</div>'+(w.sourceArticle?'<span class="wl-source-tag" style="background:rgba(34,211,238,0.08);color:'+srcColor+';">'+srcLabel+(w.sourceArticle?' · '+w.sourceArticle.substring(0,20)+'…':'')+'</span>':'<span class="wl-source-tag" style="background:rgba(167,139,250,0.08);color:var(--purple);">'+srcLabel+'</span>')+'</div><div class="wl-actions"><button class="wl-action-btn'+fcClass+'" onclick="addSavedWordToFlashcards({cn:\''+w.cn.replace(/'/g,"\\'")+'\',py:\''+w.py.replace(/'/g,"\\'")+'\',en:\''+w.en.replace(/'/g,"\\'")+'\'}); renderWordlistContent();" title="Add to Flashcards">'+fcIcon+'</button><button class="wl-action-btn delete-btn" onclick="removeWord(\''+w.cn.replace(/'/g,"\\'")+'\'); showToast(\''+w.cn.replace(/'/g,"\\'")+'\',\''+w.py.replace(/'/g,"\\'")+'\',\''+w.en.replace(/'/g,"\\'")+'\',true); renderWordlistContent(); refreshCurrentArticleVocab();" title="Remove">✕</button></div></div>';
  });
  c.innerHTML=html;updateWordCountDisplays();
}
function renderWlFilters(){
  var c=document.getElementById('wlFilterRow');
  var sources=[{id:'all',label:'All'},{id:'rss',label:'📡 RSS'},{id:'manual',label:'✏️ Manual'}];
  c.innerHTML='';
  sources.forEach(function(s){
    var count=s.id==='all'?savedWords.length:savedWords.filter(function(w){return w.source===s.id;}).length;
    var btn=document.createElement('button');btn.className='wl-filter-btn'+(wlFilter===s.id?' active':'');btn.textContent=s.label+' ('+count+')';
    btn.onclick=function(){wlFilter=s.id;renderWordlistContent();};c.appendChild(btn);
  });
}
function exportWordlist(){
  var text=savedWords.map(function(w){return w.cn+'\t'+w.py+'\t'+w.en;}).join('\n');
  if(navigator.clipboard)navigator.clipboard.writeText(text).then(function(){showToast('📋','','Word list copied!',false);});
}
function clearWordlist(){
  if(!savedWords.length)return;savedWords=[];flashcards=flashcards.filter(function(fc){return fc.source!=='saved';});
  queuePersistSavedWords();
  updateWordCountDisplays();renderWordlistContent();renderCard();showToast('🗑','','All words cleared',true);
}

function switchTab(tab,btn){document.querySelectorAll('.tab-content').forEach(function(t){t.classList.remove('active');});document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});document.getElementById('tab-'+tab).classList.add('active');btn.classList.add('active');if(tab==='overview'){drawTree();drawWeeklyChart();}if(tab==='practice')initWritingCanvas();if(tab==='handwriting')initHandwritingZone();if(tab==='games')initMemory();if(tab==='immerse'){renderImmerse();loadAllFeeds();}if(tab==='words')initWordsZone();if(tab==='kahoot')initKahootZone();}
function filterWidgets(q){q=q.toLowerCase();document.querySelectorAll('.widget,.resource-card').forEach(function(w){var kw=(w.getAttribute('data-keywords')||'')+' '+w.textContent.toLowerCase();w.style.display=q===''||kw.includes(q)?'':'none';});}
function toggleNotifs(){document.getElementById('notifModal').classList.toggle('show');}
(function(){var h=new Date().getHours();var g=h<6?'夜好':h<12?'早上好':h<18?'下午好':'晚上好';var greetingText=document.getElementById('greetingText');if(greetingText)greetingText.innerHTML=g+', Alex 👋';})();

var toneMap={a:['ā','á','ǎ','à','a'],e:['ē','é','ě','è','e'],i:['ī','í','ǐ','ì','i'],o:['ō','ó','ǒ','ò','o'],u:['ū','ú','ǔ','ù','u'],'ü':['ǖ','ǘ','ǚ','ǜ','ü']};
function applyTone(syl,tone){var t=parseInt(tone)-1;var s=syl.toLowerCase().replace(/v/g,'ü');if(s.includes('a'))return s.replace('a',toneMap.a[t]);if(s.includes('e'))return s.replace('e',toneMap.e[t]);if(s.includes('ou'))return s.replace('o',toneMap.o[t]);if(s.includes('i')&&s.includes('u')){return s.lastIndexOf('i')>s.lastIndexOf('u')?s.replace('i',toneMap.i[t]):s.replace('u',toneMap.u[t]);}if(s.includes('i'))return s.replace('i',toneMap.i[t]);if(s.includes('o'))return s.replace('o',toneMap.o[t]);if(s.includes('u'))return s.replace('u',toneMap.u[t]);if(s.includes('ü'))return s.replace('ü',toneMap['ü'][t]);return s;}
function convertPinyin(){var r=document.getElementById('pinyinInput').value.replace(/([a-züü]+?)([1-5])/gi,function(m,s,t){return applyTone(s,t);});document.getElementById('pinyinOutput').textContent=r;}convertPinyin();

function lookupChar(){var ch=document.getElementById('charLookupInput').value.trim();if(!ch||!charDB[ch]){['clChar','clPinyin','clMeaning','clRadical','clStrokes','clHsk'].forEach(function(id){document.getElementById(id).textContent='—';});if(ch)document.getElementById('clChar').textContent=ch;return;}var d=charDB[ch];document.getElementById('clChar').textContent=ch;document.getElementById('clPinyin').textContent=d.py;document.getElementById('clMeaning').textContent=d.en;document.getElementById('clRadical').textContent=d.rad;document.getElementById('clStrokes').textContent=d.str;document.getElementById('clHsk').textContent='HSK '+d.hsk;}

var cnD=['零','一','二','三','四','五','六','七','八','九'],cnF=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'],cnP=['líng','yī','èr','sān','sì','wǔ','liù','qī','bā','jiǔ'];
function numToCn(n,f){if(n===0)return f?cnF[0]:cnD[0];var d=f?cnF:cnD;var u=f?['','拾','佰','仟','万']:['','十','百','千','万'];var s=String(Math.abs(Math.floor(n)));var r='',z=false;for(var i=0;i<s.length;i++){var dg=parseInt(s[i]),p=s.length-1-i;if(dg===0)z=true;else{if(z){r+=d[0];z=false;}r+=d[dg]+(u[p]||'');}}return(n<0?'负':'')+r||d[0];}
function convertNumber(){var n=parseInt(document.getElementById('numInput').value)||0;document.getElementById('numChinese').textContent=numToCn(n);document.getElementById('numFormal').textContent=numToCn(n,true);document.getElementById('numPinyin').textContent=String(Math.abs(n)).split('').map(function(c){return cnP[parseInt(c)];}).join(' ');}convertNumber();

function updateDateTime(){var now=new Date();var weekCn=['日','一','二','三','四','五','六'];var y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate(),h=now.getHours(),min=now.getMinutes(),s=now.getSeconds();var ampm=h<12?'上午':'下午';var h12=h%12||12;document.getElementById('dateTimeDisplay').innerHTML='<div style="font-size:2rem;font-weight:800;font-family:\'JetBrains Mono\',monospace;background:linear-gradient(135deg,var(--pink),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">'+String(h).padStart(2,'0')+':'+String(min).padStart(2,'0')+':'+String(s).padStart(2,'0')+'</div><div class="cn" style="font-size:0.9rem;color:#ccc;margin:8px 0;">'+y+'年'+m+'月'+d+'日 星期'+weekCn[now.getDay()]+'</div><div class="cn" style="font-size:0.75rem;color:var(--accent2);">'+ampm+numToCn(h12)+'点'+(min>0?numToCn(min)+'分':'')+'</div>';}
updateDateTime();setInterval(updateDateTime,1000);

function selectTone(t){document.querySelectorAll('.tone-card').forEach(function(c,i){c.classList.toggle('active',i===t-1);});var canvas=document.getElementById('toneCanvas'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.strokeStyle='#2a2d3a';ctx.lineWidth=1;for(var y2=15;y2<h;y2+=15){ctx.beginPath();ctx.moveTo(0,y2);ctx.lineTo(w,y2);ctx.stroke();}ctx.strokeStyle='#e63946';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();var pad=40,pw=w-pad*2;var tones={1:[[0,.2],[1,.2]],2:[[0,.7],[1,.15]],3:[[0,.45],[.3,.8],[.5,.85],[.7,.6],[1,.2]],4:[[0,.15],[1,.85]]};(tones[t]||tones[1]).forEach(function(pt,i){var px=pad+pt[0]*pw,py=10+pt[1]*(h-20);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);});ctx.stroke();}selectTone(1);

var codChars=charKeys.filter(function(k){return charDB[k].hsk<=2;});var codIdx=Math.floor(Math.random()*codChars.length);
function renderCOD(){var ch=codChars[codIdx],d=charDB[ch];document.getElementById('codChar').textContent=ch;document.getElementById('codPinyin').textContent=d.py;document.getElementById('codMeaning').textContent=d.en;document.getElementById('codRadical').textContent=d.rad;document.getElementById('codStrokes').textContent=d.str;document.getElementById('codHsk').textContent='HSK '+d.hsk;}
function newCOD(){codIdx=(codIdx+1)%codChars.length;renderCOD();}renderCOD();

(function(){var c=document.getElementById('heatmap');for(var w=0;w<13;w++){var col=document.createElement('div');col.className='heatmap-col';for(var d=0;d<7;d++){var cell=document.createElement('div');cell.className='heatmap-cell';var daysAgo=(12-w)*7+(6-d);var val=Math.random();var lvl=daysAgo>23&&Math.random()>0.3?0:val<0.2?0:val<0.4?1:val<0.6?2:val<0.8?3:4;if(lvl)cell.classList.add('l'+lvl);col.appendChild(cell);}c.appendChild(col);}})();

function drawWeeklyChart(){var canvas=document.getElementById('weeklyChart');if(!canvas)return;var rect=canvas.parentElement.getBoundingClientRect();canvas.width=rect.width*2;canvas.height=280;var ctx=canvas.getContext('2d');ctx.scale(2,2);var w=rect.width,h=140;ctx.clearRect(0,0,w,h);var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];var data=[45,60,30,75,50,90,65];var maxV=100;var barW=w/7-10;days.forEach(function(d,i){var x=i*(w/7)+5;var bh=(data[i]/maxV)*(h-30);var grad=ctx.createLinearGradient(0,h-bh-5,0,h-5);grad.addColorStop(0,'#e63946');grad.addColorStop(1,'#e6394633');ctx.fillStyle=grad;ctx.fillRect(x+4,h-bh-1,barW-4,bh);ctx.fillStyle='#888';ctx.font='9px Inter';ctx.textAlign='center';ctx.fillText(d,x+barW/2,h);ctx.fillStyle='#ccc';ctx.font='bold 9px JetBrains Mono';ctx.fillText(data[i]+'m',x+barW/2,h-bh-10);});}
setTimeout(drawWeeklyChart,100);window.addEventListener('resize',drawWeeklyChart);

(function(){var c=document.getElementById('charFreqBars');[{ch:'的',p:95},{ch:'是',p:80},{ch:'了',p:78},{ch:'我',p:72},{ch:'不',p:68},{ch:'在',p:65},{ch:'人',p:60},{ch:'有',p:58},{ch:'他',p:55},{ch:'这',p:50},{ch:'大',p:45},{ch:'来',p:40}].forEach(function(x,i){var col=document.createElement('div');col.className='traffic-bar-col';var bar=document.createElement('div');bar.className='traffic-bar';bar.style.background=i%2?'#fbbf24':'#e63946';bar.style.height=x.p+'%';var lb=document.createElement('div');lb.className='label';lb.textContent=x.ch;col.appendChild(bar);col.appendChild(lb);c.appendChild(col);});})();

var treeDefs={'好':{char:'好',meaning:'good',parts:[{char:'女',meaning:'woman'},{char:'子',meaning:'child'}]},'明':{char:'明',meaning:'bright',parts:[{char:'日',meaning:'sun'},{char:'月',meaning:'moon'}]},'想':{char:'想',meaning:'think',parts:[{char:'相',meaning:'look',parts:[{char:'木',meaning:'wood'},{char:'目',meaning:'eye'}]},{char:'心',meaning:'heart'}]},'谢':{char:'谢',meaning:'thank',parts:[{char:'讠',meaning:'speech'},{char:'射',meaning:'shoot',parts:[{char:'身',meaning:'body'},{char:'寸',meaning:'inch'}]}]},'语':{char:'语',meaning:'language',parts:[{char:'讠',meaning:'speech'},{char:'吾',meaning:'I',parts:[{char:'五',meaning:'five'},{char:'口',meaning:'mouth'}]}]},'休':{char:'休',meaning:'rest',parts:[{char:'亻',meaning:'person'},{char:'木',meaning:'tree'}]}};
var currentTree='好';function setTree(ch){currentTree=ch;}
function drawTree(){var canvas=document.getElementById('topoCanvas');if(!canvas)return;var rect=canvas.parentElement.getBoundingClientRect();canvas.width=rect.width*2;canvas.height=rect.height*2;var ctx=canvas.getContext('2d');ctx.scale(2,2);var w=rect.width,h=rect.height;ctx.clearRect(0,0,w,h);var tree=treeDefs[currentTree];if(!tree)return;function dn(x,y,node,depth){var s=depth===0?26:depth===1?18:14;var tc=depth===0?'#e63946':depth===1?'#fbbf24':'#38bdf8';ctx.fillStyle=tc+'33';ctx.fillRect(x-s-4,y-s/2-8,2*(s+4),s+16);ctx.font=s+'px Noto Sans SC,serif';ctx.fillStyle='#eee';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(node.char,x,y-2);ctx.font='8px Inter';ctx.fillStyle='#888';ctx.fillText(node.meaning,x,y+s/2+4);if(node.parts){var sp=Math.max(55,w/(node.parts.length+1)/(depth+1));var sy=y+65;var sx=x-(node.parts.length-1)*sp/2;node.parts.forEach(function(p,i){var cx=sx+i*sp;ctx.strokeStyle=tc+'88';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y+s/2+8);ctx.lineTo(cx,sy-12);ctx.stroke();dn(cx,sy,p,depth+1);});}}dn(w/2,35,tree,0);}
function animTree(){drawTree();requestAnimationFrame(animTree);}animTree();

var sentences=[{parts:[{text:'我',role:'Subject',color:'#e63946'},{text:'喜欢',role:'Verb',color:'#34d399'},{text:'中国菜',role:'Object',color:'#38bdf8'}],tr:'I like Chinese food.'},{parts:[{text:'我',role:'Subj',color:'#e63946'},{text:'昨天',role:'Time',color:'#fbbf24'},{text:'在学校',role:'Place',color:'#a78bfa'},{text:'学了',role:'Verb',color:'#34d399'},{text:'中文',role:'Obj',color:'#38bdf8'}],tr:'I studied Chinese at school yesterday.'},{parts:[{text:'我',role:'S',color:'#e63946'},{text:'把',role:'把',color:'#ff6ec7'},{text:'书',role:'O',color:'#38bdf8'},{text:'放在',role:'V',color:'#34d399'},{text:'桌子上',role:'Loc',color:'#a78bfa'}],tr:'I put the book on the table.'},{parts:[{text:'他',role:'S',color:'#e63946'},{text:'比',role:'比',color:'#ff6ec7'},{text:'我',role:'Ref',color:'#f0a040'},{text:'高',role:'Adj',color:'#34d399'}],tr:'He is taller than me.'}];
function showSentence(idx){for(var i=0;i<4;i++){var b=document.getElementById('sBtn'+i);if(b){b.style.borderColor=i===idx?'var(--accent)':'var(--border)';b.style.color=i===idx?'var(--accent)':'var(--muted)';}}var s=sentences[idx];var c=document.getElementById('sentenceViz');c.innerHTML='';var row=document.createElement('div');row.className='pkt-row';s.parts.forEach(function(p){var div=document.createElement('div');div.className='pkt-field cn';div.style.background=p.color+'22';div.style.color=p.color;div.style.fontSize='0.9rem';div.innerHTML=p.text+'<small>'+p.role+'</small>';row.appendChild(div);});c.appendChild(row);document.getElementById('sentenceInfo').textContent=s.tr;}showSentence(0);

var questions=[{q:'你好 means?',opts:['Goodbye','Hello','Thanks','Sorry'],ans:1,cat:'vocab'},{q:'Pinyin for 学?',opts:['shué','xié','xué','xuě'],ans:2,cat:'pinyin'},{q:'Radical of 好?',opts:['子','口','女','大'],ans:2,cat:'radicals'},{q:'"I love you"?',opts:['我想你','我爱你','我喜欢你','我有你'],ans:1,cat:'vocab'},{q:'Which is "dipping" tone?',opts:['1st','2nd','3rd','4th'],ans:2,cat:'tones'},{q:'三百四十五 = ?',opts:['345','354','435','3045'],ans:0,cat:'numbers'},{q:'Which means "water"?',opts:['火','山','水','土'],ans:2,cat:'characters'},{q:'谢谢 means?',opts:['Sorry','Hello','Please','Thank you'],ans:3,cat:'vocab'}];
var qIdx=0,score=0,total=0,answered=false,activeCat='all';var cats=[];questions.forEach(function(q){if(cats.indexOf(q.cat)===-1)cats.push(q.cat);});var ltrs=['A','B','C','D'];
function renderQuizCats(){var c=document.getElementById('quizCats');c.innerHTML='<button class="quiz-cat-btn active" onclick="setQuizCat(\'all\',this)">All</button>';cats.forEach(function(cat){c.innerHTML+='<button class="quiz-cat-btn" onclick="setQuizCat(\''+cat+'\',this)">'+cat.charAt(0).toUpperCase()+cat.slice(1)+'</button>';});}
function setQuizCat(cat,btn){activeCat=cat;document.querySelectorAll('.quiz-cat-btn').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');qIdx=0;nextQuestion();}
function getFiltered(){return activeCat==='all'?questions:questions.filter(function(q){return q.cat===activeCat;});}
function renderQ(){answered=false;var f=getFiltered();if(!f.length)return;var q=f[qIdx%f.length];document.getElementById('qText').textContent=q.q;var c=document.getElementById('qOpts');c.innerHTML='';q.opts.forEach(function(o,i){var d=document.createElement('div');d.className='quiz-opt';d.innerHTML='<span class="letter">'+ltrs[i]+'</span>'+o;d.onclick=function(){if(answered)return;answered=true;total++;if(i===q.ans){d.classList.add('correct');score++;}else{d.classList.add('wrong');c.children[q.ans].classList.add('correct');}document.getElementById('qScore').textContent='Score: '+score+' / '+total;};c.appendChild(d);});}
function nextQuestion(){qIdx=(qIdx+1)%getFiltered().length;renderQ();}renderQuizCats();renderQ();

var flashcards=[{f:'你好',b:'nǐ hǎo — Hello',source:'default'},{f:'谢谢',b:'xièxie — Thank you',source:'default'},{f:'再见',b:'zàijiàn — Goodbye',source:'default'},{f:'学习',b:'xuéxí — To study',source:'default'},{f:'朋友',b:'péngyou — Friend',source:'default'},{f:'吃饭',b:'chīfàn — To eat',source:'default'},{f:'工作',b:'gōngzuò — Work',source:'default'},{f:'开心',b:'kāixīn — Happy',source:'default'}];
var fcIdx=0;var fcDeck='default';
function getActiveDeck(){if(fcDeck==='default')return flashcards.filter(function(fc){return fc.source==='default';});if(fcDeck==='saved')return flashcards.filter(function(fc){return fc.source==='saved';});return flashcards;}
function switchFCDeck(deck){fcDeck=deck;fcIdx=0;renderCard();}
function renderCard(){var deck=getActiveDeck();document.getElementById('flashInner').classList.remove('flipped');if(!deck.length){document.getElementById('fcFront').textContent='No cards';document.getElementById('fcBack').textContent=fcDeck==='saved'?'Save words from RSS articles first!':'No cards';document.getElementById('fcCounter').textContent='0/0';document.getElementById('fcSourceTag').textContent='';return;}fcIdx=fcIdx%deck.length;document.getElementById('fcFront').textContent=deck[fcIdx].f;document.getElementById('fcBack').textContent=deck[fcIdx].b;document.getElementById('fcCounter').textContent=(fcIdx+1)+'/'+deck.length;var src=deck[fcIdx].source;var st=document.getElementById('fcSourceTag');if(src==='saved'){st.textContent='📡 RSS';st.style.background='rgba(34,211,238,0.13)';st.style.color='var(--cyan)';}else{st.textContent='📦 Default';st.style.background='rgba(167,139,250,0.13)';st.style.color='var(--purple)';}}
function flipCard(){document.getElementById('flashInner').classList.toggle('flipped');}
function nextCard(){var deck=getActiveDeck();if(deck.length)fcIdx=(fcIdx+1)%deck.length;renderCard();}
function prevCard(){var deck=getActiveDeck();if(deck.length)fcIdx=(fcIdx-1+deck.length)%deck.length;renderCard();}renderCard();

var fibData=[{sentence:'我___中文。',blank:'学',choices:['学','吃','喝','看'],hint:'I ___ Chinese.'},{sentence:'她很___。',blank:'漂亮',choices:['漂亮','吃饭','工作','学习'],hint:'She is very ___.'},{sentence:'今天天气很___。',blank:'好',choices:['人','大','好','吃'],hint:'Today weather is very ___.'}];var fibIdx=0;
function renderFIB(){var f=fibData[fibIdx%fibData.length];var area=document.getElementById('fibArea');area.innerHTML='<div class="fib-sentence cn">'+f.sentence.replace('___','<span class="fib-blank" id="fibBlank">?</span>')+'</div><div style="font-size:0.7rem;color:var(--muted);margin-bottom:8px;">'+f.hint+'</div><div class="fib-choices" id="fibChoices"></div>';var cc=document.getElementById('fibChoices');var a2=false;f.choices.forEach(function(ch){var btn=document.createElement('div');btn.className='fib-choice cn';btn.textContent=ch;btn.onclick=function(){if(a2)return;a2=true;if(ch===f.blank){btn.classList.add('selected');document.getElementById('fibBlank').textContent=ch;document.getElementById('fibBlank').style.color='var(--green)';}else{btn.classList.add('wrong-sel');cc.querySelectorAll('.fib-choice').forEach(function(b){if(b.textContent===f.blank)b.classList.add('selected');});document.getElementById('fibBlank').textContent=f.blank;}};cc.appendChild(btn);});}
function nextFIB(){fibIdx++;renderFIB();}renderFIB();

var checklistData=[{label:'Pinyin & Tones',cat:'Basics',done:true},{label:'Greetings',cat:'Basics',done:true},{label:'HSK 1 Vocabulary',cat:'Vocab',done:true},{label:'HSK 2 Vocabulary',cat:'Vocab',done:true},{label:'Save 5 words from RSS',cat:'Immerse',done:false},{label:'Review saved flashcards',cat:'Study',done:false}];
function renderChecklist(){var c=document.getElementById('checklist');c.innerHTML='';checklistData.forEach(function(item,i){var d=document.createElement('div');d.className='check-item'+(item.done?' done':'');d.innerHTML='<div class="check-box">'+(item.done?'✓':'')+'</div><span class="check-label">'+item.label+'</span><span class="check-cat">'+item.cat+'</span>';d.onclick=function(){checklistData[i].done=!checklistData[i].done;renderChecklist();};c.appendChild(d);});document.getElementById('checkProgress').textContent=Math.round(checklistData.filter(function(i){return i.done;}).length/checklistData.length*100)+'%';}renderChecklist();

var tips=['<strong>Tone pairs matter!</strong> 你好 — two 3rd tones: nǐ hǎo → ní hǎo.','<strong>Radicals are key.</strong> 氵= water → 河 海 湖','<strong>Save RSS vocab!</strong> Click highlighted words in articles to build your dictionary.','<strong>Hover vocab!</strong> Highlighted words in articles show pinyin + meaning tooltip.','<strong>把 (bǎ):</strong> 我把门关了 = "I closed the door."'];var tipIdx=0;
function newTip(){tipIdx=(tipIdx+1)%tips.length;document.getElementById('tipText').innerHTML=tips[tipIdx];}document.getElementById('tipText').innerHTML=tips[0];

var typingTexts=['ni hao wo shi xuesheng','jintian tianqi hen hao','wo xihuan chi zhongguo cai'];var typingTarget='',typingStart=0;
function resetTyping(){typingTarget=typingTexts[Math.floor(Math.random()*typingTexts.length)];typingStart=0;document.getElementById('typingInput').value='';renderTypingDisplay('');document.getElementById('typSpeed').textContent='0';document.getElementById('typAccuracy').textContent='100%';document.getElementById('typProgress').textContent='0%';}
function renderTypingDisplay(typed){var d=document.getElementById('typingDisplay');var html='';for(var i=0;i<typingTarget.length;i++){if(i<typed.length){html+=typed[i]===typingTarget[i]?'<span class="typed">'+typingTarget[i]+'</span>':'<span class="error-char">'+typingTarget[i]+'</span>';}else if(i===typed.length){html+='<span class="current">'+typingTarget[i]+'</span>';}else html+=typingTarget[i];}d.innerHTML=html;}
function handleTyping(){var typed=document.getElementById('typingInput').value;if(!typingStart&&typed.length)typingStart=Date.now();renderTypingDisplay(typed);var elapsed=Math.max(1,(Date.now()-typingStart)/60000);var correct=typed.split('').filter(function(c,i){return c===typingTarget[i];}).length;document.getElementById('typSpeed').textContent=Math.round(correct/elapsed)+' CPM';document.getElementById('typAccuracy').textContent=(typed.length?Math.round(correct/typed.length*100):100)+'%';document.getElementById('typProgress').textContent=Math.min(Math.round(typed.length/typingTarget.length*100),100)+'%';}resetTyping();

var radicals=[{ch:'亻',py:'rén',en:'person'},{ch:'口',py:'kǒu',en:'mouth'},{ch:'女',py:'nǚ',en:'woman'},{ch:'子',py:'zǐ',en:'child'},{ch:'日',py:'rì',en:'sun'},{ch:'月',py:'yuè',en:'moon'},{ch:'水',py:'shuǐ',en:'water'},{ch:'火',py:'huǒ',en:'fire'},{ch:'木',py:'mù',en:'wood'},{ch:'土',py:'tǔ',en:'earth'},{ch:'心',py:'xīn',en:'heart'},{ch:'手',py:'shǒu',en:'hand'},{ch:'山',py:'shān',en:'mountain'},{ch:'大',py:'dà',en:'big'},{ch:'艹',py:'cǎo',en:'grass'},{ch:'纟',py:'sī',en:'silk'}];
(function(){var c=document.getElementById('radicalGrid');radicals.forEach(function(r){c.innerHTML+='<div class="radical-card"><div class="radical-char">'+r.ch+'</div><div class="radical-pinyin">'+r.py+'</div><div class="radical-meaning">'+r.en+'</div></div>';});})();

var hskVocab={1:[{ch:'你好',py:'nǐ hǎo',en:'hello'},{ch:'谢谢',py:'xièxie',en:'thank you'},{ch:'再见',py:'zàijiàn',en:'goodbye'},{ch:'请',py:'qǐng',en:'please'},{ch:'是',py:'shì',en:'to be'},{ch:'有',py:'yǒu',en:'to have'},{ch:'吃',py:'chī',en:'to eat'}],2:[{ch:'已经',py:'yǐjīng',en:'already'},{ch:'因为',py:'yīnwèi',en:'because'},{ch:'所以',py:'suǒyǐ',en:'therefore'},{ch:'虽然',py:'suīrán',en:'although'},{ch:'但是',py:'dànshì',en:'but'}],3:[{ch:'终于',py:'zhōngyú',en:'finally'},{ch:'而且',py:'érqiě',en:'moreover'},{ch:'适合',py:'shìhé',en:'suitable'},{ch:'提高',py:'tígāo',en:'improve'}]};
function showHSK(lvl,btn){document.querySelectorAll('.hsk-btn').forEach(function(b){b.style.borderColor='var(--border)';b.style.color='var(--muted)';});btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';var c=document.getElementById('hskList');c.innerHTML='';hskVocab[lvl].forEach(function(w){c.innerHTML+='<div class="phrase-item"><span class="phrase-cn">'+w.ch+'</span><span class="phrase-py">'+w.py+'</span><span class="phrase-en">'+w.en+'</span></div>';});}showHSK(1,document.querySelector('.hsk-btn'));

var grammarPatterns=[{pattern:'S + V + O',desc:'Basic SVO',ex:'<strong>我吃饭。</strong>'},{pattern:'S + 很 + Adj',desc:'Adj predicates',ex:'<strong>她很漂亮。</strong>'},{pattern:'是...的',desc:'Emphasis',ex:'<strong>我是昨天来的。</strong>'},{pattern:'把 + O + V',desc:'Disposal',ex:'<strong>请把门关上。</strong>'},{pattern:'被 + Agent + V',desc:'Passive',ex:'<strong>蛋糕被他吃了。</strong>'}];
(function(){var c=document.getElementById('grammarList');grammarPatterns.forEach(function(g){var d=document.createElement('div');d.className='grammar-item';d.innerHTML='<div class="grammar-pattern">'+g.pattern+'</div><div class="grammar-desc">'+g.desc+'</div><div class="grammar-example">'+g.ex+'</div>';d.onclick=function(){d.classList.toggle('expanded');};c.appendChild(d);});})();

var idioms=[{ch:'一举两得',py:'yì jǔ liǎng dé',en:'Two birds one stone'},{ch:'画蛇添足',py:'huà shé tiān zú',en:'Over-doing it'},{ch:'马马虎虎',py:'mǎmahūhū',en:'So-so'}];
(function(){var c=document.getElementById('idiomList');idioms.forEach(function(item){var d=document.createElement('div');d.className='idiom-item';d.innerHTML='<div class="idiom-chars">'+item.ch+'</div><div class="idiom-py">'+item.py+'</div><div class="idiom-meaning"><strong>Meaning:</strong> '+item.en+'</div>';d.onclick=function(){d.classList.toggle('expanded');};c.appendChild(d);});})();

var phrases2=[{ch:'你好',py:'nǐ hǎo',en:'Hello'},{ch:'谢谢',py:'xièxie',en:'Thanks'},{ch:'不客气',py:'bú kèqi',en:'Welcome'},{ch:'对不起',py:'duìbuqǐ',en:'Sorry'},{ch:'多少钱？',py:'duōshao qián?',en:'How much?'},{ch:'加油！',py:'jiā yóu!',en:'Keep going!'}];
(function(){var c=document.getElementById('phraseList');phrases2.forEach(function(p){c.innerHTML+='<div class="phrase-item"><span class="phrase-cn">'+p.ch+'</span><span class="phrase-py">'+p.py+'</span><span class="phrase-en">'+p.en+'</span></div>';});})();

var cultureNotes=[{title:'🧧 Red Envelopes',body:'Red envelopes (红包) contain money given during New Year.'},{title:'🏮 Chinese New Year',body:'Biggest holiday. Family reunion, fireworks, 红包.'},{title:'🍜 Food Culture',body:'Communal dining. Never stick chopsticks upright in rice.'}];
(function(){var c=document.getElementById('cultureList');cultureNotes.forEach(function(n){var d=document.createElement('div');d.className='culture-card';d.innerHTML='<div class="culture-title">'+n.title+'</div><div class="culture-body">'+n.body+'</div>';d.onclick=function(){d.classList.toggle('expanded');};c.appendChild(d);});})();

var pomo={running:false,time:25*60,mode:'focus',session:3,interval:null};
function updatePomo(){var m=String(Math.floor(pomo.time/60)).padStart(2,'0'),s=String(pomo.time%60).padStart(2,'0');document.getElementById('pomoTime').textContent=m+':'+s;document.getElementById('pomoLabel').textContent=pomo.mode==='focus'?'专注学习 · Focus':'休息 · Break';var d=document.getElementById('pomoSessions');d.innerHTML='';for(var i=0;i<4;i++)d.innerHTML+='<div class="pomo-dot'+(i<pomo.session?' done':'')+'"></div>';}
function pomoAction(a){if(a==='start'){if(pomo.running)return;pomo.running=true;pomo.interval=setInterval(function(){pomo.time--;if(pomo.time<=0){if(pomo.mode==='focus'){pomo.session++;pomo.mode='break';pomo.time=5*60;}else{pomo.mode='focus';pomo.time=25*60;}}updatePomo();},1000);}else if(a==='pause'){pomo.running=false;clearInterval(pomo.interval);}else if(a==='reset'){pomo.running=false;clearInterval(pomo.interval);pomo.time=25*60;pomo.mode='focus';updatePomo();}}updatePomo();

document.getElementById('termInput').addEventListener('keydown',function(e){if(e.key==='Enter'){var cmd=this.value.trim();if(!cmd)return;processCmd(cmd);this.value='';}});
function termPrint(text,cls){var out=document.getElementById('termOutput');var d=document.createElement('div');d.className='terminal-line'+(cls?' '+cls:'');d.innerHTML=text;out.appendChild(d);out.scrollTop=out.scrollHeight;}
function processCmd(cmd){termPrint('<span class="prompt">> </span>'+cmd);var parts=cmd.trim().split(/\s+/);var c=parts[0].toLowerCase();if(c==='help'){termPrint('Commands: lookup, pinyin, random, quiz, answer, number, wordlist, clear, help','info');}else if(c==='clear')document.getElementById('termOutput').innerHTML='';else if(c==='wordlist'){if(!savedWords.length)termPrint('Word list empty. Save words from RSS!','warn');else{termPrint('📖 Saved Words ('+savedWords.length+'):','info');savedWords.forEach(function(w){termPrint('  '+w.cn+' ('+w.py+') — '+w.en+' ['+w.source+']','info');});}}else if(c==='lookup'){var ch=parts[1];if(ch&&charDB[ch]){var d=charDB[ch];termPrint(ch+' ('+d.py+') — '+d.en+' | '+d.rad+' | '+d.str+' strokes','info');}else termPrint('Not found.','warn');}else if(c==='random'){var ch6=charKeys[Math.floor(Math.random()*charKeys.length)];var d6=charDB[ch6];termPrint(ch6+' ('+d6.py+') — '+d6.en+' | HSK '+d6.hsk,'info');}else if(c==='number'){var n=parseInt(parts[1]);if(!isNaN(n))termPrint(n+' → '+numToCn(n),'info');else termPrint('Usage: number 123','error');}else if(c==='quiz'){var ch5=charKeys[Math.floor(Math.random()*charKeys.length)];var d5=charDB[ch5];termPrint('What does '+ch5+' mean? (Type "answer")','info');window._qa=ch5+' ('+d5.py+') — '+d5.en;}else if(c==='answer'){if(window._qa){termPrint(window._qa,'info');window._qa=null;}else termPrint('No quiz active.','warn');}else if(c==='pinyin'){var t=parts.slice(1).join(' ');termPrint(t.replace(/([a-züü]+?)([1-5])/gi,function(m2,s2,tn){return applyTone(s2,tn);}),'info');}else termPrint('Unknown: '+c+'. Type \'help\'.','error');}

var writeChars=['你','好','我','是','学','中','大','小','人','天','日','月','水','爱','心'];var writeIdx=0,isDrawing=false,lastPos=null;
function initWritingCanvas(){drawWritingGrid();}
function drawWritingGrid(){var canvas=document.getElementById('writingCanvas');if(!canvas)return;var ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#0a0c10';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#2a2d3a';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();ctx.setLineDash([]);ctx.font='160px Noto Sans SC,serif';ctx.fillStyle='#ffffff08';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(writeChars[writeIdx],w/2,h/2);document.getElementById('writingChar').textContent=writeChars[writeIdx];}
function clearWriting(){drawWritingGrid();}function nextWriteChar(){writeIdx=(writeIdx+1)%writeChars.length;drawWritingGrid();}function prevWriteChar(){writeIdx=(writeIdx-1+writeChars.length)%writeChars.length;drawWritingGrid();}
(function(){var canvas=document.getElementById('writingCanvas');if(!canvas)return;var ctx=canvas.getContext('2d');function gp(e){var r=canvas.getBoundingClientRect();var t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*(canvas.width/r.width),y:(t.clientY-r.top)*(canvas.height/r.height)};}canvas.addEventListener('mousedown',function(e){e.preventDefault();isDrawing=true;lastPos=gp(e);});canvas.addEventListener('mousemove',function(e){e.preventDefault();if(!isDrawing)return;var p=gp(e);ctx.strokeStyle='#eee';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(lastPos.x,lastPos.y);ctx.lineTo(p.x,p.y);ctx.stroke();lastPos=p;});canvas.addEventListener('mouseup',function(){isDrawing=false;});canvas.addEventListener('mouseleave',function(){isDrawing=false;});canvas.addEventListener('touchstart',function(e){e.preventDefault();isDrawing=true;lastPos=gp(e);},{passive:false});canvas.addEventListener('touchmove',function(e){e.preventDefault();if(!isDrawing)return;var p=gp(e);ctx.strokeStyle='#eee';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(lastPos.x,lastPos.y);ctx.lineTo(p.x,p.y);ctx.stroke();lastPos=p;},{passive:false});canvas.addEventListener('touchend',function(){isDrawing=false;});drawWritingGrid();})();

var dialogues=[{scene:'🏪 At a store',messages:[{who:'店员',text:'你好！欢迎光临！'},{who:'你',text:'(Greet)'}],choices:[{text:'你好！我想买东西。',correct:true,reply:'好的！你想买什么？'},{text:'再见！',correct:false,reply:'啊？你要走了？'}]},{scene:'🍜 Restaurant',messages:[{who:'服务员',text:'请问要点什么？'},{who:'你',text:'(Order)'}],choices:[{text:'我要一碗面条。',correct:true,reply:'好的！还要别的吗？'},{text:'你好吗？',correct:false,reply:'我很好...你要点菜吗？'}]}];var dlgIdx=0;
function renderDialogue(){var d=dialogues[dlgIdx];document.getElementById('dialogueScene').textContent=d.scene;var msgs=document.getElementById('dialogueMessages');msgs.innerHTML='';d.messages.forEach(function(m){var isy=m.who==='你';msgs.innerHTML+='<div style="padding:8px 10px;background:'+(isy?'rgba(230,57,70,0.1)':'var(--surface)')+';border-radius:8px;font-size:0.78rem;font-family:\'Noto Sans SC\',sans-serif;"><strong style="color:'+(isy?'var(--accent)':'var(--blue)')+';">'+m.who+':</strong> '+m.text+'</div>';});var cc=document.getElementById('dialogueChoices');cc.innerHTML='';d.choices.forEach(function(ch,i){var btn=document.createElement('div');btn.className='quiz-opt';btn.style.fontFamily="'Noto Sans SC','Inter',sans-serif";btn.innerHTML='<span class="letter">'+ltrs[i]+'</span>'+ch.text;btn.onclick=function(){cc.querySelectorAll('.quiz-opt').forEach(function(b){b.style.pointerEvents='none';});btn.classList.add(ch.correct?'correct':'wrong');var r=document.createElement('div');r.style.cssText='padding:8px;background:var(--surface);border-radius:8px;font-size:0.78rem;margin-top:6px;font-family:"Noto Sans SC",sans-serif;';r.innerHTML='<strong style="color:var(--blue);">Reply:</strong> '+ch.reply;document.getElementById('dialogueMessages').appendChild(r);};cc.appendChild(btn);});}
function nextDialogue(){dlgIdx=(dlgIdx+1)%dialogues.length;renderDialogue();}renderDialogue();

var memCards=[],memFlipped=[],memMatched=0,memMoves=0,memLock=false;
function initMemory(){var pool=charKeys.filter(function(k){return charDB[k].str<=8;}).sort(function(){return Math.random()-.5;}).slice(0,8);var pairs=[];pool.forEach(function(ch){pairs.push({type:'char',value:ch,id:ch});pairs.push({type:'meaning',value:charDB[ch].en,id:ch});});memCards=pairs.sort(function(){return Math.random()-.5;});memFlipped=[];memMatched=0;memMoves=0;memLock=false;document.getElementById('memScore').textContent='Moves: 0';var g=document.getElementById('memGrid');g.innerHTML='';memCards.forEach(function(c2,i){var d=document.createElement('div');d.className='mem-card';d.textContent=c2.type==='char'?c2.value:c2.value;d.dataset.idx=i;d.onclick=function(){flipMem(i);};g.appendChild(d);});}
function flipMem(idx){if(memLock)return;var cards=document.querySelectorAll('.mem-card');var card=cards[idx];if(card.classList.contains('flipped')||card.classList.contains('matched'))return;card.classList.add('flipped');memFlipped.push(idx);if(memFlipped.length===2){memMoves++;document.getElementById('memScore').textContent='Moves: '+memMoves;memLock=true;var a=memFlipped[0],b=memFlipped[1];if(memCards[a].id===memCards[b].id&&a!==b){cards[a].classList.add('matched');cards[b].classList.add('matched');memMatched+=2;memFlipped=[];memLock=false;}else{setTimeout(function(){cards[a].classList.remove('flipped');cards[b].classList.remove('flipped');memFlipped=[];memLock=false;},800);}}}initMemory();

var toneScore=0;var toneWords=[{ch:'妈',tone:1},{ch:'麻',tone:2},{ch:'马',tone:3},{ch:'骂',tone:4},{ch:'花',tone:1},{ch:'人',tone:2},{ch:'水',tone:3},{ch:'大',tone:4}];
function newToneGame(){var w=toneWords[Math.floor(Math.random()*toneWords.length)];var area=document.getElementById('toneGameArea');area.innerHTML='<div class="cn" style="font-size:3rem;font-weight:800;color:#eee;margin:10px;">'+w.ch+'</div><div style="font-size:0.75rem;color:var(--muted);margin-bottom:12px;">What tone?</div><div style="display:flex;gap:8px;justify-content:center;" id="toneGameBtns"></div><div style="margin-top:10px;"><button class="btn-secondary btn-small" onclick="newToneGame()">Next →</button></div>';var btns=document.getElementById('toneGameBtns');var ans=false;[1,2,3,4].forEach(function(t){var b=document.createElement('button');b.className='btn-secondary';b.textContent=t===1?'1st ¯':t===2?'2nd ´':t===3?'3rd ˇ':'4th `';b.onclick=function(){if(ans)return;ans=true;if(t===w.tone){b.style.borderColor='var(--green)';b.style.color='var(--green)';toneScore++;document.getElementById('toneGameScore').textContent='Score: '+toneScore;}else{b.style.borderColor='var(--red)';b.style.color='var(--red)';btns.children[w.tone-1].style.borderColor='var(--green)';btns.children[w.tone-1].style.color='var(--green)';}};btns.appendChild(b);});}newToneGame();

var scramScore=0;var scramWords=[{ch:'你好',en:'hello'},{ch:'谢谢',en:'thank you'},{ch:'学习',en:'study'},{ch:'中国',en:'China'},{ch:'朋友',en:'friend'}];
function newScramble(){var w=scramWords[Math.floor(Math.random()*scramWords.length)];var chars=w.ch.split('').sort(function(){return Math.random()-.5;});var area=document.getElementById('scrambleArea');area.innerHTML='<div style="font-size:0.8rem;color:var(--muted);margin-bottom:8px;">Unscramble: <strong>'+w.en+'</strong></div><div style="display:flex;gap:8px;justify-content:center;margin-bottom:10px;" id="scramBtns"></div><div class="cn" style="font-size:1.5rem;font-weight:700;min-height:40px;color:var(--accent2);" id="scramResult"></div><div style="display:flex;gap:6px;justify-content:center;margin-top:8px;"><button class="btn-secondary btn-small" onclick="scramClear()">Clear</button><button class="btn-secondary btn-small" onclick="scramCheck()">Check</button><button class="btn-secondary btn-small" onclick="newScramble()">Next →</button></div>';window._scramAns=w.ch;window._scramPicked=[];var btns=document.getElementById('scramBtns');chars.forEach(function(c3){var b=document.createElement('button');b.className='btn-secondary cn';b.style.fontSize='1.3rem';b.style.minWidth='44px';b.textContent=c3;b.dataset.used='0';b.onclick=function(){if(b.dataset.used==='1')return;b.dataset.used='1';b.style.opacity='0.3';window._scramPicked.push(c3);document.getElementById('scramResult').textContent=window._scramPicked.join('');};btns.appendChild(b);});}
function scramClear(){window._scramPicked=[];document.getElementById('scramResult').textContent='';document.querySelectorAll('#scramBtns button').forEach(function(b){b.dataset.used='0';b.style.opacity='1';});}
function scramCheck(){var r=document.getElementById('scramResult');if(window._scramPicked.join('')===window._scramAns){r.style.color='var(--green)';scramScore++;document.getElementById('scrambleScore').textContent='Score: '+scramScore;}else{r.style.color='var(--red)';setTimeout(function(){r.textContent=window._scramAns;r.style.color='var(--green)';},1000);}}newScramble();

// ===== RSS READER =====
var rssFeeds=[{id:'bbc',name:'BBC 中文',nameCn:'BBC中文网',color:'#e63946',url:'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml',icon:'🇬🇧'},{id:'rfi',name:'RFI 中文',nameCn:'法广中文',color:'#38bdf8',url:'https://www.rfi.fr/cn/rss',icon:'🇫🇷'},{id:'dw',name:'DW 中文',nameCn:'德国之声',color:'#fbbf24',url:'https://rss.dw.com/xml/rss-chi-all',icon:'🇩🇪'},{id:'voa',name:'VOA 中文',nameCn:'美国之音',color:'#34d399',url:'https://www.voachinese.com/api/zmgqoe$moi',icon:'🇺🇸'},{id:'zaobao',name:'联合早报',nameCn:'联合早报',color:'#f0a040',url:'https://www.zaobao.com/rss',icon:'🇸🇬'},{id:'nyt',name:'NYT 中文',nameCn:'纽约时报',color:'#a78bfa',url:'https://cn.nytimes.com/rss/',icon:'🗽'}];
var allRssArticles=[];var activeRssFeed='all';var rssLoaded=false;

function extractVocab(){
  var vocabBank=[{cn:'国际',py:'guójì',en:'international'},{cn:'经济',py:'jīngjì',en:'economy'},{cn:'政府',py:'zhèngfǔ',en:'government'},{cn:'发展',py:'fāzhǎn',en:'develop'},{cn:'社会',py:'shèhuì',en:'society'},{cn:'问题',py:'wèntí',en:'problem'},{cn:'报道',py:'bàodào',en:'report'},{cn:'世界',py:'shìjiè',en:'world'},{cn:'技术',py:'jìshù',en:'technology'},{cn:'安全',py:'ānquán',en:'safety'},{cn:'合作',py:'hézuò',en:'cooperation'},{cn:'影响',py:'yǐngxiǎng',en:'influence'},{cn:'环境',py:'huánjìng',en:'environment'},{cn:'文化',py:'wénhuà',en:'culture'},{cn:'教育',py:'jiàoyù',en:'education'},{cn:'关系',py:'guānxi',en:'relationship'},{cn:'市场',py:'shìchǎng',en:'market'},{cn:'历史',py:'lìshǐ',en:'history'},{cn:'记者',py:'jìzhě',en:'journalist'},{cn:'消息',py:'xiāoxi',en:'news'},{cn:'表示',py:'biǎoshì',en:'express'},{cn:'分析',py:'fēnxī',en:'analyze'},{cn:'领导',py:'lǐngdǎo',en:'leader'},{cn:'决定',py:'juédìng',en:'decide'},{cn:'情况',py:'qíngkuàng',en:'situation'},{cn:'研究',py:'yánjiū',en:'research'},{cn:'增长',py:'zēngzhǎng',en:'growth'},{cn:'政策',py:'zhèngcè',en:'policy'},{cn:'贸易',py:'màoyì',en:'trade'},{cn:'公司',py:'gōngsī',en:'company'}];
  return vocabBank.sort(function(){return Math.random()-.5;}).slice(0,Math.floor(Math.random()*4)+4);
}
function fetchRSS(feed,callback){
  var proxyUrl='https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent(feed.url);
  fetch(proxyUrl).then(function(r){return r.json();}).then(function(data){
    if(data.status==='ok'&&data.items&&data.items.length>0){
      var articles=data.items.slice(0,15).map(function(item,idx){
        var desc=(item.description||item.content||'').replace(/<[^>]+>/g,'').trim();
        var pubDate=item.pubDate?new Date(item.pubDate):new Date();
        return{id:feed.id+'_'+idx,feedId:feed.id,feedName:feed.name,feedNameCn:feed.nameCn,feedColor:feed.color,feedIcon:feed.icon,title:item.title||'无标题',snippet:desc.substring(0,200),body:desc||desc.substring(0,200),link:item.link||feed.url,date:pubDate,dateStr:formatTimeAgo(pubDate),vocab:extractVocab(),live:true};
      });callback(articles);}else callback([]);
  }).catch(function(){callback([]);});
}
function formatTimeAgo(date){var now=new Date();var diff=Math.floor((now-date)/1000);if(diff<60)return'Just now';if(diff<3600)return Math.floor(diff/60)+'m ago';if(diff<86400)return Math.floor(diff/3600)+'h ago';if(diff<604800)return Math.floor(diff/86400)+'d ago';return date.toLocaleDateString('zh-CN');}

var fallbackArticles=[
  {feedId:'bbc',title:'中国经济增长放缓引发全球关注',snippet:'最新数据显示，中国第一季度GDP增速低于预期，分析人士认为这可能对全球经济产生重要影响。',body:'最新数据显示，中国第一季度GDP增速低于预期，分析人士认为这可能对全球经济产生重要影响。国际货币基金组织呼吁各国加强合作，共同应对经济下行压力。专家指出，中国政府正在采取一系列政策措施来刺激内需，促进社会发展。市场分析师表示，技术创新将是推动经济增长的关键因素。'},
  {feedId:'bbc',title:'人工智能安全峰会在北京举行',snippet:'来自全球各地的科技领导和政策制定者齐聚北京，讨论人工智能技术的安全发展。',body:'来自全球各地的科技领导和政策制定者齐聚北京，讨论人工智能技术的安全发展与监管框架问题。与会者一致认为，需要建立国际合作机制来确保技术的安全和负责任发展。研究人员分析了当前的情况，并提出了具体建议。'},
  {feedId:'rfi',title:'气候变化：亚太地区面临严峻挑战',snippet:'联合国最新报道指出，亚太地区是全球受气候变化影响最严重的地区之一。',body:'联合国最新报道指出，亚太地区是全球受气候变化影响最严重的地区之一。环境问题日益严重，国际社会呼吁各国政府采取更积极的政策。专家表示，合作是解决问题的关键。世界各国需要加强文化交流和教育合作。'},
  {feedId:'rfi',title:'中法文化交流年活动正式启动',snippet:'中法两国宣布启动文化交流年系列活动，旨在加深两国人民之间的相互了解和关系。',body:'中法两国宣布启动文化交流年系列活动，旨在加深两国人民之间的关系。首批活动包括艺术展览、电影节和学术论坛。教育部门表示将加强合作，推动社会文化发展。这一决定得到了双方的积极响应。'},
  {feedId:'dw',title:'欧盟讨论对华贸易新政策',snippet:'欧盟委员会正在审议一系列新的对华贸易政策建议。',body:'欧盟委员会正在审议一系列新的对华贸易政策建议，旨在平衡经济利益与安全考量。部分领导主张加强与中国的经济合作，而另一些国家则强调需要减少对中国市场的依赖。分析人士认为，这一决定将对国际贸易关系产生深远影响。'},
  {feedId:'dw',title:'科技创新：中国量子计算取得突破',snippet:'中国研究人员宣布在量子计算领域取得重大突破。',body:'中国研究人员宣布在量子计算领域取得重大突破，成功研发出新一代量子处理器。这项技术将对世界产生深远影响。公司和政府都在加大投资力度。记者报道说，这一消息引发了国际社会的广泛关注。'},
  {feedId:'voa',title:'教育改革：双语教学模式受到关注',snippet:'随着全球化深入发展，越来越多的国家开始推广双语教育模式。',body:'随着全球化深入发展，越来越多的国家开始推广双语教育模式。研究表明，早期语言学习对儿童认知发展有显著促进作用。教育部门决定加大投入，推动社会文化发展。这一政策得到了广泛支持。'},
  {feedId:'voa',title:'太空探索：嫦娥七号任务计划公布',snippet:'中国国家航天局公布嫦娥七号月球探测任务的详细情况。',body:'中国国家航天局公布嫦娥七号月球探测任务的详细情况。该任务将对月球南极进行全面研究。技术团队表示，国际合作是成功的关键。这一消息引起了世界各国的广泛关注。分析师认为，这将推动全球太空技术的发展。'},
  {feedId:'zaobao',title:'东南亚经济一体化进程加速',snippet:'东盟各国领导承诺加快区域经济一体化进程。',body:'东盟各国领导承诺加快区域经济一体化进程，推动贸易合作和市场便利化。政府部门表示将采取新的政策措施。分析人士认为，这一决定将对地区经济增长产生积极影响。'},
  {feedId:'zaobao',title:'新加坡推出新一轮华语学习计划',snippet:'新加坡教育部宣布推出新一轮华语学习推广计划。',body:'新加坡教育部宣布推出新一轮华语学习推广计划。该计划鼓励更多年轻人学习和使用华语。研究表明，语言学习对社会文化发展有重要影响。政府决定加大教育投入。'},
  {feedId:'nyt',title:'全球粮食安全问题日益突出',snippet:'联合国粮农组织报道，全球粮食安全情况正在恶化。',body:'联合国粮农组织报道，全球粮食安全情况正在恶化。多个地区面临严重的问题。国际社会呼吁各国政府加强合作，共同应对挑战。分析人士表示，技术创新和政策改革是解决问题的关键。'},
  {feedId:'nyt',title:'中国传统文化走向世界',snippet:'中医药在全球范围内的影响不断扩大。',body:'中医药在全球范围内的影响不断扩大。世界卫生组织最近发布了关于传统医学的历史性报道。研究人员表示，国际合作是推动文化交流的关键。教育机构也在积极参与。市场分析显示，相关公司的增长前景良好。'}
];
function buildFallbackArticles(){var now=new Date();return fallbackArticles.map(function(a,i){var feed=rssFeeds.find(function(f){return f.id===a.feedId;});var d=new Date(now.getTime()-(Math.floor(Math.random()*48)+1)*3600000);return{id:a.feedId+'_fb_'+i,feedId:a.feedId,feedName:feed.name,feedNameCn:feed.nameCn,feedColor:feed.color,feedIcon:feed.icon,title:a.title,snippet:a.snippet,body:a.body,link:'#',date:d,dateStr:formatTimeAgo(d),vocab:extractVocab(),live:false};}).sort(function(a,b){return b.date-a.date;});}

function renderRssFeedBtns(){var c=document.getElementById('rssFeedBtns');c.innerHTML='';var allBtn=document.createElement('button');allBtn.className='rss-feed-btn'+(activeRssFeed==='all'?' active':'');allBtn.innerHTML='<span class="feed-dot" style="background:var(--cyan);"></span>All';allBtn.onclick=function(){activeRssFeed='all';renderRssFeedBtns();renderRssList();};c.appendChild(allBtn);rssFeeds.forEach(function(f){var btn=document.createElement('button');btn.className='rss-feed-btn'+(activeRssFeed===f.id?' active':'');btn.innerHTML='<span class="feed-dot" style="background:'+f.color+';"></span>'+f.icon+' '+f.name;btn.onclick=function(){activeRssFeed=f.id;renderRssFeedBtns();renderRssList();};c.appendChild(btn);});}

function renderRssList(){var list=document.getElementById('rssList');var filtered=activeRssFeed==='all'?allRssArticles:allRssArticles.filter(function(a){return a.feedId===activeRssFeed;});list.innerHTML='';if(!filtered.length){list.innerHTML='<div class="rss-loading">No articles found.</div>';return;}document.getElementById('rssArticleCount').textContent=filtered.length+' articles';filtered.forEach(function(art){var item=document.createElement('div');item.className='rss-item';item.dataset.artId=art.id;item.innerHTML='<div class="rss-item-source"><span class="src-dot" style="background:'+art.feedColor+';"></span><span class="src-name">'+art.feedIcon+' '+art.feedName+'</span><span class="src-time">'+art.dateStr+'</span></div><div class="rss-item-title">'+art.title+'</div><div class="rss-item-snippet">'+art.snippet+'</div><div class="rss-item-tags">'+(art.live?'<span class="rit" style="background:rgba(52,211,153,0.1);color:var(--green);">LIVE</span>':'<span class="rit" style="background:rgba(251,191,36,0.1);color:var(--accent2);">CACHED</span>')+'<span class="rit" style="background:rgba(230,57,70,0.1);color:var(--accent);">'+art.feedNameCn+'</span></div>';item.onclick=function(){document.querySelectorAll('.rss-item').forEach(function(i2){i2.classList.remove('active');});item.classList.add('active');showArticle(art);};list.appendChild(item);});}

function showArticle(art){
  currentDisplayedArticle=art;
  var detail=document.getElementById('rssDetail');

  // Highlight vocab words in title and body
  var highlightedTitle=highlightVocabInText(art.title,art.vocab,art.title);
  var bodyParagraphs=art.body.split('\n').filter(function(p){return p.trim();});
  var highlightedBody=bodyParagraphs.map(function(p){
    return '<p>'+highlightVocabInText(p,art.vocab,art.title)+'</p>';
  }).join('');

  var vocabHtml=art.vocab.map(function(v){
    var isSaved=isWordSaved(v.cn);
    var eCn=v.cn.replace(/'/g,"\\'");var ePy=v.py.replace(/'/g,"\\'");var eEn=v.en.replace(/'/g,"\\'");var eTitle=art.title.replace(/'/g,"\\'");
    return '<span class="rss-vocab-chip'+(isSaved?' added':'')+'" onclick="addWordFromVocab(\''+eCn+'\',\''+ePy+'\',\''+eEn+'\',\''+eTitle+'\')" title="'+(isSaved?'Click to remove':'Click to add')+'"><span class="vc-cn">'+v.cn+'</span><span class="vc-py">'+v.py+'</span><span class="vc-en">'+v.en+'</span><span class="vc-add">'+(isSaved?'✓':'+')+'</span></span>';
  }).join('');

  var addAllSaved=art.vocab.every(function(v){return isWordSaved(v.cn);});

  detail.innerHTML='<div class="rss-detail-header"><div class="rss-detail-source"><span class="rds-name" style="background:'+art.feedColor+'22;color:'+art.feedColor+';">'+art.feedIcon+' '+art.feedName+'</span><span class="rds-time">'+art.dateStr+(art.live?' · 🟢 Live':'')+'</span></div><div class="rss-detail-title">'+highlightedTitle+'</div></div>'+
  '<div class="vocab-highlight-legend"><div class="vhl-item"><div class="vhl-swatch" style="background:var(--accent2);"></div><span>Vocab word (hover for details)</span></div><div class="vhl-item"><div class="vhl-swatch" style="background:var(--green);"></div><span>Already saved ✓</span></div></div>'+
  '<div class="rss-detail-body">'+highlightedBody+'</div>'+
  '<div class="rss-vocab"><div class="rss-vocab-title">📝 Key Vocabulary · <span style="font-weight:400;color:var(--muted);">Click ➕ to save</span></div><div class="rss-vocab-list">'+vocabHtml+'</div>'+(art.vocab.length>1&&!addAllSaved?'<button class="add-all-btn" onclick="addAllVocabFromArticle()">➕ Add All Words to List</button>':'')+(addAllSaved&&art.vocab.length>0?'<div style="font-size:0.65rem;color:var(--green);margin-top:8px;">✅ All words from this article saved!</div>':'')+'</div>'+(art.link&&art.link!=='#'?'<a class="rss-detail-link" href="'+art.link+'" target="_blank" rel="noopener noreferrer">🔗 Read Full on '+art.feedName+' →</a>':'');
}

function addAllVocabFromArticle(){
  if(!currentDisplayedArticle)return;var count=0;
  currentDisplayedArticle.vocab.forEach(function(v){
    if(!isWordSaved(v.cn)){addWord({cn:v.cn,py:v.py,en:v.en,source:'rss',sourceArticle:currentDisplayedArticle.title});addSavedWordToFlashcards({cn:v.cn,py:v.py,en:v.en});count++;}
  });
  if(count>0){showToast(count+' words','','added to word list & flashcards',false);refreshCurrentArticleVocab();renderCard();}
}

var feedsLoaded=0;var feedsFailed=0;
function loadAllFeeds(){if(rssLoaded)return;allRssArticles=[];feedsLoaded=0;feedsFailed=0;document.getElementById('rssLoading').style.display='flex';renderRssFeedBtns();rssFeeds.forEach(function(feed){fetchRSS(feed,function(articles){feedsLoaded++;if(articles.length>0)allRssArticles=allRssArticles.concat(articles);else feedsFailed++;if(feedsLoaded>=rssFeeds.length){if(allRssArticles.length===0)allRssArticles=buildFallbackArticles();else if(feedsFailed>0){var liveFeedIds=allRssArticles.map(function(a){return a.feedId;});allRssArticles=allRssArticles.concat(buildFallbackArticles().filter(function(a){return liveFeedIds.indexOf(a.feedId)===-1;}));}allRssArticles.sort(function(a,b){return b.date-a.date;});rssLoaded=true;document.getElementById('rssLoading').style.display='none';document.getElementById('rssLastUpdate').textContent=new Date().toLocaleTimeString();renderRssList();}});});setTimeout(function(){if(!rssLoaded){allRssArticles=buildFallbackArticles();rssLoaded=true;document.getElementById('rssLoading').style.display='none';document.getElementById('rssLastUpdate').textContent=new Date().toLocaleTimeString()+' (offline)';renderRssList();}},8000);}

// ===== IMMERSE RESOURCES =====
var immerseResources=[{name:'哔哩哔哩 Bilibili',cat:'video',icon:'📱',color:'#38bdf8',desc:'China\'s biggest video community.',tags:['video','social'],level:'easy',url:'https://www.bilibili.com/',tip:'Search 学中文 for learner content.'},{name:'CCTV 中文国际',cat:'tv',icon:'📺',color:'#e63946',desc:'China\'s main state broadcaster.',tags:['live','video'],level:'hard',url:'https://tv.cctv.com/live/cctv4/',tip:'Watch 新闻联播 for standardized Mandarin.'},{name:'微博 Weibo',cat:'social',icon:'💬',color:'#f472b6',desc:'China\'s Twitter — real opinions.',tags:['social','text'],level:'med',url:'https://weibo.com/',tip:'Follow @人民日报 and check 热搜.'},{name:'知乎 Zhihu',cat:'social',icon:'❓',color:'#38bdf8',desc:'China\'s Quora. Great for reading.',tags:['text','community'],level:'hard',url:'https://www.zhihu.com/',tip:'Search topics you know well.'},{name:'喜马拉雅 Ximalaya',cat:'audio',icon:'🎧',color:'#a78bfa',desc:'Biggest podcast platform.',tags:['audio','podcast'],level:'med',url:'https://www.ximalaya.com/',tip:'Start with 儿童故事.'},{name:'Mandarin Corner',cat:'learning',icon:'🎓',color:'#34d399',desc:'YouTube street interviews and lessons.',tags:['video','learning'],level:'easy',url:'https://www.youtube.com/@MandarinCorner',tip:'Street interviews are amazing.'}];
var immerseCats=[{id:'all',label:'🌏 All'},{id:'tv',label:'📺 TV'},{id:'video',label:'▶️ Video'},{id:'social',label:'💬 Social'},{id:'audio',label:'🎧 Audio'},{id:'learning',label:'🎓 Learning'}];var activeImmerseCat='all';
var YOUTUBE_NEWS_STORAGE_KEY='hanzi-dash:immerse-youtube-news-channel';
var youtubeNewsChannels=[
  {id:'feed-1',label:'Feed 1',name:'Live News Feed 1',videoId:'BOy2xDU1LC8',url:'https://www.youtube.com/watch?v=BOy2xDU1LC8'},
  {id:'feed-2',label:'Feed 2',name:'Live News Feed 2',videoId:'TsccmbyNk6g',url:'https://www.youtube.com/watch?v=TsccmbyNk6g'},
  {id:'feed-3',label:'Feed 3',name:'Live News Feed 3',videoId:'fN9uYWCjQaw',url:'https://www.youtube.com/watch?v=fN9uYWCjQaw'},
  {id:'feed-4',label:'Feed 4',name:'Live News Feed 4',videoId:'6IquAgfvYmc',url:'https://www.youtube.com/watch?v=6IquAgfvYmc'}
];
var activeYoutubeNewsChannelId=loadYoutubeNewsChannel();
function loadYoutubeNewsChannel(){
  try{
    var savedId=localStorage.getItem(YOUTUBE_NEWS_STORAGE_KEY);
    var match=youtubeNewsChannels.find(function(channel){return channel.id===savedId;});
    return match?match.id:youtubeNewsChannels[0].id;
  }catch(err){
    return youtubeNewsChannels[0].id;
  }
}
function saveYoutubeNewsChannel(channelId){
  try{
    localStorage.setItem(YOUTUBE_NEWS_STORAGE_KEY,channelId);
  }catch(err){}
}
function getActiveYoutubeNewsChannel(){
  return youtubeNewsChannels.find(function(channel){return channel.id===activeYoutubeNewsChannelId;})||youtubeNewsChannels[0];
}
function setYoutubeNewsChannel(channelId){
  activeYoutubeNewsChannelId=channelId;
  saveYoutubeNewsChannel(channelId);
  renderYoutubeNewsWidget();
}
function renderYoutubeNewsWidget(){
  var mount=document.getElementById('youtubeNewsWidget');
  if(!mount)return;
  var activeChannel=getActiveYoutubeNewsChannel();
  mount.innerHTML='<div class="youtube-news-head"><div class="youtube-news-copy"><div class="youtube-news-kicker">Persistent Live News</div><div class="youtube-news-title-row"><strong>'+activeChannel.name+'</strong><span class="youtube-news-live-tag">Live</span></div><div class="youtube-news-sub">Your selected channel stays active after reload.</div></div><a class="btn-secondary btn-small" href="'+activeChannel.url+'" target="_blank" rel="noopener noreferrer">Open on YouTube</a></div><div class="youtube-news-player"><iframe src="https://www.youtube.com/embed/'+activeChannel.videoId+'?autoplay=0&mute=1&playsinline=1&rel=0&modestbranding=1" title="'+activeChannel.name+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="youtube-news-channel-row">'+youtubeNewsChannels.map(function(channel){return '<button class="youtube-news-channel-btn'+(channel.id===activeChannel.id?' active':'')+'" onclick="setYoutubeNewsChannel(\''+channel.id+'\')">'+channel.label+'</button>';}).join('')+'</div>';
}
function renderImmerse(){renderImmerseCats();renderYoutubeNewsWidget();renderResources();renderDCProgress();}
function renderImmerseCats(){var bar=document.getElementById('immerseCatBar');bar.innerHTML='';immerseCats.forEach(function(cat){var btn=document.createElement('button');btn.className='immerse-cat-btn'+(activeImmerseCat===cat.id?' active':'');btn.textContent=cat.label;btn.onclick=function(){activeImmerseCat=cat.id;renderImmerseCats();renderResources();};bar.appendChild(btn);});}
function renderResources(){var grid=document.getElementById('resourceGrid');grid.innerHTML='';var filtered=activeImmerseCat==='all'?immerseResources:immerseResources.filter(function(r){return r.cat===activeImmerseCat;});filtered.forEach(function(res){var lc=res.level==='easy'?'level-easy':res.level==='med'?'level-med':'level-hard';var ll=res.level==='easy'?'Beginner':res.level==='med'?'Intermediate':'Advanced';var tags=res.tags.map(function(t){var tc=t==='video'?'type-video':t==='text'?'type-text':t==='audio'?'type-audio':t==='social'?'type-social':t==='live'?'type-live':'';return'<span class="resource-tag '+tc+'">'+t+'</span>';}).join('')+'<span class="resource-tag '+lc+'">'+ll+'</span>';var card=document.createElement('div');card.className='resource-card';card.innerHTML='<div class="resource-thumb" style="background:'+res.color+'11;"><span style="position:relative;">'+res.icon+'</span></div><div class="resource-body"><div class="resource-name">'+res.icon+' '+res.name+'</div><div class="resource-desc">'+res.desc+'</div><div class="resource-tags">'+tags+'</div><div style="background:var(--bg);border-radius:8px;padding:8px 10px;margin-top:10px;font-size:0.68rem;color:var(--accent2);line-height:1.5;">💡 '+res.tip+'</div><a class="resource-link" href="'+res.url+'" target="_blank" rel="noopener noreferrer">🔗 Open →</a></div>';grid.appendChild(card);});}
function renderDCProgress(){var c=document.getElementById('dcProgress');if(!c)return;c.innerHTML='';var tasks=['📺 Watch','📰 Read','💾 Save 5','🃏 Review'];if(!window._dcDone)window._dcDone=[false,false,false,false];tasks.forEach(function(t,i){var dot=document.createElement('div');dot.className='dc-dot'+(window._dcDone[i]?' done':'');dot.textContent=window._dcDone[i]?'✓':'';dot.title=t;dot.onclick=function(){window._dcDone[i]=!window._dcDone[i];renderDCProgress();};c.appendChild(dot);if(i<tasks.length-1){var label=document.createElement('span');label.style.cssText='font-size:0.6rem;color:var(--muted);';label.textContent=t;c.appendChild(label);}});}

var cyberFlashcards=[
  {cn:'网络安全',py:'wǎngluò ānquán',en:'cybersecurity'},
  {cn:'威胁情报',py:'wēixié qíngbào',en:'threat intelligence'},
  {cn:'供应链攻击',py:'gōngyìng liàn gōngjī',en:'supply chain attack'},
  {cn:'数据泄露',py:'shùjù xièlòu',en:'data breach'},
  {cn:'零日',py:'líng rì',en:'zero-day'},
  {cn:'勒索软件',py:'lèsuǒ ruǎnjiàn',en:'ransomware'}
];
var cyberFlashcardState={idx:0,flipped:false};
function renderCyberFlashcard(){
  var card=cyberFlashcards[cyberFlashcardState.idx];
  var front=document.getElementById('cyberFlashcardFront');
  var back=document.getElementById('cyberFlashcardBack');
  var inner=document.getElementById('cyberFlashcardInner');
  var counter=document.getElementById('cyberFlashcardCounter');
  if(!front||!back||!inner||!counter)return;
  front.innerHTML=card.cn+'<div class="fc-sub">'+card.py+'</div>';
  back.textContent=card.en;
  inner.classList.toggle('flipped',cyberFlashcardState.flipped);
  counter.textContent=(cyberFlashcardState.idx+1)+'/'+cyberFlashcards.length;
}
function flipCyberFlashcard(){
  cyberFlashcardState.flipped=!cyberFlashcardState.flipped;
  renderCyberFlashcard();
}
function navCyberFlashcard(dir){
  cyberFlashcardState.idx=(cyberFlashcardState.idx+dir+cyberFlashcards.length)%cyberFlashcards.length;
  cyberFlashcardState.flipped=false;
  renderCyberFlashcard();
}

var cyberQuizBank=[
  {cn:'网络安全',en:'cybersecurity'},
  {cn:'威胁情报',en:'threat intelligence'},
  {cn:'供应链攻击',en:'supply chain attack'},
  {cn:'数据泄露',en:'data breach'},
  {cn:'零日',en:'zero-day'},
  {cn:'勒索软件',en:'ransomware'},
  {cn:'社工库',en:'social engineering database'},
  {cn:'水军',en:'paid commenters / bot network'}
];
var cyberQuizState={score:0,total:0,current:null};
function nextCyberQuiz(){
  var question=document.getElementById('cyberQuizQuestion');
  var optionsEl=document.getElementById('cyberQuizOptions');
  var scoreEl=document.getElementById('cyberQuizScore');
  if(!question||!optionsEl||!scoreEl)return;
  var current=cyberQuizBank[Math.floor(Math.random()*cyberQuizBank.length)];
  var wrong=cyberQuizBank.filter(function(item){return item.cn!==current.cn;}).sort(function(){return Math.random()-.5;}).slice(0,3);
  var options=[{text:current.en,correct:true}].concat(wrong.map(function(item){return{text:item.en,correct:false};})).sort(function(){return Math.random()-.5;});
  cyberQuizState.current=current;
  question.textContent='What does "'+current.cn+'" mean?';
  optionsEl.innerHTML='';
  var answered=false;
  options.forEach(function(option){
    var row=document.createElement('button');
    row.type='button';
    row.className='quiz-opt';
    row.textContent=option.text;
    row.onclick=function(){
      if(answered)return;
      answered=true;
      cyberQuizState.total+=1;
      if(option.correct){
        cyberQuizState.score+=1;
        row.classList.add('correct');
      }else{
        row.classList.add('wrong');
        optionsEl.querySelectorAll('.quiz-opt').forEach(function(el){if(el.textContent===current.en)el.classList.add('correct');});
      }
      scoreEl.textContent='Score: '+cyberQuizState.score+'/'+cyberQuizState.total;
    };
    optionsEl.appendChild(row);
  });
}

var cyberQuerySiteMap={Baidu:'baidu.com',Bilibili:'bilibili.com',Zhihu:'zhihu.com',GitHub:'github.com',XHS:'xiaohongshu.com'};
function toggleCyberChip(el){if(!el)return;el.classList.toggle('on');}
function getCyberQueryText(){
  var kws=[];var plats=[];
  document.querySelectorAll('#cyberKw .qb-chip.on').forEach(function(el){kws.push(el.textContent.trim());});
  document.querySelectorAll('#cyberPlat .qb-chip.on').forEach(function(el){plats.push(el.textContent.trim());});
  var queryParts=[];
  if(kws.length)queryParts.push(kws.join(' '));
  if(plats.length){
    var sites=plats.map(function(name){return cyberQuerySiteMap[name]?'site:'+cyberQuerySiteMap[name]:'';}).filter(Boolean);
    if(sites.length)queryParts.push(sites.join(' OR '));
  }
  return queryParts.join(' ').trim();
}
function buildCyberQuery(){
  var output=document.getElementById('cyberQueryOutput');
  if(!output)return;
  var query=getCyberQueryText();
  output.innerHTML='<button class="qb-copy" type="button" onclick="copyCyberQuery()">📋 Copy</button>'+(query||'<span class="qb-placeholder">Click chips above to generate a query.</span>');
}
function copyCyberQuery(){
  var query=getCyberQueryText();
  if(!query)return;
  if(navigator.clipboard)navigator.clipboard.writeText(query).then(function(){
    var btn=document.querySelector('#cyberQueryOutput .qb-copy');
    if(btn){
      btn.classList.add('copied');
      btn.textContent='Copied';
      setTimeout(function(){btn.classList.remove('copied');btn.textContent='📋 Copy';},900);
    }
    showToast('📋','','Cyber query copied',false);
  });
}

var HW={level:'1-2',idx:0,strokes:[],currentStroke:[],isDrawing:false,brushSize:5,brushColor:'#ffffff',gridType:'rice',showGhost:true,ghostOpacity:0.07,hideChar:false,stats:{total:0,again:0,hard:0,good:0,easy:0},practiced:{},RES:400,ready:false,loading:false,error:'',levels:[],itemsByLevel:{},loadPromise:null,audioEl:null,strokeCache:{},anim:{active:false,auto:false,paths:[],medians:[],revealed:0,trace:[],timer:null,speed:40,char:''}};
var HSK_CHARS={1:[{ch:'人',py:'ren',en:'person',sk:2,rad:'人',ex:['人们','大人','人民']},{ch:'大',py:'da',en:'big',sk:3,rad:'大',ex:['大家','大学','很大']},{ch:'小',py:'xiao',en:'small',sk:3,rad:'小',ex:['小时','小心','大小']},{ch:'中',py:'zhong',en:'middle; China',sk:4,rad:'丨',ex:['中国','中间','中文']},{ch:'我',py:'wo',en:'I; me',sk:7,rad:'戈',ex:['我们','我的']},{ch:'你',py:'ni',en:'you',sk:7,rad:'亻',ex:['你好','你们']},{ch:'他',py:'ta',en:'he; him',sk:5,rad:'亻',ex:['他们','其他']},{ch:'是',py:'shi',en:'is; am; are',sk:9,rad:'日',ex:['是的','不是','但是']},{ch:'有',py:'you',en:'have; exist',sk:6,rad:'月',ex:['有人','没有','有的']},{ch:'学',py:'xue',en:'study; learn',sk:8,rad:'子',ex:['学生','学校','学习']},{ch:'好',py:'hao',en:'good; well',sk:6,rad:'女',ex:['好的','好看','你好']},{ch:'看',py:'kan',en:'look; see',sk:9,rad:'目',ex:['看书','好看','看见']},{ch:'说',py:'shuo',en:'speak; say',sk:9,rad:'讠',ex:['说话','听说']},{ch:'天',py:'tian',en:'day; sky',sk:4,rad:'大',ex:['天气','今天','每天']},{ch:'水',py:'shui',en:'water',sk:4,rad:'水',ex:['水果','喝水']},{ch:'火',py:'huo',en:'fire',sk:4,rad:'火',ex:['火车','火锅']},{ch:'月',py:'yue',en:'moon; month',sk:4,rad:'月',ex:['月亮','一月']},{ch:'日',py:'ri',en:'sun; day',sk:4,rad:'日',ex:['日本','生日']},{ch:'山',py:'shan',en:'mountain',sk:3,rad:'山',ex:['山上','上山']},{ch:'口',py:'kou',en:'mouth; opening',sk:3,rad:'口',ex:['人口','口语']}],2:[{ch:'走',py:'zou',en:'walk; go',sk:7,rad:'走',ex:['走路','走开']},{ch:'跑',py:'pao',en:'run',sk:12,rad:'足',ex:['跑步','跑道']},{ch:'快',py:'kuai',en:'fast; happy',sk:7,rad:'忄',ex:['快乐','很快']},{ch:'慢',py:'man',en:'slow',sk:14,rad:'忄',ex:['慢慢','慢走']},{ch:'新',py:'xin',en:'new',sk:13,rad:'斤',ex:['新年','新闻']},{ch:'长',py:'chang',en:'long; grow',sk:4,rad:'长',ex:['长城','很长']},{ch:'高',py:'gao',en:'tall; high',sk:10,rad:'高',ex:['高兴','很高']},{ch:'远',py:'yuan',en:'far; distant',sk:7,rad:'辶',ex:['远处','很远']},{ch:'近',py:'jin',en:'near; close',sk:7,rad:'辶',ex:['附近','最近']},{ch:'早',py:'zao',en:'early; morning',sk:6,rad:'日',ex:['早上','早饭']},{ch:'晚',py:'wan',en:'late; evening',sk:11,rad:'日',ex:['晚上','晚饭']},{ch:'花',py:'hua',en:'flower; spend',sk:7,rad:'艹',ex:['花园','花钱']},{ch:'鸟',py:'niao',en:'bird',sk:5,rad:'鸟',ex:['小鸟','鸟类']},{ch:'鱼',py:'yu',en:'fish',sk:8,rad:'鱼',ex:['钓鱼','鱼肉']},{ch:'马',py:'ma',en:'horse',sk:3,rad:'马',ex:['马上','马路']},{ch:'黑',py:'hei',en:'black; dark',sk:12,rad:'黑',ex:['黑色','黑板']},{ch:'白',py:'bai',en:'white; plain',sk:5,rad:'白',ex:['白色','明白']},{ch:'红',py:'hong',en:'red',sk:6,rad:'纟',ex:['红色','红包']},{ch:'笑',py:'xiao',en:'laugh; smile',sk:10,rad:'竹',ex:['笑话','微笑']},{ch:'哭',py:'ku',en:'cry',sk:10,rad:'口',ex:['哭了','哭声']}],3:[{ch:'关',py:'guan',en:'close; relate',sk:6,rad:'八',ex:['关系','关心','关门']},{ch:'决',py:'jue',en:'decide',sk:6,rad:'冫',ex:['决定','解决']},{ch:'重',py:'zhong',en:'heavy; important',sk:9,rad:'里',ex:['重要','重新']},{ch:'特',py:'te',en:'special',sk:10,rad:'牜',ex:['特别','特点']},{ch:'变',py:'bian',en:'change',sk:8,rad:'又',ex:['变化','改变']},{ch:'发',py:'fa',en:'send; develop',sk:5,rad:'又',ex:['发展','发现']},{ch:'经',py:'jing',en:'pass through',sk:8,rad:'纟',ex:['经过','经验','已经']},{ch:'世',py:'shi',en:'world; era',sk:5,rad:'一',ex:['世界','世纪']},{ch:'界',py:'jie',en:'boundary; world',sk:9,rad:'田',ex:['世界','边界']},{ch:'历',py:'li',en:'experience; calendar',sk:4,rad:'厂',ex:['历史','经历']},{ch:'城',py:'cheng',en:'city; wall',sk:9,rad:'土',ex:['城市','长城']},{ch:'风',py:'feng',en:'wind; style',sk:4,rad:'风',ex:['风景','风格']},{ch:'雨',py:'yu',en:'rain',sk:8,rad:'雨',ex:['下雨','雨水']},{ch:'雪',py:'xue',en:'snow',sk:11,rad:'雨',ex:['下雪','雪花']},{ch:'河',py:'he',en:'river',sk:8,rad:'氵',ex:['河流','银河']},{ch:'海',py:'hai',en:'sea; ocean',sk:10,rad:'氵',ex:['大海','海洋','上海']},{ch:'树',py:'shu',en:'tree',sk:9,rad:'木',ex:['树木','大树']},{ch:'草',py:'cao',en:'grass',sk:9,rad:'艹',ex:['草地','花草']},{ch:'春',py:'chun',en:'spring',sk:9,rad:'日',ex:['春天','春节']},{ch:'秋',py:'qiu',en:'autumn',sk:9,rad:'禾',ex:['秋天','秋风']}],4:[{ch:'竞',py:'jing',en:'compete',sk:10,rad:'立',ex:['竞争','竞赛']},{ch:'争',py:'zheng',en:'strive; dispute',sk:6,rad:'刀',ex:['竞争','争论']},{ch:'积',py:'ji',en:'accumulate',sk:10,rad:'禾',ex:['积极','积累']},{ch:'极',py:'ji',en:'extreme; pole',sk:7,rad:'木',ex:['积极','极其']},{ch:'观',py:'guan',en:'observe; view',sk:6,rad:'又',ex:['观察','观点']},{ch:'察',py:'cha',en:'inspect',sk:14,rad:'宀',ex:['观察','察觉']},{ch:'推',py:'tui',en:'push; recommend',sk:11,rad:'扌',ex:['推荐','推动']},{ch:'严',py:'yan',en:'strict',sk:7,rad:'一',ex:['严格','严重']},{ch:'格',py:'ge',en:'standard; grid',sk:10,rad:'木',ex:['严格','风格']},{ch:'温',py:'wen',en:'warm; temperature',sk:12,rad:'氵',ex:['温度','温暖']},{ch:'度',py:'du',en:'degree; measure',sk:9,rad:'广',ex:['温度','速度','制度']},{ch:'顺',py:'shun',en:'smooth; follow',sk:9,rad:'页',ex:['顺利','顺序']},{ch:'感',py:'gan',en:'feel; sense',sk:13,rad:'心',ex:['感觉','感谢','感动']},{ch:'觉',py:'jue',en:'feel; realize',sk:9,rad:'见',ex:['感觉','觉得']},{ch:'缺',py:'que',en:'lack; missing',sk:10,rad:'缶',ex:['缺乏','缺少']},{ch:'尊',py:'zun',en:'respect',sk:12,rad:'寸',ex:['尊重','尊敬']},{ch:'敬',py:'jing',en:'respect; salute',sk:12,rad:'攵',ex:['尊敬','敬意']},{ch:'鼓',py:'gu',en:'drum; encourage',sk:13,rad:'鼓',ex:['鼓励','鼓掌']},{ch:'励',py:'li',en:'encourage',sk:7,rad:'力',ex:['鼓励','激励']},{ch:'降',py:'jiang',en:'fall; reduce',sk:8,rad:'阝',ex:['降低','下降']}],5:[{ch:'概',py:'gai',en:'approximate; general',sk:13,rad:'木',ex:['大概','概念']},{ch:'念',py:'nian',en:'think of; read',sk:8,rad:'心',ex:['概念','纪念','想念']},{ch:'策',py:'ce',en:'plan; strategy',sk:12,rad:'竹',ex:['政策','策略']},{ch:'略',py:'lue',en:'strategy; brief',sk:11,rad:'田',ex:['策略','省略']},{ch:'贡',py:'gong',en:'tribute; contribute',sk:7,rad:'贝',ex:['贡献','进贡']},{ch:'献',py:'xian',en:'offer; dedicate',sk:13,rad:'犬',ex:['贡献','献身']},{ch:'维',py:'wei',en:'maintain',sk:11,rad:'纟',ex:['维护','思维']},{ch:'护',py:'hu',en:'protect; guard',sk:7,rad:'扌',ex:['维护','保护','护士']},{ch:'促',py:'cu',en:'urge; promote',sk:9,rad:'亻',ex:['促进','催促']},{ch:'效',py:'xiao',en:'effect; imitate',sk:10,rad:'攵',ex:['效果','效率']},{ch:'率',py:'lu',en:'rate; lead',sk:11,rad:'玄',ex:['效率','概率']},{ch:'创',py:'chuang',en:'create',sk:6,rad:'刂',ex:['创造','创新']},{ch:'造',py:'zao',en:'make; build',sk:10,rad:'辶',ex:['创造','制造']},{ch:'承',py:'cheng',en:'bear; undertake',sk:8,rad:'手',ex:['承担','继承']},{ch:'担',py:'dan',en:'carry; bear',sk:8,rad:'扌',ex:['承担','负担']},{ch:'协',py:'xie',en:'assist; coordinate',sk:6,rad:'十',ex:['协调','协会']},{ch:'调',py:'tiao',en:'adjust; investigate',sk:10,rad:'讠',ex:['协调','调查']},{ch:'象',py:'xiang',en:'elephant; image',sk:11,rad:'豕',ex:['象征','大象','想象']},{ch:'征',py:'zheng',en:'journey; sign',sk:8,rad:'彳',ex:['象征','征求']},{ch:'幸',py:'xing',en:'fortunate; lucky',sk:8,rad:'干',ex:['幸福','幸运']}],6:[{ch:'践',py:'jian',en:'tread; practice',sk:12,rad:'足',ex:['实践','践行']},{ch:'摧',py:'cui',en:'destroy',sk:14,rad:'扌',ex:['摧毁','摧残']},{ch:'毁',py:'hui',en:'destroy; ruin',sk:13,rad:'殳',ex:['摧毁','毁灭']},{ch:'颠',py:'dian',en:'top; upset',sk:16,rad:'页',ex:['颠覆','颠倒']},{ch:'覆',py:'fu',en:'cover; overturn',sk:18,rad:'覀',ex:['颠覆','覆盖']},{ch:'凝',py:'ning',en:'congeal; concentrate',sk:16,rad:'冫',ex:['凝聚','凝固']},{ch:'聚',py:'ju',en:'gather; assemble',sk:14,rad:'耳',ex:['凝聚','聚会','聚集']},{ch:'释',py:'shi',en:'release; explain',sk:12,rad:'采',ex:['解释','释放']},{ch:'奠',py:'dian',en:'establish',sk:12,rad:'大',ex:['奠基','奠定']},{ch:'遏',py:'e',en:'check; restrain',sk:12,rad:'辶',ex:['遏制','遏止']},{ch:'蕴',py:'yun',en:'contain; accumulate',sk:15,rad:'艹',ex:['蕴含','底蕴']},{ch:'诚',py:'cheng',en:'sincere; honest',sk:8,rad:'讠',ex:['诚实','真诚']},{ch:'挚',py:'zhi',en:'sincere; ardent',sk:10,rad:'手',ex:['真挚','挚友']},{ch:'渊',py:'yuan',en:'deep; profound',sk:11,rad:'氵',ex:['渊博','深渊']},{ch:'博',py:'bo',en:'extensive; learned',sk:12,rad:'十',ex:['渊博','博物馆']},{ch:'谨',py:'jin',en:'cautious; careful',sk:13,rad:'讠',ex:['谨慎','谨记']},{ch:'慎',py:'shen',en:'careful; cautious',sk:13,rad:'忄',ex:['谨慎','慎重']},{ch:'坦',py:'tan',en:'flat; frank',sk:8,rad:'土',ex:['坦率','坦白']},{ch:'恳',py:'ken',en:'sincere; earnest',sk:10,rad:'心',ex:['恳切','诚恳']},{ch:'瞻',py:'zhan',en:'gaze; look forward',sk:18,rad:'目',ex:['瞻仰','瞻望']}]};
var HW_RADICALS=[{ch:'亻',name:'person',ex:'他你们'},{ch:'氵',name:'water',ex:'河海洋'},{ch:'扌',name:'hand',ex:'打扫推'},{ch:'口',name:'mouth',ex:'吃喝听'},{ch:'女',name:'woman',ex:'她好妈'},{ch:'木',name:'tree',ex:'树林桌'},{ch:'火',name:'fire',ex:'烤热煮'},{ch:'土',name:'earth',ex:'地城墙'},{ch:'心',name:'heart',ex:'想感思'},{ch:'讠',name:'speech',ex:'说话语'},{ch:'日',name:'sun',ex:'明早晚'},{ch:'月',name:'moon',ex:'朋期脸'},{ch:'纟',name:'silk',ex:'红线绿'},{ch:'辶',name:'walk',ex:'进远道'},{ch:'艹',name:'grass',ex:'花草药'},{ch:'宀',name:'roof',ex:'家安室'},{ch:'目',name:'eye',ex:'看眼睛'},{ch:'足',name:'foot',ex:'跑跳路'},{ch:'钅',name:'metal',ex:'钱铁银'},{ch:'页',name:'page',ex:'顺须颜'},{ch:'竹',name:'bamboo',ex:'笑笔算'},{ch:'雨',name:'rain',ex:'雪雷霜'},{ch:'饣',name:'food',ex:'饭饱饿'},{ch:'刂',name:'knife',ex:'别利到'}];
var HW_STROKE_RULES=[{rule:'Top -> Bottom',cn:'从上到下',ex:'三 言'},{rule:'Left -> Right',cn:'从左到右',ex:'你 他'},{rule:'Horizontal -> Vertical',cn:'先横后竖',ex:'十 丰'},{rule:'Left-fall -> Right-fall',cn:'先撇后捺',ex:'人 八'},{rule:'Outside -> Inside',cn:'先外后内',ex:'月 同'},{rule:'Inside -> Seal',cn:'先进后关',ex:'国 回'},{rule:'Center -> Sides',cn:'先中间后两边',ex:'小 水'},{rule:'Horizontal cross first',cn:'横撇交叉先横',ex:'右 有'}];
var HW_BASIC_STROKES=[{name:'横 heng',desc:'Horizontal',ch:'一'},{name:'竖 shu',desc:'Vertical',ch:'丨'},{name:'撇 pie',desc:'Left-fall',ch:'丿'},{name:'捺 na',desc:'Right-fall',ch:'㇏'},{name:'点 dian',desc:'Dot',ch:'丶'},{name:'提 ti',desc:'Rising',ch:'㇀'},{name:'折 zhe',desc:'Turn',ch:'㇆'},{name:'钩 gou',desc:'Hook',ch:'亅'}];
function hwGetLevelKey(level){return String(level);}
function hwGetLevelLabel(level){return 'HSK '+String(level);}
function hwGetLevels(){return Array.isArray(HW.levels)?HW.levels:[];}
function hwEscapeJs(value){return String(value||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function hwGetChars(){return HW.itemsByLevel[hwGetLevelKey(HW.level)]||[];}
function hwGetCurrentChar(){var chars=hwGetChars();return chars[HW.idx]||chars[0]||null;}
function hwRenderSection(icon,title,tag,body,extraClass){return '<div class="widget'+(extraClass?' '+extraClass:'')+'"><div class="widget-header"><div class="widget-title"><div class="icon" style="background:rgba(34,211,238,0.13);color:var(--cyan);">'+icon+'</div>'+title+'</div>'+(tag?'<span class="tag" style="background:rgba(34,211,238,0.13);color:var(--cyan);">'+tag+'</span>':'')+'</div>'+body+'</div>';}
function hwFetchDataset(force){
  if(HW.loadPromise&&!force)return HW.loadPromise;
  HW.loading=true;HW.error='';
  var container=document.getElementById('widgets-handwriting');
  if(container&&container.children.length)hwRenderAndSync();
  var url='/api/language/handwriting?level='+encodeURIComponent(hwGetLevelKey(HW.level));
  HW.loadPromise=fetch(url).then(function(r){
    return r.ok?r.json():r.json().catch(function(){return{message:'Failed to load handwriting dataset.'};}).then(function(data){throw new Error(data&&data.message?data.message:'Failed to load handwriting dataset.');});
  }).then(function(data){
    HW.levels=Array.isArray(data.levels)?data.levels:[];
    HW.itemsByLevel=HW.itemsByLevel||{};
    if(data.currentLevel&&Array.isArray(data.items))HW.itemsByLevel[String(data.currentLevel)]=data.items;
    if(data.currentLevel)HW.level=String(data.currentLevel);
    if(HW.idx>=hwGetChars().length)HW.idx=0;
    HW.loading=false;HW.error='';
    hwRenderAndSync();
    return data;
  }).catch(function(err){
    HW.loading=false;
    HW.error=err&&err.message?err.message:'Failed to load handwriting dataset.';
    hwRenderAndSync();
    throw err;
  }).finally(function(){HW.loadPromise=null;});
  return HW.loadPromise;
}
function renderHandwritingZone(){
  var levels=hwGetLevels(),h='';
  h+='<div class="hsk-tabs">';
  if(levels.length){
    levels.forEach(function(level){
      var id=String(level.id);
      h+='<div class="hsk-tab'+(id===hwGetLevelKey(HW.level)?' active':'')+'" data-level="'+escapeHtml(id)+'" onclick="hwSetLevel(\''+hwEscapeJs(id)+'\')">'+escapeHtml(level.label||hwGetLevelLabel(id))+' <span style="opacity:.5;font-size:.6rem">('+(level.count||0)+')</span></div>';
    });
  }else{
    h+='<div class="hsk-tab active">HSK 3.0 2025</div>';
  }
  h+='</div>';
  h+='<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:.62rem;color:var(--muted)"><span id="hwProgressLabel">'+(HW.loading?'Loading 2025 handwriting set…':'0/0 practiced · 0%')+'</span><span>'+escapeHtml(hwGetLevelLabel(HW.level))+'</span></div><div class="hw-progress"><div class="hw-progress-fill" id="hwProgressFill" style="width:0%"></div></div></div>';
  if(HW.loading){
    h+=hwRenderSection('⏳','Loading Handwriting Set','HSK 3.0 2025','<div style="font-size:.78rem;color:var(--muted);line-height:1.7">Pulling characters from your new <b>HSK 3.0 Handwritten 2025</b> source and matching examples/audio from the 2025 word and audio sets.</div>','span-2');
    return h;
  }
  if(HW.error){
    h+=hwRenderSection('⚠️','Handwriting Dataset Error','Retry','<div style="font-size:.78rem;color:var(--muted);line-height:1.7;margin-bottom:10px">'+escapeHtml(HW.error)+'</div><button class="btn-secondary" type="button" onclick="hwFetchDataset(true)">Retry loading HSK 3.0 handwriting</button>','span-2');
    return h;
  }
  if(!hwGetChars().length){
    h+=hwRenderSection('📝','No Handwriting Characters','Empty','<div style="font-size:.78rem;color:var(--muted);line-height:1.7">No characters were returned for this handwriting level yet.</div>','span-2');
    return h;
  }
  h+=hwRenderSection('✍️','Practice Canvas','HSK 3.0 2025','<div style="text-align:center;padding:16px 12px 8px"><div style="display:flex;align-items:center;justify-content:center;gap:10px"><div class="hw-target cn" id="hwCharTarget">人</div><button class="hw-tool-btn hw-audio-btn hidden" id="hwAudioBtn" type="button" onclick="hwPlayCurrentAudio()" title="Play audio" style="width:28px;height:28px;font-size:.72rem">🔊</button><div class="hw-tool-btn" id="hwHideBtn" onclick="hwToggleHide()" title="Hide/Show character" style="width:28px;height:28px;font-size:.7rem">🙈</div></div><div class="hw-pinyin" id="hwCharPy">ren</div><div class="hw-meaning" id="hwCharEn">person</div><div class="hw-meta" id="hwCharMeta"></div><div class="hw-examples" id="hwCharExamples"></div></div><div class="hw-canvas-outer"><div class="hw-canvas-wrap"><canvas class="hw-canvas" id="hwCanvas"></canvas></div></div><div class="hw-stroke-count" id="hwStrokeCount">Strokes: <b>0</b></div><div class="hw-toolbar"><div class="hw-tool-btn" onclick="hwUndo()" title="Undo stroke">↩</div><div class="hw-tool-btn" onclick="hwClear()" title="Clear all">🗑</div><div class="hw-tool-btn" onclick="hwRandom()" title="Random character">🎲</div><div style="width:1px;height:20px;background:var(--border)"></div><div class="hw-tool-btn" id="hwAnimBtn" onclick="hwAnimateStrokes()" title="Auto-play stroke order">▶</div><div class="hw-tool-btn" onclick="hwStepStroke()" title="Step: next stroke">⏭</div><span class="hw-anim-badge" id="hwAnimLabel" style="display:none"></span><div style="width:1px;height:20px;background:var(--border)"></div><div class="hw-color-dot active" data-color="#ffffff" style="background:#ffffff" onclick="hwSetColor(\'#ffffff\')"></div><div class="hw-color-dot" data-color="#00ff88" style="background:#00ff88" onclick="hwSetColor(\'#00ff88\')"></div><div class="hw-color-dot" data-color="#f87171" style="background:#f87171" onclick="hwSetColor(\'#f87171\')"></div><div class="hw-color-dot" data-color="#38bdf8" style="background:#38bdf8" onclick="hwSetColor(\'#38bdf8\')"></div><div style="width:1px;height:20px;background:var(--border)"></div><div class="hw-brush-row"><span>🖊</span><input type="range" min="2" max="14" value="5" oninput="hwSetBrush(this.value)"><span id="hwBrushLabel">5px</span></div></div><div class="hw-speed-row"><span>Anim speed:</span><button class="hw-speed-btn" data-speed="80" onclick="hwSetAnimSpeed(80)">Slow</button><button class="hw-speed-btn active" data-speed="40" onclick="hwSetAnimSpeed(40)">Med</button><button class="hw-speed-btn" data-speed="15" onclick="hwSetAnimSpeed(15)">Fast</button></div><div class="hw-controls-row"><div style="display:flex;gap:3px"><button class="btn-secondary btn-small hw-grid-btn active" data-grid="rice" onclick="hwSetGrid(\'rice\')">米字格</button><button class="btn-secondary btn-small hw-grid-btn" data-grid="field" onclick="hwSetGrid(\'field\')">田字格</button><button class="btn-secondary btn-small hw-grid-btn" data-grid="blank" onclick="hwSetGrid(\'blank\')">Blank</button></div><div style="display:flex;align-items:center;gap:6px;font-size:.65rem;color:var(--muted)">Ghost<div class="hw-toggle on" id="hwGhostToggle" onclick="hwToggleGhost()"></div></div></div><div class="hw-nav"><button class="btn-secondary btn-small" onclick="hwNav(-1)">← Prev</button><span class="hw-counter" id="hwCounter">1 / 1</span><button class="btn-secondary btn-small" onclick="hwNav(1)">Next →</button></div><div style="text-align:center;margin-top:8px;font-size:.62rem;color:var(--muted)">How was your writing?</div><div class="hw-assess"><div class="hw-assess-btn again" onclick="hwAssess(\'again\')">🔴<br>Again</div><div class="hw-assess-btn hard" onclick="hwAssess(\'hard\')">🟡<br>Hard</div><div class="hw-assess-btn good" onclick="hwAssess(\'good\')">🟢<br>Good</div><div class="hw-assess-btn easy" onclick="hwAssess(\'easy\')">🔵<br>Easy</div></div>','span-2');
  h+=hwRenderSection('📊','Session Stats','Today','<div class="hw-stats"><div class="hw-stat"><div class="hw-stat-num" id="hwStatTotal" style="color:var(--tab-accent)">0</div><div class="hw-stat-label">Total</div></div><div class="hw-stat"><div class="hw-stat-num" id="hwStatGood" style="color:var(--green)">0</div><div class="hw-stat-label">Good</div></div><div class="hw-stat"><div class="hw-stat-num" id="hwStatHard" style="color:var(--gold)">0</div><div class="hw-stat-label">Hard</div></div><div class="hw-stat"><div class="hw-stat-num" id="hwStatAgain" style="color:var(--red)">0</div><div class="hw-stat-label">Again</div></div></div>');
  h+=hwRenderSection('📋','Character Browser','Jump to any','<div class="hw-browser" id="hwBrowser"></div><div style="font-size:.58rem;color:var(--muted);margin-top:6px">Dot = practiced · highlighted = current</div>','hw-browser-panel');
  h+=hwRenderSection('📐','Stroke Order Rules','笔顺规则',HW_STROKE_RULES.map(function(r,i){return '<div class="hw-rule"><div class="hw-rule-num">'+(i+1)+'</div><div class="hw-rule-text"><b>'+r.rule+'</b><br><span class="cn" style="color:var(--muted);font-size:.65rem">'+r.cn+'</span></div><div class="hw-rule-ex cn">'+r.ex+'</div></div>';}).join(''));
  h+=hwRenderSection('🖌️','Basic Strokes','Warm-up practice','<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">'+HW_BASIC_STROKES.map(function(s){return '<div class="hw-stroke-card"><div class="hw-stroke-ch cn">'+s.ch+'</div><div class="hw-stroke-name">'+s.name+'</div></div>';}).join('')+'</div><div style="font-size:.6rem;color:var(--muted);margin-top:8px;text-align:center">These 8 strokes form every Chinese character</div>');
  h+=hwRenderSection('🧩','Common Radicals','24 essential','<div style="font-size:.65rem;color:var(--muted);margin-bottom:8px">Hover for meaning. These appear in many HSK characters.</div><div class="hw-rad-grid">'+HW_RADICALS.map(function(r){return '<div class="hw-rad" title="'+r.name+' - '+r.ex+'"><div class="hw-rad-ch cn">'+r.ch+'</div><div class="hw-rad-name">'+r.name+'</div></div>';}).join('')+'</div>','span-2');
  return h;
}
function hwInitCanvas(){var c=document.getElementById('hwCanvas');if(!c||HW.ready)return;c.width=HW.RES;c.height=HW.RES;c.addEventListener('mousedown',function(e){hwStrokeStart(hwPos(e));});c.addEventListener('mousemove',function(e){if(HW.isDrawing)hwStrokeMove(hwPos(e));});c.addEventListener('mouseup',hwStrokeEnd);c.addEventListener('mouseleave',hwStrokeEnd);c.addEventListener('touchstart',function(e){e.preventDefault();hwStrokeStart(hwTouchPos(e));},{passive:false});c.addEventListener('touchmove',function(e){e.preventDefault();if(HW.isDrawing)hwStrokeMove(hwTouchPos(e));},{passive:false});c.addEventListener('touchend',function(e){e.preventDefault();hwStrokeEnd();},{passive:false});HW.ready=true;hwRedraw();}
function hwPos(e){var c=document.getElementById('hwCanvas'),r=c.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*HW.RES,y:(e.clientY-r.top)/r.height*HW.RES};}
function hwTouchPos(e){var t=e.touches[0],c=document.getElementById('hwCanvas'),r=c.getBoundingClientRect();return{x:(t.clientX-r.left)/r.width*HW.RES,y:(t.clientY-r.top)/r.height*HW.RES};}
  function hwFetchStrokeData(char,cb){
    if(HW.strokeCache[char]){cb(HW.strokeCache[char]);return;}
    var url='https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/'+encodeURIComponent(char)+'.json';
    fetch(url).then(function(r){if(!r.ok)throw new Error('Not found');return r.json();}).then(function(data){HW.strokeCache[char]=data;cb(data);}).catch(function(){
      var el=document.getElementById('hwAnimLabel');
      if(el){el.textContent='✗ no data';el.style.display='';}
      setTimeout(function(){if(el)el.style.display='none';},2000);
    });
  }
  function hwGetAnimTransform(){
    var R=HW.RES,pad=R*0.08,medians=HW.anim.medians||[];
    if(!medians.length){
      var sc=(R-pad*2)/1024;
      return {minX:0,maxY:1024,scale:sc,offsetX:pad,offsetY:pad};
    }
    var minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    medians.forEach(function(stroke){
      stroke.forEach(function(p){
        if(p[0]<minX)minX=p[0];
        if(p[0]>maxX)maxX=p[0];
        if(p[1]<minY)minY=p[1];
        if(p[1]>maxY)maxY=p[1];
      });
    });
    if(!isFinite(minX)||!isFinite(maxX)||!isFinite(minY)||!isFinite(maxY)){
      var fallback=(R-pad*2)/1024;
      return {minX:0,maxY:1024,scale:fallback,offsetX:pad,offsetY:pad};
    }
    var width=Math.max(1,maxX-minX),height=Math.max(1,maxY-minY);
    var scale=Math.min((R-pad*2)/width,(R-pad*2)/height);
    var offsetX=(R-width*scale)/2;
    var offsetY=(R-height*scale)/2;
    return {minX:minX,maxY:maxY,scale:scale,offsetX:offsetX,offsetY:offsetY};
  }
  function hwTransformMedian(pts){
    var t=hwGetAnimTransform();
    return pts.map(function(p){return{x:t.offsetX+(p[0]-t.minX)*t.scale,y:t.offsetY+(t.maxY-p[1])*t.scale};});
  }
function hwStopAnim(){
  HW.anim.auto=false;HW.anim.active=false;HW.anim.trace=[];clearTimeout(HW.anim.timer);
  var btn=document.getElementById('hwAnimBtn');
  if(btn){btn.classList.remove('animating');btn.textContent='▶';}
  hwRedraw();hwUpdateAnimLabel();
}
function hwResetAnim(){
  hwStopAnim();HW.anim.paths=[];HW.anim.medians=[];HW.anim.revealed=0;HW.anim.char='';hwUpdateAnimLabel();
}
function hwSetAnimSpeed(ms){
  HW.anim.speed=ms;
  document.querySelectorAll('.hw-speed-btn').forEach(function(b){b.classList.toggle('active',parseInt(b.dataset.speed,10)===ms);});
}
function hwUpdateAnimLabel(){
  var el=document.getElementById('hwAnimLabel');if(!el)return;
  if(HW.anim.paths.length&&HW.anim.revealed>0){el.textContent=HW.anim.revealed+'/'+HW.anim.paths.length;el.style.display='';}
  else{el.textContent='';el.style.display='none';}
}
function hwAnimNextStroke(){
  if(!HW.anim.auto||HW.anim.revealed>=HW.anim.medians.length){hwStopAnim();return;}
  var pts=hwTransformMedian(HW.anim.medians[HW.anim.revealed]);HW.anim.trace=[pts[0]];var i=0;hwUpdateAnimLabel();
  function tick(){
    if(!HW.anim.auto)return;
    i++;
    if(i>=pts.length){HW.anim.revealed++;HW.anim.trace=[];hwRedraw();hwUpdateAnimLabel();hwUpdateStrokeCount();HW.anim.timer=setTimeout(hwAnimNextStroke,380);return;}
    HW.anim.trace.push(pts[i]);hwRedraw();HW.anim.timer=setTimeout(tick,HW.anim.speed);
  }
  tick();
}
function hwAnimateStrokes(){
  if(HW.anim.auto){hwStopAnim();return;}
  var c=hwGetCurrentChar();if(!c)return;
  hwClear();HW.anim.auto=true;HW.anim.active=true;HW.anim.char=c.ch;HW.anim.revealed=0;HW.anim.trace=[];HW.anim.paths=[];HW.anim.medians=[];
  var btn=document.getElementById('hwAnimBtn');
  if(btn){btn.classList.add('animating');btn.textContent='⏹';}
  hwFetchStrokeData(c.ch,function(data){if(!data.strokes||!data.medians){hwStopAnim();return;}HW.anim.paths=data.strokes;HW.anim.medians=data.medians;hwAnimNextStroke();});
}
function hwStepStroke(){
  if(HW.anim.active)return;
  var c=hwGetCurrentChar();if(!c)return;
  hwFetchStrokeData(c.ch,function(data){
    if(!data.strokes||!data.medians)return;
    if(HW.anim.char!==c.ch){HW.anim.char=c.ch;HW.anim.paths=data.strokes;HW.anim.medians=data.medians;HW.anim.revealed=0;HW.anim.trace=[];HW.strokes=[];HW.currentStroke=[];}
    if(HW.anim.revealed>=data.strokes.length){HW.anim.revealed=0;hwRedraw();hwUpdateAnimLabel();hwUpdateStrokeCount();return;}
    var pts=hwTransformMedian(data.medians[HW.anim.revealed]);HW.anim.trace=[pts[0]];HW.anim.active=true;var i=0;hwUpdateAnimLabel();
    function tick(){
      i++;
      if(i>=pts.length){HW.anim.revealed++;HW.anim.trace=[];HW.anim.active=false;hwRedraw();hwUpdateAnimLabel();hwUpdateStrokeCount();return;}
      HW.anim.trace.push(pts[i]);hwRedraw();HW.anim.timer=setTimeout(tick,HW.anim.speed);
    }
    tick();
  });
}
function hwStrokeStart(p){hwStopAnim();HW.isDrawing=true;HW.currentStroke=[p];}
function hwStrokeMove(p){HW.currentStroke.push(p);hwRedraw();}
function hwStrokeEnd(){if(!HW.isDrawing)return;HW.isDrawing=false;if(HW.currentStroke.length>1)HW.strokes.push(HW.currentStroke.slice());HW.currentStroke=[];hwUpdateStrokeCount();hwRedraw();}
function hwDrawGrid(ctx,R){if(HW.gridType==='blank')return;ctx.save();ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=2;ctx.strokeRect(4,4,R-8,R-8);ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,R/2);ctx.lineTo(R,R/2);ctx.stroke();ctx.beginPath();ctx.moveTo(R/2,0);ctx.lineTo(R/2,R);ctx.stroke();if(HW.gridType==='rice'){ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(R,R);ctx.stroke();ctx.beginPath();ctx.moveTo(R,0);ctx.lineTo(0,R);ctx.stroke();}ctx.restore();}
function hwDrawGhost(ctx,R){var c=hwGetCurrentChar();if(!c||!HW.showGhost)return;ctx.save();ctx.font='bold '+(R*0.72)+'px "Noto Sans SC","SimSun",sans-serif';ctx.fillStyle='rgba(255,255,255,'+HW.ghostOpacity+')';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c.ch,R/2,R/2+R*0.02);ctx.restore();}
function hwDrawLine(ctx,pts){if(pts.length<2)return;ctx.save();ctx.strokeStyle=HW.brushColor;ctx.lineWidth=HW.brushSize;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(var i=1;i<pts.length;i++){var mx=(pts[i-1].x+pts[i].x)/2;var my=(pts[i-1].y+pts[i].y)/2;ctx.quadraticCurveTo(pts[i-1].x,pts[i-1].y,mx,my);}ctx.lineTo(pts[pts.length-1].x,pts[pts.length-1].y);ctx.stroke();ctx.restore();}
  function hwDrawAnimState(ctx,R){
    if(HW.anim.paths.length&&HW.anim.revealed>0){
      ctx.save();
      var t=hwGetAnimTransform();
      ctx.translate(t.offsetX,t.offsetY);ctx.scale(t.scale,-t.scale);ctx.translate(-t.minX,-t.maxY);
      for(var i=0;i<HW.anim.revealed;i++){
        var p2d=new Path2D(HW.anim.paths[i]);
        ctx.fillStyle=(i===HW.anim.revealed-1&&!HW.anim.active)?'rgba(0,255,136,0.28)':'rgba(0,255,136,0.14)';
        ctx.fill(p2d);ctx.strokeStyle='rgba(0,255,136,0.4)';ctx.lineWidth=2;ctx.stroke(p2d);
      }
    ctx.restore();
  }
  if(HW.anim.trace&&HW.anim.trace.length>1){
    ctx.save();ctx.strokeStyle='#00ff88';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='#00ff88';ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(HW.anim.trace[0].x,HW.anim.trace[0].y);
    for(var j=1;j<HW.anim.trace.length;j++){var mx=(HW.anim.trace[j-1].x+HW.anim.trace[j].x)/2;var my=(HW.anim.trace[j-1].y+HW.anim.trace[j].y)/2;ctx.quadraticCurveTo(HW.anim.trace[j-1].x,HW.anim.trace[j-1].y,mx,my);}
    ctx.stroke();var tip=HW.anim.trace[HW.anim.trace.length-1];ctx.shadowBlur=24;ctx.beginPath();ctx.arc(tip.x,tip.y,7,0,Math.PI*2);ctx.fillStyle='#00ff88';ctx.fill();ctx.restore();
  }
}
function hwRedraw(){var c=document.getElementById('hwCanvas');if(!c)return;var ctx=c.getContext('2d'),R=HW.RES;ctx.clearRect(0,0,R,R);hwDrawGrid(ctx,R);hwDrawGhost(ctx,R);hwDrawAnimState(ctx,R);HW.strokes.forEach(function(s){hwDrawLine(ctx,s);});if(HW.currentStroke.length>1)hwDrawLine(ctx,HW.currentStroke);}
function hwUndo(){HW.strokes.pop();hwUpdateStrokeCount();hwRedraw();}
function hwClear(){hwResetAnim();HW.strokes=[];HW.currentStroke=[];hwUpdateStrokeCount();hwRedraw();}
function hwToggleGhost(){HW.showGhost=!HW.showGhost;var t=document.getElementById('hwGhostToggle');if(t)t.classList.toggle('on',HW.showGhost);hwRedraw();}
function hwSetGrid(type){HW.gridType=type;document.querySelectorAll('.hw-grid-btn').forEach(function(b){b.classList.toggle('active',b.dataset.grid===type);});hwRedraw();}
function hwSetBrush(val){HW.brushSize=parseInt(val,10);var l=document.getElementById('hwBrushLabel');if(l)l.textContent=val+'px';}
function hwSetColor(col){HW.brushColor=col;document.querySelectorAll('.hw-color-dot').forEach(function(d){d.classList.toggle('active',d.dataset.color===col);});}
function hwToggleHide(){HW.hideChar=!HW.hideChar;var el=document.getElementById('hwCharTarget');if(el)el.classList.toggle('hidden-char',HW.hideChar);var btn=document.getElementById('hwHideBtn');if(btn)btn.textContent=HW.hideChar?'👁':'🙈';}
function hwPlayAudio(url){
  if(!url)return;
  if(!HW.audioEl){HW.audioEl=new Audio();}
  HW.audioEl.pause();
  HW.audioEl.src=url;
  HW.audioEl.currentTime=0;
  HW.audioEl.play().catch(function(){});
}
function hwPlayCurrentAudio(){var c=hwGetCurrentChar();if(c&&c.audioUrl)hwPlayAudio(c.audioUrl);}
function hwRenderExampleChip(example){
  var text=typeof example==='string'?example:(example&&example.text?example.text:'');
  var audioUrl=example&&example.audioUrl?example.audioUrl:'';
  if(!text)return '';
  if(audioUrl){
    return '<button type="button" class="hw-example-chip has-audio" onclick="hwPlayAudio(\''+hwEscapeJs(audioUrl)+'\')"><span class="cn">'+escapeHtml(text)+'</span><span class="hw-example-audio">🔊</span></button>';
  }
  return '<span class="hw-example-chip"><span class="cn">'+escapeHtml(text)+'</span></span>';
}
function hwUpdateStrokeCount(){var el=document.getElementById('hwStrokeCount'),c=hwGetCurrentChar();if(el)el.innerHTML='Strokes: <b>'+HW.strokes.length+'</b>'+(c&&c.sk?' / '+c.sk:'');}
function hwSetLevel(lvl){hwResetAnim();HW.level=String(lvl);HW.idx=0;HW.strokes=[];HW.currentStroke=[];HW.hideChar=false;if(HW.itemsByLevel[hwGetLevelKey(HW.level)]){hwRenderAndSync();return;}hwFetchDataset(true);}
function hwNav(dir){var chars=hwGetChars();if(!chars.length)return;hwResetAnim();HW.idx=(HW.idx+dir+chars.length)%chars.length;HW.strokes=[];HW.currentStroke=[];HW.hideChar=false;hwUpdateAll();}
function hwJumpTo(i){hwResetAnim();HW.idx=i;HW.strokes=[];HW.currentStroke=[];HW.hideChar=false;hwUpdateAll();}
function hwRandom(){var chars=hwGetChars();if(!chars.length)return;hwResetAnim();HW.idx=Math.floor(Math.random()*chars.length);HW.strokes=[];HW.currentStroke=[];HW.hideChar=false;hwUpdateAll();}
function hwAssess(rating){var key=HW.level+'-'+HW.idx;HW.practiced[key]=rating;HW.stats.total++;HW.stats[rating]++;hwUpdateStats();hwUpdateProgress();hwUpdateBrowser();setTimeout(function(){hwNav(1);},220);}
function hwUpdateCharDisplay(){var c=hwGetCurrentChar();if(!c)return;var el=document.getElementById('hwCharTarget');if(el){el.textContent=c.ch;el.classList.toggle('hidden-char',HW.hideChar);}var py=document.getElementById('hwCharPy');if(py)py.textContent=convertNumberedPinyinText(c.py||'');var en=document.getElementById('hwCharEn');if(en)en.textContent=c.en||'No definition found yet';var meta=document.getElementById('hwCharMeta');if(meta){var chips=['<span class="hw-meta-chip"><b>'+escapeHtml(c.sourceLevelLabel||hwGetLevelLabel(HW.level))+'</b></span>'];if(c.sk)chips.push('<span class="hw-meta-chip"><b>'+c.sk+'</b> strokes</span>');if(c.rad)chips.push('<span class="hw-meta-chip">Radical <b class="cn">'+escapeHtml(c.rad)+'</b></span>');meta.innerHTML=chips.join('');}var ex=document.getElementById('hwCharExamples');if(ex)ex.innerHTML=(c.ex&&c.ex.length?c.ex.map(hwRenderExampleChip).join(''):'<span class="hw-example-empty">No example words matched this character yet.</span>');var counter=document.getElementById('hwCounter');if(counter)counter.textContent=(HW.idx+1)+' / '+hwGetChars().length;var btn=document.getElementById('hwHideBtn');if(btn)btn.textContent=HW.hideChar?'👁':'🙈';var audioBtn=document.getElementById('hwAudioBtn');if(audioBtn){audioBtn.classList.toggle('hidden',!c.audioUrl);audioBtn.title=c.audioUrl?'Play audio':'No audio';}}
function hwUpdateStats(){var map={hwStatTotal:HW.stats.total,hwStatGood:HW.stats.good+HW.stats.easy,hwStatHard:HW.stats.hard,hwStatAgain:HW.stats.again};Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)el.textContent=map[id];});}
function hwUpdateProgress(){var chars=hwGetChars();if(!chars.length)return;var done=0;chars.forEach(function(_c,i){if(HW.practiced[HW.level+'-'+i])done++;});var pct=Math.round(done/chars.length*100);var fill=document.getElementById('hwProgressFill');if(fill)fill.style.width=pct+'%';var label=document.getElementById('hwProgressLabel');if(label)label.textContent=done+'/'+chars.length+' practiced · '+pct+'%';}
function hwUpdateBrowser(){var chars=hwGetChars(),el=document.getElementById('hwBrowser');if(!el)return;el.innerHTML=chars.map(function(c,i){var cls='hw-browse-ch';if(i===HW.idx)cls+=' current';var rating=HW.practiced[HW.level+'-'+i];if(rating)cls+=' practiced '+rating;return '<div class="'+cls+'" onclick="hwJumpTo('+i+')">'+c.ch+'</div>';}).join('');}
function hwUpdateAll(){hwUpdateCharDisplay();hwUpdateStats();hwUpdateProgress();hwUpdateBrowser();hwUpdateStrokeCount();hwRedraw();}
function hwRenderAndSync(){var container=document.getElementById('widgets-handwriting');if(!container)return;container.innerHTML=renderHandwritingZone();HW.ready=false;if(HW.loading||HW.error||!hwGetChars().length)return;setTimeout(function(){hwInitCanvas();hwUpdateAll();},60);}
function initHandwritingZone(){var container=document.getElementById('widgets-handwriting');if(!container)return;if(!HW.levels.length||!HW.itemsByLevel[hwGetLevelKey(HW.level)]){if(!container.children.length)hwRenderAndSync();hwFetchDataset();return;}if(!container.children.length){hwRenderAndSync();return;}if(!HW.ready)hwInitCanvas();hwUpdateAll();}
var lookupPopup=null;
var lookupCache={};
var lookupState={query:'',entries:[],readings:[],visible:false};
function containsChineseText(text){return /[\u3400-\u9fff]/.test(text);}
function normalizeLookupText(text){return text.replace(/\s+/g,'').trim().slice(0,24);}
function isLookupSelectionAllowed(node){
  if(!node)return false;
  var el=node.nodeType===1?node:node.parentElement;
  if(!el)return false;
  if(el.closest('.lookup-popup'))return false;
  if(el.closest('input, textarea, button, select, option'))return false;
  return !!el.closest('.dashboard');
}
function createLookupEntry(cn,py,en,trad){
  return {simplified:cn,traditional:trad||cn,pinyin:py||'',english:Array.isArray(en)?en:[en]};
}
function dedupeLookupEntries(entries){
  var seen={};
  return entries.filter(function(entry){
    var key=[entry.simplified,entry.traditional,entry.pinyin,entry.english.join('|')].join('::');
    if(seen[key])return false;
    seen[key]=true;
    return true;
  });
}
function getLocalLookupEntries(query){
  var entries=[];
  if(currentDisplayedArticle&&Array.isArray(currentDisplayedArticle.vocab)){
    currentDisplayedArticle.vocab.forEach(function(v){
      if(v.cn===query)entries.push(createLookupEntry(v.cn,v.py,v.en));
    });
  }
  savedWords.forEach(function(w){
    if(w.cn===query)entries.push(createLookupEntry(w.cn,w.py,w.en));
  });
  if(query.length===1&&charDB[query]){
    var d=charDB[query];
    entries.push(createLookupEntry(query,d.py,d.en));
  }
  return dedupeLookupEntries(entries);
}
function convertNumberedPinyinText(text){
  return text.replace(/([A-Za-züÜv:]+)([1-5])/g,function(_m,syl,tone){return applyTone(syl.replace(/u:/gi,'ü').replace(/v/gi,'ü'),tone);});
}
function getToneNumber(token){
  if(/[1-5]/.test(token)){var m=token.match(/([1-5])/);return m?Number(m[1]):5;}
  if(/[āēīōūǖĀĒĪŌŪǕ]/.test(token))return 1;
  if(/[áéíóúǘÁÉÍÓÚǗ]/.test(token))return 2;
  if(/[ǎěǐǒǔǚǍĚǏǑǓǙ]/.test(token))return 3;
  if(/[àèìòùǜÀÈÌÒÙǛ]/.test(token))return 4;
  return 5;
}
function renderTonePinyinHtml(text){
  var tokens=(text||'').split(/\s+/).filter(Boolean);
  return tokens.map(function(token){
    var tone=getToneNumber(token);
    return '<span class="tone-'+tone+'">'+escapeHtml(convertNumberedPinyinText(token))+'</span>';
  }).join(' ');
}
function ensureLookupPopup(){
  if(lookupPopup)return lookupPopup;
  lookupPopup=document.createElement('div');
  lookupPopup.className='lookup-popup hidden';
  document.body.appendChild(lookupPopup);
  return lookupPopup;
}
function hideLookupPopup(){
  if(!lookupPopup)return;
  lookupPopup.classList.add('hidden');
  lookupState.visible=false;
}
function getLookupPrimaryEntry(){
  return lookupState.entries&&lookupState.entries.length?lookupState.entries[0]:null;
}
function saveLookupEntry(){
  var entry=getLookupPrimaryEntry();
  if(!entry)return;
  var cn=entry.simplified||lookupState.query;
  var py=convertNumberedPinyinText(entry.pinyin||'');
  var en=entry.english&&entry.english.length?entry.english[0]:'';
  if(isWordSaved(cn)){showToast(cn,py,en,false);return;}
  addWord({cn:cn,py:py,en:en,source:'manual',sourceArticle:'lookup'});
  addSavedWordToFlashcards({cn:cn,py:py,en:en});
  showToast(cn,py,en,false);
  renderWordlistContent();
}
function copyLookupEntry(){
  var entry=getLookupPrimaryEntry();
  var text=entry?[entry.simplified||lookupState.query,convertNumberedPinyinText(entry.pinyin||''),(entry.english||[]).join('; ')].join('\t'):lookupState.query;
  if(navigator.clipboard)navigator.clipboard.writeText(text).then(function(){showToast('📋','','Copied lookup entry',false);});
}
function openLookupLink(kind){
  var entry=getLookupPrimaryEntry();
  var query=encodeURIComponent(entry&&entry.simplified?entry.simplified:lookupState.query);
  var urls={
    grammar:'https://resources.allsetlearning.com/chinese/grammar/index.php?search='+query,
    tatoeba:'https://tatoeba.org/en/sentences/search?from=cmn&query='+query,
    mdbg:'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb='+query
  };
  var url=urls[kind];
  if(url)window.open(url,'_blank','noopener,noreferrer');
}
function renderLookupPopup(rect){
  var popup=ensureLookupPopup();
  var primary=getLookupPrimaryEntry();
  var entriesHtml=lookupState.entries.length?lookupState.entries.slice(0,4).map(function(entry){
    var trad=entry.traditional&&entry.traditional!==entry.simplified?'<span class="lookup-trad">'+escapeHtml(entry.traditional)+'</span>':'';
    var glosses=(entry.english||[]).slice(0,3).map(function(gloss){return '<div class="lookup-gloss">'+escapeHtml(gloss)+'</div>';}).join('');
    return '<div class="lookup-entry"><div class="lookup-wordline"><div class="lookup-word cn">'+escapeHtml(entry.simplified||lookupState.query)+'</div>'+trad+'</div><div class="lookup-pinyin">'+renderTonePinyinHtml(entry.pinyin||'')+'</div><div class="lookup-glosses">'+glosses+'</div></div>';
  }).join(''):'<div class="lookup-empty">No exact local dictionary entry found yet. Add CC-CEDICT under <code>data/language</code> for fuller results.</div>';
  var readingsHtml=lookupState.readings&&lookupState.readings.length?'<div class="lookup-reading-list">'+lookupState.readings.map(function(reading){return '<span class="lookup-reading-chip">'+escapeHtml(convertNumberedPinyinText(reading))+'</span>';}).join('')+'</div>':'';
  popup.innerHTML='<div class="lookup-head"><div class="lookup-meta"><div class="lookup-sub">Selection Lookup</div><div class="lookup-word cn">'+escapeHtml(lookupState.query)+'</div></div><button class="lookup-close" type="button" onclick="hideLookupPopup()">×</button></div>'+entriesHtml+readingsHtml+'<div class="lookup-actions"><button class="lookup-action" type="button" onclick="saveLookupEntry()">Save</button><button class="lookup-action" type="button" onclick="copyLookupEntry()">Copy</button><button class="lookup-action" type="button" onclick="openLookupLink(\'grammar\')">Grammar</button><button class="lookup-action" type="button" onclick="openLookupLink(\'tatoeba\')">Tatoeba</button><button class="lookup-action" type="button" onclick="openLookupLink(\'mdbg\')">MDBG</button></div><div class="lookup-foot">Select Chinese text anywhere in the dashboard. Shortcuts while open: r save, c copy, g grammar, t examples, Esc close.</div>';
  popup.classList.remove('hidden');
  lookupState.visible=true;
  var left=Math.min(window.innerWidth-popup.offsetWidth-16,Math.max(16,rect.left));
  var top=rect.bottom+12;
  if(top+popup.offsetHeight>window.innerHeight-16)top=Math.max(16,rect.top-popup.offsetHeight-12);
  popup.style.left=left+'px';
  popup.style.top=top+'px';
}
function lookupSelectionText(text,rect){
  var query=normalizeLookupText(text);
  if(!query||!containsChineseText(query)){hideLookupPopup();return;}
  if(lookupCache[query]){lookupState=lookupCache[query];renderLookupPopup(rect);return;}
  var dictUrl='/api/language/dictionary/search?query='+encodeURIComponent(query)+'&limit=6';
  var readingUrl='/api/language/readings/'+encodeURIComponent(query);
  var dictPromise=fetch(dictUrl).then(function(r){return r.ok?r.json():{results:[]};}).catch(function(){return{results:[]};});
  var readingPromise=query.length===1?fetch(readingUrl).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}):Promise.resolve(null);
  Promise.all([dictPromise,readingPromise]).then(function(res){
    var dictData=res[0];
    var readingData=res[1];
    var entries=Array.isArray(dictData&&dictData.results)?dictData.results:[];
    entries=dedupeLookupEntries(entries.concat(getLocalLookupEntries(query)));
    var readings=readingData&&readingData.result&&Array.isArray(readingData.result.readings)?readingData.result.readings:[];
    lookupState={query:query,entries:entries,readings:readings,visible:true};
    lookupCache[query]=lookupState;
    renderLookupPopup(rect);
  });
}
function handleLookupSelection(){
  setTimeout(function(){
    var selection=window.getSelection();
    if(!selection||selection.isCollapsed){return;}
    var text=selection.toString();
    if(!text||!containsChineseText(text)){return;}
    if(!selection.rangeCount)return;
    var range=selection.getRangeAt(0);
    if(!isLookupSelectionAllowed(range.commonAncestorContainer))return;
    var rect=range.getBoundingClientRect();
    if(!rect||(!rect.width&&!rect.height))return;
    lookupSelectionText(text,rect);
  },0);
}
function initSelectionLookup(){
  ensureLookupPopup();
  document.addEventListener('mouseup',handleLookupSelection);
  document.addEventListener('keyup',function(event){
    if(lookupState.visible){
      if(event.key==='Escape'){hideLookupPopup();return;}
      if(event.key==='r'){saveLookupEntry();return;}
      if(event.key==='c'&&!event.ctrlKey&&!event.metaKey){copyLookupEntry();return;}
      if(event.key==='g'){openLookupLink('grammar');return;}
      if(event.key==='t'){openLookupLink('tatoeba');return;}
    }
    if(event.key==='Shift'||event.key.startsWith('Arrow'))handleLookupSelection();
  });
  document.addEventListener('mousedown',function(event){
    if(lookupPopup&&!lookupPopup.classList.contains('hidden')&&!lookupPopup.contains(event.target)){hideLookupPopup();}
  });
  window.addEventListener('scroll',hideLookupPopup,true);
}

// ===== WORDS TAB =====
var WORDS={
  level:'1',
  levels:[],
  allWords:[],
  loading:false,
  error:'',
  learn10:{
    words:[],
    currentIdx:0,
    learned:{},
    phase:'setup',
    readingText:'',
    quizIdx:0,
    quizScore:0,
    quizTotal:0,
    quizAnswered:false
  },
  browser:{
    words:[],
    filteredWords:[],
    page:0,
    search:'',
    pageSize:20
  },
  flashcard:{
    deck:[],
    idx:0,
    flipped:false
  },
  wod:null,
  challenges:[]
};

function fetchWordsForLevel(level,count,random){
  var url='/api/language/words?level='+encodeURIComponent(level||'1');
  if(count)url+='&count='+count;
  if(random)url+='&random=true';
  return fetch(url).then(function(r){return r.json();});
}

function initWordsZone(){
  WORDS.loading=true;
  fetchWordsForLevel(WORDS.level).then(function(data){
    WORDS.loading=false;
    if(!data.ok){WORDS.error='Failed to load words';return;}
    WORDS.levels=data.levels||[];
    WORDS.level=data.currentLevel||'1';
    WORDS.allWords=data.words||[];
    renderLearn10Setup();
    renderHskBrowserLevels();
    loadHskBrowserWords();
    loadWordsFlashcardDeck();
    loadWordOfDay();
    loadChallengesCache();
  }).catch(function(err){
    WORDS.loading=false;
    WORDS.error='Failed to load words: '+err.message;
  });
}

// Learn 10 + Read Widget
function renderLearn10Setup(){
  var select=document.getElementById('learn10LevelSelect');
  if(!select)return;
  select.innerHTML='';
  WORDS.levels.forEach(function(lvl){
    var opt=document.createElement('option');
    opt.value=lvl.id;
    opt.textContent=lvl.label;
    if(lvl.id===WORDS.level)opt.selected=true;
    select.appendChild(opt);
  });
  select.onchange=function(){
    WORDS.level=select.value;
    var lvl=WORDS.levels.find(function(l){return l.id===WORDS.level;});
    document.getElementById('learn10LevelCount').textContent='('+(lvl?lvl.count:0)+' words)';
  };
  var lvl=WORDS.levels.find(function(l){return l.id===WORDS.level;});
  document.getElementById('learn10LevelCount').textContent='('+(lvl?lvl.count:0)+' words)';
}

function startLearn10(){
  WORDS.learn10.phase='learn';
  WORDS.learn10.currentIdx=0;
  WORDS.learn10.learned={};
  WORDS.learn10.quizIdx=0;
  WORDS.learn10.quizScore=0;
  WORDS.learn10.quizTotal=0;
  document.getElementById('learn10Phase').textContent='Learning';
  fetchWordsForLevel(WORDS.level,10,true).then(function(data){
    WORDS.learn10.words=data.words||[];
    showLearn10Phase('learn');
    renderLearn10Card();
  });
}

function showLearn10Phase(phase){
  ['Setup','Learn','Read','Quiz','Complete'].forEach(function(p){
    var el=document.getElementById('learn10'+p);
    if(el)el.style.display=p.toLowerCase()===phase?'block':'none';
  });
}

function renderLearn10Card(){
  var words=WORDS.learn10.words;
  var idx=WORDS.learn10.currentIdx;
  if(!words.length)return;
  var w=words[idx];
  document.getElementById('learn10Chinese').textContent=w.simplified;
  document.getElementById('learn10Pinyin').textContent=w.pinyin;
  document.getElementById('learn10English').textContent=w.english;
  document.getElementById('learn10Counter').textContent=(idx+1)+' / '+words.length;
  var prog=document.getElementById('learn10Progress');
  prog.innerHTML='';
  words.forEach(function(_w,i){
    var dot=document.createElement('div');
    dot.style.cssText='width:10px;height:10px;border-radius:50%;background:'+(WORDS.learn10.learned[i]?'var(--green)':i===idx?'var(--accent)':'var(--surface)')+';border:1px solid var(--border);';
    prog.appendChild(dot);
  });
  var btn=document.getElementById('learn10LearnedBtn');
  if(WORDS.learn10.learned[idx]){
    btn.textContent='✓ Learned';
    btn.style.background='var(--green)';
  }else{
    btn.textContent='✓ I Know This Word';
    btn.style.background='';
  }
}

function prevLearn10Word(){
  if(WORDS.learn10.currentIdx>0){
    WORDS.learn10.currentIdx--;
    renderLearn10Card();
  }
}

function nextLearn10Word(){
  if(WORDS.learn10.currentIdx<WORDS.learn10.words.length-1){
    WORDS.learn10.currentIdx++;
    renderLearn10Card();
  }else{
    var allLearned=Object.keys(WORDS.learn10.learned).length>=WORDS.learn10.words.length;
    if(allLearned){
      startLearn10Read();
    }
  }
}

function markLearn10Learned(){
  WORDS.learn10.learned[WORDS.learn10.currentIdx]=true;
  renderLearn10Card();
  var allLearned=Object.keys(WORDS.learn10.learned).length>=WORDS.learn10.words.length;
  if(allLearned&&WORDS.learn10.currentIdx===WORDS.learn10.words.length-1){
    setTimeout(startLearn10Read,500);
  }else if(WORDS.learn10.currentIdx<WORDS.learn10.words.length-1){
    setTimeout(nextLearn10Word,300);
  }
}

// Reading passage generation using templates
var readingTemplates=[
  {template:'今天我去{place}。我看见{person}在{verb}。',slots:['place','person','verb']},
  {template:'{person}说："我们一起{verb}吧！"我觉得很{adj}。',slots:['person','verb','adj']},
  {template:'这个{noun}是我的。我很{adverb}{verb}它。',slots:['noun','adverb','verb']},
  {template:'我{time}{verb}了。现在我想{verb2}。',slots:['time','verb','verb2']},
  {template:'{person}每天都{verb}。他们很{adj}。',slots:['person','verb','adj']},
  {template:'在{place}，有很多{noun}。我喜欢{verb}。',slots:['place','noun','verb']}
];

function categorizeWord(word){
  var en=(word.english||'').toLowerCase();
  if(/\b(to|do|make|go|come|eat|drink|see|look|read|write|speak|say|want|like|love|study|learn|work|play|run|walk|sit|stand|sleep|buy|sell|give|take|put|get|know|think|feel|hear|listen|use|open|close|start|stop|begin|end|try|need|can|will|would|should|must)\b/.test(en))return 'verb';
  if(/\b(big|small|good|bad|new|old|young|fast|slow|high|low|long|short|hot|cold|happy|sad|easy|hard|beautiful|ugly|clean|dirty|rich|poor|strong|weak|busy|free|full|empty|right|wrong|early|late|important|interesting)\b/.test(en))return 'adj';
  if(/\b(very|really|quite|too|more|most|less|least|always|never|often|sometimes|usually|already|still|just|only|also|again|together|quickly|slowly)\b/.test(en))return 'adverb';
  if(/\b(person|people|man|woman|child|children|friend|family|father|mother|teacher|student|doctor|worker)\b/.test(en))return 'person';
  if(/\b(place|school|home|house|room|store|shop|restaurant|hotel|hospital|airport|station|park|city|country|road|street)\b/.test(en))return 'place';
  if(/\b(day|time|year|month|week|hour|minute|morning|afternoon|evening|night|today|tomorrow|yesterday)\b/.test(en))return 'time';
  if(/\b(thing|book|pen|paper|table|chair|door|window|car|phone|computer|food|water|clothes|money|work|word|name|number)\b/.test(en))return 'noun';
  return 'noun';
}

function generateReadingPassage(words){
  var categorized={verb:[],adj:[],adverb:[],person:[],place:[],time:[],noun:[]};
  words.forEach(function(w){
    var cat=categorizeWord(w);
    categorized[cat].push(w.simplified);
  });
  Object.keys(categorized).forEach(function(cat){
    if(!categorized[cat].length){
      var fallbacks={verb:['学习','工作'],adj:['好','高兴'],adverb:['很'],person:['我','他'],place:['学校','家'],time:['今天'],noun:['东西','书']};
      categorized[cat]=fallbacks[cat]||['这个'];
    }
  });
  var template=readingTemplates[Math.floor(Math.random()*readingTemplates.length)];
  var sentence=template.template;
  template.slots.forEach(function(slot){
    var cat=slot==='verb2'?'verb':slot;
    var pool=categorized[cat]||categorized.noun;
    var word=pool[Math.floor(Math.random()*pool.length)];
    sentence=sentence.replace('{'+slot+'}',word);
  });
  return sentence;
}

function startLearn10Read(){
  WORDS.learn10.phase='read';
  document.getElementById('learn10Phase').textContent='Reading';
  var passage=generateReadingPassage(WORDS.learn10.words);
  WORDS.learn10.readingText=passage;
  var passageEl=document.getElementById('learn10Passage');
  var html=passage;
  WORDS.learn10.words.forEach(function(w){
    var re=new RegExp('('+w.simplified+')','g');
    html=html.replace(re,'<span class="learn10-highlight" title="'+w.pinyin+' — '+escapeHtml(w.english)+'" style="background:rgba(230,57,70,0.15);padding:2px 4px;border-radius:4px;cursor:help;">$1</span>');
  });
  passageEl.innerHTML=html;
  showLearn10Phase('read');
}

function startLearn10Quiz(){
  WORDS.learn10.phase='quiz';
  WORDS.learn10.quizIdx=0;
  WORDS.learn10.quizScore=0;
  WORDS.learn10.quizTotal=WORDS.learn10.words.length;
  WORDS.learn10.quizAnswered=false;
  document.getElementById('learn10Phase').textContent='Quiz';
  showLearn10Phase('quiz');
  renderLearn10QuizQuestion();
}

function renderLearn10QuizQuestion(){
  var words=WORDS.learn10.words;
  var idx=WORDS.learn10.quizIdx;
  if(idx>=words.length){
    finishLearn10();
    return;
  }
  var w=words[idx];
  WORDS.learn10.quizAnswered=false;
  document.getElementById('learn10QuizQuestion').textContent=w.simplified;
  var opts=document.getElementById('learn10QuizOptions');
  opts.innerHTML='';
  var choices=[w.english];
  var otherWords=words.filter(function(_,i){return i!==idx;});
  while(choices.length<4&&otherWords.length){
    var rIdx=Math.floor(Math.random()*otherWords.length);
    var other=otherWords.splice(rIdx,1)[0];
    if(choices.indexOf(other.english)===-1)choices.push(other.english);
  }
  while(choices.length<4)choices.push('(no match)');
  for(var i=choices.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1));
    var tmp=choices[i];choices[i]=choices[j];choices[j]=tmp;
  }
  choices.forEach(function(ch){
    var btn=document.createElement('div');
    btn.className='quiz-opt';
    btn.textContent=ch;
    btn.onclick=function(){
      if(WORDS.learn10.quizAnswered)return;
      WORDS.learn10.quizAnswered=true;
      if(ch===w.english){
        btn.classList.add('correct');
        WORDS.learn10.quizScore++;
      }else{
        btn.classList.add('wrong');
        Array.from(opts.children).forEach(function(b){
          if(b.textContent===w.english)b.classList.add('correct');
        });
      }
      document.getElementById('learn10QuizScore').textContent='Score: '+WORDS.learn10.quizScore+' / '+(idx+1);
      setTimeout(function(){
        WORDS.learn10.quizIdx++;
        renderLearn10QuizQuestion();
      },1000);
    };
    opts.appendChild(btn);
  });
  document.getElementById('learn10QuizScore').textContent='Question '+(idx+1)+' of '+words.length;
}

function finishLearn10(){
  WORDS.learn10.phase='complete';
  document.getElementById('learn10Phase').textContent='Complete';
  document.getElementById('learn10FinalScore').textContent='Score: '+WORDS.learn10.quizScore+' / '+WORDS.learn10.quizTotal;
  showLearn10Phase('complete');
  if(!WORDS.learn10.replayId){
    saveChallenge({
      id:'ch_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
      createdAt:new Date().toISOString(),
      level:WORDS.level,
      words:WORDS.learn10.words,
      quizScore:WORDS.learn10.quizScore,
      quizTotal:WORDS.learn10.quizTotal
    });
  }
  WORDS.learn10.replayId=null;
}

// Challenge history
function loadChallengesCache(){
  return fetch('/api/challenges').then(function(r){return r.json();}).then(function(data){
    WORDS.challenges=Array.isArray(data.challenges)?data.challenges:[];
    renderChallengeHistory();
  }).catch(function(){WORDS.challenges=[];renderChallengeHistory();});
}

function saveChallenge(challenge){
  WORDS.challenges.unshift(challenge);
  if(WORDS.challenges.length>50)WORDS.challenges=WORDS.challenges.slice(0,50);
  fetch('/api/challenges',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenges:WORDS.challenges})}).catch(function(err){console.error('Failed to persist challenges.',err);});
  renderChallengeHistory();
}

function renderChallengeHistory(){
  var c=document.getElementById('learn10History');
  if(!c)return;
  if(!WORDS.challenges.length){
    c.innerHTML='<div style="font-size:0.72rem;color:var(--muted);text-align:center;padding:10px 0;">No past challenges yet. Complete one to see it here.</div>';
    return;
  }
  var html='<div style="font-size:0.72rem;color:var(--muted);margin:12px 0 6px;">Past challenges ('+WORDS.challenges.length+')</div>';
  WORDS.challenges.slice(0,10).forEach(function(ch){
    var d=new Date(ch.createdAt);
    var dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    var safeId=String(ch.id).replace(/'/g,"\\'");
    html+='<div class="phrase-item" style="cursor:pointer;" onclick="replayChallenge(\''+safeId+'\')" title="Replay quiz with these 10 words"><span class="phrase-cn" style="font-size:0.85rem;">HSK '+ch.level+'</span><span class="phrase-py">'+ch.quizScore+'/'+ch.quizTotal+'</span><span class="phrase-en" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.7rem;">'+dateStr+'</span><span style="font-size:0.7rem;color:var(--accent);">↻ Replay</span></div>';
  });
  c.innerHTML=html;
}

function replayChallenge(id){
  var ch=WORDS.challenges.find(function(c){return c.id===id;});
  if(!ch||!ch.words||!ch.words.length)return;
  WORDS.learn10.words=ch.words.slice();
  WORDS.learn10.currentIdx=0;
  WORDS.learn10.learned={};
  WORDS.learn10.replayId=ch.id;
  WORDS.level=ch.level;
  document.getElementById('learn10Phase').textContent='Replay';
  startLearn10Quiz();
}

function resetLearn10(){
  WORDS.learn10.phase='setup';
  WORDS.learn10.words=[];
  WORDS.learn10.currentIdx=0;
  WORDS.learn10.learned={};
  document.getElementById('learn10Phase').textContent='Setup';
  showLearn10Phase('setup');
}

// HSK Browser Widget
function renderHskBrowserLevels(){
  var c=document.getElementById('hskBrowserLevels');
  if(!c)return;
  c.innerHTML='';
  WORDS.levels.forEach(function(lvl){
    var btn=document.createElement('button');
    btn.className='btn-secondary btn-small'+(lvl.id===WORDS.browser.level?' active':'');
    btn.textContent=lvl.label;
    btn.style.cssText=lvl.id===WORDS.level?'border-color:var(--accent);color:var(--accent);':'';
    btn.onclick=function(){
      WORDS.level=lvl.id;
      c.querySelectorAll('button').forEach(function(b){b.style.cssText='';});
      btn.style.cssText='border-color:var(--accent);color:var(--accent);';
      loadHskBrowserWords();
    };
    c.appendChild(btn);
  });
}

function loadHskBrowserWords(){
  fetchWordsForLevel(WORDS.level).then(function(data){
    WORDS.browser.words=data.words||[];
    WORDS.browser.filteredWords=WORDS.browser.words;
    WORDS.browser.page=0;
    WORDS.browser.search='';
    document.getElementById('hskBrowserSearch').value='';
    renderHskBrowserList();
  });
}

function filterHskBrowser(){
  var q=(document.getElementById('hskBrowserSearch').value||'').toLowerCase().trim();
  WORDS.browser.search=q;
  WORDS.browser.page=0;
  if(!q){
    WORDS.browser.filteredWords=WORDS.browser.words;
  }else{
    WORDS.browser.filteredWords=WORDS.browser.words.filter(function(w){
      return w.simplified.includes(q)||w.traditional.includes(q)||w.pinyin.toLowerCase().includes(q)||w.english.toLowerCase().includes(q);
    });
  }
  renderHskBrowserList();
}

function renderHskBrowserList(){
  var c=document.getElementById('hskBrowserList');
  var words=WORDS.browser.filteredWords;
  var page=WORDS.browser.page;
  var pageSize=WORDS.browser.pageSize;
  var start=page*pageSize;
  var pageWords=words.slice(start,start+pageSize);
  if(!pageWords.length){
    c.innerHTML='<div style="text-align:center;color:var(--muted);padding:20px;">No words found</div>';
    renderHskBrowserPagination();
    return;
  }
  var html='';
  pageWords.forEach(function(w){
    html+='<div class="phrase-item" style="cursor:pointer;" onclick="showBrowserWordDetail(\''+escapeHtml(w.simplified).replace(/'/g,"\\'")+'\')"><span class="phrase-cn">'+w.simplified+'</span><span class="phrase-py">'+w.pinyin+'</span><span class="phrase-en" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escapeHtml(w.english.substring(0,40))+'</span></div>';
  });
  c.innerHTML=html;
  renderHskBrowserPagination();
}

function renderHskBrowserPagination(){
  var c=document.getElementById('hskBrowserPagination');
  var total=WORDS.browser.filteredWords.length;
  var pageSize=WORDS.browser.pageSize;
  var pages=Math.ceil(total/pageSize);
  var page=WORDS.browser.page;
  if(pages<=1){c.innerHTML='';return;}
  var html='';
  if(page>0)html+='<button class="btn-secondary btn-small" onclick="hskBrowserPage('+(page-1)+')">←</button>';
  html+='<span style="font-size:0.75rem;color:var(--muted);">'+(page+1)+'/'+pages+'</span>';
  if(page<pages-1)html+='<button class="btn-secondary btn-small" onclick="hskBrowserPage('+(page+1)+')">→</button>';
  c.innerHTML=html;
}

function hskBrowserPage(p){
  WORDS.browser.page=p;
  renderHskBrowserList();
}

function showBrowserWordDetail(simplified){
  var w=WORDS.browser.words.find(function(w){return w.simplified===simplified;});
  if(!w)return;
  var saved=isWordSaved(w.simplified);
  var html='<div style="text-align:center;"><div class="cn" style="font-size:2rem;color:var(--accent);">'+w.simplified+'</div><div style="color:var(--accent2);">'+w.pinyin+'</div><div style="font-size:0.85rem;color:var(--muted);margin:8px 0;">'+escapeHtml(w.english)+'</div><button class="btn-secondary btn-small" onclick="'+(saved?'removeWord':'addWordFromBrowser')+'(\''+escapeHtml(w.simplified).replace(/'/g,"\\'")+'\',\''+escapeHtml(w.pinyin).replace(/'/g,"\\'")+'\',\''+escapeHtml(w.english).replace(/'/g,"\\'")+'\')">'+(saved?'✓ Saved':'➕ Save Word')+'</button></div>';
  var list=document.getElementById('hskBrowserList');
  var detail=document.createElement('div');
  detail.style.cssText='position:absolute;top:0;left:0;right:0;bottom:0;background:var(--bg);padding:20px;z-index:10;';
  detail.innerHTML='<button class="btn-secondary btn-small" onclick="this.parentElement.remove()" style="position:absolute;top:8px;right:8px;">✕</button>'+html;
  list.style.position='relative';
  list.appendChild(detail);
}

function addWordFromBrowser(cn,py,en){
  addWord({cn:cn,py:py,en:en,source:'manual',sourceArticle:'HSK Browser'});
  addSavedWordToFlashcards({cn:cn,py:py,en:en});
  showToast(cn,py,en,false);
  renderWordlistContent();
  loadHskBrowserWords();
}

// Quick Flashcards Widget
function loadWordsFlashcardDeck(){
  fetchWordsForLevel(WORDS.level,20,true).then(function(data){
    WORDS.flashcard.deck=data.words||[];
    WORDS.flashcard.idx=0;
    WORDS.flashcard.flipped=false;
    renderWordsFlashcard();
  });
}

function renderWordsFlashcard(){
  var deck=WORDS.flashcard.deck;
  var idx=WORDS.flashcard.idx;
  document.getElementById('wordsFlashInner').classList.remove('flipped');
  if(!deck.length){
    document.getElementById('wordsFlashFront').textContent='No cards';
    document.getElementById('wordsFlashBack').textContent='Load words first';
    document.getElementById('wordsFlashCounter').textContent='0/0';
    document.getElementById('wordsFlashcardStats').textContent='0/0';
    return;
  }
  var w=deck[idx];
  document.getElementById('wordsFlashFront').textContent=w.simplified;
  document.getElementById('wordsFlashBack').textContent=w.pinyin+' — '+w.english;
  document.getElementById('wordsFlashCounter').textContent=(idx+1)+'/'+deck.length;
  document.getElementById('wordsFlashcardStats').textContent=(idx+1)+'/'+deck.length;
}

function flipWordsFlashcard(){
  document.getElementById('wordsFlashInner').classList.toggle('flipped');
  WORDS.flashcard.flipped=!WORDS.flashcard.flipped;
}

function nextWordsFlashcard(){
  var deck=WORDS.flashcard.deck;
  if(!deck.length)return;
  WORDS.flashcard.idx=(WORDS.flashcard.idx+1)%deck.length;
  WORDS.flashcard.flipped=false;
  renderWordsFlashcard();
}

function prevWordsFlashcard(){
  var deck=WORDS.flashcard.deck;
  if(!deck.length)return;
  WORDS.flashcard.idx=(WORDS.flashcard.idx-1+deck.length)%deck.length;
  WORDS.flashcard.flipped=false;
  renderWordsFlashcard();
}

function shuffleWordsFlashcards(){
  var deck=WORDS.flashcard.deck;
  for(var i=deck.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1));
    var tmp=deck[i];deck[i]=deck[j];deck[j]=tmp;
  }
  WORDS.flashcard.idx=0;
  WORDS.flashcard.flipped=false;
  renderWordsFlashcard();
}

// Word of the Day Widget
function loadWordOfDay(){
  fetchWordsForLevel(WORDS.level,1,true).then(function(data){
    var words=data.words||[];
    if(words.length){
      WORDS.wod=words[0];
      renderWordOfDay();
    }
  });
}

function renderWordOfDay(){
  var w=WORDS.wod;
  if(!w){
    document.getElementById('wodChinese').textContent='—';
    document.getElementById('wodPinyin').textContent='—';
    document.getElementById('wodEnglish').textContent='—';
    document.getElementById('wodLevel').textContent='—';
    return;
  }
  document.getElementById('wodChinese').textContent=w.simplified;
  document.getElementById('wodPinyin').textContent=w.pinyin;
  document.getElementById('wodEnglish').textContent=w.english;
  document.getElementById('wodLevel').textContent='HSK '+w.level;
}

function newWordOfDay(){
  loadWordOfDay();
}

// ===== KAHOOT =====
var KAHOOT={
  level:'1',
  levels:[],
  pool:[],
  questions:[],
  questionIdx:0,
  correctIdx:0,
  answered:false,
  questionStart:0,
  timer:null,
  timePerQuestion:15000,
  score:0,
  correctCount:0,
  streak:0,
  longestStreak:0,
  kahootColors:['#e21b3c','#1368ce','#d89e00','#26890c'],
  kahootShapes:['▲','♦','●','■']
};

function initKahootZone(){
  var lvlSel=document.getElementById('kahootLevelSelect');
  if(!lvlSel)return;
  if(WORDS.levels&&WORDS.levels.length){
    KAHOOT.levels=WORDS.levels;
    renderKahootSetup();
  }else{
    fetchWordsForLevel('1').then(function(data){
      if(data&&data.ok){
        KAHOOT.levels=data.levels||[];
        KAHOOT.level=data.currentLevel||'1';
        renderKahootSetup();
      }
    });
  }
}

function renderKahootSetup(){
  var sel=document.getElementById('kahootLevelSelect');
  if(!sel)return;
  sel.innerHTML='';
  KAHOOT.levels.forEach(function(lvl){
    var opt=document.createElement('option');
    opt.value=lvl.id;opt.textContent=lvl.label;
    if(lvl.id===KAHOOT.level)opt.selected=true;
    sel.appendChild(opt);
  });
  sel.onchange=function(){
    KAHOOT.level=sel.value;
    var lvl=KAHOOT.levels.find(function(l){return l.id===KAHOOT.level;});
    document.getElementById('kahootLevelCount').textContent='('+(lvl?lvl.count:0)+' words)';
  };
  var lvl=KAHOOT.levels.find(function(l){return l.id===KAHOOT.level;});
  document.getElementById('kahootLevelCount').textContent='('+(lvl?lvl.count:0)+' words)';
}

function showKahootPhase(phase){
  ['Setup','Game','Complete'].forEach(function(p){
    var el=document.getElementById('kahoot'+p);
    if(el)el.style.display=p.toLowerCase()===phase?'block':'none';
  });
}

function startKahoot(){
  var count=parseInt(document.getElementById('kahootCountSelect').value,10)||10;
  document.getElementById('kahootPhase').textContent='Loading';
  var poolSize=Math.max(count+10,20);
  fetchWordsForLevel(KAHOOT.level,poolSize,true).then(function(data){
    var pool=(data&&data.words)||[];
    if(pool.length<4){
      alert('Not enough words at this level to start a Kahoot.');
      document.getElementById('kahootPhase').textContent='Setup';
      return;
    }
    KAHOOT.pool=pool;
    KAHOOT.questions=pool.slice(0,Math.min(count,pool.length));
    KAHOOT.questionIdx=0;
    KAHOOT.score=0;
    KAHOOT.correctCount=0;
    KAHOOT.streak=0;
    KAHOOT.longestStreak=0;
    document.getElementById('kahootPhase').textContent='Playing';
    showKahootPhase('game');
    renderKahootQuestion();
  });
}

function renderKahootQuestion(){
  var q=KAHOOT.questions[KAHOOT.questionIdx];
  if(!q){finishKahoot();return;}
  KAHOOT.answered=false;
  document.getElementById('kahootProgress').textContent='Q '+(KAHOOT.questionIdx+1)+' / '+KAHOOT.questions.length;
  document.getElementById('kahootScore').textContent='Score: '+KAHOOT.score;
  document.getElementById('kahootStreak').textContent='🔥 Streak: '+KAHOOT.streak;
  document.getElementById('kahootHanzi').textContent=q.simplified;
  document.getElementById('kahootPinyin').textContent=q.pinyin;
  document.getElementById('kahootFeedback').textContent='';
  var choices=[q.english];
  var others=KAHOOT.pool.filter(function(w){return w.simplified!==q.simplified&&w.english&&w.english!==q.english;});
  while(choices.length<4&&others.length){
    var rIdx=Math.floor(Math.random()*others.length);
    var picked=others.splice(rIdx,1)[0];
    if(choices.indexOf(picked.english)===-1)choices.push(picked.english);
  }
  while(choices.length<4)choices.push('(no match)');
  for(var i=choices.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1));
    var tmp=choices[i];choices[i]=choices[j];choices[j]=tmp;
  }
  KAHOOT.correctIdx=choices.indexOf(q.english);
  var container=document.getElementById('kahootAnswers');
  container.innerHTML='';
  choices.forEach(function(ch,idx){
    var btn=document.createElement('div');
    btn.style.cssText='cursor:pointer;padding:18px 14px;border-radius:10px;color:#fff;font-weight:600;font-size:0.95rem;display:flex;align-items:center;gap:10px;background:'+KAHOOT.kahootColors[idx]+';transition:transform 0.1s, opacity 0.2s;user-select:none;';
    btn.innerHTML='<span style="font-size:1.3rem;">'+KAHOOT.kahootShapes[idx]+'</span><span style="flex:1;">'+escapeHtml(ch)+'</span>';
    btn.onmouseenter=function(){btn.style.transform='scale(1.02)';};
    btn.onmouseleave=function(){btn.style.transform='';};
    btn.onclick=function(){handleKahootAnswer(idx,btn);};
    container.appendChild(btn);
  });
  startKahootTimer();
}

function startKahootTimer(){
  clearInterval(KAHOOT.timer);
  KAHOOT.questionStart=Date.now();
  var bar=document.getElementById('kahootTimerBar');
  KAHOOT.timer=setInterval(function(){
    var elapsed=Date.now()-KAHOOT.questionStart;
    var remaining=Math.max(0,KAHOOT.timePerQuestion-elapsed);
    var pct=(remaining/KAHOOT.timePerQuestion)*100;
    if(bar)bar.style.width=pct+'%';
    if(remaining<=0){
      clearInterval(KAHOOT.timer);
      if(!KAHOOT.answered)handleKahootAnswer(-1,null);
    }
  },50);
}

function handleKahootAnswer(choiceIdx,btn){
  if(KAHOOT.answered)return;
  KAHOOT.answered=true;
  clearInterval(KAHOOT.timer);
  var elapsed=Date.now()-KAHOOT.questionStart;
  var remaining=Math.max(0,KAHOOT.timePerQuestion-elapsed);
  var correct=choiceIdx===KAHOOT.correctIdx;
  var feedbackEl=document.getElementById('kahootFeedback');
  var container=document.getElementById('kahootAnswers');
  Array.from(container.children).forEach(function(child,idx){
    if(idx===KAHOOT.correctIdx){child.style.outline='3px solid #fff';child.style.opacity='1';}
    else child.style.opacity='0.4';
  });
  if(correct){
    var timePoints=Math.round(1000*(remaining/KAHOOT.timePerQuestion));
    KAHOOT.streak++;
    if(KAHOOT.streak>KAHOOT.longestStreak)KAHOOT.longestStreak=KAHOOT.streak;
    var bonus=KAHOOT.streak>1?50:0;
    KAHOOT.score+=timePoints+bonus;
    KAHOOT.correctCount++;
    feedbackEl.innerHTML='<span style="color:var(--green);">✓ +'+timePoints+(bonus?' <span style="color:var(--orange);">+'+bonus+' streak!</span>':'')+'</span>';
  }else{
    KAHOOT.streak=0;
    feedbackEl.innerHTML='<span style="color:var(--accent);">✗ '+(choiceIdx<0?'Time up!':'Wrong')+'</span>';
  }
  document.getElementById('kahootScore').textContent='Score: '+KAHOOT.score;
  document.getElementById('kahootStreak').textContent='🔥 Streak: '+KAHOOT.streak;
  setTimeout(function(){
    KAHOOT.questionIdx++;
    if(KAHOOT.questionIdx>=KAHOOT.questions.length){
      finishKahoot();
    }else{
      renderKahootQuestion();
    }
  },1600);
}

function finishKahoot(){
  clearInterval(KAHOOT.timer);
  document.getElementById('kahootPhase').textContent='Complete';
  document.getElementById('kahootFinalScore').textContent='Score: '+KAHOOT.score;
  document.getElementById('kahootFinalStats').textContent=KAHOOT.correctCount+' / '+KAHOOT.questions.length+' correct · longest streak '+KAHOOT.longestStreak;
  showKahootPhase('complete');
}

function resetKahoot(){
  clearInterval(KAHOOT.timer);
  document.getElementById('kahootPhase').textContent='Setup';
  showKahootPhase('setup');
}

renderImmerse();updateWordCountDisplays();
loadSavedWordsCache();
initSelectionLookup();
renderCyberFlashcard();
nextCyberQuiz();
setTimeout(function(){loadAllFeeds();},1500);
