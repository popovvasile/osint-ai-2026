// ../../node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/i18n.ts
var titles = {
  "ar-SA": "\u0627\u0644\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A",
  "ca-ES": "Vista Gr\xE0fica",
  "cs-CZ": "Graf",
  "de-DE": "Graphansicht",
  "en-GB": "Graph View",
  "en-US": "Graph View",
  "es-ES": "Vista Gr\xE1fica",
  "fa-IR": "\u0646\u0645\u0627\u06CC \u06AF\u0631\u0627\u0641",
  "fi-FI": "Verkkon\xE4kym\xE4",
  "fr-FR": "Vue Graphique",
  "he-IL": "\u05DE\u05D1\u05D8 \u05D2\u05E8\u05E3",
  "hu-HU": "Grafikonn\xE9zet",
  "id-ID": "Tampilan Grafik",
  "it-IT": "Vista grafico",
  "ja-JP": "\u30B0\u30E9\u30D5\u30D3\u30E5\u30FC",
  "kk-KZ": "\u0413\u0440\u0430\u0444 \u043A\u04E9\u0440\u0456\u043D\u0456\u0441\u0456",
  "ko-KR": "\uADF8\uB798\uD504 \uBDF0",
  "lt-LT": "Grafiko Vaizdas",
  "nb-NO": "Graf-visning",
  "nl-NL": "Grafiekweergave",
  "pl-PL": "Graf",
  "pt-BR": "Vis\xE3o de gr\xE1fico",
  "ro-RO": "Graf",
  "ru-RU": "\u0412\u0438\u0434 \u0433\u0440\u0430\u0444\u0430",
  "th-TH": "\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F",
  "tr-TR": "Grafik G\xF6r\xFCn\xFCm\xFC",
  "uk-UA": "\u0412\u0438\u0433\u043B\u044F\u0434 \u0433\u0440\u0430\u0444\u0430",
  "vi-VN": "S\u01A1 \u0111\u1ED3",
  "zh-CN": "\u5173\u7CFB\u56FE\u8C31",
  "zh-TW": "\u95DC\u4FC2\u5716\u8B5C"
};
function graphTitle(locale) {
  return locale && titles[locale] || titles["en-US"];
}

// quartz-inline-asset:/mnt/Storage/Projects/osint-ai-2026/plugins/graph/src/components/styles/graph.scss
var graph_default = ".graph > h3 {\n  font-size: 1rem;\n  margin: 0;\n}\n.graph > .graph-outer {\n  border-radius: 5px;\n  border: 1px solid var(--lightgray);\n  box-sizing: border-box;\n  height: 250px;\n  margin: 0.5em 0;\n  position: relative;\n  overflow: hidden;\n}\n.graph > .graph-outer > .global-graph-icon {\n  cursor: pointer;\n  background: none;\n  border: none;\n  color: var(--dark);\n  opacity: 0.5;\n  width: 24px;\n  height: 24px;\n  position: absolute;\n  padding: 0.2rem;\n  margin: 0.3rem;\n  top: 0;\n  right: 0;\n  border-radius: 4px;\n  background-color: transparent;\n  transition: background-color 0.5s ease;\n}\n.graph > .graph-outer > .global-graph-icon:hover {\n  background-color: var(--lightgray);\n}\n.graph > .global-graph-outer {\n  position: fixed;\n  z-index: 9999;\n  left: 0;\n  top: 0;\n  width: 100vw;\n  height: 100%;\n  backdrop-filter: blur(4px);\n  display: none;\n  overflow: hidden;\n}\n.graph > .global-graph-outer.active {\n  display: inline-block;\n}\n.graph > .global-graph-outer > .global-graph-container {\n  border: 1px solid var(--lightgray);\n  background-color: var(--light);\n  border-radius: 5px;\n  box-sizing: border-box;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  height: 80vh;\n  width: 80vw;\n}\n@media all and (max-width: 800px) {\n  .graph > .global-graph-outer > .global-graph-container {\n    width: 90%;\n  }\n}\n\n.graph-container {\n  width: 100%;\n  height: 100%;\n}\n\n.graph-legend {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.35rem 0.75rem;\n  margin: 0.4rem 0 0;\n  padding: 0;\n  font-size: 0.72rem;\n  line-height: 1.25;\n  color: var(--darkgray);\n}\n\n.graph-legend-item {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.3rem;\n  white-space: nowrap;\n}\n\n.graph-legend-swatch {\n  display: inline-block;\n  width: 0.65rem;\n  height: 0.65rem;\n  border-radius: 2px;\n  flex-shrink: 0;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);\n}\n.graph-legend-swatch--current {\n  background-color: transparent;\n  box-shadow: inset 0 0 0 2px var(--secondary);\n}\n\n.global-graph-outer > .graph-legend {\n  position: fixed;\n  z-index: 10000;\n  left: calc(50% - 40vw + 1rem);\n  bottom: calc(50% - 40vh + 1rem);\n  margin: 0;\n  padding: 0.55rem 0.75rem;\n  border: 1px solid var(--lightgray);\n  border-radius: 6px;\n  background: rgba(0, 0, 0, 0.78);\n  font-size: 0.8rem;\n  pointer-events: none;\n  display: none;\n}\n@media all and (max-width: 800px) {\n  .global-graph-outer > .graph-legend {\n    left: calc(5% + 0.75rem);\n    bottom: calc(50% - 40vh + 0.75rem);\n  }\n}\n\n.global-graph-outer.active > .graph-legend {\n  display: flex;\n}";

