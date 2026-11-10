// Midnight Mystery — world: layouts, styles and furniture per location type
(function(){
const T=48,INK='#1b1214';
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function shade(hex,f){const n=parseInt(hex.slice(1),16);const c=[n>>16,n>>8&255,n&255].map(v=>Math.max(0,Math.min(255,Math.round(v*f))));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')}

// ---------- layouts: letters = 12 rooms, H = hall/corridor, . = outside ----------
const LAYOUTS={
 manor:{g:['ABCD','EHHF','GHHI','JKLM'],cw:[11,14],ch:[10,12]},
 hospital:{g:['ABCDEF','HHHHHH','GIJKLM'],cw:[10,12],ch:[10,11],hr:[7,8]},
 school:{g:['ABHCD','EFHGI','JKHLM'],cw:[11,13],ch:[10,11],hc:[7,8]},
 cruise:{g:['.ABCDE.','FHHHHHG','.IJKLM.'],cw:[9,11],ch:[9,10],hr:[8,9]},
 circus:{g:['ABCDE','FHHHG','IHHHJ','.K.LM'],cw:[10,12],ch:[9,11]},
 bank:{g:['ABCDE','FHHHG','IJKLM'],cw:[10,12],ch:[10,12]},
 hotel:{g:['ABCDE','HHHHF','GIJHK','..LHM'],cw:[10,12],ch:[10,11],hr:[7,8]},
 opera:{g:['AHHHHB','CDEFGI','JK.ML.'],cw:[10,11],ch:[10,12]},
 museum:{g:['.AB.','CHHD','EHHF','GHHI','JKLM'],cw:[12,14],ch:[9,10]},
 office:{g:['ABCDE','HHHHH','FGIJK','LM...'],cw:[10,12],ch:[10,11],hr:[7,8]},
 tvstudio:{g:['HHAB','HHCD','EFGI','JKLM'],cw:[11,13],ch:[10,11]},
 casino:{g:['ABCD','EHHF','GHHI','JHHK','.LM.'],cw:[11,13],ch:[9,10]}
};
// ---------- visual style per location ----------
const STYLE={
 manor:{ext:'garden',floors:['wood','carpet','checker','parquet'],hall:'parquet',wall:['#4a3648','#5a4256','#1f1416'],pat:'wainscot',cap:'#231916',edge:'#3d2c25',rug:['#5a1a22','#1f3a34','#3a2a4a'],deco:'rug',fcol:['#6b4a33','#5a3d2a','#7a3a32','#4a3a2a']},
 hospital:{ext:'street',floors:['lino','tile','lino'],hall:'linoGreen',wall:['#b9c9c2','#a7b8b1','#5f7570'],pat:'tilehalf',cap:'#3c4a46',edge:'#7d918a',deco:'cross',fcol:['#d8dfdc','#9fb2ab','#7d918a','#c9d3cf']},
 school:{ext:'yard',floors:['lino','wood','lino'],hall:'linoBlue',wall:['#c9a86a','#b8975a','#6a5232'],pat:'chalk',cap:'#3a2c1c',edge:'#8a6d40',deco:'lines',fcol:['#7a6a4f','#8c7a5b','#4a6a7a','#9a5a3a']},
 cruise:{ext:'water',floors:['carpetBlue','deck','carpet'],hall:'deck',wall:['#ece6d6','#d6cfbb','#24405a'],pat:'portholes',cap:'#1d3346',edge:'#3a5a7a',deco:'lifebuoy',fcol:['#2c4a6a','#e6dcc4','#8a5a32','#3a6a7a']},
 circus:{ext:'grass',floors:['sawdust','canvas','sawdust'],hall:'ring',wall:['#b8282e','#efe3c4','#5a1418'],pat:'tentstripes',cap:'#4a1a14',edge:'#7a2a24',deco:'ring',fcol:['#b8282e','#2a5a8a','#d6a02a','#6a3a8a']},
 bank:{ext:'street',floors:['marble','carpetGrey','marble'],hall:'marble',wall:['#7d786a','#8a8576','#3a382f'],pat:'panels',cap:'#2a2822',edge:'#5a564a',deco:'seal',fcol:['#4a4a44','#6a5a3a','#3a4a4a','#5a3a2a']},
 hotel:{ext:'street',floors:['carpet','wood','carpetRed'],hall:'carpetRed',wall:['#5a2430','#6a2d3a','#2a1015'],pat:'wallpaper',cap:'#1f0c10',edge:'#7a3a42',deco:'lobby',fcol:['#5a2a20','#c9a24a','#3a2a2a','#7a3a32']},
 opera:{ext:'street',floors:['wood','carpetRed','wood'],hall:'stage',wall:['#4a1a1e','#5a2226','#240c0e'],pat:'gilded',cap:'#180608',edge:'#c9a24a',deco:'stage',fcol:['#5a1a1e','#c9a24a','#2a1a1a','#6a3a2a']},
 museum:{ext:'street',floors:['marble','wood','marble'],hall:'marbleDark',wall:['#9a9282','#a8a090','#4f4a40'],pat:'columns',cap:'#2f2b24',edge:'#6e675a',deco:'mosaic',fcol:['#6e675a','#8a6a3a','#4a4a5a','#5a4a3a']},
 office:{ext:'street',floors:['carpetGrey','lino','carpetGrey'],hall:'carpetGrey',wall:['#9aa4ad','#aab4bc','#4a535c'],pat:'glass',cap:'#2a3036',edge:'#6a747c',deco:'none',fcol:['#55606a','#8a949c','#3e464e','#c9d0d6']},
 tvstudio:{ext:'street',floors:['concrete','lino','carpetGrey'],hall:'studio',wall:['#2a2c31','#34373d','#141518'],pat:'acoustic',cap:'#0c0d0f',edge:'#4a4e56',deco:'tape',fcol:['#2a2c31','#4a4e56','#7a2a2a','#3a5a7a']},
 casino:{ext:'street',floors:['carpetCasino','wood','carpetCasino'],hall:'carpetCasino',wall:['#1f3328','#26402f','#0f1a14'],pat:'gilded',cap:'#08100b',edge:'#c9a24a',deco:'casino',fcol:['#1f3328','#6a1a1a','#c9a24a','#2a2a2a']}
};
// ---------- furniture ----------
const CONTAINER=new Set(['cabinet','drawers','desk','shelf','crate','locker','safe','trunk','barrel','vanity','display','filing','medcart','console']);
const FSIZE={cabinet:[1,78],drawers:[1,48],desk:[2,40],shelf:[2,92],crate:[1,34],locker:[1,92],safe:[1,46],trunk:[1,34],barrel:[1,46],vanity:[2,62],display:[2,48],filing:[1,70],medcart:[1,44],console:[2,42],
 bed:[2,30],sofa:[2,34],table:[2,32],plant:[1,58],stove:[1,44],fridge:[1,86],fireplace:[2,70],piano:[2,52],bunk:[2,70],cage:[2,62],rack:[2,66],hay:[1,30],slot:[1,74],cardtable:[2,30],bar:[3,44],camera:[1,66],lightstand:[1,90],plinth:[1,70],copier:[1,50],cooler:[1,64],server:[1,90],opbed:[2,36],altar:[2,40],lounger:[2,22],easel:[1,78],clothes:[2,40],bench:[2,26]};
const CNAME={cabinet:['cabinet','armário'],drawers:['chest of drawers','cômoda'],desk:['desk','escrivaninha'],shelf:['bookshelf','estante'],crate:['crate','caixote'],locker:['locker','armário de metal'],safe:['small safe','cofre pequeno'],trunk:['travel trunk','baú'],barrel:['barrel','barril'],vanity:['dressing table','penteadeira'],display:['display case','vitrine'],filing:['filing cabinet','arquivo'],medcart:['medicine cart','carrinho de remédios'],console:['control console','mesa de controle'],
 bed:['bed','cama'],sofa:['sofa','sofá'],table:['table','mesa'],plant:['plant','vaso'],stove:['stove','fogão'],fridge:['fridge','geladeira'],fireplace:['fireplace','lareira'],piano:['piano','piano'],bunk:['bunk bed','beliche'],cage:['cage','jaula'],rack:['costume rack','arara de figurinos'],hay:['hay bale','fardo de feno'],slot:['slot machine','caça-níquel'],cardtable:['card table','mesa de jogo'],bar:['bar counter','balcão do bar'],camera:['TV camera','câmera de TV'],lightstand:['spotlight','refletor'],plinth:['statue','estátua'],copier:['copier','copiadora'],cooler:['water cooler','bebedouro'],server:['server rack','rack de servidores'],opbed:['operating table','mesa cirúrgica'],altar:['altar','altar'],lounger:['deck chair','espreguiçadeira'],easel:['easel','cavalete'],clothes:['laundry basket','cesto de roupas'],bench:['bench','banco']};
const ROOMFURN=[
 [/kitchen|galley|staff kitchen/i,['stove','fridge','cabinet','drawers','table']],
 [/cafeteria|café|food stand/i,['table','table','cabinet','crate','fridge']],
 [/bedroom|guest room|suite|room 12/i,['bed','drawers','vanity','cabinet','plant']],
 [/crew quarters|servants/i,['bunk','locker','trunk','drawers']],
 [/cabin corridor/i,['trunk','locker','bench','plant']],
 [/library|archive|records/i,['shelf','shelf','filing','desk','table']],
 [/study|office|manager|director|principal|ceo|hr |legal|producer|purser|loan|caravan/i,['desk','filing','shelf','cabinet','plant','sofa']],
 [/ballroom|foyer|reception|lobby/i,['sofa','plant','table','cabinet','drawers','piano']],
 [/boardroom/i,['table','table','cabinet','plant','filing']],
 [/laboratory|science lab|pharmacy|radiology/i,['medcart','cabinet','table','drawers','shelf']],
 [/server|it room|computer lab|cable/i,['server','server','console','desk','cabinet']],
 [/ward|emergency/i,['bed','bed','medcart','cabinet','locker']],
 [/operating/i,['opbed','medcart','cabinet','locker']],
 [/morgue/i,['filing','cabinet','medcart','desk']],
 [/laundry/i,['clothes','clothes','cabinet','crate']],
 [/wine cellar|cellar/i,['barrel','barrel','crate','shelf']],
 [/storage|luggage|loading|prop room|janitor|service elevator/i,['crate','crate','trunk','shelf','barrel']],
 [/chapel/i,['altar','bench','bench','cabinet','plant']],
 [/conservatory|rooftop|terrace|pool deck|deck a|lifeboat/i,['plant','plant','lounger','crate','locker']],
 [/billiard/i,['cardtable','shelf','cabinet','sofa']],
 [/main floor|vip|high-roller|casino lounge/i,['cardtable','slot','slot','drawers','sofa']],
 [/\bbar\b/i,['bar','cabinet','table','crate']],
 [/vault|safe deposit|counting|cashier|treasury/i,['safe','safe','cabinet','desk','drawers']],
 [/security|control room|lighting booth|bridge|editing/i,['console','desk','locker','filing','cabinet']],
 [/studio a|studio b|main stage|newsroom/i,['camera','lightstand','console','crate','desk']],
 [/makeup|dressing|green room|wardrobe|costume/i,['vanity','rack','trunk','sofa','drawers']],
 [/animal wagons/i,['cage','cage','hay','barrel','crate']],
 [/clown wagon/i,['trunk','vanity','rack','barrel']],
 [/strongman/i,['barrel','crate','trunk','bench']],
 [/trapeze|fly gallery/i,['crate','trunk','rack','barrel']],
 [/mirror maze/i,['vanity','display','cabinet','plant']],
 [/music|orchestra|rehearsal|auditorium/i,['piano','shelf','cabinet','bench']],
 [/ticket booth/i,['desk','drawers','safe']],
 [/big top ring/i,['hay','barrel','crate','bench']],
 [/gym/i,['locker','locker','bench','crate']],
 [/art room|restoration|chip workshop/i,['easel','table','cabinet','drawers','crate']],
 [/classroom/i,['desk','desk','shelf','cabinet']],
 [/staff room/i,['sofa','cabinet','table','drawers','cooler']],
 [/wing|gallery|dinosaur|main hall/i,['display','display','plinth','cabinet']],
 [/gift shop/i,['display','shelf','drawers','plant']],
 [/engine room/i,['barrel','crate','locker','cabinet']],
 [/spa/i,['lounger','plant','cabinet','drawers']],
 [/box five/i,['sofa','drawers','table','plant']],
 [/print room/i,['copier','cabinet','shelf','filing']],
 [/open office/i,['desk','desk','filing','plant','cooler']],
 [/security desk/i,['console','desk','filing']]
];
const HALLFURN={manor:['fireplace','sofa','plant'],hospital:['bench','plant','cooler'],school:['locker','locker','bench'],cruise:['bench','plant','lounger'],circus:['hay','bench','barrel'],bank:['plant','bench','table'],hotel:['sofa','plant','plant'],opera:['plant','sofa','bench'],museum:['plinth','plinth','bench'],office:['plant','cooler','sofa'],tvstudio:['lightstand','camera','crate'],casino:['slot','slot','cardtable']};
function furnFor(name,loc){for(const[re,l]of ROOMFURN)if(re.test(name))return l;return['cabinet','drawers','desk','table','plant']}

// ---------- map build ----------
function buildMap(c){const r=rng(c.n*7717+1);const L=LAYOUTS[c.loc]||LAYOUTS.manor;const g=L.g;const GR=g.length,GC=g[0].length;
 const cw=[],ch=[];for(let x=0;x<GC;x++){const isH=g.every(row=>row[x]==='H');cw.push(L.hc&&isH?L.hc[0]+Math.floor(r()*(L.hc[1]-L.hc[0]+1)):L.cw[0]+Math.floor(r()*(L.cw[1]-L.cw[0]+1)))}
 for(let y=0;y<GR;y++){const isH=[...g[y]].every(ch2=>ch2==='H');ch.push(L.hr&&isH?L.hr[0]+Math.floor(r()*(L.hr[1]-L.hr[0]+1)):L.ch[0]+Math.floor(r()*(L.ch[1]-L.ch[0]+1)))}
 const M=2;const ox=[M],oy=[M];for(let x=1;x<=GC;x++)ox.push(ox[x-1]+cw[x-1]);for(let y=1;y<=GR;y++)oy.push(oy[y-1]+ch[y-1]);
 const MW=ox[GC]+M,MH=oy[GR]+M;const tiles=new Uint8Array(MW*MH).fill(3);const roomId=new Int8Array(MW*MH).fill(-1);
 const set=(x,y,v,id)=>{tiles[y*MW+x]=v;if(id!==undefined)roomId[y*MW+x]=id};
 // room ids per cell
 const letters=[];g.forEach(row=>[...row].forEach(ch2=>{if(/[A-M]/.test(ch2)&&ch2!=='H'&&!letters.includes(ch2))letters.push(ch2)}));
 const order=shuffle(r,letters);const names=c.map.rooms;const idOfLetter={};order.forEach((l,i)=>idOfLetter[l]=i);
 const cellId=(x,y)=>{const ch2=g[y]&&g[y][x];if(!ch2||ch2==='.')return null;return ch2==='H'?12:idOfLetter[ch2]};
 const rooms=[];for(let i=0;i<12;i++)rooms.push({id:i,name:names[i],rects:[]});const hall={id:12,name:'hall',rects:[]};rooms.push(hall);
 for(let y=0;y<GR;y++)for(let x=0;x<GC;x++){const id=cellId(x,y);if(id===null)continue;
  for(let ty=oy[y];ty<oy[y+1];ty++)for(let tx=ox[x];tx<ox[x+1];tx++)set(tx,ty,2);
  const rc={x0:ox[x]+1,y0:oy[y]+1,x1:ox[x+1]-2,y1:oy[y+1]-2,gx:x,gy:y};
  if(id!==12){const ri=n=>Math.floor(r()*(n+1));let l=ri(2),rr=ri(2),t=ri(1),b=ri(2);while(rc.x1-rc.x0+1-l-rr<8&&(l||rr)){if(l)l--;else rr--}while(rc.y1-rc.y0+1-t-b<6&&(t||b)){if(b)b--;else t--}rc.x0+=l;rc.x1-=rr;rc.y0+=t;rc.y1-=b}
  rooms[id].rects.push(rc);
  for(let ty=rc.y0;ty<=rc.y1;ty++)for(let tx=rc.x0;tx<=rc.x1;tx++)set(tx,ty,1,id)}
 // merge adjacent hall cells (open the double wall)
 for(let y=0;y<GR;y++)for(let x=0;x<GC;x++){if(cellId(x,y)!==12)continue;
  if(cellId(x+1,y)===12){for(let ty=oy[y]+1;ty<=oy[y+1]-2;ty++){set(ox[x+1]-1,ty,1,12);set(ox[x+1],ty,1,12)}}
  if(cellId(x,y+1)===12){for(let tx=ox[x]+1;tx<=ox[x+1]-2;tx++){set(tx,oy[y+1]-1,1,12);set(tx,oy[y+1],1,12)}}
  if(cellId(x+1,y)===12&&cellId(x,y+1)===12&&cellId(x+1,y+1)===12){for(let k=-1;k<=0;k++)for(let j=-1;j<=0;j++)set(ox[x+1]+k,oy[y+1]+j,1,12)}}
 rooms.forEach(rm=>{const xs=rm.rects;rm.x0=Math.min(...xs.map(q=>q.x0));rm.y0=Math.min(...xs.map(q=>q.y0));rm.x1=Math.max(...xs.map(q=>q.x1));rm.y1=Math.max(...xs.map(q=>q.y1));
  const big=xs.slice().sort((a,b)=>(b.x1-b.x0)*(b.y1-b.y0)-(a.x1-a.x0)*(a.y1-a.y0))[0];rm.main=big;rm.cx=((big.x0+big.x1+1)/2)*T;rm.cy=((big.y0+big.y1+1)/2)*T});
 // doors between adjacent cells of different rooms
 const edges=[];for(let y=0;y<GR;y++)for(let x=0;x<GC;x++){const a=cellId(x,y);if(a===null)continue;const R2=cellId(x+1,y),D=cellId(x,y+1);if(R2!==null&&R2!==a)edges.push({x,y,dir:'r',a,b:R2});if(D!==null&&D!==a)edges.push({x,y,dir:'d',a,b:D})}
 const par=[...Array(13).keys()];const f=x=>par[x]===x?x:(par[x]=f(par[x]));const use=new Set();const sh=shuffle(r,edges);
 sh.forEach(e=>{if((e.a===12||e.b===12)&&r()<.8){use.add(e);par[f(e.a)]=f(e.b)}});
 sh.forEach(e=>{if(f(e.a)!==f(e.b)){use.add(e);par[f(e.a)]=f(e.b)}});
 sh.forEach(e=>{if(!use.has(e)&&r()<.18)use.add(e)});
 const doors=[];const rectAt=(x,y)=>{const id=cellId(x,y);return rooms[id].rects.find(q=>q.gx===x&&q.gy===y)};
 use.forEach(e=>{const A=rectAt(e.x,e.y),B=e.dir==='r'?rectAt(e.x+1,e.y):rectAt(e.x,e.y+1);const rid=e.a===12?12:e.b===12?12:e.a;
  if(e.dir==='r'){const lo=Math.max(A.y0,B.y0)+1,hi=Math.min(A.y1,B.y1)-2;const yy=lo+Math.floor(r()*Math.max(1,hi-lo+1));for(let k=0;k<2;k++)for(let tx=A.x1+1;tx<B.x0;tx++)set(tx,yy+k,1,rid);doors.push({x:Math.round((A.x1+B.x0)/2),y:yy+1,v:true})}
  else{const lo=Math.max(A.x0,B.x0)+1,hi=Math.min(A.x1,B.x1)-2;const xx=lo+Math.floor(r()*Math.max(1,hi-lo+1));for(let k=0;k<2;k++)for(let ty=A.y1+1;ty<B.y0;ty++)set(xx+k,ty,1,rid);doors.push({x:xx+1,y:Math.round((A.y1+B.y0)/2),v:false})}});
 // board in the most central hall cell
 const hc=hall.rects.slice().sort((a,b)=>{const ca=Math.abs((a.gx+.5)-GC/2)+Math.abs((a.gy+.5)-GR/2),cb=Math.abs((b.gx+.5)-GC/2)+Math.abs((b.gy+.5)-GR/2);return ca-cb})[0];
 const blocked=new Uint8Array(MW*MH);
 const bx=Math.floor((hc.x0+hc.x1)/2)-1,by=hc.y0+Math.max(2,Math.floor((hc.y1-hc.y0)/2)-1);for(let k=0;k<4;k++)blocked[by*MW+bx+k]=1;
 const board={x:bx*T,y:by*T,w:4*T,tx:bx,ty:by};hall.cx=(bx+2)*T;hall.cy=(by+2)*T;
 // furniture along walls
 const furn=[];const st=STYLE[c.loc]||STYLE.manor;
 const doorNear=(x,y)=>doors.some(d=>Math.abs(d.x-x)<=2&&Math.abs(d.y-y)<=2);
 const nearBoard=(x,y)=>x>=bx-2&&x<=bx+5&&y>=by-2&&y<=by+3;
 const place=(rm,rc,types,n,minCont)=>{let tries=0,placed=0,cont=0;const list=types.slice();
  while(placed<n&&tries<90){tries++;let ty=cont<minCont?(list.find(t=>CONTAINER.has(t))||pick(r,list)):pick(r,list);const [w]=FSIZE[ty];const side=Math.floor(r()*3);let x,y;
   if(side===0){y=rc.y0;x=rc.x0+Math.floor(r()*Math.max(1,rc.x1-rc.x0-w+2))}else if(side===1){x=rc.x0;y=rc.y0+1+Math.floor(r()*Math.max(1,rc.y1-rc.y0-1))}else{x=rc.x1-w+1;y=rc.y0+1+Math.floor(r()*Math.max(1,rc.y1-rc.y0-1))}
   let ok=true;for(let k=0;k<w;k++){const i=y*MW+x+k;if(x+k>rc.x1||tiles[i]!==1||blocked[i]||doorNear(x+k,y)||nearBoard(x+k,y))ok=false;for(const[dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){const j=(y+dy)*MW+x+k+dx;if(blocked[j])ok=false}}
   if(!ok)continue;for(let k=0;k<w;k++)blocked[y*MW+x+k]=1;if(CONTAINER.has(ty)){cont++;const ix=list.indexOf(ty);if(ix>=0&&cont<=minCont)list.splice(ix,1),list.push(ty)}
   furn.push({type:ty,x,y,w,h:FSIZE[ty][1],room:rm.id,open:0,openT:0,searched:false,clue:null,col:pick(r,st.fcol)});placed++}};
 const center=(rm,rc,types,n)=>{const deco=types.filter(t=>!CONTAINER.has(t)&&t!=='plant'&&t!=='fridge'&&t!=='stove'&&t!=='fireplace');if(!deco.length)return;let tries=0,placed=0;
  while(placed<n&&tries<40){tries++;const ty=pick(r,deco);const [w]=FSIZE[ty];const x=rc.x0+2+Math.floor(r()*Math.max(1,rc.x1-rc.x0-3-w)),y=rc.y0+2+Math.floor(r()*Math.max(1,rc.y1-rc.y0-3));
   let ok=true;for(let k=-1;k<=w;k++)for(let j=-1;j<=1;j++){const i=(y+j)*MW+x+k;if(tiles[i]!==1||blocked[i]||doorNear(x+k,y+j)||nearBoard(x+k,y+j))ok=false}if(!ok)continue;
   for(let k=0;k<w;k++)blocked[y*MW+x+k]=1;furn.push({type:ty,x,y,w,h:FSIZE[ty][1],room:rm.id,open:0,openT:0,searched:false,clue:null,col:pick(r,st.fcol)});placed++}};
 rooms.forEach(rm=>{if(rm.id===12)return;const types=furnFor(rm.name,c.loc);const rc=rm.main;const area=(rc.x1-rc.x0)*(rc.y1-rc.y0);place(rm,rc,types,area>70?6:5,2);center(rm,rc,types,area>70?2:1);
  let lt=0;while(lt<30){lt++;const x=rc.x0+1+Math.floor(r()*(rc.x1-rc.x0-1)),y=rc.y0+1+Math.floor(r()*(rc.y1-rc.y0-1));if(!blocked[y*MW+x]){rm.lamp={x:(x+.5)*T,y:(y+.5)*T};break}}});
 hall.rects.forEach(rc=>place(hall,rc,HALLFURN[c.loc]||['plant'],(rc.y1-rc.y0)<6?1:2,0));
 const lamps=[];rooms.forEach(rm=>{if(rm.lamp)lamps.push({x:rm.lamp.x,y:rm.lamp.y,R:300})});hall.rects.forEach(rc=>lamps.push({x:((rc.x0+rc.x1+1)/2)*T,y:((rc.y0+rc.y1+1)/2)*T,R:Math.max(300,Math.min(460,(rc.x1-rc.x0)*T*.7))}));
 hall.lamp={x:hall.cx,y:hall.cy};
 return{tiles,roomId,rooms,doors,furn,blocked,board,r,MW,MH,lamps,style:st,loc:c.loc,grid:{ox,oy,g}}}

// ---------- floor patterns ----------
function noiseCanvas(base,seed,dots,alpha,sz=192){const cv=document.createElement('canvas');cv.width=cv.height=sz;const g=cv.getContext('2d');g.fillStyle=base;g.fillRect(0,0,sz,sz);const r=rng(seed);
 for(let i=0;i<dots;i++){g.fillStyle=r()<.5?`rgba(0,0,0,${alpha*r()})`:`rgba(255,240,210,${alpha*.6*r()})`;g.fillRect(r()*sz,r()*sz,1+r()*2.5,1+r()*2)}return cv}
const FLOORBASE={wood:'#6b4a33',parquet:'#7a5236',carpet:'#5a2a30',checker:'#d8d0c0',lino:'#b8c4b8',linoGreen:'#8fb0a2',linoBlue:'#9aaab8',tile:'#d4dcd8',carpetBlue:'#24405a',deck:'#a77a4a',sawdust:'#c9a46a',canvas:'#d8c8a0',ring:'#c9a46a',marble:'#ddd8cc',marbleDark:'#8a8478',carpetGrey:'#5d646b',carpetRed:'#7a1e26',stage:'#5a3a22',concrete:'#5a5c60',studio:'#26282c',carpetCasino:'#5a1420'};
function paintFloor(g,type,x,y,w,h,seed){const base=FLOORBASE[type]||'#5a4a3a';const r=rng(seed);
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();
 g.fillStyle=g.createPattern(noiseCanvas(base,seed,type.startsWith('carpet')?2200:1200,type.startsWith('marble')||type==='checker'||type==='tile'?.08:.2),'repeat');g.fillRect(x,y,w,h);
 const line=(x1,y1,x2,y2)=>{g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
 if(type==='wood'||type==='deck'||type==='stage'){const pw=type==='deck'?16:24;g.strokeStyle=type==='deck'?'rgba(30,18,8,.55)':'rgba(0,0,0,.28)';g.lineWidth=type==='deck'?2:2;for(let yy=y;yy<y+h;yy+=pw){line(x,yy,x+w,yy);for(let xx=x+((yy/pw|0)%3)*40;xx<x+w;xx+=120)line(xx,yy,xx,yy+pw)}
  if(type==='deck'){g.fillStyle='rgba(0,0,0,.35)';for(let yy=y;yy<y+h;yy+=pw)for(let xx=x+((yy/pw|0)%2)*60;xx<x+w;xx+=120){g.fillRect(xx+3,yy+5,2,2);g.fillRect(xx+3,yy+pw-7,2,2)}}}
 else if(type==='parquet'){g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;for(let yy=y;yy<y+h;yy+=24)for(let xx=x;xx<x+w;xx+=48){const o=((yy/24|0)%2)*24;g.strokeRect(xx+o,yy,24,24);line(xx+o+(((xx/48|0)%2)?0:12),yy,xx+o+(((xx/48|0)%2)?0:12),yy+24)}}
 else if(type==='checker'||type==='marble'||type==='marbleDark'){const s=type==='checker'?T:T*2;for(let yy=y;yy<y+h;yy+=s)for(let xx=x;xx<x+w;xx+=s){if(((xx/s|0)+(yy/s|0))%2){g.fillStyle=type==='checker'?'rgba(20,14,16,.75)':'rgba(0,0,0,.08)';g.fillRect(xx,yy,s,s)}}
  if(type!=='checker'){g.strokeStyle='rgba(120,110,95,.35)';g.lineWidth=1.2;for(let k=0;k<w*h/9000;k++){let px=x+r()*w,py=y+r()*h;g.beginPath();g.moveTo(px,py);for(let s2=0;s2<5;s2++){px+=(r()-.3)*40;py+=(r()-.5)*30;g.lineTo(px,py)}g.stroke()}g.strokeStyle='rgba(0,0,0,.12)';for(let yy=y;yy<y+h;yy+=s)line(x,yy,x+w,yy);for(let xx=x;xx<x+w;xx+=s)line(xx,y,xx,y+h)}}
 else if(type==='lino'||type==='linoGreen'||type==='linoBlue'||type==='tile'){const s=type==='tile'?T/2:T;g.strokeStyle='rgba(0,0,0,.14)';g.lineWidth=1.5;for(let yy=y;yy<y+h;yy+=s)line(x,yy,x+w,yy);for(let xx=x;xx<x+w;xx+=s)line(xx,y,xx,y+h);
  if(type!=='tile'){g.fillStyle='rgba(255,255,255,.07)';for(let yy=y;yy<y+h;yy+=s)for(let xx=x;xx<x+w;xx+=s)if(r()<.25)g.fillRect(xx+2,yy+2,s-4,s-4)}}
 else if(type.startsWith('carpet')){g.strokeStyle='rgba(255,230,180,.08)';g.lineWidth=2;const s=type==='carpetCasino'?40:56;
  if(type==='carpetCasino'){g.strokeStyle='rgba(201,162,74,.28)';for(let yy=y-s;yy<y+h+s;yy+=s)for(let xx=x-s;xx<x+w+s;xx+=s){g.beginPath();g.moveTo(xx+s/2,yy);g.lineTo(xx+s,yy+s/2);g.lineTo(xx+s/2,yy+s);g.lineTo(xx,yy+s/2);g.closePath();g.stroke();g.fillStyle='rgba(20,60,40,.35)';g.beginPath();g.arc(xx+s/2,yy+s/2,4,0,7);g.fill()}}
  else for(let yy=y;yy<y+h;yy+=s)for(let xx=x;xx<x+w;xx+=s){g.beginPath();g.arc(xx+s/2,yy+s/2,6,0,7);g.stroke()}}
 else if(type==='sawdust'||type==='ring'){g.fillStyle='rgba(120,80,30,.25)';for(let k=0;k<w*h/120;k++)g.fillRect(x+r()*w,y+r()*h,2+r()*3,1)}
 else if(type==='canvas'){for(let xx=x;xx<x+w;xx+=T){if((xx/T|0)%2){g.fillStyle='rgba(184,40,46,.25)';g.fillRect(xx,y,T,h)}}}
 else if(type==='concrete'||type==='studio'){g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.5;for(let yy=y;yy<y+h;yy+=T*3)line(x,yy,x+w,yy);for(let xx=x;xx<x+w;xx+=T*3)line(xx,y,xx,y+h);g.strokeStyle='rgba(0,0,0,.3)';for(let k=0;k<6;k++){let px=x+r()*w,py=y+r()*h;g.beginPath();g.moveTo(px,py);for(let s2=0;s2<4;s2++){px+=(r()-.5)*50;py+=(r()-.5)*50;g.lineTo(px,py)}g.stroke()}}
 g.restore()}
function paintExterior(g,st,MW,MH,tiles,seed){const ext=st.ext;const base={garden:'#1d2a18',street:'#1c1c1f',water:'#0c2a3a',grass:'#24361c',yard:'#3a2e28'}[ext];g.fillStyle=g.createPattern(noiseCanvas(base,seed+3,1600,.25),'repeat');
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(tiles[y*MW+x]===3)g.fillRect(x*T,y*T,T,T);
 const r=rng(seed+9);g.save();
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(tiles[y*MW+x]!==3)continue;const px=x*T,py=y*T;
  if(ext==='water'){g.strokeStyle='rgba(140,200,220,.18)';g.lineWidth=2;if(r()<.35){g.beginPath();g.arc(px+r()*T,py+r()*T,8+r()*8,Math.PI*1.1,Math.PI*1.9);g.stroke()}}
  else if(ext==='garden'||ext==='grass'){if(r()<.12){g.fillStyle='rgba(40,70,30,.9)';g.beginPath();g.arc(px+T/2,py+T/2,14+r()*10,0,7);g.fill();g.strokeStyle=INK;g.lineWidth=2;g.stroke()}else if(r()<.25){g.fillStyle='rgba(90,130,60,.35)';for(let k=0;k<5;k++)g.fillRect(px+r()*T,py+r()*T,2,6)}}
  else if(ext==='street'){if(y%6===0&&x%3===0){g.fillStyle='rgba(230,200,90,.25)';g.fillRect(px+8,py+T/2-2,T-16,4)}}
  else if(ext==='yard'){g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=1.5;g.strokeRect(px+((y%2)*T/2),py,T,T/2);g.strokeRect(px+((y%2)*T/2),py+T/2,T,T/2)}}
 g.restore()}
function hallDeco(g,map,st){const hall=map.rooms[12];const r=rng(map.loc.length*13);const centerDeco=['rug','seal','mosaic','ring','stage','casino'].includes(st.deco);
 const bt=map.board;const mainRc=hall.rects.find(q=>bt.tx>=q.x0&&bt.tx<=q.x1&&bt.ty>=q.y0&&bt.ty<=q.y1)||hall.rects[0];
 (centerDeco?[mainRc]:hall.rects).forEach((rc,ri)=>{const x=rc.x0*T,y=rc.y0*T,w=(rc.x1-rc.x0+1)*T,h=(rc.y1-rc.y0+1)*T,cx=x+w/2,cy=y+h/2;g.save();
  if(st.deco==='rug'){g.fillStyle='#34161a';g.beginPath();g.roundRect(x+T*1.5,y+T*2.5,w-T*3,h-T*4,24);g.fill();g.strokeStyle='rgba(253,235,188,.35)';g.lineWidth=4;g.beginPath();g.roundRect(x+T*1.5+14,y+T*2.5+14,w-T*3-28,h-T*4-28,14);g.stroke()}
  else if(st.deco==='cross'){g.strokeStyle='rgba(40,120,90,.35)';g.lineWidth=10;g.beginPath();g.moveTo(x,cy);g.lineTo(x+w,cy);g.stroke();g.fillStyle='rgba(200,40,40,.35)';g.fillRect(cx-10,cy-30,20,60);g.fillRect(cx-30,cy-10,60,20)}
  else if(st.deco==='lines'){g.strokeStyle='rgba(30,60,120,.35)';g.lineWidth=6;g.beginPath();g.moveTo(cx,y);g.lineTo(cx,y+h);g.stroke();g.setLineDash([18,14]);g.strokeStyle='rgba(250,240,200,.25)';g.beginPath();g.moveTo(cx+14,y);g.lineTo(cx+14,y+h);g.stroke();g.setLineDash([])}
  else if(st.deco==='lifebuoy'){g.strokeStyle='rgba(40,60,90,.55)';g.lineWidth=4;g.strokeRect(x+10,y+10,w-20,h-20);for(let k=0;k<3;k++){const lx=x+w*(.2+k*.3),ly=y+h-26;g.lineWidth=9;g.strokeStyle='#d8392f';g.beginPath();g.arc(lx,ly,13,0,7);g.stroke();g.strokeStyle='#f2ecdc';g.setLineDash([7,7]);g.beginPath();g.arc(lx,ly,13,0,7);g.stroke();g.setLineDash([])}}
  else if(st.deco==='ring'){const R=Math.min(w,h)*.42;const ccx=map.board.x+map.board.w/2,ccy=map.board.y+T*4.2;g.fillStyle='#d8b878';g.beginPath();g.arc(ccx,ccy,R,0,7);g.fill();g.lineWidth=16;g.strokeStyle='#b8282e';g.beginPath();g.arc(ccx,ccy,R,0,7);g.stroke();g.setLineDash([24,24]);g.strokeStyle='#efe3c4';g.stroke();g.setLineDash([]);g.lineWidth=3;g.strokeStyle=INK;g.beginPath();g.arc(ccx,ccy,R+9,0,7);g.stroke();for(let k=0;k<12;k++){g.fillStyle=k%2?'#efe3c4':'#b8282e';g.beginPath();g.moveTo(ccx,ccy);g.arc(ccx,ccy,R*.22,k*Math.PI/6,(k+1)*Math.PI/6);g.fill()}}
  else if(st.deco==='seal'){g.strokeStyle='rgba(120,100,60,.45)';g.lineWidth=5;g.beginPath();g.arc(cx,cy+T,T*1.8,0,7);g.stroke();g.beginPath();g.arc(cx,cy+T,T*1.3,0,7);g.stroke();g.font="900 26px 'MM Title'";g.fillStyle='rgba(120,100,60,.45)';g.textAlign='center';g.fillText('$',cx,cy+T+9)}
  else if(st.deco==='lobby'){g.fillStyle='#4a0e16';g.fillRect(cx-T*1.2,y,T*2.4,h);g.strokeStyle='rgba(201,162,74,.5)';g.lineWidth=3;g.strokeRect(cx-T*1.2+6,y-4,T*2.4-12,h+8)}
  else if(st.deco==='stage'){g.fillStyle='rgba(255,230,160,.12)';g.beginPath();g.ellipse(cx,cy,w*.35,h*.3,0,0,7);g.fill();g.fillStyle='#5a0e14';for(let k=0;k<Math.floor(w/T);k++){g.fillRect(x+k*T,y,T*.5,T*.7)}}
  else if(st.deco==='mosaic'){g.strokeStyle='rgba(60,50,40,.35)';g.lineWidth=4;g.beginPath();g.arc(cx,cy,Math.min(w,h)*.35,0,7);g.stroke();for(let k=0;k<16;k++){g.save();g.translate(cx,cy);g.rotate(k*Math.PI/8);g.fillStyle=k%2?'rgba(140,60,40,.35)':'rgba(40,70,90,.35)';g.fillRect(-6,-Math.min(w,h)*.33,12,30);g.restore()}}
  else if(st.deco==='tape'){g.strokeStyle='rgba(230,200,40,.55)';g.lineWidth=5;g.setLineDash([20,10]);g.strokeRect(x+T,y+T,w-2*T,h-2*T);g.setLineDash([]);g.fillStyle='rgba(230,200,40,.55)';for(let k=0;k<4;k++){g.fillRect(x+T*2+k*T*1.5,y+h-T*1.5,20,5);g.fillRect(x+T*2+k*T*1.5+7.5,y+h-T*1.5-7.5,5,20)}}
  else if(st.deco==='casino'){g.fillStyle='rgba(201,162,74,.12)';g.beginPath();g.ellipse(cx,cy,w*.42,h*.36,0,0,7);g.fill();g.strokeStyle='rgba(201,162,74,.45)';g.lineWidth=3;g.stroke()}
  g.restore()})}
function renderFloor(map,c,RN){const cv=document.createElement('canvas');cv.width=map.MW*T;cv.height=map.MH*T;const g=cv.getContext('2d');const st=map.style;const MW=map.MW,MH=map.MH;
 g.fillStyle='#0b0809';g.fillRect(0,0,cv.width,cv.height);paintExterior(g,st,MW,MH,map.tiles,c.n);
 map.rooms.forEach((rm,i)=>{const type=rm.id===12?st.hall:st.floors[(i+c.n)%st.floors.length];
  g.save();g.beginPath();let minx=1e9,miny=1e9,maxx=0,maxy=0;for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(map.tiles[y*MW+x]===1&&map.roomId[y*MW+x]===rm.id){g.rect(x*T,y*T,T,T);minx=Math.min(minx,x);miny=Math.min(miny,y);maxx=Math.max(maxx,x);maxy=Math.max(maxy,y)}}g.clip();
  paintFloor(g,type,minx*T,miny*T,(maxx-minx+1)*T,(maxy-miny+1)*T,c.n*100+i*7);g.restore();
  if(rm.id!==12&&st.rug&&(i+c.n)%3===0){const rc=rm.main;const rw=Math.min(5,rc.x1-rc.x0-3)*T,rh=Math.min(3.2,rc.y1-rc.y0-3)*T;const rx=rm.cx-rw/2,ry=rm.cy-rh/2;g.fillStyle=st.rug[(i+c.n)%st.rug.length];g.globalAlpha=.8;g.beginPath();g.roundRect(rx,ry,rw,rh,10);g.fill();g.strokeStyle='rgba(253,235,188,.25)';g.lineWidth=3;g.beginPath();g.roundRect(rx+8,ry+8,rw-16,rh-16,6);g.stroke();g.globalAlpha=1}
  if(rm.id!==12){g.save();g.font="900 28px 'MM Title',sans-serif";g.textAlign='center';const lightFloor=/lino|tile|marble|checker|sawdust|canvas|ring/.test(type);g.fillStyle=lightFloor?'rgba(30,20,20,.18)':'rgba(253,235,188,.13)';g.fillText(RN(rm.name).toUpperCase(),rm.cx,rm.main.y1*T+T*.7);g.restore()}});
 // re-paint door tiles with neighbour floor
 hallDeco(g,map,st);
 for(let y=1;y<MH;y++)for(let x=0;x<MW;x++){if(map.tiles[y*MW+x]===1&&map.tiles[(y-1)*MW+x]===2){const gr=g.createLinearGradient(0,y*T,0,y*T+22);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x*T,y*T,T,22)}}
 return cv}

// ---------- walls ----------
function drawWallTile(g,px,py,below,up,lf,rt,st,x,y,WH){const wc=st.wall;
 if(below===1){g.fillStyle=wc[0];g.fillRect(px,py+T-WH,T+.5,WH);const top=py+T-WH;
  switch(st.pat){
   case'wainscot':g.fillStyle=wc[2];g.fillRect(px,py+T-30,T+.5,16);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(px+T/2,py+T-30,2,16);g.fillStyle=wc[1];g.fillRect(px+10,top+8,3,WH-42);g.fillRect(px+30,top+8,3,WH-42);break;
   case'tilehalf':g.fillStyle=wc[1];g.fillRect(px,py+T-30,T+.5,16);g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;for(let k=0;k<4;k++){g.beginPath();g.moveTo(px+k*12,py+T-30);g.lineTo(px+k*12,py+T-14);g.stroke()}g.fillStyle='#2f7a64';g.fillRect(px,py+T-32,T+.5,3);break;
   case'chalk':if(x%5<3){g.fillStyle='#21362b';g.fillRect(px+(x%5===0?6:0),top+8,x%5===2?T-6:T+.5,WH-30);g.strokeStyle='rgba(240,240,230,.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(px+10,top+18+(x%3)*6);g.lineTo(px+T-8,top+22+(x%2)*5);g.stroke()}else{g.fillStyle='#6b7f8f';g.fillRect(px+4,top+6,T-8,WH-22);g.fillStyle='rgba(0,0,0,.35)';for(let k=0;k<3;k++)g.fillRect(px+10,top+12+k*5,T-20,2)}break;
   case'portholes':if(x%3===1){g.fillStyle='#24405a';g.beginPath();g.arc(px+T/2,top+WH*.42,11,0,7);g.fill();g.lineWidth=4;g.strokeStyle='#b8a46a';g.stroke();g.fillStyle='rgba(140,200,230,.35)';g.beginPath();g.arc(px+T/2-3,top+WH*.42-3,4,0,7);g.fill()}g.fillStyle=wc[2];g.fillRect(px,py+T-18,T+.5,4);break;
   case'tentstripes':g.fillStyle=(x%2)?wc[1]:wc[0];g.fillRect(px,top,T+.5,WH);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(px+T-3,top,3,WH);g.fillStyle='#d6a02a';for(let k=0;k<3;k++){g.beginPath();g.moveTo(px+k*16,top);g.lineTo(px+k*16+8,top+10);g.lineTo(px+k*16+16,top);g.fill()}break;
   case'panels':g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=2;g.strokeRect(px+5,top+8,T-10,WH-26);g.fillStyle='rgba(255,255,255,.06)';g.fillRect(px+7,top+10,T-14,6);break;
   case'wallpaper':g.fillStyle=wc[1];for(let k=0;k<3;k++)for(let j=0;j<3;j++){g.beginPath();g.arc(px+8+k*16,top+10+j*12+(k%2)*6,2.2,0,7);g.fill()}g.fillStyle='#c9a24a';g.fillRect(px,py+T-26,T+.5,2);break;
   case'gilded':g.fillStyle='#c9a24a';g.fillRect(px,top+4,T+.5,2);g.fillRect(px,py+T-26,T+.5,2);if(x%4===0){g.fillRect(px+T/2-3,top+6,6,WH-32)}g.fillStyle=wc[1];g.fillRect(px+6,top+12,T-12,WH-42);break;
   case'columns':if(x%3===0){g.fillStyle='#c8c0ae';g.fillRect(px+12,top,T-24,WH-14);g.fillStyle='rgba(0,0,0,.15)';for(let k=0;k<3;k++)g.fillRect(px+16+k*6,top+4,2,WH-22);g.fillStyle='#d8d0be';g.fillRect(px+8,top,T-16,6)}else{g.fillStyle='rgba(0,0,0,.12)';g.fillRect(px,top+WH*.45,T+.5,2)}break;
   case'glass':g.fillStyle='rgba(150,190,210,.55)';g.fillRect(px+3,top+6,T-6,WH-24);g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.moveTo(px+8,top+WH-20);g.lineTo(px+20,top+8);g.lineTo(px+26,top+8);g.lineTo(px+14,top+WH-20);g.fill();g.fillStyle=wc[2];g.fillRect(px,top+WH*.5,T+.5,3);break;
   case'acoustic':g.fillStyle=wc[1];for(let k=0;k<2;k++)for(let j=0;j<2;j++){g.fillRect(px+4+k*22,top+6+j*16,18,13)}g.fillStyle='rgba(0,0,0,.4)';for(let k=0;k<2;k++)for(let j=0;j<2;j++){g.fillRect(px+4+k*22,top+17+j*16,18,2)}break}
  g.fillStyle=wc[2];g.fillRect(px,py+T-14,T+.5,14);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(px,py+T-15,T+.5,2)}
 g.fillStyle=st.cap;g.fillRect(px,py-WH,T+.5,T+.5);g.fillStyle=st.edge;
 if(below===1)g.fillRect(px,py+T-WH-5,T+.5,5);if(up===1||up===3)g.fillRect(px,py-WH,T+.5,4);if(lf===1||lf===3)g.fillRect(px,py-WH,4,T);if(rt===1||rt===3)g.fillRect(px+T-4,py-WH,4,T)}

// ---------- furniture sprites ----------
const fcache={};
function furnSprite(f){const key=f.type+f.col+f.w+(f.open?'o':'c');if(fcache[key])return fcache[key];
 const w=f.w*T,d=T*0.82,H=f.h;const TOP=Math.round(H*.45)+30;const cv=document.createElement('canvas');cv.width=w+40;cv.height=H+d+24+TOP;cv.ox=20;cv.oy=12+TOP;const g=cv.getContext('2d');g.translate(cv.ox,cv.oy);
 const col=f.col,dark=shade(col,.62),light=shade(col,1.25);g.lineJoin='round';g.lineWidth=3;g.strokeStyle=INK;
 const box=(x,y,ww,hh,fill,r=6)=>{g.fillStyle=fill;g.beginPath();g.roundRect(x,y,ww,hh,r);g.fill();g.stroke()};
 const circ=(x,y,rr,fill)=>{g.fillStyle=fill;g.beginPath();g.arc(x,y,rr,0,7);g.fill();g.stroke()};
 const shadow=()=>{g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(w/2,H+d-6,w*.45,8,0,0,7);g.fill()};
 const hole=(x,y,ww,hh)=>{g.fillStyle='#0d0a09';g.fillRect(x,y,ww,hh);g.strokeRect(x,y,ww,hh)};
 const t=f.type;const op=f.open;
 const cabinetBody=(doors,knob='#d6b06a')=>{box(0,0,w,d,light,6);box(0,d-6,w,H,col,6);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(4,d,w-8,6);const fy=d,fh=H-10;
  for(let k=0;k<doors;k++){const dx=6+k*(w-12)/doors,dw=(w-12)/doors-4;if(op){hole(dx,fy+4,dw,fh-6);g.fillStyle=light;g.beginPath();g.moveTo(dx,fy+4);g.lineTo(dx-10,fy+10);g.lineTo(dx-10,fy+fh);g.lineTo(dx,fy+fh-2);g.closePath();g.fill();g.stroke()}else{box(dx,fy+4,dw,fh-6,shade(col,1.08),4);circ(dx+dw-8,fy+fh/2,3.5,knob)}}};
 const drawersBody=(rows)=>{box(0,0,w,d,light,6);box(0,d-6,w,H,col,6);const fy=d,fh=H-10;for(let k=0;k<rows;k++){const dy=fy+4+k*(fh-6)/rows,dh=(fh-6)/rows-3;if(op&&k===0){box(4,dy+6,w-8,dh,'#0d0a09',3);box(2,dy+dh-2,w-4,10,light,3)}else{box(6,dy,w-12,dh,shade(col,1.08),3);g.fillStyle='#d6b06a';g.fillRect(w/2-6,dy+dh/2-2,12,4)}}};
 switch(t){
 case'plant':shadow();box(w/2-14,H+d-34,28,28,'#7a4a2a',5);g.fillStyle='#2f5a3a';for(let k=0;k<7;k++){g.beginPath();g.ellipse(w/2+Math.cos(k)*12,H+d-48-Math.sin(k*2)*10-k*2,12,20,k,0,7);g.fill();g.stroke()}break;
 case'bed':box(0,d*.2,w,H+d*.8,'#e8e0cf',10);box(4,d*.2,w*.28,H+d*.5,'#fbf5e6',8);box(w*.32,d*.2+6,w*.68-4,H+d*.8-10,col,8);break;
 case'opbed':shadow();g.fillStyle='#8a9a96';g.fillRect(w/2-6,d,12,H);g.strokeRect(w/2-6,d,12,H);box(0,0,w,d+8,'#cfe0da',6);box(w*.08,4,w*.84,d,'#6fa898',4);circ(w*.8,-18,14,'#e8f0ec');g.fillStyle='rgba(255,255,220,.6)';g.beginPath();g.arc(w*.8,-18,8,0,7);g.fill();break;
 case'bunk':box(0,0,w,d,light,4);g.fillStyle=dark;g.fillRect(2,d,8,H);g.fillRect(w-10,d,8,H);g.strokeRect(2,d,8,H);g.strokeRect(w-10,d,8,H);box(6,d+6,w-12,18,'#e8e0cf',4);box(6,d+H*.55,w-12,18,'#e8e0cf',4);box(10,d+H*.55-4,w*.3,10,col,3);break;
 case'sofa':box(0,0,w,H*0.9,dark,12);box(0,H*.5,w,H*.5+d*.5,col,10);box(-2,H*.25,14,H*.75+d*.5,dark,6);box(w-12,H*.25,14,H*.75+d*.5,dark,6);break;
 case'lounger':box(0,d*.4,w,H+d*.4,'#e6dcc4',6);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=2;for(let k=1;k<6;k++){g.beginPath();g.moveTo(k*w/6,d*.4+4);g.lineTo(k*w/6,H+d*.8-4);g.stroke()}g.strokeStyle=INK;g.lineWidth=3;box(w*.72,d*.1,w*.28,H*.8,col,6);break;
 case'bench':box(0,d*.3,w,d*.5,light,4);g.fillStyle=dark;g.fillRect(6,d*.8,8,H-6);g.fillRect(w-14,d*.8,8,H-6);g.strokeRect(6,d*.8,8,H-6);g.strokeRect(w-14,d*.8,8,H-6);break;
 case'table':case'altar':box(0,0,w,d,t==='altar'?'#e8e0cf':light,6);if(t==='altar'){box(0,d-6,w,H,col,4);circ(w/2,-10,5,'#ffe08a');g.fillStyle='#c9a24a';g.fillRect(w/2-2,-6,4,10);g.fillRect(w*.2,-14,4,14);g.fillRect(w*.8-4,-14,4,14)}else{g.fillStyle=dark;g.fillRect(8,d,8,H);g.fillRect(w-16,d,8,H);g.strokeRect(8,d,8,H);g.strokeRect(w-16,d,8,H);box(w*.3,d*.25,w*.2,d*.4,'#e8e0cf',3)}break;
 case'cardtable':box(0,d*.1,w,d*.9+8,'#5a3a22',14);box(6,d*.1+5,w-12,d*.9-6,'#1f6a3a',12);g.fillStyle='#fbf5e6';for(let k=0;k<4;k++){g.save();g.translate(w*.3+k*14,d*.5);g.rotate(k*.2-.3);g.fillRect(-5,-7,10,14);g.strokeRect(-5,-7,10,14);g.restore()}circ(w*.75,d*.5,6,'#c41f2a');circ(w*.75+10,d*.55,6,'#2a4a9a');g.fillStyle='#3a2416';g.fillRect(10,d+8,8,H-10);g.fillRect(w-18,d+8,8,H-10);break;
 case'stove':box(0,0,w,d,'#3a3a3a',4);circ(w*.3,d*.35,7,'#1a1a1a');circ(w*.7,d*.35,7,'#1a1a1a');circ(w*.3,d*.7,6,'#1a1a1a');box(0,d-6,w,H,'#d8d4cc',4);hole(8,d+6,w-16,H*.5);g.fillStyle='rgba(255,140,40,.35)';g.fillRect(10,d+8,w-20,H*.5-4);break;
 case'fridge':box(0,0,w,d,'#eef0ee',6);box(0,d-6,w,H,'#e2e6e4',6);g.beginPath();g.moveTo(4,d+H*.35);g.lineTo(w-4,d+H*.35);g.stroke();g.fillStyle='#8a8a8a';g.fillRect(w-12,d+10,4,18);g.fillRect(w-12,d+H*.4,4,24);break;
 case'fireplace':box(0,0,w,d,'#8a7a6a',4);box(0,d-6,w,H,'#a89888',4);hole(w*.2,d+H*.3,w*.6,H*.6);g.fillStyle='#ff8a2a';g.beginPath();g.moveTo(w*.3,d+H*.88);g.quadraticCurveTo(w*.4,d+H*.5,w*.5,d+H*.7);g.quadraticCurveTo(w*.6,d+H*.45,w*.7,d+H*.88);g.fill();g.fillStyle='#ffd84a';g.beginPath();g.ellipse(w*.5,d+H*.8,w*.08,H*.1,0,0,7);g.fill();box(-4,d-2,w+8,8,'#6a5a4a',2);break;
 case'piano':box(0,0,w,d+4,'#141012',8);box(0,d-2,w,H,'#1c1618',6);g.fillStyle='#f6f2e8';g.fillRect(6,d+6,w-12,12);g.strokeRect(6,d+6,w-12,12);g.fillStyle='#141012';for(let k=0;k<14;k++)if(k%7!==2&&k%7!==6)g.fillRect(10+k*(w-20)/14,d+6,4,7);g.fillStyle='#3a2a2a';g.fillRect(8,d+22,6,H-24);g.fillRect(w-14,d+22,6,H-24);break;
 case'cage':box(0,0,w,d,'#6a4a2a',4);box(0,d-4,w,H,'rgba(20,14,10,.55)',4);g.strokeStyle='#b89a4a';g.lineWidth=3;for(let k=1;k<10;k++){g.beginPath();g.moveTo(k*w/10,d);g.lineTo(k*w/10,d+H-6);g.stroke()}g.strokeStyle=INK;g.fillStyle='#d6a02a';g.beginPath();g.ellipse(w*.5,d+H*.75,14,9,0,0,7);g.fill();break;
 case'rack':g.fillStyle='#3a3a3a';g.fillRect(4,0,5,H+d-6);g.fillRect(w-9,0,5,H+d-6);g.fillRect(0,4,w,5);['#b8282e','#2a5a8a','#d6a02a','#6a3a8a','#2a7a4a'].forEach((cc,k)=>{const x=10+k*(w-20)/5;box(x,8,(w-20)/5-3,H*.7,cc,4)});break;
 case'hay':box(0,d*.3,w,H+d*.6,'#d8b45a',10);g.strokeStyle='rgba(120,80,20,.6)';g.lineWidth=2;for(let k=0;k<7;k++){g.beginPath();g.moveTo(6+k*6,d*.4);g.lineTo(4+k*6,H+d*.8);g.stroke()}g.strokeStyle='#7a4a1a';g.lineWidth=3;g.beginPath();g.moveTo(0,d*.6+10);g.lineTo(w,d*.6+10);g.stroke();break;
 case'slot':box(0,0,w,d,'#c9a24a',6);box(2,d-6,w-4,H,'#6a1a1a',8);box(8,d+6,w-16,18,'#f6f2e8',3);g.fillStyle='#c41f2a';g.font="900 12px sans-serif";g.fillText('7 7 7',10,d+20);g.fillStyle='#c9a24a';g.fillRect(w-6,d+4,4,22);circ(w-4,d,5,'#c41f2a');break;
 case'bar':box(0,0,w,d,'#3a2416',4);box(0,d-6,w,H,'#5a3622',4);g.fillStyle='#c9a24a';g.fillRect(0,d+H-14,w,4);for(let k=0;k<5;k++){const bx=10+k*(w-20)/5;g.fillStyle=['#2a6a3a','#8a2a2a','#c9a24a','#3a3a6a','#6a4a2a'][k];g.fillRect(bx,-18,8,20);g.strokeRect(bx,-18,8,20)}break;
 case'camera':g.fillStyle='#2a2a2a';g.beginPath();g.moveTo(w/2,d+10);g.lineTo(4,H+d-6);g.moveTo(w/2,d+10);g.lineTo(w-4,H+d-6);g.moveTo(w/2,d+10);g.lineTo(w/2,H+d-4);g.stroke();box(4,0,w-8,d+6,'#3a3a3a',5);circ(w*.5,d*.5,8,'#141414');g.fillStyle='#c41f2a';g.beginPath();g.arc(w-12,8,3,0,7);g.fill();break;
 case'lightstand':g.fillStyle='#2a2a2a';g.fillRect(w/2-2,20,4,H+d-26);g.strokeRect(w/2-2,20,4,H+d-26);box(w/2-14,0,28,24,'#3a3a3a',4);g.fillStyle='rgba(255,240,180,.85)';g.beginPath();g.arc(w/2,12,8,0,7);g.fill();break;
 case'plinth':box(w/2-16,d+H*.35,32,H*.65-6,'#d8d0be',3);box(w/2-20,d+H*.35-6,40,8,'#e8e0cf',2);g.fillStyle='#b8b0a0';g.beginPath();g.ellipse(w/2,d+H*.15-6,10,12,0,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(w/2-12,d+H*.35-6);g.quadraticCurveTo(w/2,d-4,w/2+12,d+H*.35-6);g.fill();g.stroke();break;
 case'copier':box(0,0,w,d,'#d8dcdc',4);box(0,d-6,w,H,'#c4c8c8',4);g.fillStyle='#6a8a9a';g.fillRect(6,d+4,w-12,6);g.fillStyle='#fbf5e6';g.fillRect(8,-6,w-16,10);g.strokeRect(8,-6,w-16,10);break;
 case'cooler':box(w/2-12,d,24,H,'#e6eaea',4);g.fillStyle='rgba(120,180,230,.75)';g.beginPath();g.roundRect(w/2-11,-10,22,d+6,8);g.fill();g.stroke();g.fillStyle='#2a6aa8';g.fillRect(w/2-3,d+10,6,4);break;
 case'server':box(0,0,w,d,'#2a2c31',4);box(0,d-6,w,H,'#1c1d21',4);for(let k=0;k<6;k++){g.fillStyle='#34373d';g.fillRect(5,d+4+k*(H-14)/6,w-10,(H-14)/6-3);g.fillStyle=(k+f.x)%3?'#3aff8a':'#ffb83a';g.fillRect(w-12,d+8+k*(H-14)/6,3,3)}break;
 case'easel':g.fillStyle='#8a5a2a';g.beginPath();g.moveTo(w/2,0);g.lineTo(6,H+d-6);g.lineTo(12,H+d-6);g.lineTo(w/2,8);g.lineTo(w-12,H+d-6);g.lineTo(w-6,H+d-6);g.closePath();g.fill();g.stroke();box(4,10,w-8,H*.55,'#f6f2e8',2);g.fillStyle=col;g.beginPath();g.arc(w/2,10+H*.27,10,0,7);g.fill();break;
 case'clothes':box(4,d*.3,w-8,H+d*.6,'#c9a46a',12);g.fillStyle='#fbf5e6';g.beginPath();g.ellipse(w*.35,d*.35,12,8,0,0,7);g.fill();g.stroke();g.fillStyle='#6a8aaa';g.beginPath();g.ellipse(w*.62,d*.32,14,8,.3,0,7);g.fill();g.stroke();break;
 // ---------- containers ----------
 case'trunk':box(0,d*.2,w,H+d*.6,'#6a3a1e',6);if(op){box(-4,-14,w+8,d*.5,'#7a4a2a',4);hole(5,d*.25,w-10,d*.5)}else{box(-2,d*.1,w+4,d*.45,'#7a4a2a',8)}g.fillStyle='#c9a24a';g.fillRect(4,d*.55,w-8,4);g.fillRect(w/2-4,d*.45,8,10);break;
 case'barrel':box(4,d*.1,w-8,H+d*.7,'#7a4a24',14);g.strokeStyle='#3a3a3a';g.lineWidth=4;[.3,.75].forEach(p=>{g.beginPath();g.moveTo(5,d*.1+(H+d*.7)*p);g.lineTo(w-5,d*.1+(H+d*.7)*p);g.stroke()});g.strokeStyle=INK;g.lineWidth=3;g.fillStyle=op?'#0d0a09':'#8a5a2a';g.beginPath();g.ellipse(w/2,d*.15,w/2-6,9,0,0,7);g.fill();g.stroke();if(op){box(w-12,-12,18,10,'#8a5a2a',4)}break;
 case'vanity':box(w*.1,-H*.15,w*.8,H*.55,'#c9a24a',30);g.fillStyle=op?'#5a6a7a':'#9ab8c8';g.beginPath();g.ellipse(w/2,-H*.15+H*.27,w*.3,H*.22,0,0,7);g.fill();g.stroke();for(let k=0;k<5;k++)circ(w*.15+k*w*.175,-H*.18,4,'#fff6c8');drawersBody(2);break;
 case'display':box(0,d*.3,w,H+d*.2,col,4);g.fillStyle='rgba(170,210,230,.45)';g.beginPath();g.roundRect(4,-H*.4,w-8,H*.4+d*.5,4);g.fill();g.stroke();g.fillStyle='#c9a24a';g.beginPath();g.ellipse(w/2,d*.15,10,7,0,0,7);g.fill();g.stroke();if(op){g.fillStyle='rgba(0,0,0,.4)';g.fillRect(6,-H*.4+3,w-12,10)}break;
 case'filing':drawersBody(4);break;
 case'medcart':box(0,0,w,d,'#e8f0ec',6);box(0,d-6,w,H-8,'#cfe0da',6);g.fillStyle='#c41f2a';g.fillRect(w/2-3,d+4,6,14);g.fillRect(w/2-7,d+8,14,6);if(op)hole(6,d+H*.45,w-12,H*.3);circ(8,H+d-4,5,'#3a3a3a');circ(w-8,H+d-4,5,'#3a3a3a');break;
 case'console':box(0,0,w,d+10,'#2a2c31',6);for(let k=0;k<3;k++){box(8+k*(w-16)/3,-24,(w-16)/3-6,24,'#141518',3);g.fillStyle=['rgba(80,200,255,.6)','rgba(80,255,140,.5)','rgba(255,180,60,.5)'][k];g.fillRect(12+k*(w-16)/3,-20,(w-16)/3-14,16)}for(let k=0;k<12;k++){g.fillStyle=['#c41f2a','#3aff8a','#ffd84a'][k%3];g.fillRect(10+k*(w-20)/12,d*.5,4,4)}box(0,d+4,w,H-8,'#1c1d21',4);if(op)hole(w*.3,d+12,w*.4,H*.4);break;
 case'safe':cabinetBody(1,'#c9a24a');if(!op){circ(w/2,d+H*.45,9,'#c9a24a')}break;
 case'locker':cabinetBody(f.w>1?2:1,'#9aa4ad');if(!op){g.strokeStyle='rgba(0,0,0,.4)';for(let v=0;v<3;v++){g.beginPath();g.moveTo(12,d+14+v*6);g.lineTo(w-12,d+14+v*6);g.stroke()}g.strokeStyle=INK}break;
 case'cabinet':cabinetBody(w>T?2:1);break;
 case'drawers':drawersBody(3);break;
 case'desk':{box(0,0,w,d,light,6);box(0,d-6,w,H,col,6);const fy=d,fh=H-10;const dw=w*.38,dx=w-dw-6;for(let k=0;k<2;k++){const dy=fy+4+k*(fh-6)/2,dh=(fh-6)/2-3;if(op&&k===0){box(dx-2,dy+6,dw+4,dh,'#0d0a09',3);box(dx-4,dy+dh-2,dw+8,10,light,3)}else{box(dx,dy,dw,dh,shade(col,1.08),3);g.fillStyle='#d6b06a';g.fillRect(dx+dw/2-6,dy+dh/2-2,12,4)}}
  g.fillStyle='#0d0a09';g.fillRect(8,fy+6,w*.5,fh-8);box(w*.15,-14,22,16,'#e8e0cf',3);circ(w*.55,-6,8,'#d6b06a');break}
 case'shelf':{box(0,0,w,d,light,6);box(0,d-6,w,H,col,6);const fy=d,fh=H-10;for(let k=0;k<3;k++){const sy=fy+6+k*(fh-8)/3;g.fillStyle='#0d0a09';g.fillRect(6,sy,w-12,(fh-8)/3-4);for(let b=0;b<9;b++){g.fillStyle=['#7a2a2a','#2a4a3a','#c9a24a','#3a3a5a','#8a5a2a'][(b+k)%5];const bw=(w-16)/9;g.fillRect(8+b*bw,sy+4+(b%3)*2,bw-2,(fh-8)/3-10-(b%3)*2)}}if(op){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(6+(w-12)*.3,fy+6,(w-12)*.25,fh/3)}break}
 case'crate':default:{box(0,0,w,d,light,6);box(0,d-6,w,H,col,6);const fy=d,fh=H-10;g.strokeStyle='rgba(0,0,0,.45)';for(let k=1;k<4;k++){g.beginPath();g.moveTo(4,fy+k*fh/4);g.lineTo(w-4,fy+k*fh/4);g.stroke()}g.strokeStyle=INK;if(op){box(-6,-10,w+12,12,light,3);g.fillStyle='#0d0a09';g.fillRect(6,4,w-12,d-10)}}}
 fcache[key]=cv;return cv}

window.MM_WORLD={buildMap,renderFloor,drawWallTile,furnSprite,CONTAINER,CNAME,FSIZE,STYLE,LAYOUTS};
})();
