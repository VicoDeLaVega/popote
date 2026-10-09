// Audio-reactive cyberpunk fractal worlds drawn behind the studio (WebGL raymarching).
// Reads levels from every machine (bass / mid / high) and the shared transport for the beat.
(function(){
const VERT='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FRAG=`precision highp float;
uniform vec2 uRes;uniform float uTime,uTravel,uBass,uMid,uHigh,uBeat,uScene,uFlash;
vec4 orb;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdBox(vec3 p,vec3 b){vec3 d=abs(p)-b;return min(max(d.x,max(d.y,d.z)),0.)+length(max(d,0.));}
// world 1: apollonian cathedral; the bass inflates the inversion scale
float deApo(vec3 p){
  float s=1.12+.12*sin(uTime*.07)+.25*uBass,sc=1.;orb=vec4(1000.);
  for(int i=0;i<8;i++){p=-1.+2.*fract(.5*p+.5);float r2=dot(p,p);orb=min(orb,vec4(abs(p),r2));float k=s/r2;p*=k;sc*=k;}
  return .25*abs(p.y)/sc;}
// world 2: kaleidoscopic tunnel; mids open the folds, bass twists them
float deTunnel(vec3 p){
  vec3 p0=p;p.xy*=rot(p.z*.15+uTime*.05);p.z=mod(p.z,2.)-1.;float s=1.;orb=vec4(1000.);
  for(int i=0;i<6;i++){p=abs(p)-vec3(.55,.95,.35)*(1.+.25*uMid);p.xy*=rot(.62);p.yz*=rot(.33+.3*uBass);
    orb=min(orb,vec4(abs(p),dot(p,p)));p*=1.45;s*=1.45;}
  float d=(length(max(abs(p)-vec3(.7),0.))-.02)/s;
  return max(d,.75-length(p0.xy));}
// world 3: neon city of menger towers; the bass raises the skyline
float deCity(vec3 p){
  orb=vec4(1000.);vec3 q=p;vec2 cell=floor(q.xz/4.);q.xz=mod(q.xz,4.)-2.;
  float h=1.8+1.6*fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453)+1.3*uBass;
  q.y=p.y+2.-h;float d=sdBox(q,vec3(1.,h,1.)),s=1.;
  for(int m=0;m<3;m++){vec3 a=mod(q*s,2.)-1.;s*=3.;vec3 r=abs(1.-3.*abs(a));orb=min(orb,vec4(abs(a),dot(a,a)));
    d=max(d,(min(max(r.x,r.y),min(max(r.y,r.z),max(r.z,r.x)))-1.)/s);}
  float g=p.y+2.;if(g<d)orb=vec4(fract(p.x*.5),fract(p.z*.5),9.,1.);
  return min(d,g);}
float map(vec3 p){if(uScene<.5)return deApo(p);if(uScene<1.5)return deTunnel(p);return deCity(p);}
vec3 nrm(vec3 p,float e){vec2 h=vec2(e,0.);return normalize(vec3(map(p+h.xyy)-map(p-h.xyy),map(p+h.yxy)-map(p-h.yxy),map(p+h.yyx)-map(p-h.yyx)));}
void main(){
  vec2 uv=(gl_FragCoord.xy*2.-uRes)/uRes.y;float t=uTravel;vec3 ro,ta;
  if(uScene<.5){ro=vec3(2.8*cos(.1+.33*t),.4+.3*cos(.37*t),2.8*cos(.5+.35*t));ta=vec3(1.9*cos(1.2+.41*t),.4+.1*cos(.27*t),1.9*cos(2.+.38*t));}
  else if(uScene<1.5){ro=vec3(0.,0.,t*2.);ta=ro+vec3(.2*sin(t*.5),.15*cos(t*.4),1.);}
  else{ro=vec3(.4*sin(t*.3),.4+.7*(.5+.5*sin(t*.21)),t*3.);ta=ro+vec3(.3*sin(t*.17),-.2,1.);}
  vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);
  float roll=.08*sin(uTime*.3);uv*=rot(roll);
  vec3 rd=normalize(uv.x*uu+uv.y*vv+(1.6-.22*uBeat)*ww);
  vec3 cA=vec3(0.,.95,1.),cB=vec3(1.,.17,.84),cC=vec3(.55,.2,1.);
  float tt=0.,d=1.;vec3 glow=vec3(0.);bool hit=false;
  for(int i=0;i<100;i++){vec3 p=ro+rd*tt;d=map(p);
    glow+=.0015/(.01+d*d*300.)*mix(cA,cB,.5+.5*sin(tt*.7+uTime*.6));
    if(d<.0007*tt+.0001){hit=true;break;}tt+=d*.9;if(tt>28.)break;}
  vec3 bg=mix(vec3(.03,0.,.07),vec3(.12,0.,.2),.5+.5*uv.y);vec3 col=bg;
  if(hit){vec3 p=ro+rd*tt,n=nrm(p,.0006*tt+.0002);
    vec3 base=mix(cC*.15,cA*.5,clamp(orb.x*1.2,0.,1.));base=mix(base,cB*.65,clamp(orb.y*orb.y*1.4,0.,1.));
    float dif=clamp(dot(n,normalize(vec3(.5,.8,-.3))),0.,1.),rim=pow(1.-clamp(dot(n,-rd),0.,1.),3.);
    float lines=smoothstep(.06,0.,abs(fract(orb.z*4.+uTime*.25)-.5)-.44);
    col=base*(.08+.42*dif)+rim*cB*(.3+.8*uHigh)+lines*mix(cA,cB,.5+.5*sin(uTime*.4))*(.2+1.1*uHigh);
    if(orb.z>8.){vec2 g=abs(fract(p.xz*.5)-.5);float gl=smoothstep(.04,0.,min(g.x,g.y));col=bg*.6+gl*mix(cB,cA,.5+.5*sin(p.z*.2))*(1.+uBeat);}
    col=mix(col,bg,clamp(tt/28.,0.,1.));}
  col+=glow*(.04+.18*uBass);
  col+=uFlash*vec3(.9,.25,.85)*.35+uBeat*.06*cB;
  col*=.88+.12*sin(gl_FragCoord.y*1.7);
  col*=1.-.3*dot(uv*.5,uv*.5);
  col=1.-exp(-max(col,0.)*1.6);
  gl_FragColor=vec4(pow(col,vec3(.9)),1.);}`;

const cv=document.createElement('canvas');cv.id='fx';
cv.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;display:block;pointer-events:none';
document.body.prepend(cv);
const gl=cv.getContext('webgl',{antialias:false,powerPreference:'high-performance'});
if(!gl){console.warn('WebGL not available: no visuals');return;}
function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VERT));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(pr);gl.useProgram(pr);
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
const U={};['uRes','uTime','uTravel','uBass','uMid','uHigh','uBeat','uScene','uFlash'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));

let enabled=true,scale=.5,travel=0,last=performance.now(),env=[0,0,0],prevBass=0,onset=0,flash=0,scene=0,manual=0,idleScene=0,slow=0;
try{enabled=localStorage.getItem('studioFx')!=='off';}catch(_){}
function resize(){const d=Math.min(2,window.devicePixelRatio||1)*scale;
  cv.width=Math.max(160,Math.round(innerWidth*d));cv.height=Math.max(90,Math.round(innerHeight*d));gl.viewport(0,0,cv.width,cv.height);}
addEventListener('resize',resize);resize();

function levels(){const sum=[0,0,0];
  try{for(const p of panels){const a=api(p.dataset.id);const l=a&&a.levels&&a.levels();if(l)for(let i=0;i<3;i++)sum[i]=Math.max(sum[i],l[i]);}}catch(_){}
  // shape so quiet passages sit low and hits reach the top
  return sum.map((v,i)=>Math.min(1,Math.pow(v*[1.15,1.3,1.8][i],1.6)));}

function frame(now){
  requestAnimationFrame(frame);
  if(!enabled)return;
  const dt=Math.min(.1,(now-last)/1000);last=now;
  // adapt resolution to keep the machines responsive
  slow=slow*.95+dt*.05;
  if(slow>.028&&scale>.3){scale-=.05;resize();slow=.02;}else if(slow<.014&&scale<.7){scale+=.05;resize();slow=.02;}
  const raw=levels();
  for(let i=0;i<3;i++)env[i]=raw[i]>env[i]?raw[i]:env[i]*.9+raw[i]*.1;
  let beat=0;
  const playing=typeof running!=='undefined'&&running;
  if(playing){const bm=60000/transport.bpm,el=localNow()-t0;if(el>0)beat=Math.exp(-(el%bm)/bm*5);}
  if(env[0]-prevBass>.12)onset=1;prevBass=env[0];onset*=.88;beat=Math.max(beat*(.4+env[0]),onset);
  travel+=dt*(.18+.9*env[0]+(playing?.15:0));
  // switch worlds every 8 bars while playing, every 40 s otherwise
  let s;
  if(playing){const bar=240000/transport.bpm,el=localNow()-t0;s=el>0?Math.floor(el/bar/8):0;}
  else s=Math.floor(now/40000);
  s=((s+manual)%3+3)%3;
  if(s!==scene){scene=s;flash=1;}
  flash*=.92;
  gl.uniform2f(U.uRes,cv.width,cv.height);gl.uniform1f(U.uTime,now/1000);gl.uniform1f(U.uTravel,travel);
  gl.uniform1f(U.uBass,env[0]);gl.uniform1f(U.uMid,env[1]);gl.uniform1f(U.uHigh,env[2]);
  gl.uniform1f(U.uBeat,beat);gl.uniform1f(U.uScene,scene);gl.uniform1f(U.uFlash,flash);
  gl.drawArrays(gl.TRIANGLES,0,3);
}
requestAnimationFrame(frame);

function setEnabled(on){enabled=on;document.documentElement.classList.toggle('fx',on);cv.style.display=on?'block':'none';
  try{localStorage.setItem('studioFx',on?'on':'off');}catch(_){}
  const b=document.getElementById('fxBtn');if(b){b.classList.toggle('on',on);b.textContent=on?'🌌 Visuals: on':'🌌 Visuals: off';}}
window.studioFx={setEnabled,toggle(){setEnabled(!enabled);},next(){manual++;},
  vj(on){document.documentElement.classList.toggle('vj',on);if(on&&!enabled)setEnabled(true);}};
setEnabled(enabled);
})();
