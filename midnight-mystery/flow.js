// Midnight Mystery — playtest flow: Case Room → Loading → Dossier → handoff
(function(){
const D=window.CASEDATA;const $=s=>document.querySelector(s);
const L2={
 en:{room:'Case Room',back:'‹ Main menu',you:'Your detective',hat:'Hat',hats:['Fedora','Deerstalker','Bowler','Newsboy'],name:'Detective name',nameHint:'shown above your character in game',ready:'READY',notReady:'NOT READY',
  inRoom:'Detectives in the room',code:'Room code',copy:'Copy invite link',steam:'Steam friends',invHint:'Friends paste the code in Join Game, click the link, or accept the Steam invite.',
  open:'open seat · waiting for a detective…',host:'host',choosing:'choosing a hat…',addBot:'+ add test detective',
  choose:'Choose a case',tabs:['All','Easy','Medium','Hard'],random:'Random',randHint:'random never repeats your last 5 cases',unlockedN:(a,b)=>`${a} of ${b} cases unlocked · solve cases to unlock more`,unlockAll:'Playtest: unlock all 60 cases',
  start:'START INVESTIGATION',hintNeedReady:'mark yourself READY',hintWait:n=>`waiting for ${n} detective${n>1?'s':''} to be ready`,hintNeed2:'you need at least 2 detectives',hintOk:'everyone is ready · only the host can start',hintGuest:'waiting for the host to start…',hintPick:'choose an unlocked case',
  copied:'Invite link copied',steamSoon:'Available in the Steam version',joinTitle:'Join a game',joinHint:'Type the 4-character room code',join:'JOIN',cancel:'CANCEL',
  searching:loc=>`Searching ${loc} for clues…`,tips:['TIP: drawers hide more than socks. Open everything.','TIP: someone is always lying. Compare the times.','TIP: a clue only counts once it is pinned to the board.','TIP: a wrong accusation costs 30 seconds. Think twice.','TIP: split up — twelve rooms, one clock.'],
  begins:'The case begins at midnight…',secret:'TOP SECRET',caseW:'CASE',exhibit:'EXHIBIT A',time:'Time limit',timeV:'10:00 — until the clock strikes midnight',wrong:'Wrong accusation',wrongV:'the clock loses 30 seconds',board:'The Clue Board',boardV:'in the central hall, marked ? on your map',diff:'Difficulty',obj:'Objective',artSoon:'Concept art in production',diffN:{easy:'Easy',medium:'Medium',hard:'Hard'},
  read:'CASE READ',readDone:'CASE READ ✓',reading:'reading…',readOk:'case read ✓',waitFor:n=>`Waiting for ${n}…`,begin:'BEGIN INVESTIGATION',guestWait:'Waiting for the host…',
  playT:'The investigation begins…',playS:'You reached the end of this playtest. The playable map (12 rooms, clues, NPCs and the Clue Board) is the next milestone.',toRoom:'BACK TO CASE ROOM',toMenu:'MAIN MENU'},
 pt:{room:'Sala do Caso',back:'‹ Menu principal',you:'Seu detetive',hat:'Chapéu',hats:['Fedora','Deerstalker','Coco','Boina'],name:'Nome do detetive',nameHint:'aparece acima do seu personagem no jogo',ready:'PRONTO',notReady:'NÃO PRONTO',
  inRoom:'Detetives na sala',code:'Código da sala',copy:'Copiar link de convite',steam:'Amigos Steam',invHint:'Amigos colam o código em Entrar em Sala, clicam no link ou aceitam o convite na Steam.',
  open:'vaga aberta · esperando um detetive…',host:'anfitrião',choosing:'escolhendo o chapéu…',addBot:'+ detetive de teste',
  choose:'Escolha um caso',tabs:['Todos','Fácil','Médio','Difícil'],random:'Sortear',randHint:'o sorteio nunca repete seus últimos 5 casos',unlockedN:(a,b)=>`${a} de ${b} casos liberados · resolva casos para liberar mais`,unlockAll:'Teste: liberar os 60 casos',
  start:'INICIAR INVESTIGAÇÃO',hintNeedReady:'marque-se como PRONTO',hintWait:n=>`esperando ${n} detetive${n>1?'s':''} ficar${n>1?'em':''} pronto${n>1?'s':''}`,hintNeed2:'são necessários pelo menos 2 detetives',hintOk:'todos prontos · só o anfitrião pode iniciar',hintGuest:'esperando o anfitrião iniciar…',hintPick:'escolha um caso liberado',
  copied:'Link de convite copiado',steamSoon:'Disponível na versão Steam',joinTitle:'Entrar em uma sala',joinHint:'Digite o código de 4 caracteres',join:'ENTRAR',cancel:'CANCELAR',
  searching:loc=>`Vasculhando ${loc} atrás de pistas…`,tips:['DICA: gavetas escondem mais que meias. Abra tudo.','DICA: alguém sempre mente. Compare os horários.','DICA: uma pista só vale depois de presa no quadro.','DICA: acusação errada custa 30 segundos. Pense duas vezes.','DICA: separem-se — doze salas, um relógio.'],
  begins:'O caso começa à meia-noite…',secret:'ULTRASSECRETO',caseW:'CASO',exhibit:'PROVA A',time:'Tempo',timeV:'10:00 — até o relógio bater meia-noite',wrong:'Acusação errada',wrongV:'o relógio perde 30 segundos',board:'O Quadro de Pistas',boardV:'no salão central, marcado com ? no mapa',diff:'Dificuldade',obj:'Objetivo',artSoon:'Concept art em produção',diffN:{easy:'Fácil',medium:'Médio',hard:'Difícil'},
  read:'CASO LIDO',readDone:'CASO LIDO ✓',reading:'lendo…',readOk:'caso lido ✓',waitFor:n=>`Esperando ${n}…`,begin:'COMEÇAR INVESTIGAÇÃO',guestWait:'Esperando o anfitrião…',
  playT:'A investigação começa…',playS:'Você chegou ao fim deste teste. O mapa jogável (12 salas, pistas, NPCs e o Quadro de Pistas) é a próxima etapa.',toRoom:'VOLTAR À SALA',toMenu:'MENU PRINCIPAL'}};
const lang=()=>window.MM_LANG();const t=()=>L2[lang()];
const PL=c=>c.place[lang()];const TT=c=>c.title[lang()];
function synopsis(c){return c.synopsis[lang()]}
// ---------- state ----------
const BOTS=[['Agatha_C',1],['Detective Popcorn',2],['Sherlocko',3],['Miss Marbles',4],['Poirot_Jr',5],['Nancy D.',6],['Watson&Co',7]];
let st={players:[],isHost:true,sel:1,tab:0,timers:[],me:null};
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let unlockAll=store.get('mm_unlockAll',false);
const solved=()=>store.get('mm_solved',[]);
const isUnlocked=c=>unlockAll||c.unlocked||solved().includes(c.n)||c.n<=5+solved().length;
function clearTimers(){st.timers.forEach(clearTimeout);st.timers=[]}
const later=(ms,f)=>st.timers.push(setTimeout(f,ms));
function show(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===id));window.MM_SCENE(id==='home');window.scrollTo(0,0)}
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function toast(msg){window.MM_TOAST(msg,'')}
const sfx=k=>window.MM_SFX&&window.MM_SFX(k);

