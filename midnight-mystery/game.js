// Midnight Mystery — playable match (single-player playtest with simulated teammates)
(function(){
const $=s=>document.querySelector(s);
const lang=()=>window.MM_LANG();const L=(en,pt)=>lang()==='pt'?pt:en;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const sfx=k=>window.MM_SFX&&window.MM_SFX(k);
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const FEMALE_N=[1,2,3,5,6,7,9,11,12],MALE_N=[0,4,8,10,13,14,15];
const FEM=new Set("Agnes Alma Anita Beatrice Bianca Camille Clara Cordelia Daphne Delia Dolores Edith Elsa Esther Felicity Flora Frida Gemma Gloria Harriet Helena Ida Imogen Ines Isadora Joan Josephine Juno Klara Lavinia Lilian Lola Lucia Mabel Marguerite Matilda Mercedes Mina Nadia Nina Octavia Odile Pearl Petra Philippa Regina Rosalind Sabine Selma Sofia Tabitha Thea Ursula Vera Viola Wilhelmina Yara Zelda Amara Dalia Greta Hana Ilse Marta Olga Rita Ulla Wanda Valéria Lia".split(' '));

// ---------- room name translations ----------
const RPT={'study':'escritório','library':'biblioteca','dining room':'sala de jantar','kitchen':'cozinha','ballroom':'salão de baile','conservatory':'jardim de inverno','master bedroom':'quarto principal','guest room':'quarto de hóspedes','wine cellar':'adega',"servants' quarters":'ala dos empregados','billiard room':'sala de bilhar','chapel':'capela','emergency':'emergência','pharmacy':'farmácia','records room':'arquivo','radiology':'radiologia','operating room':'centro cirúrgico','ward A':'ala A','ward B':'ala B','cafeteria':'refeitório','laboratory':'laboratório',"doctors' lounge":'sala dos médicos','laundry':'lavanderia','morgue office':'necrotério','main vault':'cofre principal','lobby':'saguão',"manager's office":'sala do gerente','security room':'sala de segurança','safe deposit room':'sala dos cofres','counting room':'sala de contagem','archive':'arquivo','staff kitchen':'copa','boardroom':'sala do conselho','IT room':'sala de TI','loan office':'crédito','loading dock':'doca de carga','staff room':'sala dos professores',"principal's office":'diretoria','science lab':'laboratório de ciências','gym':'ginásio','art room':'sala de artes','music room':'sala de música','classroom 3B':'sala 3B',"janitor's closet":'depósito do zelador','computer lab':'laboratório de informática','auditorium':'auditório','reception':'recepção','honeymoon suite':'suíte de lua de mel','bar':'bar','luggage room':'maleiro','room 12':'quarto 12','rooftop':'terraço','spa':'spa','service elevator':'elevador de serviço','main stage':'palco principal','dressing rooms':'camarins','orchestra pit':'fosso da orquestra','fly gallery':'varanda técnica','box five':'camarote cinco','costume shop':'figurino','prop room':'depósito de cenário','foyer':'foyer',"director's office":'sala do diretor','rehearsal room':'sala de ensaio','lighting booth':'cabine de luz','cellar':'porão','main hall':'salão principal','Egyptian wing':'ala egípcia','dinosaur hall':'salão dos dinossauros','restoration studio':'ateliê de restauro','security office':'segurança','gift shop':'loja','east gallery':'galeria leste','treasury':'tesouro','café':'café','loading bay':'doca','big top ring':'picadeiro','animal wagons':'vagões dos animais','clown wagon':'vagão dos palhaços','ticket booth':'bilheteria',"owner's caravan":'trailer do dono','costume tent':'tenda de figurino','food stand':'barraca de comida','trapeze rigging':'trapézio','storage wagon':'vagão de depósito','mirror maze':'labirinto de espelhos','strongman tent':'tenda do homem-forte','music stand':'coreto',"captain's bridge":'ponte de comando',"purser's office":'escritório do comissário','engine room':'casa de máquinas','galley':'cozinha de bordo','deck A':'deck A','lifeboat deck':'deck dos botes','cabin corridor':'corredor das cabines','casino lounge':'salão de jogos','pool deck':'deck da piscina','crew quarters':'alojamento da tripulação','CEO office':'sala do CEO','server room':'sala dos servidores','open office':'escritório aberto','legal office':'jurídico','print room':'sala de impressão','HR office':'RH','security desk':'segurança','rooftop terrace':'terraço','Studio A':'Estúdio A','Studio B':'Estúdio B','control room':'sala de controle','green room':'camarim de convidados','makeup room':'maquiagem','wardrobe':'figurino','editing suite':'ilha de edição','newsroom':'redação','cable room':'sala de cabos',"producer's office":'sala da produção','main floor':'salão de jogos','high-roller room':'sala VIP de apostas','cashier':'caixa','vault':'cofre','chip workshop':'oficina de fichas','VIP lounge':'lounge VIP'};
let RNmode=null;const RN=n=>{const l=RNmode||lang();return l==='pt'?(RPT[n]||n):n};

function ptGender(n){const w=n.split(' ')[0].toLowerCase();if(['camarins','vagões'].includes(w))return'mp';if(w==='spa')return'm';if(/a$/.test(w)||['ponte','suíte','cabine','redação','recepção','maquiagem'].includes(w))return'f';return'm'}
function PREP(p,n){const g=ptGender(n);const map={na:{f:'na',m:'no',mp:'nos'},da:{f:'da',m:'do',mp:'dos'},pela:{f:'pela',m:'pelo',mp:'pelos'}};return map[p][g]+' '+n}
function mergeLang(a,b){if(Array.isArray(a)&&a.length>=2&&typeof a[0]==='string'&&typeof a[1]==='string'){const o=a.slice();o[1]=b[1];return o}if(Array.isArray(a))return a.map((x,i)=>mergeLang(x,b[i]));if(a&&typeof a==='object'){const o={};for(const k in a)o[k]=mergeLang(a[k],b[k]);return o}return a}

// ---------- palettes per location ----------
const PAL={manor:['#5a3f2c','#6b4a33','#3d2a20'],hospital:['#7f9a92','#93ada4','#5e7a73'],bank:['#6d6a62','#857f73','#4c4943'],school:['#7a6a4f','#8c7a5b','#5b4d38'],hotel:['#6a2f36','#7d3a42','#4e2228'],opera:['#5c2a2a','#6e3131','#3f1c1c'],museum:['#6e675a','#827a6a','#4f4a40'],circus:['#7a5a34','#8c6a3c','#5a4024'],cruise:['#3e5a5e','#4a6b70','#2c4245'],office:['#55606a','#66727c','#3e464e'],tvstudio:['#3c3f46','#4a4e56','#2a2c31'],casino:['#2f4a3a','#3a5a46','#1f3328']};
const FURN={manor:['cabinet','drawers','desk','shelf','sofa','table','plant','crate'],hospital:['cabinet','locker','bed','desk','drawers','table','plant'],bank:['safe','cabinet','desk','drawers','shelf','table','plant'],school:['locker','desk','shelf','cabinet','table','crate','plant'],hotel:['drawers','cabinet','bed','sofa','desk','table','plant'],opera:['cabinet','crate','drawers','sofa','table','shelf'],museum:['cabinet','crate','desk','drawers','shelf','table','plant'],circus:['crate','cabinet','drawers','table','crate','sofa'],cruise:['locker','cabinet','drawers','table','crate','desk'],office:['cabinet','desk','drawers','locker','table','plant','shelf'],tvstudio:['crate','cabinet','desk','locker','table','drawers'],casino:['safe','cabinet','drawers','table','sofa','desk','plant']};
const CNAME={cabinet:['cabinet','armário'],drawers:['chest of drawers','cômoda'],desk:['desk','escrivaninha'],shelf:['bookshelf','estante'],crate:['crate','caixote'],locker:['locker','armário de metal'],safe:['small safe','cofre pequeno'],bed:['bed','cama'],sofa:['sofa','sofá'],table:['table','mesa'],plant:['plant','vaso']};
const CONTAINER=new Set(['cabinet','drawers','desk','shelf','crate','locker','safe']);
const FSIZE={cabinet:[1,78],drawers:[1,48],desk:[2,40],shelf:[2,92],crate:[1,34],locker:[1,92],safe:[1,46],bed:[2,30],sofa:[2,34],table:[2,32],plant:[1,58]};

// ---------- constants ----------
const MIN_PINS=5,MAX_WRONG=3;const T=48,CW=13,CH=11,GW=4,GH=4,MW=CW*GW,MH=CH*GH,WH=58,INK='#1b1214';
let G=null; // game state
const FONT_T="900 16px 'MM Title',sans-serif",FONT_B="13px 'Special Elite',monospace";

// =====================================================================
// MYSTERY GENERATOR
// =====================================================================
const FOOT=[['heavy work boots','botas pesadas de trabalho'],['high heels','sapatos de salto alto'],['rubber-soled sneakers','tênis de sola de borracha'],['polished dress shoes','sapatos sociais engraxados']];
const TRACE=[['lavender perfume','perfume de lavanda'],['motor oil','óleo de motor'],['chalk dust','pó de giz'],['cinnamon','canela'],['pipe tobacco','tabaco de cachimbo'],['fresh paint','tinta fresca'],['cat hair','pelo de gato'],['peppermint','hortelã']];
const HERRING=[['A rubber duck','Um patinho de borracha','',''],['A blank envelope','Um envelope em branco','',''],['A tram ticket','Um bilhete de bonde','',''],['A cinema ticket from last week','Um ingresso de cinema da semana passada','Nothing on it but popcorn butter.','Nada além de manteiga de pipoca.'],['A grocery list','Uma lista de compras','Eggs, flour, more flour. Someone bakes a lot.','Ovos, farinha, mais farinha. Alguém faz muito bolo.'],['A broken umbrella','Um guarda-chuva quebrado','Wet, but everybody came in from the rain.','Molhado, mas todo mundo chegou da chuva.'],['A crossword, half solved','Palavras cruzadas pela metade','7 down: "culprit". Left blank. Funny.','7 vertical: "culpado". Em branco. Engraçado.'],['A lost earring','Um brinco perdido','Cheap gold paint. Not worth stealing.','Dourado barato. Não vale nada.'],['A torn postcard','Um cartão-postal rasgado','"Wish you were here." From the seaside.','"Queria que você estivesse aqui." Da praia.']];

function buildMystery(c,rooms){const r=rng(c.n*99991+7);const cast=c.cast.map((p,i)=>({...p,i,fem:FEM.has(p.name.split(' ')[0])}));
 const diff=c.difficulty;const cu=Math.floor(r()*6);const others=shuffle(r,[0,1,2,3,4,5].filter(i=>i!==cu));
 const a=others[0],b=others[1],cc=others[2],d=others[3],e=others[4];
 const fIdx=shuffle(r,[0,1,2,3]);const tIdx=shuffle(r,[0,1,2,3,4,5,6,7]);
 // footwear: G={cu,a,b} share f0; others get distinct-ish
 const foot={};[cu,a,b].forEach(i=>foot[i]=fIdx[0]);[cc,d,e].forEach((i,k)=>foot[i]=fIdx[1+k%3]);
 // trace: H={cu,a,cc} share t0; others distinct
 const trace={};[cu,a,cc].forEach(i=>trace[i]=tIdx[0]);[b,d,e].forEach((i,k)=>trace[i]=tIdx[1+k]);
 const roomPool=shuffle(r,rooms);const crime=roomPool[0];const Q=roomPool[1],S=roomPool[2],A_room=roomPool[3];
 let mt=(c.synopsis.en.match(/(\d{1,2}):(\d{2})/)||[0,'22','50']);let tot=(+mt[1])*60+(+mt[2]);if(tot<12*60)tot=23*60+40;tot-=12+Math.floor(r()*20);const TIME=`${Math.floor(tot/60)%24}:${String(tot%60).padStart(2,'0')}`;
 const alibi={};// claimed room at TIME
 cast.forEach((p,i)=>{alibi[i]=roomPool[4+i]||pick(r,rooms)});
 alibi[a]=A_room;alibi[e]=A_room; // a and e together
 alibi[cu]=Q; // lie (true room = crime)
 const N=i=>cast[i].name,RO=i=>L(cast[i].role.en,cast[i].role.pt);
 const extra={};cast.forEach((p,i)=>extra[i]=[]);
 // a's alibi confirmed by e
 extra[e].push([`At ${TIME} I was in the ${RN(A_room)} with ${N(a)}. We never left.`,`Às ${TIME} eu estava ${PREP('na',RN(A_room))} com ${N(a)}. Não saímos de lá.`]);
 extra[a].push([`${N(e)} can tell you — we were together the whole time.`,`${N(e)} pode confirmar — ficamos juntos o tempo todo.`]);
 const items=[];
 if(diff==='easy'){
  extra[d].push([`Around ${TIME} I saw the ${cast[cu].role.en} heading into the ${RN(crime)}. In a hurry.`,`Lá pelas ${TIME} vi ${cast[cu].fem?'a':'o'} ${cast[cu].role.pt} entrando ${PREP('na',RN(crime))}. Com pressa.`]);
 }else if(diff==='medium'){
  items.push({kind:'record',room:Q,title:[`Key log of the ${RN(Q)}`,`Registro de chaves: ${RN(Q)}`],text:[`The ${RN(Q)} was locked from 21:30 to 23:00 and its key never left the hook. Funny — someone swears they spent ${TIME} in there.`,`O local "${RN(Q)}" ficou trancado das 21h30 às 23h e a chave nunca saiu do gancho. Curioso — alguém jura que passou as ${TIME} lá dentro.`],sub:[[`Signed by the night staff. No erasures.`,`Assinado pela equipe da noite. Sem rasuras.`],[`A locked room makes a poor alibi.`,`Sala trancada é um péssimo álibi.`]]});
  extra[d].push([`I knocked on the ${RN(Q)} door around ${TIME}. Locked, dark, nobody inside.`,`Bati na porta ${PREP('da',RN(Q))} perto das ${TIME}. Trancada, escura, ninguém lá dentro.`]);
 }else{
  // accomplice b confirms cu's false alibi; contradicted by record + witness
  alibi[b]=Q;
  extra[b].push([`${N(cu)} was with me in the ${RN(Q)} at ${TIME}. I'm sure of it.`,`${N(cu)} estava comigo ${PREP('na',RN(Q))} às ${TIME}. Tenho certeza.`]);
  extra[cu].push([`Ask ${N(b)}. We were together.`,`Pergunte a ${N(b)}. Estávamos juntos.`]);
  items.push({kind:'record',room:S,title:[`${N(b)}'s pocket notebook`,`Caderninho de ${N(b)}`],text:[`Last entry, ${TIME}: "Still waiting in the ${RN(S)}. Nobody came. Again."`,`Última anotação, ${TIME}: "Ainda esperando ${PREP('na',RN(S))}. Ninguém apareceu. De novo."`],sub:[[`Alone in the ${RN(S)}... then who was keeping company in the ${RN(Q)}?`,`Sozinho(a) ${PREP('na',RN(S))}... então quem estava fazendo companhia ${PREP('na',RN(Q))}?`],[`The page smells of ${TRACE[trace[b]][0]}.`,`A página tem cheiro de ${TRACE[trace[b]][1]}.`]]});
  extra[d].push([`I only talk to detectives who have done their homework. Pin a few clues first.`,`Só falo com detetives que fizeram a lição de casa. Prenda algumas pistas primeiro.`,'gate']);
  extra[d].push([`At ${TIME} I passed the ${RN(S)}: ${N(b)} was there, alone, checking a watch.`,`Às ${TIME} passei ${PREP('pela',RN(S))}: ${N(b)} estava lá, sozinho(a), olhando o relógio.`]);
 }
 // physical clues
 items.push({kind:'floor',room:crime,title:[`Shoe prints in the ${RN(crime)}`,`Pegadas ${PREP('na',RN(crime))}`],text:[`Prints of ${FOOT[foot[cu]][0]}, still damp. They leave the ${RN(crime)} in a hurry — and turn away from the main door.`,`Pegadas de ${FOOT[foot[cu]][1]}, ainda úmidas. Saem ${PREP('da',RN(crime))} com pressa — e desviam da porta principal.`],sub:[[`Made around ${TIME}.`,`Feitas por volta das ${TIME}.`],[`More than one person here wears shoes like these. Look closely at everyone.`,`Mais de uma pessoa aqui usa sapatos assim. Observe todo mundo.`],[`Size 39. Half the building wears 39.`,`Número 39. Metade do prédio calça 39.`]]});
 const traceObj=pick(r,[['A silk handkerchief','Um lenço de seda'],['A single glove','Uma luva sozinha'],['A crumpled napkin','Um guardanapo amassado']]);
 const trRoom=pick(r,rooms.filter(x=>x!==crime));items.push({kind:'item',room:trRoom,title:[traceObj[0],traceObj[1]],text:[`Stuffed out of sight in the ${RN(trRoom)}. It reeks of ${TRACE[trace[cu]][0]} — someone wanted that smell off their hands, fast.`,`Escondido às pressas ${PREP('na',RN(trRoom))}. Tem cheiro forte de ${TRACE[trace[cu]][1]} — alguém quis tirar esse cheiro das mãos, rápido.`],sub:[[`The same scent clings to more than one person tonight.`,`O mesmo cheiro está em mais de uma pessoa esta noite.`],[`A faint smudge from the ${RN(crime)}.`,`Uma mancha leve vinda ${PREP('da',RN(crime))}.`],[`Why carry it this far from the ${RN(crime)}?`,`Por que levar isso tão longe ${PREP('da',RN(crime))}?`]]});
 items.push({kind:'scene',room:crime,title:['The crime scene','A cena do crime'],text:[`The ${RN(crime)}, ${TIME}. The door wasn't forced and nothing else was touched: whoever did this knew exactly where to go — and left a trail on the floor.`,`${RN(crime).charAt(0).toUpperCase()+RN(crime).slice(1)}, ${TIME}. A porta não foi forçada e nada mais foi mexido: quem fez isso sabia exatamente aonde ir — e deixou rastro no chão.`],sub:[[c.objective.en,c.objective.pt],[`Someone in this building is lying about where they were at ${TIME}.`,`Alguém neste prédio está mentindo sobre onde estava às ${TIME}.`]]});
 const nh=diff==='easy'?1:diff==='medium'?2:3;shuffle(r,HERRING).slice(0,nh).forEach(h=>items.push({kind:'herring',room:pick(r,rooms),title:[h[0],h[1]],text:[h[2],h[3]],sub:h[2]?[]:[]}));
 // testimonies
 const TR={nervous:['I— I already told the others, I didn\'t see anything strange.','Eu— eu já disse pros outros, não vi nada estranho.'],charming:['Detective! What a pleasure. Ask me anything.','Detetive! Que prazer. Pergunte o que quiser.'],grumpy:['Make it quick, I have work to do.','Seja rápido, tenho trabalho a fazer.'],gossipy:['Oh, I know everything that happens here, darling.','Ah, eu sei de tudo que acontece aqui, querido.'],ambitious:['I hope this doesn\'t slow down my plans.','Espero que isso não atrapalhe meus planos.'],forgetful:['Hmm, what was the question again?','Hum, qual era a pergunta mesmo?'],secretive:['I prefer to keep to myself.','Prefiro ficar na minha.'],loyal:['I\'d never betray this place.','Eu nunca trairia este lugar.'],jealous:['Some people here get everything handed to them.','Tem gente aqui que ganha tudo de mão beijada.'],theatrical:['What a night! What a TERRIBLE night!','Que noite! Que noite TERRÍVEL!'],meticulous:['I keep track of every minute. Always.','Eu anoto cada minuto. Sempre.'],sleepy:['*yawn* Is it morning yet?','*bocejo* Já amanheceu?'],suspicious:['Why are you asking ME?','Por que está perguntando pra MIM?'],cheerful:['Hello hello! Terrible business, isn\'t it?','Olá, olá! Que coisa horrível, né?'],proud:['I am above all this, you understand.','Eu estou acima disso tudo, entende?'],clumsy:['Oops — sorry, I keep bumping into things tonight.','Ops — desculpa, hoje estou esbarrando em tudo.']};
 const testimony=cast.map((p,i)=>{const lines=[];const tr=TR[p.trait.en]||TR.cheerful;lines.push(tr);
  lines.push([`At ${TIME}? I was in the ${RN(alibi[i])}.`,`Às ${TIME}? Eu estava ${PREP('na',RN(alibi[i]))}.`]);
  extra[i].forEach(x=>lines.push(x));
  const obs=[`Observed: wears ${FOOT[foot[i]][0]}; smells of ${TRACE[trace[i]][0]}.`,`Observado: usa ${FOOT[foot[i]][1]}; cheiro de ${TRACE[trace[i]][1]}.`];
  return{lines,obs,gate:extra[i].some(x=>x[2]==='gate')}});
 const why=[`${N(cu)} (${cast[cu].role.en}) wore ${FOOT[foot[cu]][0]} and smelled of ${TRACE[trace[cu]][0]} — only ${N(cu)} and ${N(a)} matched both, and ${N(a)} was with ${N(e)} in the ${RN(A_room)}. ${N(cu)} claimed to be in the ${RN(Q)}${diff==='medium'?', which was locked all evening':diff==='hard'?`, backed by ${N(b)} — who was actually alone in the ${RN(S)}`:''}.`,
  `${N(cu)} (${cast[cu].role.pt}) usava ${FOOT[foot[cu]][1]} e tinha cheiro de ${TRACE[trace[cu]][1]} — só ${N(cu)} e ${N(a)} batiam nas duas pistas, e ${N(a)} estava com ${N(e)} ${PREP('na',RN(A_room))}. ${N(cu)} disse que estava ${PREP('na',RN(Q))}${diff==='medium'?', que ficou trancada a noite toda':diff==='hard'?`, com o apoio de ${N(b)} — que na verdade estava sozinho(a) ${PREP('na',RN(S))}`:''}.`];
 return{cast,cu,crime,TIME,items,testimony,why};}

// =====================================================================
// MAP GENERATOR
// =====================================================================
function buildMap(c){const r=rng(c.n*7717+1);const tiles=new Uint8Array(MW*MH);const roomId=new Int8Array(MW*MH).fill(-1);
 const cells=[];for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){const hall=(gx===1||gx===2)&&(gy===1||gy===2);cells.push({gx,gy,hall})}
 const outer=cells.filter(x=>!x.hall);const names=c.map.rooms;outer.forEach((cl,i)=>cl.name=names[i]);
 const rooms=[];outer.forEach((cl,i)=>{cl.id=i;rooms.push({id:i,name:cl.name,x0:cl.gx*CW+1,y0:cl.gy*CH+1,x1:cl.gx*CW+CW-2,y1:cl.gy*CH+CH-2})});
 const hall={id:12,name:'hall',x0:CW+1,y0:CH+1,x1:3*CW-2,y1:3*CH-2};rooms.push(hall);
 const set=(x,y,v,id)=>{tiles[y*MW+x]=v;if(id!==undefined)roomId[y*MW+x]=id};
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)tiles[y*MW+x]=2;
 rooms.forEach(rm=>{for(let y=rm.y0;y<=rm.y1;y++)for(let x=rm.x0;x<=rm.x1;x++)set(x,y,1,rm.id)});
 const cellOf=(gx,gy)=>cells.find(q=>q.gx===gx&&q.gy===gy);const idOf=(gx,gy)=>{const q=cellOf(gx,gy);return q.hall?12:q.id};
 // doors between adjacent cells
 const edges=[];for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){if(gx<GW-1)edges.push([gx,gy,gx+1,gy]);if(gy<GH-1)edges.push([gx,gy,gx,gy+1])}
 const valid=edges.filter(([a,b,c2,d])=>!(cellOf(a,b).hall&&cellOf(c2,d).hall));
 // union-find to guarantee connectivity, then extras
 const par=[...Array(13).keys()];const f=x=>par[x]===x?x:(par[x]=f(par[x]));const doors=[];
 const sh=shuffle(r,valid);
 // ensure hall has at least 4 doors
 const hallEdges=sh.filter(([a,b,c2,d])=>cellOf(a,b).hall||cellOf(c2,d).hall).slice(0,4);
 const use=new Set();hallEdges.forEach(e=>{use.add(e);par[f(idOf(e[0],e[1]))]=f(idOf(e[2],e[3]))});
 sh.forEach(e=>{const A=idOf(e[0],e[1]),B=idOf(e[2],e[3]);if(f(A)!==f(B)){use.add(e);par[f(A)]=f(B)}});
 sh.forEach(e=>{if(!use.has(e)&&r()<0.25)use.add(e)});
 use.forEach(([a,b,c2,d])=>{if(c2>a){const wx=a*CW+CW-1;const yy=b*CH+2+Math.floor(r()*(CH-5));for(let k=0;k<2;k++){set(wx,yy+k,1,-1);set(wx+1,yy+k,1,-1);}doors.push({x:wx+1,y:yy+1})}
  else{const wy=b*CH+CH-1;const xx=a*CW+2+Math.floor(r()*(CW-5));for(let k=0;k<2;k++){set(xx+k,wy,1,-1);set(xx+k,wy+1,1,-1);}doors.push({x:xx+1,y:wy+1})}});
 // furniture along walls
 const furn=[];const blocked=new Uint8Array(MW*MH);
 const doorNear=(x,y)=>doors.some(d=>Math.abs(d.x-x)<=2&&Math.abs(d.y-y)<=2);
 const loc=c.loc;rooms.forEach(rm=>{if(rm.id===12)return;const types=FURN[loc];const n=3+Math.floor(r()*2);let tries=0,placed=0;
  while(placed<n&&tries<60){tries++;const ty=pick(r,types);const [w]=FSIZE[ty];const side=Math.floor(r()*3);let x,y;
   if(side===0){y=rm.y0;x=rm.x0+Math.floor(r()*(rm.x1-rm.x0-w+1))}else if(side===1){x=rm.x0;y=rm.y0+1+Math.floor(r()*(rm.y1-rm.y0-1))}else{x=rm.x1-w+1;y=rm.y0+1+Math.floor(r()*(rm.y1-rm.y0-1))}
   let ok=true;for(let k=0;k<w;k++){const i=y*MW+x+k;if(tiles[i]!==1||blocked[i]||doorNear(x+k,y))ok=false;
    // keep a free ring around
    for(const[dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){const j=(y+dy)*MW+x+k+dx;if(blocked[j])ok=false}}
   if(!ok)continue;for(let k=0;k<w;k++)blocked[y*MW+x+k]=1;
   furn.push({type:ty,x,y,w,h:FSIZE[ty][1],room:rm.id,open:0,openT:0,searched:false,clue:null,col:pick(r,['#6b4a33','#5a3d2a','#4a5a52','#6a5a3a','#3e4a5a','#7a3a32'])});placed++}
  // lamp
  let lt=0;while(lt<30){lt++;const x=rm.x0+1+Math.floor(r()*(rm.x1-rm.x0-1)),y=rm.y0+1+Math.floor(r()*(rm.y1-rm.y0-1));if(!blocked[y*MW+x]){rm.lamp={x:(x+.5)*T,y:(y+.5)*T};break}}});
 hall.lamp={x:(2*CW)*T,y:(2*CH)*T};
 // board in hall center
 const bx=2*CW-2,by=2*CH-3;for(let k=0;k<4;k++)blocked[by*MW+bx+k]=1;
 const board={x:bx*T,y:by*T,w:4*T};
 rooms.forEach(rm=>{rm.cx=((rm.x0+rm.x1+1)/2)*T;rm.cy=((rm.y0+rm.y1+1)/2)*T});
 return{tiles,roomId,rooms,doors,furn,blocked,board,r};}

