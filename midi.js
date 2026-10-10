// Shared Web MIDI input for every page.
// On its own, a machine page listens to every MIDI input itself.
// Inside the studio, the studio page listens instead and routes each controller to one machine
// (the selected one by default) through window.syncAPI.midi(msg).
(function(){
  // msg: {type:'on', note, vel 0..1, ch 1..16} | {type:'off', note, ch} | {type:'alloff', ch}
  function parse(data){
    const s=data[0],d1=data[1],d2=data[2],t=s&0xf0,ch=(s&15)+1;
    if(t===0x90&&d2>0)return {type:'on',note:d1,vel:d2/127,ch};
    if(t===0x80||(t===0x90&&d2===0))return {type:'off',note:d1,ch};
    if(t===0xB0&&(d1===120||d1===123))return {type:'alloff',ch};
    return null;
  }
  function inStudio(){try{return window.parent!==window&&!!window.parent.studioHub;}catch(_){return false;}}
  // onMsg(msg) gets every parsed message, with msg.input = the MIDIInput it came from.
  // onStatus(text, inputs) runs on connect and whenever a device is plugged or unplugged.
  function listen(onMsg,onStatus){
    onStatus=onStatus||function(){};
    if(!navigator.requestMIDIAccess){onStatus('MIDI not supported (use Chrome or Edge, over https or localhost)',[]);return;}
    navigator.requestMIDIAccess().then(acc=>{
      const bind=()=>{
        const ins=[...acc.inputs.values()];
        ins.forEach(inp=>{inp.onmidimessage=e=>{const m=parse(e.data);if(m){m.input=inp;onMsg(m);}};});
        onStatus(ins.length?'MIDI: '+ins.length+' input(s)':'MIDI: no device',ins);
      };
      bind();acc.onstatechange=bind;
    }).catch(()=>onStatus('MIDI denied (allow it from the padlock in the address bar)',[]));
  }
  async function granted(){
    try{return (await navigator.permissions.query({name:'midi'})).state==='granted';}catch(_){return false;}
  }
  window.PopoteMIDI={parse,inStudio,listen,granted};
})();