// ---------- CASE ROOM ----------
function enterRoom(host,joinCode){clearTimers();if(window.MM_NET)MM_NET.leave();st.online=false;st.isHost=host;const me={id:window.MM_NET?MM_NET.id:'me',name:store.get('mm_name','Inspector Whiskers'),hat:store.get('mm_hat',0),ready:false,me:true,host};st.me=me;
 st.players=[me];
 const pick=store.get('mm_lastSel',1);st.sel=D.cases.find(c=>c.n===pick&&isUnlocked(c))?pick:1;
 if(window.MM_NET&&window.supabase){st.online=true;st.connecting=true;st.code=host?MM_NET.code():String(joinCode||'').toUpperCase();show('room');renderRoom();
  MM_NET.join(st.code,{name:me.name,hat:me.hat,ready:false,read:false,sel:st.sel}).then(()=>{st.connecting=false;toast(lang()==='pt'?'Conectado à sala '+st.code:'Connected to room '+st.code);renderRoom()})
   .catch(()=>{st.connecting=false;st.online=false;MM_NET.leave();toast(lang()==='pt'?'Sem conexão — modo offline com detetives de teste':'No connection — offline mode with test detectives');offlineBots(host)});return}
 offlineBots(host);show('room');renderRoom();}
function offlineBots(host){st.code='K7Q2';st.isHost=host;st.me.host=host;st.players=[st.me];if(!host){st.players.unshift({name:'Agatha_C',hat:1,ready:true,host:true,bot:true});}
 if(!host){BOTS.filter(b=>!st.players.some(p=>p.name===b[0])).slice(0,2).forEach((b,i)=>later(900+i*1300,()=>addBot(b)))}renderRoom()}