// =====================================================================
// ASSETS
// =====================================================================
const IMG={};function img(src){if(!IMG[src]){IMG[src]=new Image();IMG[src].src=src}return IMG[src]}
function noisePattern(ctx,base,seed,dots=900,alpha=.18){const c=document.createElement('canvas');c.width=c.height=192;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,192,192);const r=rng(seed);
 for(let i=0;i<dots;i++){g.fillStyle=r()<.5?`rgba(0,0,0,${alpha*r()})`:`rgba(255,240,210,${alpha*.6*r()})`;g.fillRect(r()*192,r()*192,1+r()*2.5,1+r()*2)}return ctx.createPattern(c,'repeat')}

function renderFloor(map,c){const cv=document.createElement('canvas');cv.width=MW*T;cv.height=MH*T;const g=cv.getContext('2d');const pal=PAL[c.loc];
 g.fillStyle='#0b0809';g.fillRect(0,0,cv.width,cv.height);
 map.rooms.forEach((rm,i)=>{const base=rm.id===12?'#3a2c22':pal[i%2];g.fillStyle=noisePattern(g,base,i*31+c.n,1400,.22);g.fillRect(rm.x0*T,rm.y0*T,(rm.x1-rm.x0+1)*T,(rm.y1-rm.y0+1)*T);
  // planks / tiles
  g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=2;const tileStyle=(c.n+i)%3;
  for(let y=rm.y0;y<=rm.y1+1;y++){g.beginPath();g.moveTo(rm.x0*T,y*T);g.lineTo((rm.x1+1)*T,y*T);g.stroke()}
  if(tileStyle!==0)for(let x=rm.x0;x<=rm.x1+1;x++){g.beginPath();g.moveTo(x*T,rm.y0*T);g.lineTo(x*T,(rm.y1+1)*T);g.stroke()}
  // rug
  if(rm.id!==12&&(i+c.n)%2===0){const rx=rm.cx-T*2.5,ry=rm.cy-T*1.6;g.fillStyle=['#5a1a22','#1f3a34','#3a2a4a','#6a4a1a'][(i+c.n)%4];g.globalAlpha=.75;g.beginPath();g.roundRect(rx,ry,T*5,T*3.2,10);g.fill();g.strokeStyle='rgba(253,235,188,.25)';g.lineWidth=3;g.beginPath();g.roundRect(rx+8,ry+8,T*5-16,T*3.2-16,6);g.stroke();g.globalAlpha=1}
  // room name painted on floor
  if(rm.id!==12){g.save();g.font="900 30px 'MM Title',sans-serif";g.textAlign='center';g.fillStyle='rgba(253,235,188,.13)';g.fillText(RN(rm.name).toUpperCase(),rm.cx,rm.y1*T+T*.7);g.restore()}});
 // doorways floor
 g.fillStyle='rgba(0,0,0,.15)';
 // hall decorations: big rug + compass
 const hl=map.rooms[12];g.fillStyle='#34161a';g.beginPath();g.roundRect(hl.x0*T+T*2,hl.y0*T+T*3,(hl.x1-hl.x0-3)*T,(hl.y1-hl.y0-4)*T,24);g.fill();g.strokeStyle='rgba(253,235,188,.35)';g.lineWidth=4;g.beginPath();g.roundRect(hl.x0*T+T*2+14,hl.y0*T+T*3+14,(hl.x1-hl.x0-3)*T-28,(hl.y1-hl.y0-4)*T-28,14);g.stroke();
 g.save();g.translate(hl.cx,hl.cy+T*1.5);g.strokeStyle='rgba(253,235,188,.25)';g.lineWidth=3;g.beginPath();g.arc(0,0,T*2,0,7);g.stroke();for(let k=0;k<8;k++){g.rotate(Math.PI/4);g.beginPath();g.moveTo(0,0);g.lineTo(0,-T*2.4);g.stroke()}g.restore();
 // AO shadow under walls
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(map.tiles[y*MW+x]===1&&y>0&&map.tiles[(y-1)*MW+x]===2){const gr=g.createLinearGradient(0,y*T,0,y*T+22);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x*T,y*T,T,22)}}
 return cv;}

