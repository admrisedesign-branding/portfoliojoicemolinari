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

const {CONTAINER,CNAME}=window.MM_WORLD;
// ---------- constants ----------
const MIN_PINS=5;const T=48,WH=58,INK='#1b1214';let MW=0,MH=0;
let G=null; // game state
const FONT_T="900 16px 'MM Title',sans-serif",FONT_B="13px 'Special Elite',monospace";

// =====================================================================
// MYSTERY GENERATOR
// =====================================================================
// ---- evidence families: MARKS stay at the crime scene, TRACES get carried away and hidden ----
const MARKS=[
 {id:'shoes',art:'shoeprint',cols:['#3a2a1a','#7a1e2a','#4a5a6a','#141012'],vals:[['heavy work boots','botas pesadas de trabalho'],['high heels','sapatos de salto alto'],['rubber-soled sneakers','tênis de sola de borracha'],['polished dress shoes','sapatos sociais engraxados']],
  title:cr=>[`Shoe prints in the ${RN(cr)}`,`Pegadas ${PREP('na',RN(cr))}`],text:(v,cr)=>[`Prints of ${v[0]}, still damp. They leave the ${RN(cr)} in a hurry — and turn away from the main door.`,`Pegadas de ${v[1]}, ainda úmidas. Saem ${PREP('da',RN(cr))} com pressa — e desviam da porta principal.`],
  sub:[[`More than one person here wears shoes like these. Look closely at everyone.`,`Mais de uma pessoa aqui usa sapatos assim. Observe todo mundo.`],[`Size 39. Half the building wears 39.`,`Número 39. Metade do prédio calça 39.`]],
  obs:v=>[`wears ${v[0]}`,`usa ${v[1]}`],how:v=>[`left prints of ${v[0]}`,`deixou pegadas de ${v[1]}`]},
 {id:'thread',art:'thread',cols:['#b8282e','#3a6a3a','#8a8a8a','#1f2a5a'],vals:[['red wool','lã vermelha'],['green tweed','tweed verde'],['grey flannel','flanela cinza'],['navy velvet','veludo azul-marinho']],
  title:cr=>[`A thread on the latch`,`Um fio preso na tranca`],text:(v,cr)=>[`A thread of ${v[0]} snagged on the latch of the ${RN(cr)} — torn off by someone who left in a rush, sleeve first.`,`Um fio de ${v[1]} preso na tranca ${PREP('da',RN(cr))} — arrancado por alguém que saiu às pressas, de manga e tudo.`],
  sub:[[`Coats like that are not rare tonight. Check every sleeve.`,`Casacos assim não são raros esta noite. Confira cada manga.`],[`Pulled hard. Whoever wore it didn't stop to look back.`,`Puxado com força. Quem usava não parou para olhar.`]],
  obs:v=>[`wears a ${v[0]} coat`,`usa casaco de ${v[1]}`],how:v=>[`snagged a ${v[0]} sleeve on the latch`,`prendeu a manga de ${v[1]} na tranca`]},
 {id:'button',art:'button',cols:['#c9a24a','#efe6da','#1c1416','#b8bcc4'],vals:[['brass anchor','âncora de latão'],['mother-of-pearl','madrepérola'],['black leather','couro preto'],['silver crest','brasão prateado']],
  title:cr=>[`A button under the furniture`,`Um botão debaixo dos móveis`],text:(v,cr)=>[`A ${v[0]} button, thread still attached, under the furniture of the ${RN(cr)}. It didn't fall off — it was ripped off.`,`Um botão de ${v[1]}, ainda com a linha, debaixo dos móveis ${PREP('da',RN(cr))}. Não caiu — foi arrancado.`],
  sub:[[`Count the buttons on every jacket you meet.`,`Conte os botões de cada paletó que encontrar.`],[`Someone crouched here. Long enough to lose it, too fast to notice.`,`Alguém se agachou aqui. Tempo bastante para perder, rápido demais para notar.`]],
  obs:v=>[`jacket with ${v[0]} buttons`,`paletó com botões de ${v[1]}`],how:v=>[`lost a ${v[0]} button crouching by the door`,`perdeu um botão de ${v[1]} agachado(a) perto da porta`]},
 {id:'feather',art:'feather',cols:['#2a7a8a','#141012','#f2ece0','#8a5a2a'],vals:[['peacock','pavão'],['black crow','corvo'],['white ostrich','avestruz branca'],['pheasant','faisão']],
  title:cr=>[`A feather by the door`,`Uma pena perto da porta`],text:(v,cr)=>[`A ${v[0]} feather by the door of the ${RN(cr)} — the kind that decorates a hat brim. Bent, as if someone ducked out fast.`,`Uma pena de ${v[1]} perto da porta ${PREP('da',RN(cr))} — daquelas que enfeitam aba de chapéu. Dobrada, como se alguém tivesse saído abaixado.`],
  sub:[[`Look up: who is wearing a hat tonight?`,`Olhe para cima: quem está de chapéu esta noite?`],[`Still soft. It fell minutes before the alarm.`,`Ainda macia. Caiu minutos antes do alarme.`]],
  obs:v=>[`hat with a ${v[0]} feather`,`chapéu com pena de ${v[1]}`],how:v=>[`dropped a ${v[0]} feather from their hat while ducking out`,`deixou cair uma pena de ${v[1]} do chapéu ao sair abaixado(a)`]},
 {id:'hand',art:'handprint',cols:['#2a4ab8','#efe6d6','#1c1c1c','#e8e8e0'],vals:[['blue ink','tinta azul'],['flour','farinha'],['engine grease','graxa'],['chalk dust','pó de giz']],
  title:cr=>[`A smudged handprint`,`Uma marca de mão borrada`],text:(v,cr)=>[`A handprint in ${v[0]} on the doorframe of the ${RN(cr)}. Someone steadied themselves here — with dirty fingers.`,`Uma marca de mão de ${v[1]} no batente ${PREP('da',RN(cr))}. Alguém se apoiou aqui — com os dedos sujos.`],
  sub:[[`Hands get washed. Fingernails don't lie.`,`Mãos se lavam. Unhas não mentem.`],[`Right hand. Small smear on the thumb.`,`Mão direita. Um borrão no polegar.`]],
  obs:v=>[`${v[0]} on the fingertips`,`dedos sujos de ${v[1]}`],how:v=>[`left a ${v[0]} handprint on the doorframe`,`deixou uma marca de mão de ${v[1]} no batente`]}];
