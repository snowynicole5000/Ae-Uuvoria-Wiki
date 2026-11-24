/* ═══════════════════════════════════════════════════════════
   beads.js — THE BEAD WRITER on fulgari-beads.html
   Turns words (or IPA) into Fulgari bead strands.

   How a word becomes beads:
     1. Look it up in data/cmudict.json, a free English
        pronunciation dictionary (about 126,000 words).
        Not there (names, made-up words)? Guess from the spelling.
     2. Pair the sounds up: each consonant takes the vowel after it.
          consonant + vowel  → that SHAPE in that COLOR
          consonant alone    → that shape in clear glass
          vowel alone        → a sphere in that color
          vowel + consonant  → notched bead (when the notch box is on)
     3. Draw them on a string, black beads between words.

   The tables to change if the language changes:
     CONS  — consonant → shape name   (the shapes are drawn in SH)
     VOW   — vowel → color
   LORE  — how your made-up words are said (every visitor gets these)
   Fixes you make on the page are saved in your browser only.
═══════════════════════════════════════════════════════════ */
{
const $=id=>document.getElementById(id);
const CONS=[['s','s','Triangle'],['n','n','Cube'],['m','m','Dodecahedron'],['f','f','Icosahedron'],['b','b','Octagonal prism'],['ŋ','ng','Sideways cube'],['d','d','Star'],['k','k','Spiky ball'],['t','t','Round star'],['w','w','Round spiky ball'],['ʃ','sh','Bicone'],['θ','th','Barrel'],['ʒ','zh','Hourglass'],['ɹ','r','Donut'],['l','l','Oval'],['p','p','Cylinder'],['v','v','Triangle (down)'],['dʒ','j','Hemisphere'],['j','y','Teardrop'],['h','h','Saucer'],['g','g','Diamond'],['ð','dh','Chips'],['tʃ','ch','Square tube'],['z','z','Cone']];
const VOW=[['ʊ','b<b>oo</b>k','Red','#EB0A2C'],['aʊ','<b>ou</b>t','Orange','#F2571E'],['ʌ','c<b>u</b>p','Yellow','#FECD33'],['ɔɪ','t<b>oy</b>','Green','#6BD34A'],['aɪ','<b>eye</b>','Dark green','#2B6420'],['ɑɹ','<b>ar</b>m','Cyan','#16E5E8'],['ɪ','b<b>i</b>t','Blue','#4A4ED9'],['ɛ','<b>e</b>nd','Navy','#28175E'],['ɪɹ','d<b>eer</b>','Purple','#9C70E6'],['æ','c<b>a</b>t','Magenta','#E60BA8'],['ɔɹ','<b>ore</b>','Pink','#F48EB8'],['i','b<b>ee</b>','Black','#222222'],['oʊ','t<b>oe</b>','White','#FFFFFF'],['eɪ','b<b>ay</b>','Bone','#FDF8E9'],['u','t<b>oo</b>','Wood','#B97D52'],['ɝ','b<b>ir</b>d','Stone','#F3D399'],['ɑ','sw<b>a</b>n','Metal','#ABABAB'],['ɛɹ','<b>air</b>','Gold','#CF9524']];
const VM=Object.fromEntries(VOW.map(v=>[v[0],v]));
const CM=Object.fromEntries(CONS.map(c=>[c[0],c]));
const ALIAS={'ə':'ʌ','ɚ':'ɝ','ɔ':'ɑ','ʊɹ':'ɔɹ'};
const vk=t=>t&&VM[ALIAS[t]||t]?(ALIAS[t]||t):null;
const isV=t=>!!vk(t);
const ARPA=['ɑ','æ','ʌ','ɔ','aʊ','aɪ','ɛ','ɝ','eɪ','ɪ','i','oʊ','ɔɪ','ʊ','u','b','tʃ','d','ð','f','g','h','dʒ','k','l','m','n','ŋ','p','ɹ','s','ʃ','t','θ','v','w','j','z','ʒ','ə','ɚ'];
const decode=s=>[...s].map(ch=>{const c=ch.charCodeAt(0);return ARPA[c<97?c-65:c-97+26]});
const RM={'ɑ':'ɑɹ','ɔ':'ɔɹ','oʊ':'ɔɹ','ɛ':'ɛɹ','eɪ':'ɛɹ','ɪ':'ɪɹ','i':'ɪɹ','ʊ':'ʊɹ','u':'ʊɹ','ə':'ɚ','ʌ':'ɝ'};
function merge(t){const o=[];for(let i=0;i<t.length;i++){if(RM[t[i]]&&t[i+1]==='ɹ'&&!isV(t[i+2])){o.push(RM[t[i]]);i++}else o.push(t[i])}return o}

/* ---------- IPA text parsing ---------- */
const SYM={'tʃ':'tʃ','ʧ':'tʃ','dʒ':'dʒ','ʤ':'dʒ','t͡ʃ':'tʃ','d͡ʒ':'dʒ','aɪ':'aɪ','aʊ':'aʊ','ɔɪ':'ɔɪ','oʊ':'oʊ','eɪ':'eɪ','əʊ':'oʊ','ɜɹ':'ɝ','ɜr':'ɝ','ʊɹ':'ʊɹ',
'ŋ':'ŋ','ʃ':'ʃ','ʒ':'ʒ','θ':'θ','ð':'ð','ɹ':'ɹ','r':'ɹ','ɾ':'t','ɡ':'g','g':'g','j':'j','y':'j','b':'b','d':'d','f':'f','h':'h','k':'k','l':'l','ɫ':'l','m':'m','n':'n','p':'p','s':'s','t':'t','v':'v','w':'w','z':'z','c':'k',
'ɝ':'ɝ','ɚ':'ɚ','ɜ':'ɝ','ʊ':'ʊ','ʌ':'ʌ','ə':'ə','ɐ':'ʌ','ɪ':'ɪ','ᵻ':'ɪ','ɨ':'ɪ','ɛ':'ɛ','æ':'æ','i':'i','u':'u','ʉ':'u','ɑ':'ɑ','ɒ':'ɑ','a':'ɑ','ɔ':'ɔ','e':'eɪ','o':'oʊ','ɘ':'ə'};
const IGN=/[ˈˌ.ːˑ'ʼ‿̀-ͯ/\[\]ʔ-]/;
const SYMK=Object.keys(SYM).sort((a,b)=>b.length-a.length);
function parseIPA(s){const out=[],bad=[];let i=0;while(i<s.length){const ch=s[i];if(IGN.test(ch)||/\s/.test(ch)){i++;continue}const k=SYMK.find(k=>s.startsWith(k,i));if(k){out.push(SYM[k]);i+=k.length}else{bad.push(ch);i++}}return{t:merge(out),bad}}

/* ---------- spelling guess for names ---------- */
function guess(w){
  w=w.toLowerCase().replace(/[^a-z]/g,'');const T=[],n=w.length,vw=c=>!!c&&'aeiou'.includes(c);
  let magic=-1;if(n>3&&w[n-1]==='e'&&!vw(w[n-2])&&w[n-2]!=='l'&&vw(w[n-3])&&!vw(w[n-4]))magic=n-3;
  const R=[['tion',['ʃ','ə','n']],['sion',['ʒ','ə','n']],['ture',['tʃ','ɚ']],['eigh',['eɪ']],['igh',['aɪ']],['tch',['tʃ']],['sch',['s','k']],['ch',['tʃ']],['sh',['ʃ']],['th',['θ']],['ph',['f']],['wh',['w']],['ck',['k']],['qu',['k','w']],['ng',['ŋ']],['kn',['n'],1],['wr',['ɹ'],1],['gh',['g'],1],['gh',[]],
  ['uu',['u']],['ae',['eɪ']],['ai',['eɪ']],['ay',['eɪ']],['ey',['i'],2],['ey',['eɪ']],['ee',['i']],['ea',['i']],['ie',['i']],['ei',['eɪ']],['oa',['oʊ']],['oo',['u']],['ou',['aʊ']],['ow',['oʊ']],['oi',['ɔɪ']],['oy',['ɔɪ']],['au',['ɑ']],['aw',['ɑ']],['ew',['u']],['ue',['u']],
  ['ar',['ɑɹ'],3],['or',['ɔɹ'],3],['er',['ɚ'],3],['ir',['ɝ'],3],['ur',['ɝ'],3],['yr',['ɝ'],3]];
  for(let i=0;i<n;){
    const r=R.find(([g,,m])=>w.startsWith(g,i)&&(m!==1||i===0)&&(m!==2||i+g.length===n)&&(m!==3||!vw(w[i+g.length])));
    if(r){T.push(...r[1]);i+=r[0].length;continue}
    const c=w[i],nx=w[i+1],end=i===n-1;
    if(c===w[i-1]&&!vw(c)){i++;continue}
    if(c==='l'&&nx==='e'&&i+2===n&&i>0&&!vw(w[i-1])){T.push('ə','l');i+=2;continue}
    const L={a:i===magic?'eɪ':end?'ə':'æ',e:i===magic?'i':end?(n<=2?'i':null):'ɛ',i:i===magic?'aɪ':end?'i':'ɪ',o:i===magic||end?'oʊ':'ɑ',u:i===magic?'u':'ʌ',
      y:(i===0||vw(nx))?'j':end?(n<=3?'aɪ':'i'):'ɪ',c:'eiy'.includes(nx||'_')?'s':'k',g:'eiy'.includes(nx||'_')?'dʒ':'g',j:'dʒ',r:'ɹ',q:'k',x:i===0?'z':'x'}[c];
    if(L==='x')T.push('k','s');else if(L!==undefined){if(L)T.push(L)}else if(CM[c])T.push(c);
    i++;
  }
  return merge(T);
}

/* ---------- state ---------- */
const ls={get(k,d){try{const v=localStorage.getItem('fulgari-beads.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('fulgari-beads.'+k,JSON.stringify(v))}catch(e){}}};
const S={mode:ls.get('mode','w'),text:ls.get('text1','fulgari'),ipa:ls.get('ipa1','fʊlgɑɹi'),fix:ls.get('fix',{}),lab:ls.get('lab',true),notch:ls.get('notch',true),size:ls.get('size',58),sel:null,cur:null};
let DICT=null,dictFail=false;
const keyOf=w=>w.toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z']/g,'').replace(/^'+|'+$/g,'');
function dictAlts(k){const e=DICT&&DICT.get(k);return e?e.split(',').map(s=>merge(decode(s))):null}
/* ---------- LORE: how the wiki's own words are said ----------
   The dictionary doesn't know your made-up words, so it guesses.
   Add a line here and EVERY visitor gets your pronunciation:
     "word": "ipa",          (word in lowercase, IPA as you'd type it) */
const LORE={
  "fulgari": "fʊlgɑɹi",
};
function pron(k){
  if(S.fix[k])return{t:S.fix[k],src:'fix',alts:dictAlts(k)};
  if(LORE[k])return{t:parseIPA(LORE[k]).t,src:'lore'};
  let a=dictAlts(k);if(a)return{t:a[0],src:'dict',alts:a};
  if(k.endsWith("'s")){a=dictAlts(k.slice(0,-2));if(a)return{t:[...a[0],'z'],src:'dict'}}
  a=dictAlts(k.replace(/'/g,''));if(a)return{t:a[0],src:'dict',alts:a};
  return{t:guess(k),src:'guess'};
}
function wordLines(){return S.text.split('\n').map(l=>l.split(/[\s\-–—_/]+/).map(w=>({w:w.replace(/^[^\p{L}']+|[^\p{L}']+$/gu,''),k:keyOf(w)})).filter(x=>x.k))}
function strands(){
  if(S.mode==='i'){const bad=new Set();const s=S.ipa.split('\n').map(l=>l.split(/\s+/).filter(Boolean).map(w=>{const p=parseIPA(w);p.bad.forEach(b=>bad.add(b));return{k:null,label:w,t:p.t}}).filter(x=>x.t.length));$('ipaNote').textContent=bad.size?'Skipped symbols that aren’t in the bead chart: '+[...bad].join(' '):'';return s}
  return wordLines().map(l=>l.map(x=>({k:x.k,label:x.w,t:pron(x.k).t})))
}
function beads(t){const o=[];for(let i=0;i<t.length;){const a=t[i],b=t[i+1],c=t[i+2];
  if(!isV(a)){if(isV(b)){o.push({c:a,v:b,s:a+b});i+=2}else{o.push({c:a,v:null,s:a});i++}}
  else if(S.notch&&b&&!isV(b)&&!isV(c)){o.push({c:b,v:a,n:1,s:a+b});i+=2}
  else{o.push({c:null,v:a,s:a});i++}}return o}

/* ---------- shapes (unit box about ±50) ---------- */
const pt=(r,a)=>[(r*Math.cos(a)).toFixed(1),(r*Math.sin(a)).toFixed(1)].join(',');
const poly=(n,r,rot)=>Array.from({length:n},(_,i)=>pt(r,(rot+360*i/n)*Math.PI/180)).join(' ');
const star=(n,ro,ri)=>Array.from({length:2*n},(_,i)=>pt(i%2?ri:ro,-Math.PI/2+Math.PI*i/n)).join(' ');
const wavy=(n,b,a)=>'M'+Array.from({length:144},(_,i)=>{const th=2*Math.PI*i/144-Math.PI/2;return pt(b+a*Math.cos(n*(th+Math.PI/2)),th)}).join('L')+'Z';
const SH={
 s:[46,-42,38,a=>`<polygon points="0,-42 46,38 -46,38" ${a}/>`],
 n:[36,-36,36,a=>`<rect x="-36" y="-36" width="72" height="72" ${a}/>`],
 m:[42,-44,36,a=>`<polygon points="${poly(5,44,-90)}" ${a}/>`],
 f:[46,-40,40,a=>`<polygon points="${poly(6,46,0)}" ${a}/>`],
 b:[41,-41,41,a=>`<polygon points="${poly(8,44,22.5)}" ${a}/>`],
 'ŋ':[46,-46,46,a=>`<polygon points="0,-46 46,0 0,46 -46,0" ${a}/>`],
 d:[48,-48,48,a=>`<path d="M0,-48Q7,-7 48,0Q7,7 0,48Q-7,7 -48,0Q-7,-7 0,-48Z" ${a}/>`],
 k:[50,-50,48,a=>`<polygon points="${star(9,50,19)}" ${a}/>`],
 t:[47,-47,47,a=>`<path d="${wavy(4,39,8)}" ${a}/>`],
 w:[49,-49,49,a=>`<path d="${wavy(8,37,12)}" ${a}/>`],
 'ʃ':[36,-50,50,a=>`<polygon points="-20,-50 20,-50 36,0 20,50 -20,50 -36,0" ${a}/>`],
 'θ':[32,-50,50,a=>`<path d="M-22,-50H22Q42,0 22,50H-22Q-42,0 -22,-50Z" ${a}/>`],
 'ʒ':[32,-50,50,a=>`<path d="M-32,-50H32L9,0L32,50H-32L-9,0Z" ${a}/>`],
 'ɹ':[44,-44,44,a=>`<path fill-rule="evenodd" d="M44,0A44,44 0 1 1-44,0A44,44 0 1 1 44,0ZM17,0A17,17 0 1 0-17,0A17,17 0 1 0 17,0Z" ${a}/>`],
 l:[52,-30,30,a=>`<ellipse rx="52" ry="30" ${a}/>`],
 p:[27,-48,48,(a,d)=>`<path d="M-27,-38A27,10 0 0 1 27,-38V38A27,10 0 0 1-27,38Z" ${a}/><path d="M-27,-38A27,10 0 0 0 27,-38" ${d}/>`],
 v:[46,-38,42,a=>`<polygon points="-46,-38 46,-38 0,42" ${a}/>`],
 'dʒ':[50,-25,23,(a,d)=>`<path d="M-50,23A50,48 0 0 1 50,23Z" ${a}/><path d="M-44,23H44" ${d} stroke-dasharray="7 7"/>`],
 j:[30,-48,46,a=>`<path d="M0,-48C6,-26 30,-6 30,16A30,30 0 0 1-30,16C-30,-6-6,-26 0,-48Z" ${a}/>`],
 h:[60,-26,26,(a,d)=>`<polygon points="-60,2 0,-26 60,2 0,26" ${a}/><path d="M-60,2L-18,-7L22,-5L60,2M-18,-7L0,26M22,-5L0,26" ${d}/>`],
 g:[29,-54,54,(a,d)=>`<polygon points="0,-54 29,-10 0,54 -29,-10" ${a}/><path d="M-29,-10L0,-2L29,-10M0,-2V54M0,-54V-2" ${d}/>`],
 'ð':[56,-31,31,a=>[18,0,-18].map(y=>`<ellipse cy="${y}" rx="56" ry="13" ${a}/>`).join('')],
 'tʃ':[24,-50,50,a=>`<rect x="-24" y="-50" width="48" height="100" ${a}/>`],
 z:[30,-48,48,a=>`<polygon points="-20,-48 20,-48 30,48 -30,48" ${a}/>`],
 o:[44,-44,44,a=>`<circle r="44" ${a}/>`]
};
const glass=()=>`fill="#7AE8E6" fill-opacity="${INK.glass}" stroke="#D9C826" stroke-width="3.5"`;
/* Board colours come from the CSS (.board in fulgari-beads.html):
   --string, --label, --label-dim, --bead-edge and --glass. */
let INK={string:'#141218',label:'#4d4856',dim:'#8a8394',edge:'',glass:.42};
function readInk(){const c=getComputedStyle($('board')),g=n=>c.getPropertyValue(n).trim();
  INK={string:g('--string')||'#141218',label:g('--label')||'#4d4856',dim:g('--label-dim')||'#8a8394',edge:g('--bead-edge'),glass:g('--glass')||.42}}
const dark=hex=>{const n=parseInt(hex.slice(1),16);return((n>>16&255)*.3+(n>>8&255)*.59+(n&255)*.11)<70};
function beadSVG(c,v,plain){
  const sh=SH[c||'o'],V=v?VM[vk(v)]:null;
  if(V&&!plain&&INK.edge&&dark(V[3]))return sh[3](`fill="${V[3]}" stroke="${INK.edge}" stroke-width="2.2" stroke-linejoin="round"`,`fill="none" stroke="${INK.edge}" stroke-width="1.4" stroke-opacity=".6"`);
  if(!V&&!plain)return sh[3](glass()+' stroke-linejoin="round"','fill="none" stroke="#B8A81E" stroke-width="1.4" stroke-opacity=".7"');
  const fill=V?V[3]:'#ffffff',light=!V||['Bone','Stone','White'].includes(V[2]);
  const stroke=light?'#1d1b22':'rgba(20,10,30,.4)',sw=light?2.6:1.8;
  return sh[3](`fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"`,`fill="none" stroke="${light?'#1d1b22':'rgba(0,0,0,.35)'}" stroke-width="1.4" stroke-opacity=".7"`);
}
const mini=(c,v)=>`<svg viewBox="-62 -62 124 124" aria-hidden="true">${beadSVG(c,v,!v)}</svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

/* ---------- board ---------- */
let lastSVG='';
function renderBoard(){
  const b=$('board');
  if(!DICT&&!dictFail&&S.mode==='w'){b.innerHTML='<div class="empty">Loading the pronunciation dictionary…</div>';return}
  const st=strands().filter(l=>l.length);
  if(!st.length){b.innerHTML='<div class="empty">Type something to start a strand.</div>';lastSVG='';return}
  readInk();const GAP=8,SP=13,LW=S.lab?120:0;let x=24,H=0,out='';
  for(const words of st){
    const all=words.map(w=>({...w,b:beads(w.t)}));
    const hw=Math.max(30,...all.flatMap(w=>w.b.map(q=>SH[q.c||'o'][0])));
    const cx=x+hw,y0=16;let y=y0+34,body='';
    const dot=()=>{body+=`<circle cx="${cx}" cy="${y+SP}" r="${SP}" fill="${INK.string}"/>`;y+=2*SP+GAP+2};
    dot();
    for(const w of all){
      w.b.forEach((q,i)=>{const sh=SH[q.c||'o'];y+=-sh[1];
        const sel=S.mode==='w'&&w.k===S.sel?' sel':'';
        body+=`<g class="bead${sel}" data-k="${esc(w.k||'')}" transform="translate(${cx} ${y})"><title>${esc(w.label)}: ${esc(q.s)}</title>${beadSVG(q.c,q.v,false)}${q.n?`<path d="M-56,-24L58,38" stroke="#0a0a0a" stroke-width="7" stroke-linecap="round"/><path d="M-56,-24L58,38" stroke="${INK.string}" stroke-width="3" stroke-linecap="round"/>`:''}</g>`;
        if(S.lab)body+=`<text x="${cx+hw+14}" y="${y+7}" font-size="21" fill="${INK.label}" font-family="Noto Sans,Arial,sans-serif">${esc(q.s)}${i===0?`<tspan fill="${INK.dim}" font-size="17" dx="8">${esc(w.label)}</tspan>`:''}</text>`;
        y+=sh[2]+GAP});
      y+=2;dot();
    }
    y+=30;
    out+=`<line x1="${cx}" y1="${y0}" x2="${cx}" y2="${y}" stroke="${INK.string}" stroke-width="3.5" stroke-linecap="round"/>`+body;
    H=Math.max(H,y+16);x+=2*hw+LW+40;
  }
  const W=x-16,k=S.size/100;
  lastSVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${Math.round(W*k)}" height="${Math.round(H*k)}">${out}</svg>`;
  b.innerHTML=lastSVG;
}

/* ---------- word list + editor ---------- */
function renderWords(){
  const seen=new Set(),items=[];
  for(const l of wordLines())for(const x of l){if(seen.has(x.k))continue;seen.add(x.k);items.push(x)}
  $('words').innerHTML=items.map(x=>{const p=DICT||dictFail?pron(x.k):{t:[],src:''};
    return `<button class="wd ${p.src}" data-k="${esc(x.k)}" aria-pressed="${x.k===S.sel}"><b>${esc(x.w)}</b><span class="ipa">/${esc(p.t.join(''))}/</span>${p.src==='guess'?' <span class="tag">guess</span>':p.src==='fix'?' <span class="tag">your fix</span>':''}</button>`}).join('');
}
function renderEditor(){
  const ed=$('editor');
  if(S.mode!=='w'||!S.sel){ed.hidden=true;$('palHint').textContent=S.mode==='i'?'Click to type at the cursor':'Pick a word to start editing';return}
  ed.hidden=false;const p=pron(S.sel),t=p.t;
  $('edWord').textContent=S.sel;
  $('edSrc').className='badge '+p.src;$('edSrc').textContent={dict:'from dictionary',guess:'guessed from spelling',fix:'your fix',lore:'from the wiki'}[p.src];
  const cur=S.cur||{m:'i',i:t.length};
  let h='';
  t.forEach((tok,i)=>{h+=`<button class="slot${cur.m==='i'&&cur.i===i?' on':''}" data-slot="${i}" aria-label="Insert here"></button>`;
    const v=isV(tok);h+=`<span class="chip${cur.m==='r'&&cur.i===i?' on':''}" data-chip="${i}" role="button" tabindex="0" aria-label="${esc(tok)}">${v?mini(null,tok):mini(tok,null)}<b>${esc(tok)}</b><button class="x" data-del="${i}" aria-label="Remove ${esc(tok)}">×</button></span>`});
  h+=`<button class="slot${cur.m==='i'&&cur.i===t.length?' on':''}" data-slot="${t.length}" aria-label="Add at end"></button>`;
  $('chips').innerHTML=h;
  if(document.activeElement!==$('edIpa')){$('edIpa').value=t.join('');$('edNote').textContent=''}
  const alts=p.alts&&p.alts.length>1?p.alts:null;
  $('alts').innerHTML=alts?'<span class="hint" style="margin:0;align-self:center">Dictionary options:</span>'+alts.map((a,i)=>`<button class="btn${a.join('')===t.join('')?' on':''}" data-alt="${i}"><span class="ipa">/${esc(a.join(''))}/</span></button>`).join(''):'';
  $('edReset').hidden=p.src!=='fix';
  $('palHint').textContent=cur.m==='r'?'Click a sound to swap in for '+t[cur.i]:'Click a sound to add it at the pink line';
}
function setFix(k,t){if(!t.length){delete S.fix[k]}else S.fix[k]=t;ls.set('fix',S.fix);renderAll()}
function renderAll(){renderWords();renderEditor();renderBoard()}

/* ---------- palette ---------- */
$('consKeys').innerHTML=CONS.map(c=>`<button class="key" data-sym="${c[0]}" title="${c[2]}">${mini(c[0],null)}<b>${c[0]}</b><span>${c[1]}</span></button>`).join('')+`<button class="key" data-sym="" title="Sphere: vowel with no consonant">${mini(null,null)}<b>—</b><span>none</span></button>`;
$('vowKeys').innerHTML=VOW.map(v=>`<button class="key" data-sym="${v[0]}" title="${v[2]}">${mini(null,v[0])}<b>${v[0]}</b><span>${v[1]}</span></button>`).join('');
document.querySelector('.pal').addEventListener('click',e=>{
  const b=e.target.closest('.key');if(!b)return;const sym=b.dataset.sym;
  if(S.mode==='i'){const ta=$('ipaIn');const s=ta.selectionStart??ta.value.length,en=ta.selectionEnd??s;ta.setRangeText(sym,s,en,'end');ta.focus();S.ipa=ta.value;ls.set('ipa',S.ipa);renderBoard();return}
  if(!S.sel){toast('Tap a word first, then pick its sounds');return}
  if(!sym)return;
  const t=[...pron(S.sel).t],cur=S.cur||{m:'i',i:t.length};
  if(cur.m==='r'){t[cur.i]=sym;S.cur=null}else{t.splice(cur.i,0,sym);S.cur={m:'i',i:cur.i+1}}
  setFix(S.sel,t);
});
$('chips').addEventListener('click',e=>{
  const t=[...pron(S.sel).t];const d=e.target.closest('[data-del]'),sl=e.target.closest('[data-slot]'),ch=e.target.closest('[data-chip]');
  if(d){t.splice(+d.dataset.del,1);S.cur=null;setFix(S.sel,t);return}
  if(sl){S.cur={m:'i',i:+sl.dataset.slot};renderEditor();return}
  if(ch){const i=+ch.dataset.chip;S.cur=S.cur&&S.cur.m==='r'&&S.cur.i===i?null:{m:'r',i};renderEditor()}
});
$('chips').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset.chip!=null){e.preventDefault();e.target.click()}});
let edT;$('edIpa').addEventListener('input',()=>{clearTimeout(edT);edT=setTimeout(()=>{const p=parseIPA($('edIpa').value);$('edNote').textContent=p.bad.length?'Not in the chart, skipped: '+p.bad.join(' '):'';S.cur=null;setFix(S.sel,p.t)},450)});
$('alts').addEventListener('click',e=>{const b=e.target.closest('[data-alt]');if(!b)return;const a=dictAlts(S.sel);if(+b.dataset.alt===0){delete S.fix[S.sel];ls.set('fix',S.fix);renderAll()}else setFix(S.sel,a[+b.dataset.alt])});
$('edReset').onclick=()=>{delete S.fix[S.sel];ls.set('fix',S.fix);S.cur=null;renderAll()};
$('edDone').onclick=()=>{S.sel=null;S.cur=null;renderAll()};
function pick(k){S.sel=S.sel===k?null:k;S.cur=null;renderAll();if(S.sel&&innerWidth<960)$('editor').scrollIntoView({behavior:'smooth',block:'start'})}
$('words').addEventListener('click',e=>{const b=e.target.closest('.wd');if(b)pick(b.dataset.k)});
$('board').addEventListener('click',e=>{const g=e.target.closest('.bead');if(g&&S.mode==='w'&&g.dataset.k){S.sel=null;pick(g.dataset.k)}});

/* ---------- inputs ---------- */
$('txt').value=S.text;$('ipaIn').value=S.ipa;
let tT;$('txt').addEventListener('input',()=>{clearTimeout(tT);tT=setTimeout(()=>{S.text=$('txt').value;ls.set('text1',S.text);renderAll()},200)});
$('ipaIn').addEventListener('input',()=>{S.ipa=$('ipaIn').value;ls.set('ipa',S.ipa);renderBoard()});
function setMode(m){S.mode=m;ls.set('mode',m);$('tabW').setAttribute('aria-selected',m==='w');$('tabI').setAttribute('aria-selected',m==='i');$('wordsPane').hidden=m!=='w';$('ipaPane').hidden=m!=='i';renderAll()}
$('tabW').onclick=()=>setMode('w');$('tabI').onclick=()=>setMode('i');
$('toIpa').onclick=()=>{S.ipa=wordLines().map(l=>l.map(x=>pron(x.k).t.join('')).join(' ')).join('\n');$('ipaIn').value=S.ipa;ls.set('ipa',S.ipa);setMode('i')};
$('optLab').checked=S.lab;$('optNotch').checked=S.notch;$('optSize').value=S.size;
$('optLab').onchange=e=>{S.lab=e.target.checked;ls.set('lab',S.lab);renderBoard()};
$('optNotch').onchange=e=>{S.notch=e.target.checked;ls.set('notch',S.notch);renderBoard()};
$('optSize').oninput=e=>{S.size=+e.target.value;ls.set('size',S.size);renderBoard()};

/* ---------- export ---------- */
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
$('copySvg').onclick=async()=>{if(!lastSVG)return;try{await navigator.clipboard.writeText(lastSVG);toast('SVG copied — paste into Illustrator or a .svg file')}catch(e){toast('Copying is blocked here')}};
$('saveImg').onclick=()=>{
  if(!lastSVG)return;const m=lastSVG.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/),W=+m[1],H=+m[2],sc=2;
  const svg=lastSVG.replace(/width="\d+" height="\d+"/,`width="${W*sc}" height="${H*sc}"`).replace(/(<svg[^>]*>)/,`$1<rect width="100%" height="100%" fill="${getComputedStyle($('board')).backgroundColor}"/>`);
  const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=W*sc;c.height=H*sc;const x=c.getContext('2d');x.drawImage(img,0,0);try{$('modalImg').src=c.toDataURL('image/png')}catch(e){$('modalImg').src=img.src}if($('modalDl'))$('modalDl').href=$('modalImg').src;$('modal').hidden=false};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
};
$('modalClose').onclick=()=>{$('modal').hidden=true};$('modal').onclick=e=>{if(e.target.id==='modal')$('modal').hidden=true};
addEventListener('keydown',e=>{if(e.key==='Escape')$('modal').hidden=true});

/* ---------- load dictionary ---------- */
setMode(S.mode);
fetch('data/cmudict.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(rows=>{DICT=new Map();for(const r of rows){const i=r.indexOf(' ');DICT.set(r.slice(0,i),r.slice(i+1))}renderAll()}).catch(()=>{dictFail=true;toast('Dictionary didn’t load, so every word is a spelling guess');renderAll()});
}