function furnSprite(f){const key=f.type+f.col+f.w+(f.open?'o':'c');if(furnSprite.cache[key])return furnSprite.cache[key];
 const w=f.w*T,d=T*0.82,H=f.h;const cv=document.createElement('canvas');cv.width=w+12;cv.height=H+d+12;const g=cv.getContext('2d');g.translate(6,6);
 const col=f.col,dark=shade(col,.62),light=shade(col,1.25);g.lineJoin='round';g.lineWidth=3;g.strokeStyle=INK;
 const box=(x,y,ww,hh,fill,r=6)=>{g.fillStyle=fill;g.beginPath();g.roundRect(x,y,ww,hh,r);g.fill();g.stroke()};
 const t=f.type;
 if(t==='plant'){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(w/2,H+d-8,18,7,0,0,7);g.fill();box(w/2-14,H+d-34,28,28,'#7a4a2a',5);g.fillStyle='#2f5a3a';for(let k=0;k<7;k++){g.beginPath();g.ellipse(w/2+Math.cos(k)*12,H+d-48-Math.sin(k*2)*10-k*2,12,20,k,0,7);g.fill();g.stroke()}}
 else if(t==='bed'){box(0,d*.2,w,H+d*.8,'#e8e0cf',10);box(4,d*.2,w*.28,H+d*.5,'#fbf5e6',8);box(w*.32,d*.2+6,w*.68-4,H+d*.8-10,f.col,8)}
 else if(t==='sofa'){box(0,0,w,H*0.9,dark,12);box(0,H*.5,w,H*.5+d*.5,col,10);box(-2,H*.25,14,H*.75+d*.5,dark,6);box(w-12,H*.25,14,H*.75+d*.5,dark,6)}
 else if(t==='table'){box(0,0,w,d,light,6);g.fillStyle=dark;g.fillRect(8,d,8,H);g.fillRect(w-16,d,8,H);g.strokeRect(8,d,8,H);g.strokeRect(w-16,d,8,H);box(w*.3,d*.25,w*.2,d*.4,'#e8e0cf',3)}
 else{// cabinets & containers: top face + front face
  box(0,0,w,d,light,6);box(0,d-6,w,H,col,6);
  g.fillStyle='rgba(0,0,0,.15)';g.fillRect(4,d,w-8,6);
  const fy=d,fh=H-10;
  if(t==='cabinet'||t==='locker'||t==='safe'){const nd=w>T?2:1;for(let k=0;k<nd;k++){const dx=6+k*(w-12)/nd,dw=(w-12)/nd-4;
    if(f.open){g.fillStyle='#0d0a09';g.fillRect(dx,fy+4,dw,fh-6);g.strokeRect(dx,fy+4,dw,fh-6);g.fillStyle=light;g.beginPath();g.moveTo(dx,fy+4);g.lineTo(dx-10,fy+10);g.lineTo(dx-10,fy+fh);g.lineTo(dx,fy+fh-2);g.closePath();g.fill();g.stroke();}
    else{box(dx,fy+4,dw,fh-6,shade(col,1.08),4);if(t==='locker'){g.strokeStyle='rgba(0,0,0,.4)';for(let v=0;v<3;v++){g.beginPath();g.moveTo(dx+6,fy+12+v*6);g.lineTo(dx+dw-6,fy+12+v*6);g.stroke()}g.strokeStyle=INK}
     g.fillStyle=t==='safe'?'#c9a24a':'#d6b06a';g.beginPath();g.arc(t==='safe'?dx+dw/2:dx+dw-8,fy+fh/2,t==='safe'?7:3.5,0,7);g.fill();g.stroke()}}}
  else if(t==='drawers'||t==='desk'){const rows=t==='desk'?2:3;const dw=t==='desk'?w*.38:w-12,dx=t==='desk'?w-dw-6:6;
   for(let k=0;k<rows;k++){const dy=fy+4+k*(fh-6)/rows;const dh=(fh-6)/rows-3;if(f.open&&k===0){box(dx-2,dy+6,dw+4,dh,'#0d0a09',3);box(dx-4,dy+dh-2,dw+8,10,light,3)}else{box(dx,dy,dw,dh,shade(col,1.08),3);g.fillStyle='#d6b06a';g.fillRect(dx+dw/2-6,dy+dh/2-2,12,4)}}
   if(t==='desk'){g.fillStyle='#0d0a09';g.fillRect(8,fy+6,w*.5,fh-8);box(w*.15,-14,22,16,'#e8e0cf',3);g.fillStyle='#d6b06a';g.beginPath();g.arc(w*.55,-6,8,0,7);g.fill();g.stroke()}}
  else if(t==='shelf'){for(let k=0;k<3;k++){const sy=fy+6+k*(fh-8)/3;g.fillStyle='#0d0a09';g.fillRect(6,sy,w-12,(fh-8)/3-4);for(let b=0;b<9;b++){g.fillStyle=['#7a2a2a','#2a4a3a','#c9a24a','#3a3a5a','#8a5a2a'][(b+k)%5];const bw=(w-16)/9;g.fillRect(8+b*bw,sy+4+(b%3)*2,bw-2,(fh-8)/3-10-(b%3)*2)}}if(f.open){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(6+(w-12)*.3,fy+6,(w-12)*.25,fh/3)}}
  else if(t==='crate'){g.strokeStyle='rgba(0,0,0,.45)';for(let k=1;k<4;k++){g.beginPath();g.moveTo(4,fy+k*fh/4);g.lineTo(w-4,fy+k*fh/4);g.stroke()}g.strokeStyle=INK;if(f.open){box(-6,-10,w+12,12,light,3);g.fillStyle='#0d0a09';g.fillRect(6,4,w-12,d-10)}}}
 furnSprite.cache[key]=cv;return cv;}