const TRACES=[
 {id:'smell',art:'handkerchief',obj:[['A silk handkerchief','Um lenço de seda','a silk handkerchief','um lenço de seda'],['A crumpled napkin','Um guardanapo amassado','a crumpled napkin','um guardanapo amassado']],cols:['#9a7ac8','#6a4a2a','#a8541e','#4aa87a'],vals:[['lavender perfume','perfume de lavanda'],['pipe tobacco','tabaco de cachimbo'],['cinnamon','canela'],['peppermint','hortelã']],
  text:(v,rm)=>[`Stuffed out of sight in the ${rm}. It reeks of ${v[0]} — someone wanted that smell off their hands, fast.`,`Escondido às pressas ${PREP('na',rm)}. Tem cheiro forte de ${v[1]} — alguém quis tirar esse cheiro das mãos, rápido.`],
  obs:v=>[`smells of ${v[0]}`,`cheiro de ${v[1]}`],how:(o,v)=>[`wiped their hands on ${o[2]} that still reeks of ${v[0]}`,`limpou as mãos em ${o[3]} que ainda cheira a ${v[1]}`]},
 {id:'stain',art:'glove',obj:[['A single glove','Uma luva sozinha','a glove','uma luva'],['A work apron','Um avental de trabalho','an apron','um avental']],cols:['#c41f2a','#c9a46a','#f2ead0','#d8dee4'],vals:[['fresh red paint','tinta vermelha fresca'],['sawdust','serragem'],['candle wax','cera de vela'],['sea salt','sal marinho']],
  text:(v,rm)=>[`Shoved behind other things in the ${rm}. Caked with ${v[0]} — it was worn somewhere messy, then ditched.`,`Enfiado atrás de outras coisas ${PREP('na',rm)}. Coberto de ${v[1]} — foi usado em algum lugar sujo e depois largado.`],
  obs:v=>[`${v[0]} on the sleeves`,`${v[1]} nas mangas`],how:(o,v)=>[`ditched ${o[2]} covered in ${v[0]}`,`largou ${o[3]} coberto(a) de ${v[1]}`]},
 {id:'sound',art:'bell',obj:[['A broken charm','Um berloque quebrado','a broken charm','um berloque quebrado'],['A loose key ring','Uma argola de chaveiro','a key ring','uma argola de chaveiro']],cols:['#c9a24a','#b8bcc4','#c41f2a','#2a6a4a'],vals:[['a jingling charm bracelet','pulseira de berloques que tilinta'],['a heavy bunch of keys','um molho de chaves pesado'],['a tiny silver bell','um sininho de prata'],['a ticking pocket watch','um relógio de bolso barulhento']],
  text:(v,rm)=>[`Kicked under something in the ${rm}. It came off ${v[0]} — the kind of thing you hear before you see.`,`Chutado para debaixo de algo ${PREP('na',rm)}. Soltou-se de ${v[1]} — daquelas coisas que se ouvem antes de ver.`],
  obs:v=>[`carries ${v[0]}`,`carrega ${v[1]}`],how:(o,v)=>[`broke ${o[2]} off ${v[0]} in the rush`,`quebrou ${o[3]} de ${v[1]} na correria`]},
 {id:'taste',art:'wrapper',obj:[['A candy wrapper','Um papel de bala','a candy wrapper','um papel de bala'],['A paper cone of sweets','Um cone de papel de doces','a cone of sweets','um cone de doces']],cols:['#1c1416','#d8a02a','#e8b85a','#9a6ac8'],vals:[['licorice','alcaçuz'],['butterscotch','caramelo'],['ginger candy','bala de gengibre'],['violet pastilles','pastilha de violeta']],
  text:(v,rm)=>[`Crumpled in the ${rm}, still sticky: ${v[0]}. Somebody chews these when nervous — very nervous, tonight.`,`Amassado ${PREP('na',rm)}, ainda grudento: ${v[1]}. Alguém masca isso quando fica nervoso — muito nervoso, hoje.`],
  obs:v=>[`always chewing ${v[0]}`,`vive mascando ${v[1]}`],how:(o,v)=>[`dropped ${o[2]} of ${v[0]} while waiting for the right moment`,`deixou cair ${o[3]} de ${v[1]} esperando a hora certa`]},
 {id:'scratch',art:'bandage',obj:[['A torn bandage','Um curativo rasgado','a bandage','um curativo'],['A stained plaster','Um band-aid usado','a plaster','um band-aid']],cols:['#c8506a','#8a6a4a','#c9a46a','#7ab8c8'],vals:[['rose thorns','espinhos de rosa'],['cat claws','unhas de gato'],['wood splinters','farpas de madeira'],['broken glass','vidro quebrado']],
  text:(v,rm)=>[`Thrown away in the ${rm}, fresh. Whoever wore it got scratched by ${v[0]} tonight — and didn't want anyone asking why.`,`Jogado fora ${PREP('na',rm)}, recente. Quem usava se arranhou em ${v[1]} hoje — e não queria que ninguém perguntasse por quê.`],
  obs:v=>[`scratches on the hands (${v[0]})`,`arranhões nas mãos (${v[1]})`],how:(o,v)=>[`got scratched by ${v[0]} and threw away ${o[2]}`,`se arranhou em ${v[1]} e jogou fora ${o[3]}`]}];
const HERRING=[['A rubber duck','Um patinho de borracha','','','duck'],['A blank envelope','Um envelope em branco','','','envelope'],['A tram ticket','Um bilhete de bonde','','','ticket'],['A cinema ticket from last week','Um ingresso de cinema da semana passada','Nothing on it but popcorn butter.','Nada além de manteiga de pipoca.','ticket'],['A grocery list','Uma lista de compras','Eggs, flour, more flour. Someone bakes a lot.','Ovos, farinha, mais farinha. Alguém faz muito bolo.','list'],['A broken umbrella','Um guarda-chuva quebrado','Wet, but everybody came in from the rain.','Molhado, mas todo mundo chegou da chuva.','umbrella'],['A crossword, half solved','Palavras cruzadas pela metade','7 down: "culprit". Left blank. Funny.','7 vertical: "culpado". Em branco. Engraçado.','crossword'],['A lost earring','Um brinco perdido','Cheap gold paint. Not worth stealing.','Dourado barato. Não vale nada.','earring'],['A torn postcard','Um cartão-postal rasgado','"Wish you were here." From the seaside.','"Queria que você estivesse aqui." Da praia.','postcard'],['A chess piece','Uma peça de xadrez','A white knight. The board is nowhere to be seen.','Um cavalo branco. O tabuleiro não está em lugar nenhum.','chess'],['A dried flower','Uma flor seca','Pressed between pages long ago.','Prensada entre páginas há muito tempo.','flower']];
const MOTIVE={nervous:['panic — a debt they could not admit to anyone','pânico — uma dívida que não podia confessar a ninguém'],charming:['vanity — they were sure their smile would keep them above suspicion','vaidade — tinha certeza de que o sorriso afastaria qualquer suspeita'],grumpy:['resentment — years of being ignored, settled in one night','ressentimento — anos sendo ignorado(a), resolvidos em uma noite'],gossipy:['a secret they overheard, and wanted to use before anyone else could','um segredo que ouviu por acaso e quis usar antes de todo mundo'],ambitious:['ambition — this was the shortcut to a promotion','ambição — era o atalho para uma promoção'],forgetful:['a promise they "forgot" on purpose','uma promessa que "esqueceu" de propósito'],secretive:['a hidden past that tonight threatened to come out','um passado escondido que hoje ameaçava vir à tona'],loyal:['misplaced loyalty — they thought they were protecting someone','lealdade equivocada — achou que estava protegendo alguém'],jealous:['jealousy — they could not stand someone else getting the credit','ciúme — não suportava ver outra pessoa levar o crédito'],theatrical:['the need for one unforgettable scene','a vontade de protagonizar uma cena inesquecível'],meticulous:['a plan rehearsed for weeks — it only failed in the details','um plano ensaiado por semanas — só falhou nos detalhes'],sleepy:['boredom — and a bad idea at the worst possible hour','tédio — e uma péssima ideia na pior hora possível'],suspicious:['paranoia — they were sure someone was about to do it first','paranoia — tinha certeza de que alguém faria isso primeiro'],cheerful:['a cheerful mask over a very unhappy month','uma máscara alegre sobre um mês muito infeliz'],proud:['pride — they refused to lose to anyone in this building','orgulho — se recusava a perder para qualquer um neste prédio'],clumsy:['an accident they tried to cover up — and made much worse','um acidente que tentou esconder — e só piorou']};

