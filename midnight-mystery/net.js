// Midnight Mystery — online rooms via Supabase Realtime (broadcast + presence)
(function(){
const SB_URL='https://zhdnfcllnknlhijhybjx.supabase.co',SB_KEY='sb_publishable_9AO7TzbmWoPt0SO8U12-Gg_6gjZFycq';
let sb=null,ch=null,room=null,meState=null,peers={};const listeners=new Set();
let id=null;try{id=sessionStorage.getItem('mm_id')}catch(e){}
if(!id){id=Math.random().toString(36).slice(2,10);try{sessionStorage.setItem('mm_id',id)}catch(e){}}
function client(){if(!sb&&window.supabase)sb=window.supabase.createClient(SB_URL,SB_KEY,{realtime:{params:{eventsPerSecond:30}}});return sb}
function code(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<4;i++)s+=A[Math.floor(Math.random()*A.length)];return s}
function emit(kind,arg){listeners.forEach(l=>{try{l[kind]&&l[kind](arg)}catch(e){console.error(e)}})}
function list(){return Object.values(peers).sort((a,b)=>a.at-b.at||(a.id<b.id?-1:1))}
function join(r,state){leave();room=r.toUpperCase();meState={...state,id,at:Date.now()};const c=client();if(!c)return Promise.reject('nolib');
 ch=c.channel('mm-'+room,{config:{broadcast:{self:false,ack:false},presence:{key:id}}});
 ch.on('presence',{event:'sync'},()=>{const s=ch.presenceState();peers={};for(const k in s){const a=s[k];if(a&&a.length)peers[k]=a[a.length-1]}emit('presence',list())});
 ch.on('broadcast',{event:'m'},({payload})=>{if(payload&&payload.from!==id)emit('msg',payload)});
 const my=ch;
 return new Promise((res,rej)=>{let done=false;const to=setTimeout(()=>{if(!done){done=true;rej('timeout')}},9000);
  my.subscribe(async st=>{if(st==='SUBSCRIBED'){if(!done){done=true;clearTimeout(to);try{await my.track(meState)}catch(e){}res()}else{try{await my.track(meState)}catch(e){}}}
   else if((st==='CHANNEL_ERROR'||st==='TIMED_OUT')&&!done){done=true;clearTimeout(to);rej(st)}})})}
let trackT=null;
function update(p){if(!ch||!meState)return;Object.assign(meState,p);peers[id]={...meState};clearTimeout(trackT);trackT=setTimeout(()=>{ch&&ch.track(meState).catch(()=>{})},60)}
function send(t,d){if(!ch)return;ch.send({type:'broadcast',event:'m',payload:{t,d,from:id}}).catch(()=>{})}
function leave(){if(ch){try{ch.untrack();sb.removeChannel(ch)}catch(e){}}ch=null;room=null;peers={};meState=null}
window.MM_NET={id,code,join,update,send,leave,list,listen:l=>{listeners.add(l);return()=>listeners.delete(l)},
 get online(){return !!ch},get room(){return room},get me(){return meState},isHost:()=>{const l=list();return !!l.length&&l[0].id===id}};
})();