furnSprite.cache={};
function shade(hex,f){const n=parseInt(hex.slice(1),16);const c=[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*f))));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')}

// =====================================================================
// GAME SETUP
// =====================================================================
function start(c,players,onExit,opts){stop();opts=opts||{};const map=buildMap(c);const rn=map.rooms.filter(x=>x.id!==12).map(x=>x.name);RNmode='en';const mE=buildMystery(c,rn);RNmode='pt';const mP=buildMystery(c,rn);RNmode=null;const mys=mergeLang(mE,mP);const r=rng(c.n*31+5);
 // place clues in containers / floor
 const byRoom=n=>map.rooms.find(x=>x.name===n);
 const floorItems=[];
 mys.items.forEach((it,k)=>{const rm=byRoom(it.room);it.id='c'+k;
  if(it.kind==='floor'||it.kind==='scene'){let x,y,tries=0;do{x=rm.x0+1+Math.floor(r()*(rm.x1-rm.x0-1));y=rm.y0+1+Math.floor(r()*(rm.y1-rm.y0-1));tries++}while((map.blocked[y*MW+x]||floorItems.some(f=>Math.abs(f.tx-x)<2&&Math.abs(f.ty-y)<2))&&tries<50);
   floorItems.push({i:floorItems.length,clue:it,x:(x+.5)*T,y:(y+.5)*T,tx:x,ty:y,fixed:true,kind:it.kind});}
  else{const cs=map.furn.filter(f=>f.room===rm.id&&CONTAINER.has(f.type)&&!f.clue);const f=cs.length?pick(r,cs):pick(r,map.furn.filter(f=>CONTAINER.has(f.type)&&!f.clue));f.clue=it}});
 // flavor for empty containers
 const EMPTY=[['Only dust.','Só poeira.'],['Old socks. Not a clue.','Meias velhas. Não é pista.'],['Nothing but receipts.','Só notas fiscais.'],['A dead spider. Ew.','Uma aranha morta. Eca.'],['Empty.','Vazio.'],['Some coins and a button.','Umas moedas e um botão.']];
 map.furn.forEach((f,i)=>{f.i=i;if(CONTAINER.has(f.type))f.flavor=pick(r,EMPTY)});
 const hall=map.rooms[12];
 const spawn=(i)=>({x:hall.cx-T*3+i*T*.9,y:hall.cy+T*2.6});
 const ents=[];
 players.forEach((p,i)=>{const s=spawn(i);ents.push({kind:'det',me:!!p.me,id:p.id,remote:!!(opts.online&&!p.me),tx:s.x,ty:s.y,name:p.name,img:img(`img/det${p.hat}.png`),x:s.x,y:s.y,vx:0,vy:0,face:-Math.PI/2,dirX:1,walk:0,path:null,wait:1+Math.random()*2,hand:null})});
 // NPC sprites by gender
 let fi=0,mi=0;const fr=shuffle(r,FEMALE_N),mr=shuffle(r,MALE_N);
 mys.cast.forEach((p,i)=>{const sp=p.fem?fr[fi++%fr.length]:mr[mi++%mr.length];const rm=pick(r,map.rooms.filter(x=>x.id!==12));
  ents.push({kind:'npc',ci:i,name:p.name,role:p.role,img:img(`img/npc/n${sp}.png`),sprite:sp,x:rm.cx+(r()-.5)*T*2,y:rm.cy+(r()-.5)*T*2,vx:0,vy:0,face:0,dirX:1,walk:0,path:null,wait:r()*3,talk:0,bubble:null,talked:false})});
 const me=ents.find(e=>e.me);
 G={online:!!opts.online,host:opts.online?!!opts.host:true,t0e:opts.t0||null,clockOff:opts.now?opts.now-Date.now():0,lastNpc:performance.now(),netT:0,syncT:0,dropK:0,lastSent:'',wrong:[],tense:-1,c,map,mys,ents,me,floorItems,dropped:[],board:[],t0:performance.now(),timeLeft:10*60,penalty:0,keys:{},paused:false,boardOpen:false,ended:false,toasts:[],float:[],onExit,cam:{x:me.x,y:me.y},flash:0,lastT:performance.now(),prompt:null,accuseSel:null,detail:null};
 G.floor=renderFloor(map,c);G.wallCol={manor:['#3b2a3a','#4a3648','#1f1416'],hospital:['#4f6b64','#5d7a72','#2a3a36'],bank:['#4a4a44','#585850','#26261f'],school:['#5a4a34','#6a5840','#2e251a'],hotel:['#5a2430','#6a2d3a','#2a1015'],opera:['#4a1a1e','#5a2226','#240c0e'],museum:['#4f4a40','#5e584c','#28241e'],circus:['#5a2a20','#e8d8b0','#2a1410'],cruise:['#2c4245','#365055','#162224'],office:['#3e464e','#4a535c','#1f2328'],tvstudio:['#2a2c31','#34373d','#141518'],casino:['#1f3328','#2a4535','#0f1a14']}[c.loc];
 buildDOM();show(true);if(G.online)netAttach();window.MM_MUSIC&&MM_MUSIC('game');window.MM_MUSIC&&MM_MUSIC(null,0);requestAnimationFrame(loop);}

function stop(){if(G){if(G.unlisten)G.unlisten();G.ended=true;G=null;window.MM_MUSIC&&MM_MUSIC('menu')}window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku)}

// =====================================================================
// DOM / HUD
// =====================================================================
function buildDOM(){const root=$('#gameview');root.innerHTML=`<canvas id="gcv"></canvas>
 <div class="ghud"><div class="watch"><div class="wt" id="wt">10:00</div><div class="minus" id="minus">−0:30</div><div class="wl">${L('until midnight','até a meia-noite')}</div></div>
 <div class="casechip"><b>${L('CASE','CASO')} #${String(G.c.n).padStart(2,'0')}</b> · ${esc(G.c.place[lang()])}</div>
 <canvas id="mini" width="208" height="176"></canvas>
 <div class="hand" id="hand"></div><div class="pick" id="pick"></div><div class="prompt" id="prompt"></div><div class="gtoast" id="gtoast"></div>
 <div class="keys">${L('WASD move · E interact · R drop · hold SPACE run · ESC menu','WASD andar · E interagir · R soltar · segure ESPAÇO correr · ESC menu')}</div></div>
 <div class="overlay" id="ovl"></div><div class="redflash" id="redflash"></div>`;
 window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);resize();}