function buildMystery(c,rooms){const r=rng(c.n*99991+7);const cast=c.cast.map((p,i)=>({...p,i,fem:FEM.has(p.name.split(' ')[0])}));
 const diff=c.difficulty;const cu=Math.floor(r()*6);const others=shuffle(r,[0,1,2,3,4,5].filter(i=>i!==cu));
 const a=others[0],b=others[1],cc=others[2],d=others[3],e=others[4];
 const MK=MARKS[(c.n*7+3)%MARKS.length],TC=TRACES[(c.n*3+1)%TRACES.length];
 const fIdx=shuffle(r,[0,1,2,3]),tIdx=shuffle(r,[0,1,2,3]);
 const foot={};[cu,a,b].forEach(i=>foot[i]=fIdx[0]);[cc,d,e].forEach((i,k)=>foot[i]=fIdx[1+k%3]);
 const trace={};[cu,a,cc].forEach(i=>trace[i]=tIdx[0]);[b,d,e].forEach((i,k)=>trace[i]=tIdx[1+k%3]);
 const roomPool=shuffle(r,rooms);const crime=roomPool[0];const Q=roomPool[1],S=roomPool[2],A_room=roomPool[3];
 let mt=(c.synopsis.en.match(/(\d{1,2}):(\d{2})/)||[0,'22','50']);let tot=(+mt[1])*60+(+mt[2]);if(tot<12*60)tot=23*60+40;tot-=12+Math.floor(r()*20);const TIME=`${Math.floor(tot/60)%24}:${String(tot%60).padStart(2,'0')}`;
 const alibi={};cast.forEach((p,i)=>{alibi[i]=roomPool[4+i]||pick(r,rooms)});alibi[a]=A_room;alibi[e]=A_room;alibi[cu]=Q;
 const N=i=>cast[i].name,isPT=()=>(RNmode||lang())==='pt';
 const extra={};cast.forEach((p,i)=>extra[i]=[]);
 extra[e].push([`At ${TIME} I was in the ${RN(A_room)} with ${N(a)}. We never left.`,`Às ${TIME} eu estava ${PREP('na',RN(A_room))} com ${N(a)}. Não saímos de lá.`]);
 extra[a].push([`${N(e)} can tell you — we were together the whole time.`,`${N(e)} pode confirmar — ficamos juntos o tempo todo.`]);
 const items=[];let diffLine;
 if(diff==='easy'){
  extra[d].push([`Around ${TIME} I saw the ${cast[cu].role.en} heading into the ${RN(crime)}. In a hurry.`,`Lá pelas ${TIME} vi ${cast[cu].fem?'a':'o'} ${cast[cu].role.pt} entrando ${PREP('na',RN(crime))}. Com pressa.`]);
  diffLine=[`${N(d)} saw them slip into the ${RN(crime)} — the rest was in the details.`,`${N(d)} viu ${cast[cu].fem?'ela':'ele'} entrar ${PREP('na',RN(crime))} — o resto estava nos detalhes.`];
 }else if(diff==='medium'){
  items.push({kind:'record',art:'keylog',room:Q,title:[`Key log of the ${RN(Q)}`,`Registro de chaves: ${RN(Q)}`],text:[`The ${RN(Q)} was locked from 21:30 to 23:00 and its key never left the hook. Funny — someone swears they spent ${TIME} in there.`,`O local "${RN(Q)}" ficou trancado das 21h30 às 23h e a chave nunca saiu do gancho. Curioso — alguém jura que passou as ${TIME} lá dentro.`],sub:[[`Signed by the night staff. No erasures.`,`Assinado pela equipe da noite. Sem rasuras.`],[`A locked room makes a poor alibi.`,`Sala trancada é um péssimo álibi.`]]});
  extra[d].push([`I knocked on the ${RN(Q)} door around ${TIME}. Locked, dark, nobody inside.`,`Bati na porta ${PREP('da',RN(Q))} perto das ${TIME}. Trancada, escura, ninguém lá dentro.`]);
  diffLine=[`But the ${RN(Q)} had been locked all evening — the alibi never stood a chance.`,`Mas ${RN(Q)} ficou trancado(a) a noite toda — o álibi nunca teve chance.`];
 }else{
  alibi[b]=Q;
  extra[b].push([`${N(cu)} was with me in the ${RN(Q)} at ${TIME}. I'm sure of it.`,`${N(cu)} estava comigo ${PREP('na',RN(Q))} às ${TIME}. Tenho certeza.`]);
  extra[cu].push([`Ask ${N(b)}. We were together.`,`Pergunte a ${N(b)}. Estávamos juntos.`]);
  items.push({kind:'record',art:'notebook',room:S,title:[`${N(b)}'s pocket notebook`,`Caderninho de ${N(b)}`],text:[`Last entry, ${TIME}: "Still waiting in the ${RN(S)}. Nobody came. Again."`,`Última anotação, ${TIME}: "Ainda esperando ${PREP('na',RN(S))}. Ninguém apareceu. De novo."`],sub:[[`Alone in the ${RN(S)}... then who was keeping company in the ${RN(Q)}?`,`Sozinho(a) ${PREP('na',RN(S))}... então quem estava fazendo companhia ${PREP('na',RN(Q))}?`],[`Shaky handwriting. On the cover, a detail: ${TC.obs(TC.vals[trace[b]])[0]}.`,`Letra tremida. Na capa, um detalhe: ${TC.obs(TC.vals[trace[b]])[1]}.`]]});
  extra[d].push([`I only talk to detectives who have done their homework. Pin a few clues first.`,`Só falo com detetives que fizeram a lição de casa. Prenda algumas pistas primeiro.`,'gate']);
  extra[d].push([`At ${TIME} I passed the ${RN(S)}: ${N(b)} was there, alone, checking a watch.`,`Às ${TIME} passei ${PREP('pela',RN(S))}: ${N(b)} estava lá, sozinho(a), olhando o relógio.`]);
  diffLine=[`${N(b)} covered for them — but ${N(b)}'s own notebook put ${N(b)} alone in the ${RN(S)}.`,`${N(b)} deu cobertura — mas o próprio caderninho de ${N(b)} mostrava que estava sozinho(a) ${PREP('na',RN(S))}.`];
 }
 const mv=MK.vals[foot[cu]],tv=TC.vals[trace[cu]];
 items.push({kind:'floor',art:MK.art,artCol:MK.cols[foot[cu]],room:crime,title:MK.title(crime),text:MK.text(mv,crime),sub:[[`Made around ${TIME}.`,`Feito por volta das ${TIME}.`],...MK.sub]});
 const obj=pick(r,TC.obj);const trRoom=pick(r,rooms.filter(x=>x!==crime));
 items.push({kind:'item',art:TC.art,artCol:TC.cols[trace[cu]],room:trRoom,title:[obj[0],obj[1]],text:TC.text(tv,RN(trRoom)),sub:[[`The same detail — ${TC.obs(tv)[0]} — fits more than one person tonight.`,`O mesmo detalhe — ${TC.obs(tv)[1]} — serve para mais de uma pessoa esta noite.`],[`Why carry it this far from the ${RN(crime)}?`,`Por que levar isso tão longe ${PREP('da',RN(crime))}?`]]});
 items.push({kind:'scene',art:'scene',room:crime,title:['The crime scene','A cena do crime'],text:[`The ${RN(crime)}, ${TIME}. The door wasn't forced and nothing else was touched: whoever did this knew exactly where to go — and left something behind.`,`${RN(crime).charAt(0).toUpperCase()+RN(crime).slice(1)}, ${TIME}. A porta não foi forçada e nada mais foi mexido: quem fez isso sabia exatamente aonde ir — e deixou algo para trás.`],sub:[[c.objective.en,c.objective.pt],[`Someone in this building is lying about where they were at ${TIME}.`,`Alguém neste prédio está mentindo sobre onde estava às ${TIME}.`]]});
 const nh=diff==='easy'?1:diff==='medium'?2:3;shuffle(r,HERRING).slice(0,nh).forEach(h=>items.push({kind:'herring',art:h[4],room:pick(r,rooms),title:[h[0],h[1]],text:[h[2],h[3]],sub:[]}));
 const TR={nervous:['I— I already told the others, I didn\'t see anything strange.','Eu— eu já disse pros outros, não vi nada estranho.'],charming:['Detective! What a pleasure. Ask me anything.','Detetive! Que prazer. Pergunte o que quiser.'],grumpy:['Make it quick, I have work to do.','Seja rápido, tenho trabalho a fazer.'],gossipy:['Oh, I know everything that happens here, darling.','Ah, eu sei de tudo que acontece aqui, querido.'],ambitious:['I hope this doesn\'t slow down my plans.','Espero que isso não atrapalhe meus planos.'],forgetful:['Hmm, what was the question again?','Hum, qual era a pergunta mesmo?'],secretive:['I prefer to keep to myself.','Prefiro ficar na minha.'],loyal:['I\'d never betray this place.','Eu nunca trairia este lugar.'],jealous:['Some people here get everything handed to them.','Tem gente aqui que ganha tudo de mão beijada.'],theatrical:['What a night! What a TERRIBLE night!','Que noite! Que noite TERRÍVEL!'],meticulous:['I keep track of every minute. Always.','Eu anoto cada minuto. Sempre.'],sleepy:['*yawn* Is it morning yet?','*bocejo* Já amanheceu?'],suspicious:['Why are you asking ME?','Por que está perguntando pra MIM?'],cheerful:['Hello hello! Terrible business, isn\'t it?','Olá, olá! Que coisa horrível, né?'],proud:['I am above all this, you understand.','Eu estou acima disso tudo, entende?'],clumsy:['Oops — sorry, I keep bumping into things tonight.','Ops — desculpa, hoje estou esbarrando em tudo.']};
 const testimony=cast.map((p,i)=>{const lines=[];const tr=TR[p.trait.en]||TR.cheerful;lines.push(tr);
  lines.push([`At ${TIME}? I was in the ${RN(alibi[i])}.`,`Às ${TIME}? Eu estava ${PREP('na',RN(alibi[i]))}.`]);
  extra[i].forEach(x=>lines.push(x));
  const o1=MK.obs(MK.vals[foot[i]]),o2=TC.obs(TC.vals[trace[i]]);
  const obs=[`Observed: ${o1[0]}; ${o2[0]}.`,`Observado: ${o1[1]}; ${o2[1]}.`];
  return{lines,obs,gate:extra[i].some(x=>x[2]==='gate')}});
 const why=[`${N(cu)} (${cast[cu].role.en}): ${MK.obs(mv)[0]} and ${TC.obs(tv)[0]} — only ${N(cu)} and ${N(a)} matched both, and ${N(a)} was with ${N(e)} in the ${RN(A_room)}.`,
  `${N(cu)} (${cast[cu].role.pt}): ${MK.obs(mv)[1]} e ${TC.obs(tv)[1]} — só ${N(cu)} e ${N(a)} batiam nas duas pistas, e ${N(a)} estava com ${N(e)} ${PREP('na',RN(A_room))}.`];
 let act=[(c.objective.en.match(/^Find out who (.+?)\.?$/i)||[0,''])[1],(c.objective.pt.match(/^Descubra quem (.+?)\.?$/i)||[0,''])[1]];
 const w0=act[0].split(' ')[0];if(!act[0]||!(/ed$/.test(w0)||['stole','took','cut','ate','hid','put','rang','threw','broke','sold','woke','wrote','never','swapped','forged'].includes(w0)))act[0]='set the whole plan in motion';
 if(!act[1]||/^(é|era|está|se |de )/.test(act[1]))act[1]='pôs todo o plano em prática';
 const fem=cast[cu].fem,ele=fem?'ela':'ele',mot=MOTIVE[cast[cu].trait.en]||MOTIVE.cheerful;
 const story=[`It was ${N(cu)}, the ${cast[cu].role.en}. At ${TIME} they told everyone they were in the ${RN(Q)} — but they were in the ${RN(crime)}, where they ${act[0]}. On the way out they ${MK.how(mv)[0]}; then they ${TC.how(obj,tv)[0]} and hid it in the ${RN(trRoom)}. ${diffLine[0]} The motive? ${mot[0].charAt(0).toUpperCase()+mot[0].slice(1)}.`,
  `Foi ${N(cu)}, ${fem?'a':'o'} ${cast[cu].role.pt}. Às ${TIME}, ${ele} disse a todos que estava ${PREP('na',RN(Q))} — mas estava ${PREP('na',RN(crime))}, onde ${act[1]}. Na saída, ${MK.how(mv)[1]}; depois ${TC.how(obj,tv)[1]} e escondeu ${PREP('na',RN(trRoom))}. ${diffLine[1]} O motivo? ${mot[1].charAt(0).toUpperCase()+mot[1].slice(1)}.`];
 return{cast,cu,crime,TIME,items,testimony,why,story};}