// quartz-inline-asset:/mnt/Storage/Projects/osint-ai-2026/plugins/graph/src/components/scripts/graph.inline.ts
var graph_inline_default = `function D(a){return(a==="index"||a.endsWith("/index"))&&(a=a.slice(0,-5)),a.startsWith("/")&&(a=a.substring(1)),a.endsWith("/")&&(a=a.slice(0,-1)),a.length===0?"/":a}function Ae(a,k){return k.has(a)?a:a==="/"||a===""?k.has("index")?"index":null:k.has(a+"/index")?a+"/index":null}function We(){let a=decodeURI(window.location.pathname);return a.endsWith("/")&&(a=a.slice(0,-1)),a.startsWith("/")&&(a=a.slice(1)),a}function te(){return typeof document>"u"?"":document.body&&document.body.dataset&&document.body.dataset.basepath||""}function ee(a){let k=te(),J=a.startsWith("/")?a:"/"+a;return k+J}function Te(a){for(;a.firstChild;)a.removeChild(a.firstChild)}(function(){function a(l){try{return decodeURIComponent(l)}catch{return l}}function k(){var l=We(),c=te();return c&&l.startsWith(c.replace(/^\\//,""))&&(l=l.slice(c.replace(/^\\//,"").length),l.startsWith("/")&&(l=l.slice(1))),a(l)}function J(l){var c=document.querySelector('script[src="'+l+'"]');return c?Promise.resolve():new Promise(function(C,Z){var E=document.createElement("script");E.src=l,E.crossOrigin="anonymous",E.onload=C,E.onerror=Z,document.head.appendChild(E)})}Promise.all([J("https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"),J("https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.js")]).then(function(){ae()}).catch(function(l){console.error("[Graph] Failed to load libraries:",l);for(var c=document.querySelectorAll(".graph-container"),C=0;C<c.length;C++)c[C].textContent="Graph could not load. Check your network connection.",c[C].style.display="flex",c[C].style.alignItems="center",c[C].style.justifyContent="center",c[C].style.color="var(--gray)",c[C].style.fontSize="0.9rem"});function ae(){var l=window.d3,c=window.PIXI;if(!l||!c){console.error("[Graph] Libraries not loaded");return}var C="graph-visited";function Z(){return new Set(JSON.parse(localStorage.getItem(C)||"[]"))}function E(n){var f=Z();f.add(n),localStorage.setItem(C,JSON.stringify(Array.from(f)))}function W(n,f){if(!n)return f;var s=document.createElement("div");s.style.color=n,s.style.position="absolute",s.style.visibility="hidden",document.body.appendChild(s);var u=getComputedStyle(s).color;return s.remove(),u||f}async function Er(n,f,s){var u=document.body&&document.body.dataset.slug,b=a(D(u||f));b===""&&(b="index");var m=!!n.closest(".global-graph-container"),K=Z();if(Te(n),s!==void 0&&s!==dr)return console.log("[Graph] Stale render, skipping"),function(){};var w=JSON.parse(n.dataset.cfg||"{}"),oe=w.drag,ie=w.zoom,Wr=w.depth,Tr=w.scale||1,le=w.repelForce||.5,ce=w.centerForce||.3,se=w.linkDistance||30,ue=w.fontSize||.6,fe=w.opacityScale||1,de=w.removeTags||[],ve=w.showTags,he=w.focusOnHover,ge=w.enableRadial,N=w.sections||[],U;try{var Fr=await fetchData;U=new Map;for(var Ir in Fr)U.set(a(D(Ir)),Fr[Ir])}catch(r){return console.error("[Graph] Error loading data:",r),function(){}}var x=n.offsetWidth||Math.floor(window.innerWidth*.8),p=Math.max(n.offsetHeight,250);m&&n.offsetHeight<100&&(p=Math.floor(window.innerHeight*.8));var z=[],nr=[],Vr=new Set(U.keys());U.forEach(function(r,e){for(var t=r.links||[],i=0;i<t.length;i++){var o=Ae(D(t[i]),Vr);o&&z.push({source:e,target:o})}if(ve)for(var g=r.tags||[],i=0;i<g.length;i++){var G=g[i];if(de.indexOf(G)===-1){var M=D("tags/"+G);nr.indexOf(M)===-1&&nr.push(M),z.push({source:e,target:M})}}});var P=new Set;if(Wr>=0)for(var or=[b],ir=new Set([b]),zr=0;zr<=Wr&&or.length>0;zr++){for(var mr=[],pr=0;pr<or.length;pr++){var yr=or[pr];P.add(yr);for(var br=0;br<z.length;br++){var y=z[br];y.source===yr&&!ir.has(y.target)&&(ir.add(y.target),mr.push(y.target)),y.target===yr&&!ir.has(y.source)&&(ir.add(y.source),mr.push(y.source))}}or=mr}else{Vr.forEach(function(r){P.add(r)});for(var d=0;d<nr.length;d++)P.add(nr[d])}P.delete("tags/"),P.delete("tags");function Rr(r,e){for(var t=0;t<N.length;t++)for(var i=N[t].tags,o=0;o<r.length;o++)if(i.indexOf(r[o])!==-1)return t;return e?N.length:-1}function me(r){return r.id.startsWith("tags/")?[r.id.substring(5)]:r.tags||[]}function lr(r){return Rr(me(r),r.id.startsWith("tags/"))}var wr=[-.35,0,.35,-.35,0,.35,0],xr=[-.32,-.32,-.32,.32,.32,.32,0];function Xr(r,e){return r<0&&(r=wr.length-1),wr[Math.min(r,wr.length-1)]*e}function Yr(r,e){return r<0&&(r=xr.length-1),xr[Math.min(r,xr.length-1)]*e}var R=[],Sr=new Map;P.forEach(function(r){var e=r.startsWith("tags/"),t=U.get(r),i=e?"#"+r.substring(5):t?.title||a(r),o=e?[]:t?.tags||[],g=Rr(e?[r.substring(5)]:o,e),G=m?Xr(g,x)+(Math.random()-.5)*.18*x:(Math.random()-.5)*.28*x,M=m?Yr(g,p)+(Math.random()-.5)*.18*p:(Math.random()-.5)*.28*p,V={id:r,text:i,tags:o,x:G,y:M,vx:0,vy:0};R.push(V),Sr.set(r,V)});for(var j=[],d=0;d<z.length;d++){var y=z[d];if(P.has(y.source)&&P.has(y.target)){var _r=Sr.get(y.source),qr=Sr.get(y.target);_r&&qr&&j.push({source:_r,target:qr})}}for(var A=getComputedStyle(document.documentElement),pe=W(A.getPropertyValue("--secondary").trim(),"#c792ea"),Cr=W(A.getPropertyValue("--tertiary").trim(),"#82aaff"),kr=W(A.getPropertyValue("--gray").trim(),"#6c6c6c"),Fe=W(A.getPropertyValue("--lightgray").trim(),"#d4d4d4"),ye=W(A.getPropertyValue("--dark").trim(),"#1a1a1a"),be=W(A.getPropertyValue("--light").trim(),"#f5f5f5"),we=A.getPropertyValue("--bodyFont").trim()||"inherit",cr=[],Lr=0;Lr<N.length;Lr++){var Hr=N[Lr];cr.push(W(A.getPropertyValue(Hr.cssVar).trim(),Hr.fallback))}var T=new c.Application;await T.init({width:x,height:p,antialias:!0,backgroundAlpha:0,resolution:window.devicePixelRatio||1,autoDensity:!0,eventMode:"static"}),n.appendChild(T.canvas);var X=new c.Container;T.stage.addChild(X);var F=l.forceSimulation(R).force("charge",l.forceManyBody().strength(-100*le)).force("center",l.forceCenter().strength(ce)).force("link",l.forceLink(j).distance(se)).force("collide",l.forceCollide().radius(function(r){for(var e=0,t=0;t<j.length;t++)(j[t].source.id===r.id||j[t].target.id===r.id)&&e++;return 2+Math.sqrt(e)}).iterations(3));if(m&&F.force("clusterX",l.forceX(function(r){return Xr(lr(r),x)}).strength(.14)).force("clusterY",l.forceY(function(r){return Yr(lr(r),p)}).strength(.14)),ge){var Gr=Math.min(x,p)/2*.8;F.force("radial",l.forceRadial(Gr).strength(.08))}var Kr=new c.Container,Nr=new c.Container,Ur=new c.Container;X.addChild(Kr),X.addChild(Nr),X.addChild(Ur);var h=[],L=[],B=null,Y=new Set,Br=0,sr=!1,v=l.zoomIdentity;function Dr(r){for(var e=0,t=0;t<j.length;t++)(j[t].source.id===r.id||j[t].target.id===r.id)&&e++;return 2+Math.sqrt(e)}function xe(r){var e=lr(r);return e>=0&&e<cr.length?cr[e]:K.has(r.id)||r.id.startsWith("tags/")?Cr:kr}function jr(r){if(B=r,r===null){Y=new Set;for(var e=0;e<h.length;e++)h[e].active=!1;for(var e=0;e<L.length;e++)L[e].active=!1}else{Y=new Set;for(var e=0;e<L.length;e++){var t=L[e].simulationData;t.source.id===r||t.target.id===r?(Y.add(t.source.id),Y.add(t.target.id),L[e].active=!0):L[e].active=!1}Y.add(r);for(var e=0;e<h.length;e++)Y.has(h[e].simulationData.id)?h[e].active=!0:h[e].active=!1}}function Se(){for(var r=0;r<L.length;r++){var e=L[r],t=1;B!==null&&(t=e.active?1:.2),e.alpha=t,e.color=e.active?Cr:kr}}function Ce(){for(var r=1/Tr,e=r*1.1,t=0;t<h.length;t++){var i=h[t];B===i.simulationData.id?(i.label.alpha=1,i.label.scale.set(e)):i.label.scale.set(r)}}function ke(){for(var r=0;r<h.length;r++){var e=h[r],t=1;B!==null&&he&&(t=e.active?1:.2),e.gfx.alpha=t}}function ur(){ke(),Se(),Ce()}for(var d=0;d<R.length;d++){var I=R[d],fr=I.id,Mr=fr.startsWith("tags/"),Gr=Dr(I),Jr=xe(I),_=new c.Text({text:I.text,style:{fontSize:ue*15,fill:ye,fontFamily:we},resolution:window.devicePixelRatio*4});_.anchor.set(.5,1.2),_.alpha=fr===b&&!m?1:0,_.scale.set(1/Tr),Ur.addChild(_);var S=new c.Graphics;S.circle(0,0,Gr);var Zr=Mr&&lr(I)<cr.length;S.fill({color:Mr&&!Zr?be:Jr}),Mr&&!Zr&&S.stroke({width:2,color:Cr}),fr===b&&S.stroke({width:2.5,color:pe}),S.eventMode="static",S.cursor="pointer",S.label=fr,(function(t,i,o){var g=0;i.on("pointerover",function(G){jr(t.id),g=o.alpha,sr||ur()}),i.on("pointerleave",function(){jr(null),o.alpha=g,sr||ur()})})(I,S,_),Nr.addChild(S),h.push({simulationData:I,gfx:S,label:_,color:Jr,alpha:1,active:!1})}for(var d=0;d<j.length;d++){var y=j[d],S=new c.Graphics;S.eventMode="none",Kr.addChild(S),L.push({simulationData:y,gfx:S,color:kr,alpha:1,active:!1})}if(oe){var Le=function(r){for(var e=(r.x-v.x)/v.k,t=(r.y-v.y)/v.k,i=0;i<R.length;i++){var o=R[i],g=e-o.x-x/2,G=t-o.y-p/2,M=Math.sqrt(g*g+G*G),V=Dr(o);if(M<V+5)return o}return null},Ge=function(r){r.active||F.alphaTarget(1).restart(),r.subject.fx=r.subject.x,r.subject.fy=r.subject.y;var e=(r.x-v.x)/v.k-x/2,t=(r.y-v.y)/v.k-p/2;r.subject.__dragOffset={x:e-r.subject.x,y:t-r.subject.y},Br=Date.now(),sr=!0,B=r.subject.id},je=function(r){var e=(r.x-v.x)/v.k-x/2,t=(r.y-v.y)/v.k-p/2;r.subject.fx=e-r.subject.__dragOffset.x,r.subject.fy=t-r.subject.__dragOffset.y},Me=function(r){if(r.active||F.alphaTarget(0),r.subject.fx=null,r.subject.fy=null,sr=!1,jr(null),ur(),Date.now()-Br<500){var e=ee(r.subject.id);window.location.href=e}},Ee=l.drag().container(T.canvas).subject(Le).on("start",Ge).on("drag",je).on("end",Me);l.select(T.canvas).call(Ee)}else for(var d=0;d<h.length;d++)(function(e){e.gfx.on("click",function(){var t=ee(e.simulationData.id);window.location.href=t})})(h[d]);if(ie){var Oe=function(r){v=r.transform,X.scale.set(v.k,v.k),X.position.set(v.x,v.y);for(var e=v.k*fe,t=Math.max((e-1)/3.75,0),i=0;i<h.length;i++){var o=h[i];if(o.label){if(o.active){o.label.alpha=1;continue}if(!m&&o.simulationData.id===b){o.label.alpha=1;continue}o.label.alpha=m?t:0}}},Pe=l.zoom().extent([[0,0],[x,p]]).scaleExtent([.25,4]).on("zoom",Oe);l.select(T.canvas).call(Pe)}var $r=!1;function Qr(){if(!$r){for(var r=0;r<h.length;r++){var e=h[r],t=e.simulationData.x,i=e.simulationData.y;t!=null&&i!=null&&(e.gfx.position.set(t+x/2,i+p/2),e.label&&e.label.position.set(t+x/2,i+p/2))}for(var r=0;r<L.length;r++){var o=L[r],g=o.simulationData,G=g.source.x,M=g.source.y,V=g.target.x,re=g.target.y;G!=null&&M!=null&&V!=null&&re!=null&&(o.gfx.clear(),o.gfx.moveTo(G+x/2,M+p/2),o.gfx.lineTo(V+x/2,re+p/2),o.gfx.stroke({alpha:o.alpha,width:1,color:o.color}))}requestAnimationFrame(Qr)}}return F.on("tick",function(){}),F.restart(),ur(),Qr(),function(){$r=!0,F.stop();try{T.destroy(!0)}catch{}}}var $=[],Q=[],dr=0;function Or(){for(var n=0;n<$.length;n++)$[n]();$=[]}function vr(){for(var n=0;n<Q.length;n++)Q[n]();Q=[]}var O=[],q=[],rr=null,er=null,tr=null;function hr(){vr();for(var n=0;n<O.length;n++){O[n].classList.remove("active");var f=O[n].closest(".sidebar");f&&(f.style.zIndex="")}}function H(){for(var n=0;n<O.length;n++)if(O[n].classList.contains("active"))return!0;return!1}function gr(){vr();for(var n=k(),f=0;f<O.length;f++){var s=O[f];s.classList.add("active");var u=s.closest(".sidebar");u&&(u.style.zIndex="1");var b=s.querySelector(".global-graph-container");b&&(function(m){Er(m,n,void 0).then(function(K){Q.push(K)}).catch(function(K){console.error("[Graph] Global render error:",K)})})(b)}}function Pr(){H()?hr():gr()}function Ar(){Or();var n=++dr,f=k();E(f);for(var s=document.querySelectorAll(".graph-container"),u=0;u<s.length;u++)(function(b){Er(b,f,n).then(function(m){n===dr&&$.push(m)}).catch(function(m){console.error("[Graph] Local render error:",m)})})(s[u])}function ar(n){var f=n.detail?n.detail.url:k();if(E(a(D(f))),Ar(),O=Array.from(document.querySelectorAll(".global-graph-outer")),tr)for(var s=0;s<q.length;s++)q[s].removeEventListener("click",tr);q=Array.from(document.querySelectorAll(".global-graph-icon")),tr=function(){Pr()};for(var s=0;s<q.length;s++)q[s].addEventListener("click",tr);rr&&document.removeEventListener("click",rr),rr=function(u){if(H()){var b=u.target.closest(".global-graph-container"),m=u.target.closest(".global-graph-icon");!b&&!m&&hr()}},document.addEventListener("click",rr),er&&document.removeEventListener("keydown",er),er=function(u){if(u.key==="Escape"){H()&&hr();return}u.key==="g"&&(u.ctrlKey||u.metaKey)&&!u.shiftKey&&(u.preventDefault(),Pr())},document.addEventListener("keydown",er),H()&&gr()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",function(){ar({detail:{url:k()}})}):ar({detail:{url:k()}}),document.addEventListener("prenav",function(){Or(),vr()}),document.addEventListener("nav",ar),document.addEventListener("render",ar);function ne(){Ar(),H()&&gr()}document.addEventListener("themechange",ne)}})();
`;