function show(on){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===(on?'gameview':'home')));window.MM_SCENE(!on)}
function resize(){const cv=$('#gcv');if(!cv)return;const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d;G&&(G.dpr=d);if(G){G.dark=document.createElement('canvas');G.dark.width=Math.ceil(innerWidth/2);G.dark.height=Math.ceil(innerHeight/2)}}
window.addEventListener('resize',()=>G&&resize());

function kd(e){if(!G||G.ended)return;const k=e.key.toLowerCase();
 if(k==='escape'){e.preventDefault();if(G.boardOpen)closeBoard();else togglePause();return}
 if(G.paused||G.boardOpen)return;
 if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)){G.keys[k]=true;e.preventDefault()}
 if(k==='e'&&!e.repeat)interact();if(k==='r'&&!e.repeat)drop();}
function ku(e){if(!G)return;G.keys[e.key.toLowerCase()]=false}

function toast(msg){const el=$('#gtoast');if(!el)return;el.textContent=msg;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)}
function floatText(x,y,t,col='#FDEBBC'){G.float.push({x,y,t,col,life:1.6})}
function pickMsg(t){const el=$('#pick');if(!el)return;el.textContent=t;el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}

// =====================================================================
// INTERACTION
// =====================================================================
function nearest(){const me=G.me;let best=null,bd=1e9;const cand=[];
 G.map.furn.forEach(f=>{if(!CONTAINER.has(f.type))return;const fx=(f.x+f.w/2)*T,fy=(f.y+1)*T;cand.push({type:'furn',o:f,x:fx,y:fy,r:62})});
 G.floorItems.forEach(f=>{if(!f.taken)cand.push({type:'floor',o:f,x:f.x,y:f.y,r:52})});
 G.dropped.forEach(f=>cand.push({type:'drop',o:f,x:f.x,y:f.y,r:46}));
 G.ents.forEach(e=>{if(e.kind==='npc')cand.push({type:'npc',o:e,x:e.x,y:e.y,r:64})});
 const b=G.map.board;cand.push({type:'board',x:b.x+b.w/2,y:b.y+T,r:110});
 cand.forEach(c=>{const d=Math.hypot(c.x-me.x,c.y-me.y);if(d<c.r&&d<bd){bd=d;best=c}});return best}
function promptText(t){if(!t)return'';const me=G.me;
 if(t.type==='furn'){const n=CNAME[t.o.type][lang()==='pt'?1:0];return t.o.open?`E · ${L('close','fechar')} ${n}`:`E · ${L('examine','examinar')} ${n}`}
 if(t.type==='floor')return`E · ${L('examine','examinar')}`;if(t.type==='drop')return`E · ${L('pick up','pegar')}`;
 if(t.type==='npc')return`E · ${L('talk to','falar com')} ${t.o.name}`;
 if(t.type==='board')return me.hand?`E · ${L('pin clue on the board','prender pista no quadro')}`:`E · ${L('open the Clue Board','abrir o Quadro de Pistas')}`}
function interact(){const t=nearest();if(!t)return;const me=G.me;
 if(t.type==='furn'){const f=t.o;f.open=f.open?0:1;sfx('click');
  let took=false;if(f.open){if(f.clue){if(me.hand){toast(L('Something is here — but your hands are full. Press R to drop.','Tem algo aqui — mas suas mãos estão ocupadas. Aperte R para soltar.'))}else{me.hand=f.clue;pickMsg('+ '+f.clue.title[lang()==='pt'?1:0]);f.clue=null;f.taken=true;f.searched=true;took=true;sfx('type')}}
   else floatText(t.x,t.y-90,f.taken?L('Empty — someone already took what was here.','Vazio — alguém já levou o que tinha aqui.'):f.flavor[lang()==='pt'?1:0],'rgba(253,235,188,.8)')}net('furn',{i:f.i,o:f.open,k:took});return}
 if(t.type==='floor'){const fi=t.o;if(me.hand){toast(L('Hands full. Press R to drop what you carry.','Mãos ocupadas. Aperte R para soltar o que carrega.'));return}
  me.hand={...fi.clue,title:['Photo: '+fi.clue.title[0],'Foto: '+fi.clue.title[1]]};sfx('type');pickMsg(L('+ photo taken','+ foto registrada'));return}
 if(t.type==='drop'){if(me.hand){toast(L('Hands full.','Mãos ocupadas.'));return}me.hand=t.o.clue;G.dropped=G.dropped.filter(x=>x!==t.o);net('undrop',{k:t.o.k});sfx('click');return}
 if(t.type==='npc'){talk(t.o);return}
 if(t.type==='board'){if(me.hand){pin(me.hand);me.hand=null}else openBoard()}}
function drop(){const me=G.me;if(!me.hand)return;const o={k:(window.MM_NET?MM_NET.id:'l')+'-'+(G.dropK++),clue:me.hand,x:me.x+Math.cos(me.face)*20,y:me.y+Math.sin(me.face)*14+10};G.dropped.push(o);net('drop',o);me.hand=null;sfx('click')}
function talk(npc){const me=G.me;const t=G.mys.testimony[npc.ci];npc.talk=6;npc.path=null;npc.face=Math.atan2(me.y-npc.y,me.x-npc.x);npc.dirX=me.x<npc.x?-1:1;net('talk',{ci:npc.ci,x:me.x});
 const li=lang()==='pt'?1:0;let lines=t.lines;
 if(t.gate&&G.board.length<3){lines=[t.lines[0],t.lines.find(x=>x[2]==='gate')];npc.bubble=lines.map(x=>x[li]).join(' ');sfx('hover');return}
 lines=lines.filter(x=>x[2]!=='gate');npc.bubble=lines.map(x=>x[li]).join(' ');sfx('hover');
 const card={id:'t'+npc.ci,kind:'testimony',title:[`Testimony: ${npc.name}`,`Depoimento: ${npc.name}`],text:[lines.slice(1).map(x=>x[0]).join(' '),lines.slice(1).map(x=>x[1]).join(' ')],sub:[[t.obs[0],t.obs[1]],[`Role: ${npc.role.en}.`,`Função: ${npc.role.pt}.`]],ci:npc.ci};
 if(G.board.some(b=>b.id===card.id)||(me.hand&&me.hand.id===card.id))return;
 if(me.hand){setTimeout(()=>toast(L('Your hands are full — drop your item (R) to take notes.','Mãos ocupadas — solte o item (R) para anotar o depoimento.')),400)}else{me.hand=card;pickMsg(L('+ testimony noted','+ depoimento anotado'))}}
function pin(card){if(G.board.some(b=>b.id===card.id)){toast(L('Already on the board.','Já está no quadro.'));return}G.board.push(card);net('pin',{card,by:G.me.name});sfx('type');pickMsg(L('Clue pinned on the board!','Pista presa no quadro!'))}

// =====================================================================
// BOARD UI
// =====================================================================
function openBoard(){G.boardOpen=true;G.keys={};renderBoard()}
function closeBoard(){G.boardOpen=false;G.accuseSel=null;$('#ovl').classList.remove('on');$('#ovl').innerHTML=''}
function renderBoard(){const li=lang()==='pt'?1:0;const o=$('#ovl');o.classList.add('on');const sel=G.detail;
 o.innerHTML=`<div class="cork"><div class="corkhead"><h2>${L('Clue Board','Quadro de Pistas')}</h2><span>${G.board.length} ${L('clues pinned','pistas presas')}</span><button class="x" id="bclose">ESC ✕</button></div>
 <div class="corkbody"><div class="cards">${G.board.length?G.board.map((b,i)=>`<div class="ccard ${b.kind} ${sel===i?'sel':''}" data-i="${i}" style="transform:rotate(${((i*37)%7-3)*.6}deg)"><i class="pinh"></i><b>${esc(b.title[li])}</b><small>${b.kind==='testimony'?L('testimony','depoimento'):L('evidence','evidência')}</small></div>`).join(''):`<p class="emptyb">${L('No clues yet. Explore the rooms, open drawers and cabinets, talk to people — then bring what you find here.','Nenhuma pista ainda. Explore as salas, abra gavetas e armários, converse com as pessoas — e traga o que encontrar para cá.')}</p>`}</div>
 <div class="detail">${sel!=null&&G.board[sel]?`<h3>${esc(G.board[sel].title[li])}</h3><p>${G.board[sel].text[li]?esc(G.board[sel].text[li]):'<i style="opacity:.5">'+L('Nothing written on it.','Nada escrito.')+'</i>'}</p><ul>${G.board[sel].sub.map(s=>`<li>${esc(s[li])}</li>`).join('')}</ul>`:`<p class="hint2">${L('Click a clue to read it.','Clique numa pista para ler.')}</p>`}</div></div>
 <div class="accuse ${G.board.length<MIN_PINS?'locked':''}"><h3>${L('Accuse','Acusar')}</h3><div class="suspects">${G.mys.cast.map((p,i)=>{const e=G.ents.find(x=>x.kind==='npc'&&x.ci===i);const w=G.wrong.includes(i);return`<button class="sus ${G.accuseSel===i?'on':''} ${w?'cleared':''}" data-s="${i}" ${w||G.board.length<MIN_PINS?'disabled':''}><img src="img/npc/n${e.sprite}.png" alt=""><b>${esc(p.name)}</b><small>${w?L('innocent','inocente'):esc(p.role[lang()])}</small></button>`}).join('')}</div>
 <button class="start" id="acc" ${G.accuseSel==null||G.board.length<MIN_PINS?'disabled':''}>${G.board.length<MIN_PINS?L(`Pin ${MIN_PINS-G.board.length} more clue(s) to accuse`,`Prenda mais ${MIN_PINS-G.board.length} pista(s) para acusar`):G.accuseSel==null?L('Choose a suspect','Escolha um suspeito'):L('ACCUSE ','ACUSAR ')+esc(G.mys.cast[G.accuseSel].name.split(' ')[0].toUpperCase())}</button>
 <small class="warn">${L(`You need at least ${MIN_PINS} clues on the board to accuse. Each wrong accusation costs 30 seconds — after ${MAX_WRONG} wrong accusations the culprit escapes. Accusations left: ${MAX_WRONG-G.wrong.length}.`,`É preciso ter pelo menos ${MIN_PINS} pistas no quadro para acusar. Cada acusação errada custa 30 segundos — depois de ${MAX_WRONG} erros o culpado escapa. Acusações restantes: ${MAX_WRONG-G.wrong.length}.`)}</small><div class="bminus" id="bminus">−0:30</div></div></div>`;
 o.querySelectorAll('.ccard').forEach(el=>el.onclick=()=>{G.detail=+el.dataset.i;sfx('hover');renderBoard()});
 o.querySelectorAll('.sus').forEach(el=>el.onclick=()=>{G.accuseSel=+el.dataset.s;sfx('hover');renderBoard()});
 $('#bclose').onclick=closeBoard;$('#acc').onclick=()=>{if(G.accuseSel==null)return;accuse(G.accuseSel)};}