// =====================================================================
// MAP GENERATOR
// =====================================================================
function buildMap(c){const m=MM_WORLD.buildMap(c);MW=m.MW;MH=m.MH;return m}

// =====================================================================
// ASSETS
// =====================================================================
const IMG={};function img(src){if(!IMG[src]){IMG[src]=new Image();IMG[src].src=src}return IMG[src]}
function renderFloor(map,c){return MM_WORLD.renderFloor(map,c,RN)}
const furnSprite=f=>MM_WORLD.furnSprite(f);

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
 const spots=[];{const b=map.board;for(let rad=2;rad<9&&spots.length<8;rad++)for(let dy=1;dy<=rad&&spots.length<8;dy++)for(let dx=-rad;dx<=rad+3&&spots.length<8;dx++){const x=b.tx+dx,y=b.ty+dy;const i=y*MW+x;if(map.tiles[i]===1&&!map.blocked[i]&&map.roomId[i]===12&&!spots.some(q=>Math.abs(q.x-x)<1&&Math.abs(q.y-y)<1))spots.push({x,y})}}
 const spawn=(i)=>{const q=spots[i%Math.max(1,spots.length)]||{x:map.board.tx+1,y:map.board.ty+2};return{x:(q.x+.5)*T,y:(q.y+.5)*T}};
 const ents=[];
 players.forEach((p,i)=>{const s=spawn(i);ents.push({kind:'det',color:PCOL[i%PCOL.length],me:!!p.me,id:p.id,remote:!!(opts.online&&!p.me),tx:s.x,ty:s.y,name:p.name,img:img(`img/det${p.hat}.png`),x:s.x,y:s.y,vx:0,vy:0,face:-Math.PI/2,dirX:1,walk:0,path:null,wait:1+Math.random()*2,hand:null})});
 // NPC sprites by gender
 let fi=0,mi=0;const fr=shuffle(r,FEMALE_N),mr=shuffle(r,MALE_N);
 mys.cast.forEach((p,i)=>{const sp=p.fem?fr[fi++%fr.length]:mr[mi++%mr.length];const rm=pick(r,map.rooms.filter(x=>x.id!==12));
  ents.push({kind:'npc',ci:i,name:p.name,role:p.role,img:img(`img/npc/n${sp}.png`),sprite:sp,x:rm.cx+(r()-.5)*T*2,y:rm.cy+(r()-.5)*T*2,vx:0,vy:0,face:0,dirX:1,walk:0,path:null,wait:r()*3,talk:0,bubble:null,talked:false})});
 const me=ents.find(e=>e.me);
 G={online:!!opts.online,host:opts.online?!!opts.host:true,t0e:opts.t0||null,clockOff:opts.now?opts.now-Date.now():0,lastNpc:performance.now(),netT:0,syncT:0,dropK:0,lastSent:'',wrong:[],links:[],pos:{},detailId:null,maxWrong:c.difficulty==='hard'?2:3,tense:-1,c,map,mys,ents,me,floorItems,dropped:[],board:[],t0:performance.now(),timeLeft:10*60,penalty:0,keys:{},paused:false,boardOpen:false,ended:false,toasts:[],float:[],onExit,cam:{x:me.x,y:me.y},flash:0,lastT:performance.now(),prompt:null,accuseSel:null,detail:null};
 G.floor=renderFloor(map,c);
 buildDOM();{const mc=$('#mini');if(mc){const k=Math.min(200/MW,170/MH);mc.width=Math.round(MW*k);mc.height=Math.round(MH*k)}}show(true);if(G.online)netAttach();window.MM_MUSIC&&MM_MUSIC('game');window.MM_MUSIC&&MM_MUSIC(null,0);requestAnimationFrame(loop);}

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
 if(k==='escape'){e.preventDefault();if(G.boardOpen&&!G.paused){closeBoard();return}togglePause();return}
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
const PCOL=['#ff8a1f','#a66bff','#2ecc71','#ffd31a','#1fb5ff','#f2f2f2','#ff6ad5','#3346ff'];
function cardPos(id,i){if(!G.pos[id]){G.pos[id]=[.015+(i%6)*.163,.05+Math.floor(i/6)*.31+((i*37)%5)*.006]}return G.pos[id]}
function pinColor(id){for(let k=G.links.length-1;k>=0;k--){const l=G.links[k];if(l.a===id||l.b===id)return l.c}return null}
function addLink(a,b,c,by,remote){if(a===b)return;if(G.links.some(l=>l.c===c&&((l.a===a&&l.b===b)||(l.a===b&&l.b===a))))return;G.links.push({a,b,c,by});if(!remote){net('link',{a,b,c,by});sfx('type')}}
function rmLink(a,b,c,remote){if(!remote&&c!==G.me.color)return;const n=G.links.length;G.links=G.links.filter(l=>!(l.c===c&&((l.a===a&&l.b===b)||(l.a===b&&l.b===a))));if(G.links.length!==n&&!remote){net('link',{a,b,c,rm:1});sfx('click')}}
function cardArt(b){if(b.kind==='testimony'){const e=G.ents.find(x=>x.kind==='npc'&&x.ci===b.ci);return e?`img/npc/n${e.sprite}.png`:''}return b.art&&window.MM_CLUEART?MM_CLUEART(b.art,b.artCol):''}
function openBoard(){G.boardOpen=true;G.keys={};renderBoard()}
function closeBoard(){G.boardOpen=false;G.accuseSel=null;$('#ovl').classList.remove('on');$('#ovl').innerHTML=''}
function renderBoard(){if(G.paused)return;const li=lang()==='pt'?1:0;const o=$('#ovl');o.classList.add('on');const selId=G.detailId;const myC=G.me.color;
 const sb=G.board.find(b=>b.id===selId);
 o.innerHTML=`<div class="cork"><div class="corkhead"><h2>${L('Clue Board','Quadro de Pistas')}</h2><span>${G.board.length} ${L('clues pinned','pistas presas')}</span><span class="mycol"><i style="background:${myC}"></i>${L('your thread','seu fio')}</span><span class="whint2">${L('drag a pin onto another clue to tie a thread · drag cards to organize · click your own thread to cut it · ESC closes','arraste um pino até outra pista para ligar um fio · arraste as fichas para organizar · só você corta os seus fios (clique neles) · ESC fecha')}</span><button class="x" id="bclose">ESC · ${L('CLOSE','FECHAR')} ✕</button></div>
 <div class="corkbody"><div class="wall" id="wall"><svg id="threads"></svg>${G.board.length?G.board.map((b,i)=>{const p=cardPos(b.id,i);const pc=pinColor(b.id);const cols=[...new Set(G.links.filter(l=>l.a===b.id||l.b===b.id).map(l=>l.c))];const art=cardArt(b);
   return`<div class="ccard ${b.kind} ${selId===b.id?'sel':''}" data-id="${b.id}" style="left:${p[0]*100}%;top:${p[1]*100}%;--rot:${((i*37)%7-3)*.7}deg"><i class="pinh" data-id="${b.id}" ${pc?`style="background:radial-gradient(circle at 35% 30%,#fff8,${pc} 45%,#0006)"`:''}></i>${cols.length>1?`<span class="pdots">${cols.map(c=>`<i style="background:${c}"></i>`).join('')}</span>`:''}${art?`<div class="cimg ${b.kind==='testimony'?'por':''}"><img src="${art}" alt="" draggable="false"></div>`:''}<b>${esc(b.title[li])}</b><small>${b.kind==='testimony'?L('testimony','depoimento'):b.kind==='herring'?L('object','objeto'):L('evidence','evidência')}</small></div>`}).join(''):`<p class="emptyb">${L('No clues yet. Explore the rooms, open drawers and cabinets, talk to people — then bring what you find here.','Nenhuma pista ainda. Explore as salas, abra gavetas e armários, converse com as pessoas — e traga o que encontrar para cá.')}</p>`}
</div>
 <div class="detail">${sb?`${sb.kind!=='testimony'&&cardArt(sb)?`<img class="dimg" src="${cardArt(sb)}" alt="">`:''}<h3>${esc(sb.title[li])}</h3><p>${sb.text[li]?esc(sb.text[li]):'<i style="opacity:.5">'+L('Nothing written on it.','Nada escrito.')+'</i>'}</p><ul>${sb.sub.map(s=>`<li>${esc(s[li])}</li>`).join('')}</ul>${(()=>{const ls=G.links.filter(l=>l.a===sb.id||l.b===sb.id);return ls.length?`<div class="dlinks">${ls.map(l=>{const oth=G.board.find(x=>x.id===(l.a===sb.id?l.b:l.a));return oth?`<div><i style="background:${l.c}"></i>${esc(l.by||'')} → ${esc(oth.title[li])}</div>`:''}).join('')}</div>`:''})()}`:`<p class="hint2">${L('Click a clue to read it.','Clique numa pista para ler.')}</p>`}</div></div>
 <div class="accuse ${G.board.length<MIN_PINS?'locked':''}"><h3>${L('Accuse','Acusar')}</h3><div class="suspects">${G.mys.cast.map((p,i)=>{const e=G.ents.find(x=>x.kind==='npc'&&x.ci===i);const w=G.wrong.includes(i);return`<button class="sus ${G.accuseSel===i?'on':''} ${w?'cleared':''}" data-s="${i}" ${w||G.board.length<MIN_PINS?'disabled':''}><img src="img/npc/n${e.sprite}.png" alt=""><b>${esc(p.name)}</b><small>${w?L('innocent','inocente'):esc(p.role[lang()])}</small></button>`}).join('')}</div>
 <button class="start" id="acc" ${G.accuseSel==null||G.board.length<MIN_PINS?'disabled':''}>${G.board.length<MIN_PINS?L(`Pin ${MIN_PINS-G.board.length} more clue(s) to accuse`,`Prenda mais ${MIN_PINS-G.board.length} pista(s) para acusar`):G.accuseSel==null?L('Choose a suspect','Escolha um suspeito'):L('ACCUSE ','ACUSAR ')+esc(G.mys.cast[G.accuseSel].name.split(' ')[0].toUpperCase())}</button>
 <small class="warn">${G.maxWrong===2?L(`HARD CASE: you may be wrong only once. A second wrong accusation lets the culprit escape. Each mistake costs 30 seconds. Accusations left: ${G.maxWrong-G.wrong.length}.`,`CASO DIFÍCIL: só é permitido errar uma vez. A segunda acusação errada deixa o culpado escapar. Cada erro custa 30 segundos. Acusações restantes: ${G.maxWrong-G.wrong.length}.`):L(`You need at least ${MIN_PINS} clues on the board to accuse. Each wrong accusation costs 30 seconds — after ${G.maxWrong} wrong accusations the culprit escapes. Accusations left: ${G.maxWrong-G.wrong.length}.`,`É preciso ter pelo menos ${MIN_PINS} pistas no quadro para acusar. Cada acusação errada custa 30 segundos — depois de ${G.maxWrong} erros o culpado escapa. Acusações restantes: ${G.maxWrong-G.wrong.length}.`)}</small><div class="bminus" id="bminus">−0:30</div></div></div>`;
 o.querySelectorAll('.sus').forEach(el=>el.onclick=()=>{G.accuseSel=+el.dataset.s;sfx('hover');renderBoard()});
 $('#bclose').onclick=closeBoard;$('#acc').onclick=()=>{if(G.accuseSel==null)return;accuse(G.accuseSel)};
 const wall=$('#wall');if(!wall)return;drawThreads();
 // drag: pin → thread, card → move
 wall.onpointerdown=ev=>{const pin=ev.target.closest('.pinh');const card=ev.target.closest('.ccard');if(!card)return;ev.preventDefault();const wr=wall.getBoundingClientRect();
  if(pin){const a=pin.dataset.id;const svg=$('#threads');const tmp=document.createElementNS('http://www.w3.org/2000/svg','line');const pr=pin.getBoundingClientRect();const x0=pr.left+pr.width/2-wr.left,y0=pr.top+pr.height/2-wr.top;
   tmp.setAttribute('x1',x0);tmp.setAttribute('y1',y0);tmp.setAttribute('x2',x0);tmp.setAttribute('y2',y0);tmp.setAttribute('stroke',myC);tmp.setAttribute('stroke-width','3');tmp.setAttribute('stroke-dasharray','6 4');svg.appendChild(tmp);
   const mv=e=>{tmp.setAttribute('x2',e.clientX-wr.left);tmp.setAttribute('y2',e.clientY-wr.top)};
   const up=e=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);tmp.remove();const t=document.elementFromPoint(e.clientX,e.clientY);const tc=t&&t.closest&&t.closest('.ccard');if(tc&&tc.dataset.id!==a){addLink(a,tc.dataset.id,myC,G.me.name);renderBoard()}};
   window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);return}
  const id=card.dataset.id;const sx=ev.clientX,sy=ev.clientY;const p0=G.pos[id].slice();let moved=false;card.classList.add('drag');
  const mv=e=>{const dx=(e.clientX-sx)/wr.width,dy=(e.clientY-sy)/wr.height;if(Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>4)moved=true;const nx=Math.max(0,Math.min(.86,p0[0]+dx)),ny=Math.max(0,Math.min(.8,p0[1]+dy));G.pos[id]=[nx,ny];card.style.left=nx*100+'%';card.style.top=ny*100+'%';drawThreads()};
  const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);card.classList.remove('drag');if(moved){net('mv',{id,p:G.pos[id]})}else{G.detailId=id;sfx('hover');renderBoard()}};
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up)}}
function drawThreads(){const wall=$('#wall'),svg=$('#threads');if(!wall||!svg)return;const wr=wall.getBoundingClientRect();svg.setAttribute('width',wr.width);svg.setAttribute('height',wr.height);
 const ctr=id=>{const el=wall.querySelector(`.pinh[data-id="${id}"]`);if(!el)return null;const r=el.getBoundingClientRect();return[r.left+r.width/2-wr.left,r.top+r.height/2-wr.top]};
 const off={};svg.innerHTML=G.links.map(l=>{const A=ctr(l.a),B=ctr(l.b);if(!A||!B)return'';const key=[l.a,l.b].sort().join('|');const k=off[key]=(off[key]||0)+1;const sag=26+k*12;const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2+sag;
  const mine=l.c===G.me.color;return`<path d="M${A[0]},${A[1]} Q${mx},${my} ${B[0]},${B[1]}" stroke="rgba(0,0,0,.45)" stroke-width="5" fill="none" transform="translate(2,3)"/><path class="thr ${mine?'mine':''}" data-a="${l.a}" data-b="${l.b}" data-c="${l.c}" d="M${A[0]},${A[1]} Q${mx},${my} ${B[0]},${B[1]}" stroke="${l.c}" stroke-width="3.5" fill="none"><title>${esc(l.by||'')}</title></path>`}).join('');
 svg.querySelectorAll('.thr.mine').forEach(p=>p.onclick=()=>{rmLink(p.dataset.a,p.dataset.b,p.dataset.c);renderBoard()})}
