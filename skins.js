// Shared skins for every synth page: sets CSS variables on <html>, remembers the choice, adds a picker to the tab bar.
(function(){
const SKINS={
  classic:{name:'Classic',vars:{}},
  neon:{name:'Neon night',vars:{
    '--bg':'#07070c','--body':'#17181f','--body2':'#101118','--ink':'#e6e8ff','--muted':'#8a8fb0','--accent':'#ff2bd6','--accent2':'#22e4ff',
    '--line':'#2c2f45','--panel':'#1b1d28','--btn':'#23263a','--onink':'#fff','--key':'#d9dcf0','--keyb':'#0b0c12','--keydown':'#ffb3f0','--kborder':'#444','--kbbg':'#0d0e16',
    '--screen':'#000','--lcd-bg':'#03030a','--lcd-bar':'#1a0f2e','--lcd-title':'#ffffff','--lcd-hi':'#22e4ff','--lcd-line':'#6b5bd6','--lcd-fb':'#ffe066','--lcd-off':'#3a3d55','--lcd-box':'#0a0a18','--lcd-msg':'#f0b8ff','--lcd-dim':'#9a8fd0',
    '--silver1':'#23263a','--silver2':'#15161f','--dark':'#0a0a10','--dark2':'#15161f','--ctl':'#23263a','--ctlink':'#e6e8ff','--ctlline':'#3a3d5a','--lab':'#8a8fb0','--bink':'#e6e8ff','--grp':'rgba(255,255,255,.04)',
    '--knob1':'#3a2a55','--knob2':'#0a0a14','--knobptr':'#22e4ff','--accon':'#ff2bd6','--sldon':'#22e4ff','--sel':'#22e4ff','--selink':'#000','--led':'#ff2bd6','--ledoff':'#3a1f40'}},
  acid:{name:'Acid yellow',vars:{
    '--bg':'#1a1a1a','--navink':'#ffd81f','--body':'#ffd81f','--body2':'#f2c400','--ink':'#111','--muted':'#5a4a00','--accent':'#e5191c','--accent2':'#111111',
    '--line':'#b89600','--panel':'#fff3b0','--btn':'#fff8d0','--onink':'#fff','--key':'#fffef5','--keyb':'#111','--keydown':'#ffd81f','--kborder':'#555','--kbbg':'#111',
    '--screen':'#111','--lcd-bg':'#111111','--lcd-bar':'#2a2a2a','--lcd-title':'#ffd81f','--lcd-hi':'#ffd81f','--lcd-line':'#aaaaaa','--lcd-fb':'#ff4040','--lcd-off':'#444444','--lcd-box':'#000000','--lcd-msg':'#ffd81f','--lcd-dim':'#c9b24a',
    '--silver1':'#ffe14d','--silver2':'#f2c400','--dark':'#111','--dark2':'#222','--ctl':'#2b2b2b','--ctlink':'#ffd81f','--ctlline':'#555','--lab':'#c9b24a','--bink':'#ffd81f','--grp':'rgba(0,0,0,.06)',
    '--knob1':'#333','--knob2':'#000','--knobptr':'#ffd81f','--accon':'#e5191c','--sldon':'#3aa0ff','--sel':'#ffd81f','--selink':'#111','--led':'#e5191c','--ledoff':'#4a1a1a'}},
  vintage:{name:'Vintage wood',vars:{
    '--bg':'#2a1d14','--navink':'#efe3c8','--body':'#efe3c8','--body2':'#dccaa3','--ink':'#3a2a1c','--muted':'#7a6448','--accent':'#d9731a','--accent2':'#2f7a6b',
    '--line':'#bfa57a','--panel':'#f7eedb','--btn':'#fff8e8','--onink':'#fff','--key':'#fffaf0','--keyb':'#2a1d14','--keydown':'#ffd9a8','--kborder':'#8a6a48','--kbbg':'#4a3020',
    '--screen':'#1a120b','--lcd-bg':'#1f1405','--lcd-bar':'#3a2608','--lcd-title':'#ffcf7a','--lcd-hi':'#ffb347','--lcd-line':'#c08a3e','--lcd-fb':'#ffe9a8','--lcd-off':'#5a4630','--lcd-box':'#160e04','--lcd-msg':'#ffcf7a','--lcd-dim':'#c9a56a',
    '--silver1':'#efe3c8','--silver2':'#d6c19a','--dark':'#3a2618','--dark2':'#4f3422','--ctl':'#5e4029','--ctlink':'#f7eedb','--ctlline':'#7a5638','--lab':'#d9c09a','--bink':'#f7eedb','--grp':'rgba(255,255,255,.3)',
    '--knob1':'#6b4a2e','--knob2':'#2a1a0e','--knobptr':'#ffcf7a','--accon':'#d9731a','--sldon':'#2f7a6b','--sel':'#ffcf7a','--selink':'#2a1d14','--led':'#ffb347','--ledoff':'#4a3020'}},
  pastel:{name:'Pastel',vars:{
    '--bg':'#f3e8f7','--body':'#fff0f6','--body2':'#f5dcea','--ink':'#4a3550','--muted':'#9a7fa5','--accent':'#ff7eb6','--accent2':'#8fb8ff',
    '--line':'#e2c3d6','--panel':'#fffafc','--btn':'#ffffff','--onink':'#fff','--key':'#ffffff','--keyb':'#6b5478','--keydown':'#ffd0e6','--kborder':'#d4b8cc','--kbbg':'#e9d6f5',
    '--screen':'#6b5478','--lcd-bg':'#fdf6ff','--lcd-bar':'#e9d6f5','--lcd-title':'#4a3550','--lcd-hi':'#ff5ea5','--lcd-line':'#b59ccc','--lcd-fb':'#ffb84d','--lcd-off':'#d9cce3','--lcd-box':'#ffffff','--lcd-msg':'#6b5478','--lcd-dim':'#9a7fa5',
    '--silver1':'#fff0f6','--silver2':'#f3d6e6','--dark':'#e9d6f5','--dark2':'#f3e4fa','--ctl':'#ffffff','--ctlink':'#4a3550','--ctlline':'#d9c2e6','--lab':'#8a6f96','--bink':'#4a3550','--grp':'rgba(255,255,255,.5)',
    '--knob1':'#ffc2dd','--knob2':'#c77fae','--knobptr':'#ffffff','--accon':'#ffb84d','--sldon':'#8fb8ff','--sel':'#4a3550','--selink':'#fff','--led':'#ff5ea5','--ledoff':'#e9c8da'}},
  phosphor:{name:'Phosphor',vars:{
    '--bg':'#000','--body':'#0d140d','--body2':'#070b07','--ink':'#9dff9d','--muted':'#4f9a4f','--accent':'#39ff14','--accent2':'#0f9d58',
    '--line':'#1f3a1f','--panel':'#0a120a','--btn':'#0f1f0f','--onink':'#000','--key':'#b8ffb8','--keyb':'#031003','--keydown':'#39ff14','--kborder':'#2e5a2e','--kbbg':'#050a05',
    '--screen':'#000','--lcd-bg':'#000000','--lcd-bar':'#062006','--lcd-title':'#9dff9d','--lcd-hi':'#39ff14','--lcd-line':'#2e8a2e','--lcd-fb':'#d4ff5a','--lcd-off':'#1f3a1f','--lcd-box':'#000000','--lcd-msg':'#9dff9d','--lcd-dim':'#4f9a4f',
    '--silver1':'#0f1f0f','--silver2':'#070f07','--dark':'#000','--dark2':'#061006','--ctl':'#0f1f0f','--ctlink':'#9dff9d','--ctlline':'#1f3a1f','--lab':'#4f9a4f','--bink':'#9dff9d','--grp':'rgba(57,255,20,.04)',
    '--knob1':'#1f3a1f','--knob2':'#000','--knobptr':'#39ff14','--accon':'#d4ff5a','--sldon':'#0f9d58','--sel':'#9dff9d','--selink':'#000','--led':'#39ff14','--ledoff':'#0f2a0f'}}
};
const root=document.documentElement;let applied=[];
const css=document.createElement('style');
css.textContent='html nav.tabs a:not(.cur),html .skinpick{color:var(--navink,var(--ink))}'+
  '@media (prefers-color-scheme: dark){:root[data-skin=classic]:not([data-theme=light]){--navink:#ddd}}';
document.head.appendChild(css);
function load(){try{return localStorage.getItem('synthSkin')||'classic';}catch(_){return 'classic';}}
function apply(id){
  const sk=SKINS[id]||SKINS.classic;
  applied.forEach(k=>root.style.removeProperty(k));applied=Object.keys(sk.vars);
  for(const k of applied) root.style.setProperty(k,sk.vars[k]);
  root.dataset.skin=id;
  try{localStorage.setItem('synthSkin',id);}catch(_){}
  window.dispatchEvent(new Event('skinchange'));
}
apply(load());
const embedded=window.self!==window.top;
if(embedded){const h=document.createElement('style');h.textContent='nav.tabs{display:none!important}body{padding-top:8px!important}';document.head.appendChild(h);}
window.addEventListener('storage',e=>{if(e.key==='synthSkin'&&e.newValue&&e.newValue!==root.dataset.skin){apply(e.newValue);const s=document.querySelector('.skinpick select');if(s)s.value=e.newValue;}});
window.synthSkins={SKINS,apply};
document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('nav.tabs');if(!nav)return;
  const lab=document.createElement('label');lab.className='skinpick';
  lab.style.cssText='margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;letter-spacing:.06em';
  lab.innerHTML='🎨 Skin ';
  const sel=document.createElement('select');sel.style.cssText='width:auto;padding:5px 8px';
  for(const id in SKINS){const o=document.createElement('option');o.value=id;o.textContent=SKINS[id].name;sel.appendChild(o);}
  sel.value=root.dataset.skin;sel.onchange=()=>apply(sel.value);
  lab.appendChild(sel);nav.appendChild(lab);
});
})();