function accuse(i,by){if(!by&&G.board.length<MIN_PINS)return;if(G.wrong.includes(i)||G.ended)return;
 if(!by)net('acc',{i,by:G.me.name});
 if(i===G.mys.cu){G.winner=by||null;end(true);return}
 G.wrong.push(i);G.penalty+=30;sfx('click');const f=$('#redflash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');
 const m=$('#minus');m.classList.remove('on');void m.offsetWidth;m.classList.add('on');const bm=$('#bminus');if(bm){bm.classList.remove('on');void bm.offsetWidth;bm.classList.add('on')}
 if(G.accuseSel===i||!by)G.accuseSel=null;
 if(G.wrong.length>=MAX_WRONG){setTimeout(()=>end(false,'accuse'),900);if(G.boardOpen)renderBoard();return}
 if(G.boardOpen)renderBoard();const bm2=$('#bminus');if(bm2){void bm2.offsetWidth;bm2.classList.add('on')}
 if(by&&!G.boardOpen){const o=$('#ovl');if(!G.paused){o.classList.remove('on');o.innerHTML=''}}
 toast((by?by+': ':'')+L(`Wrong! ${G.mys.cast[i].name} is innocent. −30 seconds. ${MAX_WRONG-G.wrong.length} accusation(s) left before the culprit escapes.`,`Errado! ${G.mys.cast[i].name} é inocente. −30 segundos. Restam ${MAX_WRONG-G.wrong.length} acusação(ões) antes de o culpado escapar.`))}
// =====================================================================
// PAUSE / END
// =====================================================================
function togglePause(){G.paused=!G.paused;G.keys={};const o=$('#ovl');if(!G.paused){o.classList.remove('on');o.innerHTML='';return}const l=lang();
 o.classList.add('on');o.innerHTML=`<div class="pausewrap"><div class="pcase"><div class="pc-top">${L('CASE','CASO')} #${String(G.c.n).padStart(2,'0')}</div><div class="pc-loc">${esc(G.c.place[l])}</div><h3>${esc(G.c.title[l])}</h3><p class="pc-syn" id="pcs">${esc(G.c.synopsis[l])}</p><button class="ghost2" id="readall">${L('Read all','Ler tudo')}</button><div class="pc-obj">${esc(G.c.objective[l])}</div></div>
 <div class="pmenu"><h2>${L('Paused','Pausa')}</h2><small>${L('the clock keeps running','o relógio continua correndo')}</small><button class="pm" id="pres">${L('Resume','Continuar')}</button><button class="pm" id="pmus">${L('Music','Música')}: ${window.MM_MUSIC_ON&&MM_MUSIC_ON()?L('ON','LIGADA'):L('OFF','DESLIGADA')}</button><button class="pm" id="pctl">${L('Controls','Controles')}</button><button class="pm" id="pquit">${L('Leave case','Sair do caso')}</button><div class="pctl" id="ctl" hidden>WASD — ${L('move','andar')}<br>${L('hold','segure')} SPACE — ${L('run','correr')}<br>E — ${L('examine / talk / pin','examinar / conversar / prender')}<br>R — ${L('drop item','soltar item')}<br>ESC — ${L('menu','menu')}</div></div></div>`;
 $('#readall').onclick=()=>{$('#pcs').classList.toggle('full')};$('#pmus').onclick=()=>{const on=MM_MUSIC_TOGGLE();$('#pmus').textContent=L('Music','Música')+': '+(on?L('ON','LIGADA'):L('OFF','DESLIGADA'))};$('#pres').onclick=togglePause;$('#pctl').onclick=()=>{$('#ctl').hidden=!$('#ctl').hidden};$('#pquit').onclick=()=>{const cb=G.onExit;stop();cb&&cb('room')}}
function end(win,why){if(G.ended)return;G.ended=true;const li=lang()==='pt'?1:0;const cu=G.mys.cast[G.mys.cu];const left=Math.max(0,G.timeLeft);
 if(win){try{const s=JSON.parse(localStorage.getItem('mm_solved')||'[]');if(!s.includes(G.c.n))s.push(G.c.n);localStorage.setItem('mm_solved',JSON.stringify(s))}catch(e){}}
 const o=$('#ovl');o.classList.add('on');const mmss=`${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')}`;
 G.paused=false;G.boardOpen=false;o.innerHTML=`<div class="endwrap ${win?'win':'lose'}"><div class="stampbig">${win?L('CASE CLOSED','CASO ENCERRADO'):why==='accuse'?L('CULPRIT ESCAPED','CULPADO ESCAPOU'):L('TIME\'S UP','TEMPO ESGOTADO')}</div><h1>${win?(G.winner?esc(G.winner)+L(' caught the culprit!',' pegou o culpado!'):L('You caught the culprit!','Vocês pegaram o culpado!')):why==='accuse'?L('Too many wrong accusations — the culprit slipped away.','Acusações erradas demais — o culpado escapou.'):L('The culprit got away…','O culpado escapou…')}</h1>
 <div class="culprit"><img src="img/npc/n${G.ents.find(e=>e.kind==='npc'&&e.ci===G.mys.cu).sprite}.png" alt=""><div><b>${esc(cu.name)}</b><small>${esc(cu.role[lang()])}</small><p>${esc(G.mys.why[li])}</p></div></div>
 <div class="stats">${win?`${L('Time left','Tempo restante')}: <b>${mmss}</b> · `:''}${L('Clues pinned','Pistas presas')}: <b>${G.board.length}</b> · ${L('Wrong accusations','Acusações erradas')}: <b>${G.wrong.length}</b></div>
 <div class="pb"><button class="cream" id="eroom">${L('BACK TO CASE ROOM','VOLTAR À SALA')}</button><button class="ghost" id="emenu">${L('MAIN MENU','MENU PRINCIPAL')}</button></div></div>`;
 const cb=G.onExit;$('#eroom').onclick=()=>{stop();cb&&cb('room')};$('#emenu').onclick=()=>{stop();cb&&cb('menu')};sfx(win?'type':'click')}

// =====================================================================
// MOVEMENT / AI
// =====================================================================
function solid(px,py){const tx=Math.floor(px/T),ty=Math.floor(py/T);if(tx<0||ty<0||tx>=MW||ty>=MH)return true;const i=ty*MW+tx;return G.map.tiles[i]!==1||G.map.blocked[i]===1}
function moveEnt(e,dx,dy){const R=13;if(dx){const nx=e.x+dx;if(!solid(nx+Math.sign(dx)*R,e.y-6)&&!solid(nx+Math.sign(dx)*R,e.y+6))e.x=nx}if(dy){const ny=e.y+dy;if(!solid(e.x-8,ny+Math.sign(dy)*R)&&!solid(e.x+8,ny+Math.sign(dy)*R))e.y=ny}}
function bfs(sx,sy,tx,ty){const W=MW,H=MH,start=sy*W+sx,goal=ty*W+tx;const prev=new Int32Array(W*H).fill(-1);const q=[start];prev[start]=start;
 while(q.length){const cur=q.shift();if(cur===goal)break;const x=cur%W,y=(cur/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const ni=ny*W+nx;if(prev[ni]!==-1||G.map.tiles[ni]!==1||G.map.blocked[ni])continue;prev[ni]=cur;q.push(ni)}}
 if(prev[goal]===-1)return null;const path=[];let c=goal;while(c!==start){path.push({x:(c%W+.5)*T,y:((c/W|0)+.5)*T});c=prev[c]}return path.reverse()}
function aiStep(e,dt){if(e.talk>0){e.talk-=dt;if(e.talk<=0)e.bubble=null;e.walk=0;return}
 if(!e.path||!e.path.length){e.wait-=dt;e.walk=0;if(e.wait<=0){const rms=G.map.rooms;const rm=e.kind==='det'&&Math.random()<.3?rms[12]:rms[Math.floor(Math.random()*rms.length)];
   let tx=Math.floor((rm.x0+1+Math.random()*(rm.x1-rm.x0-1))),ty=Math.floor((rm.y0+1+Math.random()*(rm.y1-rm.y0-1)));if(G.map.blocked[ty*MW+tx])return;
   e.path=bfs(Math.floor(e.x/T),Math.floor(e.y/T),tx,ty);e.wait=2+Math.random()*5}return}
 const p=e.path[0];const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);const sp=(e.kind==='det'?120:70)*dt;
 if(d<4){e.path.shift();return}e.x+=dx/d*Math.min(sp,d);e.y+=dy/d*Math.min(sp,d);e.face=Math.atan2(dy,dx);if(Math.abs(dx)>1)e.dirX=dx<0?-1:1;e.walk+=dt*8}

// =====================================================================
// LOOP / RENDER
// =====================================================================
function loop(now){if(!G||G.ended&&!$('#ovl .endwrap'))return;const dt=Math.min(.05,(now-G.lastT)/1000);G.lastT=now;
 if(!G.ended){G.timeLeft=10*60-(G.t0e?(Date.now()+G.clockOff-G.t0e)/1000:(now-G.t0)/1000)-G.penalty;const tn=G.timeLeft<60?.85:G.timeLeft<180?.45:0;if(tn!==G.tense){G.tense=tn;window.MM_MUSIC&&MM_MUSIC(null,tn)}if(G.timeLeft<=0){G.timeLeft=0;end(false)}}
 const me=G.me;
 if(!G.paused&&!G.boardOpen&&!G.ended){let ix=0,iy=0;const k=G.keys;if(k.a||k.arrowleft)ix--;if(k.d||k.arrowright)ix++;if(k.w||k.arrowup)iy--;if(k.s||k.arrowdown)iy++;
  if(ix||iy){const l=Math.hypot(ix,iy);const sp=(k[' ']?250:155)*dt;moveEnt(me,ix/l*sp,iy/l*sp);const tf=Math.atan2(iy,ix);let df=tf-me.face;while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;me.face+=df*Math.min(1,dt*12);if(ix)me.dirX=ix;me.walk+=dt*(k[' ']?13:9)}else me.walk=0}
 const npcAuto=!G.online||G.host||performance.now()-G.lastNpc>3000;
 G.ents.forEach(e=>{if(e.me)return;if(e.remote){const k=Math.min(1,dt*10);const mv=Math.hypot(e.tx-e.x,e.ty-e.y);if(mv>400){e.x=e.tx;e.y=e.ty}else{e.x+=(e.tx-e.x)*k;e.y+=(e.ty-e.y)*k}if(mv>2)e.walk+=dt*9;else e.walk=0;return}
  if(e.kind==='npc'&&!npcAuto){if(e.talk>0){e.talk-=dt;if(e.talk<=0)e.bubble=null}const k=Math.min(1,dt*6);if(e.tx!=null){const mv=Math.hypot(e.tx-e.x,e.ty-e.y);if(mv>300){e.x=e.tx;e.y=e.ty}else{e.x+=(e.tx-e.x)*k;e.y+=(e.ty-e.y)*k}e.walk=mv>1.5?e.walk+dt*8:0}return}
  aiStep(e,dt)});
 if(G.online)netTick(dt);
 G.float.forEach(f=>{f.life-=dt;f.y-=dt*18});G.float=G.float.filter(f=>f.life>0);
 G.cam.x+=(me.x-G.cam.x)*Math.min(1,dt*6);G.cam.y+=(me.y-G.cam.y)*Math.min(1,dt*6);
 draw(now/1000);hud();requestAnimationFrame(loop)}