function accuse(i,by){if(!by&&G.board.length<MIN_PINS)return;if(G.wrong.includes(i)||G.ended)return;
 if(!by)net('acc',{i,by:G.me.name});
 if(i===G.mys.cu){G.winner=by||null;end(true);return}
 G.wrong.push(i);G.penalty+=30;sfx('click');const f=$('#redflash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');
 const m=$('#minus');m.classList.remove('on');void m.offsetWidth;m.classList.add('on');const bm=$('#bminus');if(bm){bm.classList.remove('on');void bm.offsetWidth;bm.classList.add('on')}
 if(G.accuseSel===i||!by)G.accuseSel=null;
 if(G.wrong.length>=G.maxWrong){setTimeout(()=>end(false,'accuse'),900);if(G.boardOpen)renderBoard();return}
 if(G.boardOpen)renderBoard();const bm2=$('#bminus');if(bm2){void bm2.offsetWidth;bm2.classList.add('on')}
 if(by&&!G.boardOpen){const o=$('#ovl');if(!G.paused){o.classList.remove('on');o.innerHTML=''}}
 toast((by?by+': ':'')+L(`Wrong! ${G.mys.cast[i].name} is innocent. −30 seconds. ${G.maxWrong-G.wrong.length} accusation(s) left before the culprit escapes.`,`Errado! ${G.mys.cast[i].name} é inocente. −30 segundos. Restam ${G.maxWrong-G.wrong.length} acusação(ões) antes de o culpado escapar.`))}
