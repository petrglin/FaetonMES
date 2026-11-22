// Presentation-only localisation: simulation identifiers and state remain unchanged.
(()=>{
'use strict';
const root=document.getElementById('furniture-line');
if(!root)return;
const resources=globalThis.FaetonFactoryLocales;
const english=resources.en;
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const matcher=new RegExp('(?<![\\p{L}])(?:'+Object.keys(english).sort((a,b)=>b.length-a.length).map(escapeRE).join('|')+')(?![\\p{L}])','gu');
let language=root.dataset.defaultLanguage==='en'?'en':'ru';
const translate=(value,lang=language)=>lang==='en'?String(value).replace(matcher,key=>english[key]):String(value);
const originals=new WeakMap(),attributes=new WeakMap();
const attributeNames=['aria-label','title','alt','placeholder','data-tooltip'];
const skip=node=>node.nodeType===1&&['SCRIPT','STYLE','TEXTAREA'].includes(node.tagName);
function localiseNode(node){
 // The language switch advertises the destination language in its native wording.
 if(node===button||node.parentElement===button)return;
 if(node.nodeType===3){const value=node.data;if(!value.trim())return;let item=originals.get(node);if(!item||value!==item.last)item={source:value,last:value};const result=translate(item.source);if(value!==result)node.data=result;item.last=result;originals.set(node,item);return;}
 if(node.nodeType!==1||skip(node))return;
 let item=attributes.get(node);if(!item){item={};attributes.set(node,item);}
 for(const name of attributeNames){if(!node.hasAttribute(name))continue;const value=node.getAttribute(name);if(!item[name]||value!==item[name].last)item[name]={source:value,last:value};const result=translate(item[name].source);if(value!==result)node.setAttribute(name,result);item[name].last=result;}
 for(const child of node.childNodes)localiseNode(child);
}
const observer=typeof MutationObserver==='function'?new MutationObserver(mutations=>{
 observer.disconnect();const targets=new Set();
 for(const m of mutations){if(m.type==='childList')m.addedNodes.forEach(n=>targets.add(n));else targets.add(m.target);}
 for(const n of targets)if(root.contains(n))localiseNode(n);
 observe();
}):null;
function observe(){observer?.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributeNames});}
function refresh(){observer?.disconnect();localiseNode(root);observe();}
// Remember canvas drawing commands so existing 3D signs and edge labels can be
// repainted in another language without rebuilding geometry or restarting work.
const canvasStates=new WeakMap(),textCanvases=new Set();let repainting=false;
const proto=globalThis.CanvasRenderingContext2D?.prototype;
const methods=['fillText','strokeText','fillRect','strokeRect','clearRect','drawImage','putImageData','beginPath','moveTo','lineTo','bezierCurveTo','quadraticCurveTo','arc','arcTo','ellipse','rect','roundRect','closePath','fill','stroke','clip','save','restore','translate','rotate','scale','transform','setTransform','resetTransform','setLineDash'];
const paints=new Set(['fillText','strokeText','fillRect','strokeRect','clearRect','drawImage','fill','stroke']);
const styleKeys=['fillStyle','strokeStyle','font','textAlign','textBaseline','direction','lineWidth','lineCap','lineJoin','miterLimit','lineDashOffset','globalAlpha','globalCompositeOperation','shadowColor','shadowBlur','shadowOffsetX','shadowOffsetY','imageSmoothingEnabled','filter','fontKerning','letterSpacing'];
const native={};
if(proto)for(const name of methods){if(typeof proto[name]!=='function')continue;native[name]=proto[name];proto[name]=function(...args){
 if(repainting)return native[name].apply(this,args);
 let state=canvasStates.get(this);if(!state){state={ctx:this,commands:[],text:false,disabled:false,width:this.canvas.width,height:this.canvas.height};canvasStates.set(this,state);}
 if(state.width!==this.canvas.width||state.height!==this.canvas.height){state.commands=[];state.disabled=false;state.text=false;state.width=this.canvas.width;state.height=this.canvas.height;}
 if((name==='clearRect'||name==='fillRect')&&args[0]===0&&args[1]===0&&args[2]>=this.canvas.width&&args[3]>=this.canvas.height){state.commands=[];state.disabled=false;}
 if(!state.disabled){const styles=paints.has(name)?styleKeys.filter(k=>this[k]!==undefined).map(k=>[k,this[k]]):null;state.commands.push({name,args:[...args],styles});if(state.commands.length>3000){state.commands=[];state.disabled=true;}}
 if((name==='fillText'||name==='strokeText')&&/[А-Яа-яЁё]/.test(String(args[0]))){state.text=true;if(!state.tracked){state.tracked=true;textCanvases.add(typeof WeakRef==='function'?new WeakRef(state):state);}}
 if(name==='fillText'||name==='strokeText')args[0]=translate(args[0]);
 return native[name].apply(this,args);
};}
function repaintCanvases(){if(!proto)return;repainting=true;try{const done=new Set();for(const ref of textCanvases){const state=ref.deref?ref.deref():ref;if(!state){textCanvases.delete(ref);continue;}if(done.has(state)||state.disabled)continue;done.add(state);const c=state.ctx;native.save.call(c);native.setTransform.call(c,1,0,0,1,0,0);native.clearRect.call(c,0,0,c.canvas.width,c.canvas.height);native.beginPath.call(c);for(const command of state.commands){if(command.styles)for(const [key,value]of command.styles)c[key]=value;const args=[...command.args];if(command.name==='fillText'||command.name==='strokeText')args[0]=translate(args[0]);native[command.name].apply(c,args);}native.restore.call(c);}}finally{repainting=false;}}
const button=root.querySelector('#fl-language');
function updateButton(){if(!button)return;button.textContent=language==='en'?'Переключить на русский':'Switch to English';button.setAttribute('lang',language==='en'?'ru':'en');button.setAttribute('aria-label',language==='en'?'Переключить на русский':'Switch to English');root.lang=language;window.parent?.postMessage({type:'faeton-language',language},'*');}
function setLanguage(value){const next=value==='en'?'en':'ru';if(next===language){refresh();updateButton();return;}language=next;refresh();updateButton();repaintCanvases();api.onChange?.(language);refresh();updateButton();}
const api=globalThis.FaetonI18n={t:translate,refresh,setLanguage,get language(){return language;},onChange:null};
button?.addEventListener('click',()=>setLanguage(language==='en'?'ru':'en'));
refresh();updateButton();
})();