function draw(t){const cv=$('#gcv');if(!cv)return;const g=cv.getContext('2d');const d=G.dpr||1;const W=innerWidth,H=innerHeight;const Z=1.15;
 g.setTransform(d,0,0,d,0,0);g.fillStyle='#050404';g.fillRect(0,0,W,H);
 g.save();g.translate(W/2,H/2);g.scale(Z,Z);g.translate(-Math.round(G.cam.x),-Math.round(G.cam.y));
 const vx0=G.cam.x-W/2/Z-T,vy0=G.cam.y-H/2/Z-T*2,vx1=G.cam.x+W/2/Z+T,vy1=G.cam.y+H/2/Z+T*2;
 g.drawImage(G.floor,0,0);
 // floor clues (subtle, not highlighted)
 G.floorItems.forEach(f=>{if(f.taken&&f.kind!=='floor')return;g.save();g.translate(f.x,f.y);if(f.kind==='floor'){g.fillStyle='rgba(30,18,10,.55)';for(let k=0;k<5;k++){g.save();g.translate(k*16-32,(k%2)*10-5);g.rotate(.3);g.beginPath();g.ellipse(0,0,5,9,0,0,7);g.fill();g.restore()}}else{g.fillStyle='rgba(223,6,31,.35)';g.beginPath();g.ellipse(0,0,22,10,0,0,7);g.fill();g.strokeStyle='rgba(253,235,188,.35)';g.setLineDash([4,4]);g.beginPath();g.ellipse(0,0,26,13,0,0,7);g.stroke();g.setLineDash([])}g.restore()});
 G.dropped.forEach(f=>{g.save();g.translate(f.x,f.y);g.rotate(.2);g.fillStyle='#ece4cf';g.strokeStyle=INK;g.lineWidth=2;g.fillRect(-10,-7,20,14);g.strokeRect(-10,-7,20,14);g.restore()});
 // drawables sorted by y
 const list=[];
 for(let y=Math.max(0,Math.floor(vy0/T));y<Math.min(MH,Math.ceil(vy1/T));y++)list.push({k:(y+1)*T-0.5,row:y});
 G.map.furn.forEach(f=>{const fx=f.x*T,fy=f.y*T;if(fx>vx1||fx+f.w*T<vx0||fy>vy1+T||fy<vy0-T)return;list.push({k:fy+T*.82,f})});
 const b=G.map.board;list.push({k:b.y+T*.8,board:true});
 G.ents.forEach(e=>list.push({k:e.y,e}));
 list.sort((a,b)=>a.k-b.k);
 const me=G.me;
 list.forEach(it=>{if(it.row!==undefined)drawWallRow(g,it.row,vx0,vx1);else if(it.f)drawFurn(g,it.f);else if(it.board)drawBoard(g,t);else drawEnt(g,it.e,t)});
 g.restore();
 lighting(g,W,H,Z,t);
 g.setTransform(d*Z,0,0,d*Z,d*(W/2-Math.round(G.cam.x)*Z),d*(H/2-Math.round(G.cam.y)*Z));
 const bub=G.ents.filter(e=>e.bubble);G.ents.forEach(e=>{if(bub.some(b=>Math.abs(b.x-e.x)<190&&Math.abs(b.y-e.y)<120))return;drawTag(g,e)});
 G.ents.forEach(e=>{if(e.bubble)drawBubble(g,e.x,e.y-100,e.bubble)});
 G.float.forEach(f=>{if(bub.some(b=>Math.abs(b.x-f.x)<200&&Math.abs(b.y-f.y)<160))return;g.save();g.globalAlpha=Math.min(1,f.life);g.font="900 18px 'MM Title',sans-serif";g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.8)';g.strokeText(f.t,f.x,f.y);g.fillStyle=f.col;g.fillText(f.t,f.x,f.y);g.restore()});}

function drawWallRow(g,y,vx0,vx1){const tl=G.map.tiles;const me=G.me;
 for(let x=Math.max(0,Math.floor(vx0/T));x<Math.min(MW,Math.ceil(vx1/T));x++){if(tl[y*MW+x]!==2)continue;
  // skip deep interior walls (all neighbours walls) for perf but still draw top
  const px=x*T,py=y*T;const below=y<MH-1?tl[(y+1)*MW+x]:2;
  let a=1;const dyp=py-me.y;if(dyp>-T&&dyp<T*3.2&&Math.abs(px+T/2-me.x)<T*2.2)a=.32;
  g.globalAlpha=a;
  const wc=G.wallCol;if(below===1){g.fillStyle=wc[0];g.fillRect(px,py+T-WH,T+.5,WH);g.fillStyle=wc[1];for(let k=0;k<3;k++)g.fillRect(px+6+k*16,py+T-WH+6,3,WH-20);
   g.fillStyle=wc[2];g.fillRect(px,py+T-14,T+.5,14);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(px,py+T-15,T+.5,2)}
  g.fillStyle='#231916';g.fillRect(px,py-WH,T+.5,T+.5);
  const up=y>0?tl[(y-1)*MW+x]:2,lf=x>0?tl[y*MW+x-1]:2,rt=x<MW-1?tl[y*MW+x+1]:2;g.fillStyle='#3d2c25';
  if(below===1)g.fillRect(px,py+T-WH-5,T+.5,5);if(up===1)g.fillRect(px,py-WH,T+.5,4);if(lf===1)g.fillRect(px,py-WH,4,T);if(rt===1)g.fillRect(px+T-4,py-WH,4,T);
  g.globalAlpha=1}}
function drawFurn(g,f){const sp=furnSprite(f);const fx=f.x*T,fy=f.y*T;const me=G.me;let a=1;if(me.y<fy+T*.8&&me.y>fy-f.h-10&&me.x>fx-10&&me.x<fx+f.w*T+10)a=.35;
 g.globalAlpha=a;g.drawImage(sp,fx-6,fy-f.h+T*.1-6);g.globalAlpha=1}
function drawBoard(g,t){const b=G.map.board;g.save();g.translate(b.x,b.y);const w=b.w,h=110;
 g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(w/2,T*.9,w*.55,16,0,0,7);g.fill();
 g.fillStyle='#3a2516';g.fillRect(16,T*.2,10,T*.7);g.fillRect(w-26,T*.2,10,T*.7);
 g.fillStyle='#2a1a10';g.beginPath();g.roundRect(-4,-h+T*.2-4,w+8,h+8,8);g.fill();g.fillStyle='#8a6038';g.beginPath();g.roundRect(4,-h+T*.2+4,w-8,h-8,6);g.fill();
 g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.roundRect(-4,-h+T*.2-4,w+8,h+8,8);g.stroke();
 const n=G.board.length;for(let i=0;i<Math.min(n,14);i++){const cx=16+(i%7)*((w-32)/7),cy=-h+T*.2+14+Math.floor(i/7)*42;g.fillStyle=G.board[i].kind==='testimony'?'#FDEBBC':'#ece4cf';g.fillRect(cx,cy,22,28);g.fillStyle='#DF061F';g.beginPath();g.arc(cx+11,cy+3,3,0,7);g.fill()}
 if(n>1){g.strokeStyle='rgba(223,6,31,.85)';g.lineWidth=1.6;g.beginPath();for(let i=0;i<Math.min(n,14);i++){const cx=16+(i%7)*((w-32)/7)+11,cy=-h+T*.2+17+Math.floor(i/7)*42;i?g.lineTo(cx,cy):g.moveTo(cx,cy)}g.stroke()}
 g.fillStyle='#DF061F';g.font="900 30px 'MM Title',sans-serif";g.textAlign='center';if(!n)g.fillText('?',w/2,-h/2+T*.2+10);
 g.restore()}
function drawEnt(g,e,t){const im=e.img;if(!im.complete||!im.naturalWidth)return;const h=e.kind==='det'?74:72;const w=im.naturalWidth/im.naturalHeight*h;
 const bob=e.walk?Math.abs(Math.sin(e.walk))*3:0;const sq=e.walk?1+Math.sin(e.walk*2)*.03:1;
 g.save();g.translate(e.x,e.y);g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(0,2,w*.32,7,0,0,7);g.fill();
 g.scale(e.dirX<0?-1:1,1);g.drawImage(im,-w/2,-h-bob,w,h*sq);
 // flashlight in hand for detectives
 if(e.kind==='det'){g.restore();g.save();g.translate(e.x,e.y-26);g.rotate(e.face);g.fillStyle='#1d1a1c';g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.roundRect(8,-4,18,8,2);g.fill();g.stroke();g.fillStyle='#ffe7a8';g.fillRect(25,-4,3,8)}
 g.restore();
 if(e.me&&e.hand){g.save();g.translate(e.x+14,e.y-h-34);g.rotate(-.1);g.fillStyle=e.hand.kind==='testimony'?'#FDEBBC':'#ece4cf';g.strokeStyle=INK;g.lineWidth=2;g.fillRect(-9,-12,18,22);g.strokeRect(-9,-12,18,22);g.fillStyle='#DF061F';g.beginPath();g.arc(0,-10,3,0,7);g.fill();g.restore()}}
function drawTag(g,e){const dx=e.x-G.me.x,dy=e.y-G.me.y;const d=Math.hypot(dx,dy);if(!e.me&&d>520)return;const h=74;const isNpc=e.kind==='npc';g.save();g.globalAlpha=e.me?1:Math.max(.25,1-d/600);g.font="12px 'Special Elite',monospace";const label=e.name;const tw=g.measureText(label).width+14;g.fillStyle=e.me?'rgba(223,6,31,.92)':'rgba(20,14,16,.8)';g.beginPath();g.roundRect(e.x-tw/2,e.y-h-26,tw,18,9);g.fill();g.fillStyle=isNpc?'#FDEBBC':'#fff';g.textAlign='center';g.fillText(label,e.x,e.y-h-13);g.restore()}
function drawBubble(g,x,y,text){g.save();g.font="13px 'Special Elite',monospace";const maxW=300;const words=text.split(' ');const lines=[];let cur='';words.forEach(w=>{const tt=cur?cur+' '+w:w;if(g.measureText(tt).width>maxW){lines.push(cur);cur=w}else cur=tt});lines.push(cur);
 const bw=Math.min(maxW,Math.max(...lines.map(l=>g.measureText(l).width)))+24,bh=lines.length*17+18;const bx=x-bw/2,by=y-bh;
 g.fillStyle='#FDEBBC';g.strokeStyle=INK;g.lineWidth=2.5;g.beginPath();g.roundRect(bx,by,bw,bh,10);g.fill();g.stroke();g.beginPath();g.moveTo(x-8,y-1);g.lineTo(x,y+12);g.lineTo(x+8,y-1);g.fill();g.beginPath();g.moveTo(x-8,y);g.lineTo(x,y+12);g.lineTo(x+8,y);g.stroke();
 g.fillStyle=INK;g.textAlign='left';lines.forEach((l,i)=>g.fillText(l,bx+12,by+22+i*17));g.restore()}

function lighting(g,W,H,Z,t){const dk=G.dark;const dc=dk.getContext('2d');const s=dk.width/W;
 dc.setTransform(1,0,0,1,0,0);dc.globalCompositeOperation='source-over';dc.clearRect(0,0,dk.width,dk.height);dc.fillStyle='rgba(3,4,7,.8)';dc.fillRect(0,0,dk.width,dk.height);
 dc.setTransform(s*Z,0,0,s*Z,s*(W/2-G.cam.x*Z),s*(H/2-G.cam.y*Z));dc.globalCompositeOperation='destination-out';
 const lamps=G.map.rooms.filter(r=>r.lamp);lamps.forEach((r,i)=>{const fl=.85+.15*Math.sin(t*3+i*1.7)*Math.sin(t*11+i);const R=r.id===12?460:300;const gr=dc.createRadialGradient(r.lamp.x,r.lamp.y,10,r.lamp.x,r.lamp.y,R);gr.addColorStop(0,`rgba(0,0,0,${.72*fl})`);gr.addColorStop(.6,`rgba(0,0,0,${.35*fl})`);gr.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=gr;dc.fillRect(r.lamp.x-R,r.lamp.y-R,R*2,R*2)});
 G.ents.forEach(e=>{if(e.kind!=='det')return;const ox=e.x,oy=e.y-26;const R=e.me?300:220;const gr=dc.createRadialGradient(ox,oy,0,ox,oy,R);gr.addColorStop(0,'rgba(0,0,0,.98)');gr.addColorStop(.7,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=gr;dc.beginPath();dc.moveTo(ox,oy);dc.arc(ox,oy,R,e.face-.5,e.face+.5);dc.closePath();dc.fill();
  const g2=dc.createRadialGradient(ox,oy,0,ox,oy,70);g2.addColorStop(0,'rgba(0,0,0,.7)');g2.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=g2;dc.fillRect(ox-70,oy-70,140,140)});
 g.setTransform(1,0,0,1,0,0);g.drawImage(dk,0,0,g.canvas.width,g.canvas.height);
 // warm glow
 const d=G.dpr||1;g.setTransform(d*Z,0,0,d*Z,d*(W/2-G.cam.x*Z),d*(H/2-G.cam.y*Z));g.globalCompositeOperation='screen';
 lamps.forEach((r,i)=>{const gr=g.createRadialGradient(r.lamp.x,r.lamp.y,0,r.lamp.x,r.lamp.y,160);gr.addColorStop(0,'rgba(255,200,120,.22)');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(r.lamp.x-160,r.lamp.y-160,320,320)});
 const me=G.me;const ox=me.x,oy=me.y-26;const gr=g.createRadialGradient(ox,oy,0,ox,oy,280);gr.addColorStop(0,'rgba(255,235,190,.16)');gr.addColorStop(1,'rgba(255,235,190,0)');g.fillStyle=gr;g.beginPath();g.moveTo(ox,oy);g.arc(ox,oy,280,me.face-.5,me.face+.5);g.closePath();g.fill();
 g.globalCompositeOperation='source-over';
 // vignette
 g.setTransform(d,0,0,d,0,0);const vg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.9);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,W,H)}

function hud(){const tl=Math.max(0,G.timeLeft);const el=$('#wt');if(el){el.textContent=`${Math.floor(tl/60)}:${String(Math.floor(tl%60)).padStart(2,'0')}`;el.classList.toggle('low',tl<60)}
 const t=G.paused||G.boardOpen||G.ended?null:nearest();const p=$('#prompt');if(p){const tx=promptText(t);p.textContent=tx;p.classList.toggle('on',!!tx)}
 const h=$('#hand');if(h){const li=lang()==='pt'?1:0;h.innerHTML=G.me.hand?`<span>${L('In hand','Na mão')}:</span> <b>${esc(G.me.hand.title[li])}</b> <em>${L('take it to the Clue Board · R to drop','leve ao Quadro de Pistas · R para soltar')}</em>`:`<span>${L('Hands empty','Mãos livres')}</span>`}
 // minimap
 const mc=$('#mini');if(!mc)return;const m=mc.getContext('2d');const sx=mc.width/(MW*T),sy=mc.height/(MH*T);m.clearRect(0,0,mc.width,mc.height);m.fillStyle='rgba(10,7,8,.8)';m.fillRect(0,0,mc.width,mc.height);
 G.map.rooms.forEach(r=>{m.fillStyle=r.id===12?'rgba(253,235,188,.22)':'rgba(253,235,188,.1)';m.fillRect(r.x0*T*sx,r.y0*T*sy,(r.x1-r.x0+1)*T*sx,(r.y1-r.y0+1)*T*sy)});
 m.fillStyle='rgba(253,235,188,.2)';G.map.doors.forEach(d=>m.fillRect(d.x*T*sx-3,d.y*T*sy-3,6,6));
 const cr=G.map.rooms.find(r=>r.name===G.mys.crime);m.strokeStyle='#DF061F';m.lineWidth=3;const cx=cr.cx*sx,cy=cr.cy*sy;m.beginPath();m.moveTo(cx-6,cy-6);m.lineTo(cx+6,cy+6);m.moveTo(cx+6,cy-6);m.lineTo(cx-6,cy+6);m.stroke();
 const b=G.map.board;m.fillStyle='#FDEBBC';m.font="900 16px 'MM Title'";m.textAlign='center';m.fillText('?',(b.x+b.w/2)*sx,b.y*sy+8);
 G.ents.forEach(e=>{if(e.kind==='det'&&!e.me){m.fillStyle='#FDEBBC';m.beginPath();m.arc(e.x*sx,e.y*sy,3,0,7);m.fill()}});
 m.fillStyle='#fff';m.beginPath();m.arc(G.me.x*sx,G.me.y*sy,4,0,7);m.fill();m.strokeStyle='#DF061F';m.lineWidth=2;m.stroke()}

// =====================================================================
// NETWORK (online co-op)
// =====================================================================
function net(t,d){if(G&&G.online&&window.MM_NET)MM_NET.send(t,d)}
function bubbleFor(ci){const t=G.mys.testimony[ci];const li=lang()==='pt'?1:0;let lines=t.lines;if(t.gate&&G.board.length<3)lines=[t.lines[0],t.lines.find(x=>x[2]==='gate')];else lines=lines.filter(x=>x[2]!=='gate');return lines.map(x=>x[li]).join(' ')}
function netAttach(){const g0=G;G.unlisten=MM_NET.listen({msg:m=>{if(G!==g0||!G)return;onNet(m)},presence:l=>{if(G!==g0||!G)return;const ids=new Set(l.map(p=>p.id));
  G.ents.filter(e=>e.remote&&!ids.has(e.id)).forEach(e=>toast(e.name+L(' left the case.',' saiu do caso.')));G.ents=G.ents.filter(e=>!e.remote||ids.has(e.id));
  G.host=MM_NET.isHost()}})}
function onNet(m){const d=m.d||{};const byId=id=>G.ents.find(e=>e.id===id);
 switch(m.t){
 case'p':{const e=byId(m.from);if(e){e.tx=d.x;e.ty=d.y;e.dirX=d.dx;e.face=d.f;e.handT=d.h}break}
 case'n':{if(G.host)break;G.lastNpc=performance.now();d.a.forEach((v,ci)=>{const e=G.ents.find(x=>x.kind==='npc'&&x.ci===ci);if(!e)return;e.tx=v[0];e.ty=v[1];e.dirX=v[2]});break}
 case'clock':{if(!G.host)G.clockOff=d.now-Date.now()+0.08*1000;break}
 case'talk':{const e=G.ents.find(x=>x.kind==='npc'&&x.ci===d.ci);if(!e)break;e.talk=6;e.path=null;e.dirX=d.x<e.x?-1:1;e.bubble=bubbleFor(d.ci);break}
 case'furn':{const f=G.map.furn[d.i];if(!f)break;f.open=d.o?1:0;if(d.k){f.clue=null;f.taken=true}break}
 case'drop':{if(!G.dropped.some(x=>x.k===d.k))G.dropped.push(d);break}
 case'undrop':{G.dropped=G.dropped.filter(x=>x.k!==d.k);break}
 case'pin':{if(!G.board.some(b=>b.id===d.card.id)){G.board.push(d.card);pickMsg(d.by+L(' pinned: ',' prendeu: ')+d.card.title[lang()==='pt'?1:0]);if(G.boardOpen)renderBoard()}break}
 case'acc':{const before=G.wrong.length;accuse(d.i,d.by||'?');break}
 case'end':{if(!G.ended){if(d.win)G.winner=d.by;end(d.win,d.why)}break}
 case'sync':{if(G.host)break;let ch=false;(d.board||[]).forEach(c=>{if(!G.board.some(b=>b.id===c.id)){G.board.push(c);ch=true}});
  (d.wrong||[]).forEach(i=>{if(!G.wrong.includes(i)){G.wrong.push(i);ch=true}});if(d.pen>G.penalty)G.penalty=d.pen;
  (d.ft||[]).forEach(i=>{const f=G.map.furn[i];if(f&&!f.taken){f.taken=true;f.clue=null}});
  if(d.now)G.clockOff=d.now-Date.now()+80;if(d.t0e&&!G.t0e)G.t0e=d.t0e;
  if(ch&&G.boardOpen)renderBoard();break}
 }}
function netTick(dt){if(G.ended)return;G.netT+=dt;G.syncT+=dt;const me=G.me;
 if(G.netT>=.2){G.netT=0;const h=me.hand?me.hand.title[0]:'';const key=Math.round(me.x)+','+Math.round(me.y)+','+h;
  if(key!==G.lastSent||(G.hb=(G.hb||0)+1)%10===0){G.lastSent=key;net('p',{x:Math.round(me.x),y:Math.round(me.y),f:+me.face.toFixed(2),dx:me.dirX,h})}
  if(G.host&&(G.npcT=(G.npcT||0)+1)%2===0)net('n',{a:G.ents.filter(e=>e.kind==='npc').sort((a,b)=>a.ci-b.ci).map(e=>[Math.round(e.x),Math.round(e.y),e.dirX])})}
 if(G.host&&G.syncT>=3){G.syncT=0;net('sync',{board:G.board,wrong:G.wrong,pen:G.penalty,ft:G.map.furn.filter(f=>f.taken).map(f=>f.i),now:Date.now(),t0e:G.t0e})}}
window.MM_GAME={start,stop,debug:()=>G};
})();