// =====================================================================
// PAUSE / END
// =====================================================================
function togglePause(){G.paused=!G.paused;G.keys={};const o=$('#ovl');if(!G.paused){if(G.boardOpen){renderBoard();return}o.classList.remove('on');o.innerHTML='';return}const l=lang();
 o.classList.add('on');o.innerHTML=`<div class="pausewrap"><div class="pcase"><div class="pc-top">${L('CASE','CASO')} #${String(G.c.n).padStart(2,'0')}</div><div class="pc-loc">${esc(G.c.place[l])}</div><h3>${esc(G.c.title[l])}</h3><p class="pc-syn" id="pcs">${esc(G.c.synopsis[l])}</p><button class="ghost2" id="readall">${L('Read all','Ler tudo')}</button><div class="pc-obj">${esc(G.c.objective[l])}</div></div>
 <div class="pmenu"><h2>${L('Paused','Pausa')}</h2><small>${L('the clock keeps running','o relógio continua correndo')}</small><button class="pm" id="pres">${L('Resume','Continuar')}</button><button class="pm" id="pmus">${L('Music','Música')}: ${window.MM_MUSIC_ON&&MM_MUSIC_ON()?L('ON','LIGADA'):L('OFF','DESLIGADA')}</button><button class="pm" id="pctl">${L('How to play','Como jogar')}</button><button class="pm" id="pquit">${L('Leave case','Sair do caso')}</button><div class="plist"><b>${L('Detectives','Detetives')}</b>${G.ents.filter(e=>e.kind==='det').map(e=>`<div><i style="background:${e.color}"></i>${esc(e.name)}${e.me?` <em>(${L('you','você')})</em>`:''}</div>`).join('')}</div><div class="pctl" id="ctl" hidden>WASD — ${L('move','andar')}<br>${L('hold','segure')} SPACE — ${L('run','correr')}<br>E — ${L('examine / talk / pin','examinar / conversar / prender')}<br>R — ${L('drop item','soltar item')}<br>ESC — ${L('menu','menu')}</div></div></div>`;
 $('#readall').onclick=()=>{$('#pcs').classList.toggle('full')};$('#pmus').onclick=()=>{const on=MM_MUSIC_TOGGLE();$('#pmus').textContent=L('Music','Música')+': '+(on?L('ON','LIGADA'):L('OFF','DESLIGADA'))};$('#pres').onclick=()=>togglePause();$('#pctl').onclick=()=>{if(window.MM_TUTORIAL)MM_TUTORIAL();else $('#ctl').hidden=!$('#ctl').hidden};$('#pquit').onclick=()=>{const cb=G.onExit;stop();cb&&cb('room')}}