function syncPlayers(l){const mine=st.me;st.players=l.map((p,i)=>{const isMe=p.id===MM_NET.id;const o=isMe?mine:{};Object.assign(o,{id:p.id,name:p.name,hat:p.hat|0,host:i===0,me:isMe});if(!isMe){o.ready=!!p.ready;o.read=!!p.read}return o});
 if(!st.players.some(p=>p.me)){mine.host=false;st.players.push(mine)}st.isHost=MM_NET.isHost();if(!st.isHost&&l[0]&&l[0].sel)st.sel=l[0].sel}
if(window.MM_NET)MM_NET.listen({presence:l=>{if(!st.online)return;syncPlayers(l);const v=document.querySelector('.view.on');
  if(v&&v.id==='room'){if(document.activeElement&&document.activeElement.id==='nm')st.dirty=true;else renderRoom()}else if(v&&v.id==='dossier'&&st.rd)st.rd()},
 msg:m=>{if(!st.online)return;if(m.t==='start'){st.sel=m.d.n;startCase()}else if(m.t==='begin'){if(st.curCase&&!(window.MM_GAME.debug()))play(st.curCase,m.d)}}});
function addBot(b){if(st.players.length>=8)return;if(!b)b=BOTS.find(x=>!st.players.some(p=>p.name===x[0]));if(!b)return;const p={name:b[0],hat:b[1],ready:false,bot:true,choosing:true};st.players.push(p);sfx('hover');renderRoom();
 later(1200+Math.random()*1500,()=>{p.choosing=false;renderRoom()});later(2600+Math.random()*4000,()=>{p.ready=true;sfx('hover');renderRoom();guestAuto()})}