// src/components/Graph.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var defaultSections = [
  {
    id: "lesson",
    label: "\u0423\u0440\u043E\u043A\u0438",
    tags: ["lesson"],
    cssVar: "--hub-lesson",
    fallback: "#eec35e"
  },
  {
    id: "homework",
    label: "\u0414\u0417",
    tags: ["homework"],
    cssVar: "--hub-homework",
    fallback: "#d4845a"
  },
  {
    id: "materials",
    label: "\u041C\u0430\u0442\u0435\u0440\u0456\u0430\u043B\u0438",
    tags: ["materials"],
    cssVar: "--hub-materials",
    fallback: "#7a9bb8"
  },
  {
    id: "project",
    label: "\u041F\u0440\u043E\u0454\u043A\u0442\u0438",
    tags: ["project"],
    cssVar: "--hub-project",
    fallback: "#7cb87c"
  },
  {
    id: "case",
    label: "\u041A\u0435\u0439\u0441\u0438",
    tags: ["case"],
    cssVar: "--hub-case",
    fallback: "#c47a9e"
  },
  {
    id: "meta",
    label: "\u041C\u0435\u0442\u0430",
    tags: ["meta"],
    cssVar: "--hub-meta",
    fallback: "#9a9a9a"
  }
];
var defaultOptions = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: false,
    enableRadial: false
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.2,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    // Radial fights the section clusters; off by default for quartz-ts.
    enableRadial: false
  },
  sections: defaultSections,
  legend: { show: true, currentPageLabel: "\u041F\u043E\u0442\u043E\u0447\u043D\u0430 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0430" }
};
function Legend({ sections, legend }) {
  if (!legend.show) return null;
  return /* @__PURE__ */ jsxs("div", { class: "graph-legend", "aria-label": "Section legend", children: [
    sections.map((s) => /* @__PURE__ */ jsxs("span", { class: "graph-legend-item", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          class: "graph-legend-swatch",
          style: `background-color: var(${s.cssVar}, ${s.fallback})`,
          "aria-hidden": "true"
        }
      ),
      s.label
    ] }, s.id)),
    /* @__PURE__ */ jsxs("span", { class: "graph-legend-item", children: [
      /* @__PURE__ */ jsx("span", { class: "graph-legend-swatch graph-legend-swatch--current", "aria-hidden": "true" }),
      legend.currentPageLabel
    ] })
  ] });
}
var Graph_default = ((userOpts) => {
  const Graph = ({ displayClass, cfg }) => {
    const sections = userOpts?.sections ?? defaultOptions.sections;
    const legend = { ...defaultOptions.legend, ...userOpts?.legend };
    const localGraph = { ...defaultOptions.localGraph, ...userOpts?.localGraph, sections };
    const globalGraph = { ...defaultOptions.globalGraph, ...userOpts?.globalGraph, sections };
    return /* @__PURE__ */ jsxs("div", { class: classNames(displayClass, "graph"), children: [
      /* @__PURE__ */ jsx("h3", { children: graphTitle(cfg.locale) }),
      /* @__PURE__ */ jsxs("div", { class: "graph-outer", children: [
        /* @__PURE__ */ jsx("div", { class: "graph-container", "data-cfg": JSON.stringify(localGraph) }),
        /* @__PURE__ */ jsx("button", { class: "global-graph-icon", "aria-label": "Global Graph", children: /* @__PURE__ */ jsx(
          "svg",
          {
            version: "1.1",
            xmlns: "http://www.w3.org/2000/svg",
            xmlnsXlink: "http://www.w3.org/1999/xlink",
            x: "0px",
            y: "0px",
            viewBox: "0 0 55 55",
            fill: "currentColor",
            xmlSpace: "preserve",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                d: "M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17\n                s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4\n                c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562\n                C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829\n                c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91\n                v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4\n                s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665\n                C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z M11,9c0-1.103,0.897-2,2-2s2,0.897,2,2s-0.897,2-2,2\n                S11,10.103,11,9z M6,51c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S8.206,51,6,51z M33,49c0,2.206-1.794,4-4,4s-4-1.794-4-4\n                s1.794-4,4-4S33,46.794,33,49z M29,31c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S32.309,31,29,31z M47,41c0,1.103-0.897,2-2,2\n                s-2-0.897-2-2s0.897-2,2-2S47,39.897,47,41z M49,10c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S51.206,10,49,10z"
              }
            )
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(Legend, { sections, legend }),
      /* @__PURE__ */ jsxs("div", { class: "global-graph-outer", children: [
        /* @__PURE__ */ jsx("div", { class: "global-graph-container", "data-cfg": JSON.stringify(globalGraph) }),
        /* @__PURE__ */ jsx(Legend, { sections, legend })
      ] })
    ] });
  };
  Graph.css = graph_default;
  Graph.afterDOMLoaded = graph_inline_default;
  return Graph;
});
export {
  Graph_default as Graph
};
//# sourceMappingURL=index.js.map