function end(win,why){if(G.ended)return;G.ended=true;const li=lang()==='pt'?1:0;const cu=G.mys.cast[G.mys.cu];const left=Math.max(0,G.timeLeft);
 if(win){try{const s=JSON.parse(localStorage.getItem('mm_solved')||'[]');if(!s.includes(G.c.n))s.push(G.c.n);localStorage.setItem('mm_solved',JSON.stringify(s))}catch(e){}}
 const o=$('#ovl');o.classList.add('on');const mmss=`${Math.floor(left/60)}:${String(Math.floor(left%60)).padStart(2,'0')}`;
 G.paused=false;G.boardOpen=false;o.innerHTML=`<div class="endwrap ${win?'win':'lose'}"><div class="stampbig">${win?L('CASE CLOSED','CASO ENCERRADO'):why==='accuse'?L('CULPRIT ESCAPED','CULPADO ESCAPOU'):L('TIME\'S UP','TEMPO ESGOTADO')}</div><h1>${win?(G.winner?esc(G.winner)+L(' caught the culprit!',' pegou o culpado!'):L('You caught the culprit!','Vocês pegaram o culpado!')):why==='accuse'?L('Too many wrong accusations — the culprit slipped away.','Acusações erradas demais — o culpado escapou.'):L('The culprit got away…','O culpado escapou…')}</h1>
 <div class="culprit"><img src="img/npc/n${G.ents.find(e=>e.kind==='npc'&&e.ci===G.mys.cu).sprite}.png" alt=""><div><b>${esc(cu.name)}</b><small>${esc(cu.role[lang()])}</small><h4>${win?L('How it happened','Como aconteceu'):L('What really happened','O que aconteceu de verdade')}</h4><p>${esc(G.mys.story[li])}</p><h4>${L('The key evidence','A prova decisiva')}</h4><p class="whyp">${esc(G.mys.why[li])}</p></div></div>${win&&window.MM_STORY?MM_STORY.fileHTML(G.c,li):''}
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
 if(!e.path||!e.path.length){e.wait-=dt;e.walk=0;if(e.wait<=0){const rms=G.map.rooms;const rm0=e.kind==='det'&&Math.random()<.3?rms[12]:rms[Math.floor(Math.random()*rms.length)];const rm=rm0.rects[Math.floor(Math.random()*rm0.rects.length)];
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
 {const placed=[];G.ents.filter(e=>e.bubble).sort((a,b)=>b.y-a.y).forEach(e=>{const lay=measureBubble(g,e.bubble);let bx=e.x-lay.bw/2,by=e.y-100-lay.bh;
   for(let it=0;it<8;it++){const hit=placed.find(q=>bx<q.x+q.w+6&&bx+lay.bw+6>q.x&&by<q.y+q.h+6&&by+lay.bh+6>q.y);if(!hit)break;by=hit.y-lay.bh-14}
   placed.push({x:bx,y:by,w:lay.bw,h:lay.bh,e,lay})});for(let k=placed.length-1;k>=0;k--){const q=placed[k];drawBubble(g,q.e.x,q.e.y-100,q.lay,q.x,q.y)}}
 G.float.forEach(f=>{if(bub.some(b=>Math.abs(b.x-f.x)<200&&Math.abs(b.y-f.y)<160))return;g.save();g.globalAlpha=Math.min(1,f.life);g.font="900 18px 'MM Title',sans-serif";g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(0,0,0,.8)';g.strokeText(f.t,f.x,f.y);g.fillStyle=f.col;g.fillText(f.t,f.x,f.y);g.restore()});}

function drawWallRow(g,y,vx0,vx1){const tl=G.map.tiles;const me=G.me;const st=G.map.style;
 for(let x=Math.max(0,Math.floor(vx0/T));x<Math.min(MW,Math.ceil(vx1/T));x++){if(tl[y*MW+x]!==2)continue;const px=x*T,py=y*T;const below=y<MH-1?tl[(y+1)*MW+x]:3;
  let a=1;const dyp=py-me.y;if(below===1&&dyp>-T&&dyp<T*3.2&&Math.abs(px+T/2-me.x)<T*2.2)a=.32;g.globalAlpha=a;
  const up=y>0?tl[(y-1)*MW+x]:3,lf=x>0?tl[y*MW+x-1]:3,rt=x<MW-1?tl[y*MW+x+1]:3;MM_WORLD.drawWallTile(g,px,py,below,up,lf,rt,st,x,y,WH);g.globalAlpha=1}}
function drawFurn(g,f){const sp=furnSprite(f);const fx=f.x*T,fy=f.y*T;const me=G.me;let a=1;if(me.y<fy+T*.8&&me.y>fy-f.h-10&&me.x>fx-10&&me.x<fx+f.w*T+10)a=.35;
 g.globalAlpha=a;g.drawImage(sp,fx-sp.ox,fy-f.h+T*.1-sp.oy);g.globalAlpha=1}
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
function drawTag(g,e){const dx=e.x-G.me.x,dy=e.y-G.me.y;const d=Math.hypot(dx,dy);if(!e.me&&d>520)return;const h=74;const isNpc=e.kind==='npc';g.save();g.globalAlpha=e.me?1:Math.max(.25,1-d/600);g.font="12px 'Special Elite',monospace";const label=e.name;const dot=!isNpc&&e.color?14:0;const tw=g.measureText(label).width+14+dot;g.fillStyle=e.me?'rgba(223,6,31,.92)':'rgba(20,14,16,.8)';g.beginPath();g.roundRect(e.x-tw/2,e.y-h-26,tw,18,9);g.fill();if(dot){g.fillStyle=e.color;g.strokeStyle='#000';g.lineWidth=1.5;g.beginPath();g.arc(e.x-tw/2+11,e.y-h-17,5,0,7);g.fill();g.stroke()}g.fillStyle=isNpc?'#FDEBBC':'#fff';g.textAlign='center';g.fillText(label,e.x+dot/2,e.y-h-13);g.restore()}
function measureBubble(g,text){g.save();g.font="13px 'Special Elite',monospace";const maxW=300;const words=text.split(' ');const lines=[];let cur='';words.forEach(w=>{const tt=cur?cur+' '+w:w;if(g.measureText(tt).width>maxW){lines.push(cur);cur=w}else cur=tt});lines.push(cur);
 const bw=Math.min(maxW,Math.max(...lines.map(l=>g.measureText(l).width)))+24,bh=lines.length*17+18;g.restore();return{lines,bw,bh}}
function drawBubble(g,x,y,lay,bx,by){g.save();g.font="13px 'Special Elite',monospace";const{lines,bw,bh}=lay;
 g.fillStyle='#FDEBBC';g.strokeStyle=INK;g.lineWidth=2.5;
 // tail from bubble bottom to speaker
 const tx=Math.max(bx+14,Math.min(bx+bw-14,x));g.beginPath();g.moveTo(tx-8,by+bh-1);g.lineTo(x,y+12);g.lineTo(tx+8,by+bh-1);g.closePath();g.fill();g.stroke();
 g.beginPath();g.roundRect(bx,by,bw,bh,10);g.fill();g.stroke();
 g.fillStyle=INK;g.textAlign='left';lines.forEach((l,i)=>g.fillText(l,bx+12,by+22+i*17));g.restore()}

function lighting(g,W,H,Z,t){const dk=G.dark;const dc=dk.getContext('2d');const s=dk.width/W;
 dc.setTransform(1,0,0,1,0,0);dc.globalCompositeOperation='source-over';dc.clearRect(0,0,dk.width,dk.height);dc.fillStyle='rgba(3,4,7,.8)';dc.fillRect(0,0,dk.width,dk.height);
 dc.setTransform(s*Z,0,0,s*Z,s*(W/2-G.cam.x*Z),s*(H/2-G.cam.y*Z));dc.globalCompositeOperation='destination-out';
 const lamps=G.map.lamps.map(l=>({lamp:l,R:l.R}));lamps.forEach((r,i)=>{const fl=.85+.15*Math.sin(t*3+i*1.7)*Math.sin(t*11+i);const R=r.R;const gr=dc.createRadialGradient(r.lamp.x,r.lamp.y,10,r.lamp.x,r.lamp.y,R);gr.addColorStop(0,`rgba(0,0,0,${.72*fl})`);gr.addColorStop(.6,`rgba(0,0,0,${.35*fl})`);gr.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=gr;dc.fillRect(r.lamp.x-R,r.lamp.y-R,R*2,R*2)});
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
 G.map.rooms.forEach(r=>{m.fillStyle=r.id===12?'rgba(253,235,188,.22)':'rgba(253,235,188,.1)';r.rects.forEach(q=>m.fillRect(q.x0*T*sx,q.y0*T*sy,(q.x1-q.x0+1)*T*sx,(q.y1-q.y0+1)*T*sy))});
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
 case'link':{if(d.rm)rmLink(d.a,d.b,d.c,true);else addLink(d.a,d.b,d.c,d.by,true);if(G.boardOpen)renderBoard();break}
 case'mv':{G.pos[d.id]=d.p;if(G.boardOpen){const el=document.querySelector(`.ccard[data-id="${d.id}"]`);if(el&&!el.classList.contains('drag')){el.style.left=d.p[0]*100+'%';el.style.top=d.p[1]*100+'%';drawThreads()}}break}
 case'pin':{if(!G.board.some(b=>b.id===d.card.id)){G.board.push(d.card);pickMsg(d.by+L(' pinned: ',' prendeu: ')+d.card.title[lang()==='pt'?1:0]);if(G.boardOpen)renderBoard()}break}
 case'acc':{const before=G.wrong.length;accuse(d.i,d.by||'?');break}
 case'end':{if(!G.ended){if(d.win)G.winner=d.by;end(d.win,d.why)}break}
 case'sync':{if(G.host)break;let ch=false;(d.links||[]).forEach(l=>{if(!G.links.some(x=>x.c===l.c&&x.a===l.a&&x.b===l.b)){G.links.push(l);ch=true}});if(d.pos)for(const k in d.pos)if(!G.pos[k])G.pos[k]=d.pos[k];(d.board||[]).forEach(c=>{if(!G.board.some(b=>b.id===c.id)){G.board.push(c);ch=true}});
  (d.wrong||[]).forEach(i=>{if(!G.wrong.includes(i)){G.wrong.push(i);ch=true}});if(d.pen>G.penalty)G.penalty=d.pen;
  (d.ft||[]).forEach(i=>{const f=G.map.furn[i];if(f&&!f.taken){f.taken=true;f.clue=null}});
  if(d.now)G.clockOff=d.now-Date.now()+80;if(d.t0e&&!G.t0e)G.t0e=d.t0e;
  if(ch&&G.boardOpen)renderBoard();break}
 }}
function netTick(dt){if(G.ended)return;G.netT+=dt;G.syncT+=dt;const me=G.me;
 if(G.netT>=.2){G.netT=0;const h=me.hand?me.hand.title[0]:'';const key=Math.round(me.x)+','+Math.round(me.y)+','+h;
  if(key!==G.lastSent||(G.hb=(G.hb||0)+1)%10===0){G.lastSent=key;net('p',{x:Math.round(me.x),y:Math.round(me.y),f:+me.face.toFixed(2),dx:me.dirX,h})}
  if(G.host&&(G.npcT=(G.npcT||0)+1)%2===0)net('n',{a:G.ents.filter(e=>e.kind==='npc').sort((a,b)=>a.ci-b.ci).map(e=>[Math.round(e.x),Math.round(e.y),e.dirX])})}
 if(G.host&&G.syncT>=3){G.syncT=0;net('sync',{links:G.links,pos:G.pos,board:G.board,wrong:G.wrong,pen:G.penalty,ft:G.map.furn.filter(f=>f.taken).map(f=>f.i),now:Date.now(),t0e:G.t0e})}}
window.MM_GAME={start,stop,debug:()=>G};
})();