function guestAuto(){if(st.isHost)return;if(st.players.every(p=>p.ready)&&st.players.length>=2)later(1600,()=>{if(st.players.every(p=>p.ready))startCase()})}
function renderRoom(){const T=t(),me=st.me;
 $('#room').innerHTML=`
 <header class="rhead"><img src="logo.png" class="mini" alt="Midnight Mystery"><h1>${T.room}</h1><button class="ghost" id="rBack">${T.back}</button></header>
 <main class="rgrid">
  <section class="paper p1"><h2>${T.you}</h2>
   <div class="portrait"><img src="img/det${me.hat}.png" alt=""></div>
   <div class="hatsel"><button class="arrow" id="hPrev">‹</button><b>${T.hat}: ${T.hats[me.hat]}</b><button class="arrow" id="hNext">›</button></div>
   <div class="dots">${T.hats.map((_,i)=>`<i class="${i===me.hat?'on':''}"></i>`).join('')}</div>
   <label class="lbl">${T.name}</label><input id="nm" maxlength="20" value="${esc(me.name)}"><small class="hint">${T.nameHint}</small>
   <button class="big ${me.ready?'is-ready':''}" id="rdy">${me.ready?T.ready+'  ✓':T.ready+'?'}</button></section>
  <section class="paper p2"><h2>${T.inRoom}<span class="cnt">${st.players.length} / 8</span></h2>
   <div class="invite"><div><label class="lbl">${T.code}</label><div class="code">${st.connecting?'····':esc(st.code||'K7Q2')}</div></div><div class="ib"><button class="dark" id="cpy">${T.copy}</button><button class="dark" id="stm">${T.steam}</button></div><small>${T.invHint}</small></div>
   <div class="seats">${Array.from({length:8},(_,i)=>{const p=st.players[i];if(!p)return`<div class="seat empty">${i===st.players.length&&st.players.length<8&&!st.online?`<button class="add" id="addB">${T.addBot}</button>`:T.open}</div>`;
    return`<div class="seat ${p.me?'mine':''}"><img src="img/det${p.hat}.png" alt=""><span class="pn"><i class="pcdot" style="background:${['#ff8a1f','#a66bff','#2ecc71','#ffd31a','#1fb5ff','#f2f2f2','#ff6ad5','#3346ff'][i]}"></i>${esc(p.name)}${p.host?` <em>(${T.host})</em>`:''}</span>${p.choosing?`<span class="st">${T.choosing}</span>`:`<span class="tag ${p.ready?'ok':''}">${p.ready?T.ready:T.notReady}</span>`}${p.bot&&!p.host&&st.isHost?`<button class="x" data-k="${i}" title="remove">×</button>`:''}</div>`}).join('')}</div></section>
  <section class="paper p3"><h2>${T.choose}</h2>
   <div class="tabs">${T.tabs.map((x,i)=>`<button data-tab="${i}" class="${st.tab===i?'on':''}">${x}</button>`).join('')}<button class="rnd" id="rnd" ${st.isHost?'':'disabled'}>⚄ ${T.random}</button></div>
   <small class="hint l">${T.randHint}</small>
   <div class="clist" id="clist">${D.cases.filter(c=>st.tab===0||c.difficulty===['','easy','medium','hard'][st.tab]).map(c=>{const u=isUnlocked(c);return`<div class="case ${u?'':'locked'} ${c.n===st.sel?'sel':''}" data-n="${c.n}"><div class="cl">${T.caseW} #${String(c.n).padStart(2,'0')} · ${esc(PL(c))}</div><div class="ct">${esc(TT(c))}</div><span class="pips">${'◆'.repeat({easy:1,medium:2,hard:3}[c.difficulty])}<s>${'◆'.repeat(3-{easy:1,medium:2,hard:3}[c.difficulty])}</s></span>${u?(c.n===st.sel?'<span class="chk">✓</span>':''):'<span class="lock">🔒</span>'}</div>`}).join('')}</div>
   <div class="cfoot"><small>${T.unlockedN(D.cases.filter(isUnlocked).length,D.cases.length)}</small><label class="ua"><input type="checkbox" id="ua" ${unlockAll?'checked':''}> ${T.unlockAll}</label></div></section>
 </main>
 <footer class="rfoot"><button class="start" id="go">${T.start}</button><div class="rh" id="rh"></div></footer>`;
 const selC=D.cases.find(c=>c.n===st.sel);const notReady=st.players.filter(p=>!p.ready).length;
 let hint='',ok=false;if(!st.isHost)hint=T.hintGuest;else if(!me.ready)hint=T.hintNeedReady;else if(notReady)hint=T.hintWait(notReady);else if(!selC||!isUnlocked(selC))hint=T.hintPick;else{hint=T.hintOk;ok=true}
 $('#rh').textContent=hint;$('#go').disabled=!ok;if(!st.isHost)$('#go').classList.add('guest');
 const el=$('#clist .sel');if(el)el.scrollIntoView({block:'nearest'});
 $('#rBack').onclick=()=>{clearTimers();if(st.online){MM_NET.leave();st.online=false}show('home');sfx('click')};
 const up=p=>{if(st.online)MM_NET.update(p)};
 $('#hPrev').onclick=()=>{me.hat=(me.hat+3)%4;store.set('mm_hat',me.hat);up({hat:me.hat});sfx('hover');renderRoom()};$('#hNext').onclick=()=>{me.hat=(me.hat+1)%4;store.set('mm_hat',me.hat);up({hat:me.hat});sfx('hover');renderRoom()};
 $('#nm').onchange=e=>{me.name=(e.target.value.trim()||'Detective').slice(0,20);store.set('mm_name',me.name);up({name:me.name});renderRoom()};
 $('#nm').onblur=()=>{if(st.dirty){st.dirty=false;setTimeout(renderRoom,30)}};
 $('#rdy').onclick=()=>{me.ready=!me.ready;up({ready:me.ready});sfx('click');renderRoom();if(!st.online)guestAuto()};
 $('#cpy').onclick=()=>{const u=location.href.split('#')[0]+'#join='+(st.code||'K7Q2');(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).catch(()=>{}).finally(()=>toast(T.copied));sfx('click')};
 $('#stm').onclick=()=>{toast(T.steamSoon);sfx('click')};
 const ab=$('#addB');if(ab)ab.onclick=()=>{addBot();sfx('click')};
 document.querySelectorAll('.seat .x').forEach(b=>b.onclick=()=>{st.players.splice(+b.dataset.k,1);sfx('click');renderRoom()});
 document.querySelectorAll('.tabs [data-tab]').forEach(b=>b.onclick=()=>{st.tab=+b.dataset.tab;sfx('hover');renderRoom()});
 document.querySelectorAll('.case').forEach(cdiv=>cdiv.onclick=()=>{if(!st.isHost)return;const c=D.cases.find(x=>x.n===+cdiv.dataset.n);if(!isUnlocked(c)){sfx('hover');return}st.sel=c.n;store.set('mm_lastSel',c.n);up({sel:c.n});sfx('click');renderRoom()});
 $('#rnd').onclick=()=>{const last=store.get('mm_last5',[]);const pool=D.cases.filter(c=>isUnlocked(c)&&(st.tab===0||c.difficulty===['','easy','medium','hard'][st.tab]));let opts=pool.filter(c=>!last.includes(c.n));if(!opts.length)opts=pool;const c=opts[Math.floor(Math.random()*opts.length)];if(c){st.sel=c.n;store.set('mm_lastSel',c.n);up({sel:c.n})}sfx('click');renderRoom()};
 $('#ua').onchange=e=>{unlockAll=e.target.checked;store.set('mm_unlockAll',unlockAll);renderRoom()};
 $('#go').onclick=()=>{if($('#go').disabled)return;if(st.online)MM_NET.send('start',{n:st.sel});startCase()};}

// ---------- LOADING ----------
function startCase(){clearTimers();sfx('click');const c=D.cases.find(x=>x.n===st.sel);st.curCase=c;st.me.read=false;if(st.online)MM_NET.update({read:false,ready:false});const last=store.get('mm_last5',[]).filter(n=>n!==c.n);last.unshift(c.n);store.set('mm_last5',last.slice(0,5));
 const T=t(),loc=PL(c);show('loading');
 $('#loading').innerHTML=`<div class="lwrap"><div class="folder2"><div class="tab"></div><div class="stamp2">${T.caseW} #${String(c.n).padStart(2,'0')}</div><div class="loc">${esc(loc.toUpperCase())}</div></div>
  <h3>${T.searching(esc(loc))}</h3><div class="steps">${Array.from({length:22},(_,i)=>`<i class="${i%2?'r':'l'}"></i>`).join('')}<b id="pct">0%</b></div><div class="tip" id="tip">${T.tips[Math.floor(Math.random()*T.tips.length)]}</div></div>`;
 // preload concept art while loading
 const art=new Image();art.alt='';art.src=c.art;
 let p=0;const steps=document.querySelectorAll('.steps i');const iv=setInterval(()=>{p=Math.min(100,p+2+Math.random()*4);$('#pct').textContent=Math.floor(p)+'%';steps.forEach((s,i)=>s.classList.toggle('on',i<p/100*22));
  if(p>=100){clearInterval(iv);later(450,()=>dossier(c,art))}},90);st.timers.push(iv);
 later(1900,()=>{const el=$('#tip');if(el)el.textContent=T.tips[Math.floor(Math.random()*T.tips.length)]});}

// ---------- DOSSIER ----------
function dossier(c,art){const T=t(),l=lang(),loc=PL(c);show('dossier');
 if(!st.online)st.players.forEach(p=>p.read=false);else st.players.forEach(p=>{if(p.me)p.read=false});
 $('#dossier').innerHTML=`<h1 class="begins">${T.begins}</h1>
 <div class="book"><div class="pg left"><div class="artbox"><div class="cap">${T.exhibit} · ${esc(loc.toUpperCase())} · 23:58</div></div></div>
  <div class="pg right"><div class="sheet"><div class="stamp3">${T.secret}</div><div class="cline">${T.caseW} #${String(c.n).padStart(2,'0')} · ${esc(loc.toUpperCase())}</div><div class="chap">${window.MM_STORY?esc(MM_STORY.label(c)):''}</div><h2>${esc(TT(c))}</h2><p class="syn" id="syn"></p>${window.MM_STORY&&(c.n-1)%12===0?`<p class="chapi">${esc(MM_STORY.intro(c))}</p>`:''}<hr>
   <dl><dt>${T.obj}</dt><dd class="obj">${esc(c.objective[l])}</dd><dt>${T.time}</dt><dd>${T.timeV}</dd><dt>${T.wrong}</dt><dd>${T.wrongV}</dd><dt>${T.board}</dt><dd>${T.boardV}</dd><dt>${T.diff}: <span class="dv">${T.diffN[c.difficulty]}</span></dt></dl></div></div></div>
 <div class="readers" id="readers"></div><div class="dbtn"><button class="cream" id="iread">${T.read}</button><button class="start" id="begin" disabled></button></div>`;
 art.className='art';art.onerror=()=>{const ph=document.createElement('div');ph.className='art ph';ph.innerHTML=`<img src="logo.png" alt=""><span>${T.artSoon}</span>`;art.replaceWith(ph)};$('#dossier .artbox').prepend(art);if(art.complete&&!art.naturalWidth)art.onerror();
 // typewriter
 const txt=synopsis(c),el=$('#syn');let i=0;const iv=setInterval(()=>{i+=2;el.textContent=txt.slice(0,i);if(i%6===0)sfx('type');if(i>=txt.length)clearInterval(iv)},22);st.timers.push(iv);
 if(!st.online)st.players.filter(p=>p.bot).forEach(p=>later(2500+Math.random()*7000,()=>{p.read=true;sfx('hover');rd()}));
 const rd=()=>{const T=t();$('#readers').innerHTML=st.players.map(p=>`<div class="rchip"><img src="img/det${p.hat}.png" alt=""><div><span>${esc(p.name)}</span><b class="${p.read?'ok':''}">${p.read?T.readOk:T.reading}</b></div></div>`).join('');
  const me=st.me;$('#iread').textContent=me.read?T.readDone:T.read;$('#iread').classList.toggle('done',!!me.read);
  const waiting=st.players.filter(p=>!p.read);const b=$('#begin');
  if(!st.isHost){b.textContent=T.guestWait;b.disabled=true;if(!waiting.length&&!st.online)later(1500,()=>play(c))}
  else if(waiting.length){b.textContent=T.waitFor(waiting.length===1?waiting[0].name:waiting.length);b.disabled=true}else{b.textContent=T.begin;b.disabled=false}};
 st.rd=rd;rd();$('#iread').onclick=()=>{st.me.read=!st.me.read;if(st.online)MM_NET.update({read:st.me.read});sfx('click');rd()};$('#begin').onclick=()=>{if($('#begin').disabled)return;if(st.online){const d={t0:Date.now()+400,now:Date.now()};MM_NET.send('begin',d);play(c,d)}else play(c)};}

// ---------- HANDOFF ----------
function play(c,nd){clearTimers();st.rd=null;sfx('click');const players=st.players.map(p=>({...p}));
 window.MM_GAME.start(c,players,(where)=>{if(where==='menu'){if(st.online){MM_NET.leave();st.online=false}show('home')}else enterRoomKeep(players)},{online:!!st.online,host:st.online?MM_NET.isHost():true,t0:nd&&nd.t0,now:nd&&nd.now});}
function enterRoomKeep(players){clearTimers();if(st.online){st.me.ready=false;st.me.read=false;MM_NET.update({ready:false,read:false});syncPlayers(MM_NET.list());show('room');renderRoom();return}st.players=players.map(p=>({...p,ready:p.bot?true:false,read:false}));st.me=st.players.find(p=>p.me);show('room');renderRoom();}

// ---------- JOIN modal ----------
function joinModal(){const T=t(),m=$('#modal');m.innerHTML=`<div class="folder"><h2>${T.joinTitle}</h2><div class="row" style="flex-direction:column;align-items:flex-start;gap:12px">${T.joinHint}<input id="jc" maxlength="4" class="codein" value="" placeholder="ABCD" style="text-transform:uppercase"></div><button class="btn primary" id="jgo">${T.join}</button> <button class="btn" id="jx" style="margin-left:8px">${T.cancel}</button></div>`;
 m.classList.add('open');$('#jc').focus();$('#jx').onclick=()=>m.classList.remove('open');$('#jgo').onclick=()=>{if($('#jc').value.trim().length<4){$('#jc').classList.add('bad');return}m.classList.remove('open');enterRoom(false,$('#jc').value.trim().toUpperCase())};m.onclick=e=>{if(e.target===m)m.classList.remove('open')};}

window.MM_FLOW={newGame:()=>enterRoom(true),join:joinModal,rerender:()=>{const v=document.querySelector('.view.on');if(v&&v.id==='room')renderRoom()}};
if(/#join=/.test(location.hash)){const jc=(location.hash.match(/#join=([A-Za-z0-9]{4})/)||[])[1];setTimeout(()=>enterRoom(false,jc||'K7Q2'),400)}
})();
