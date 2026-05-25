var b=(r,h,o)=>new Promise((f,m)=>{var p=n=>{try{l(o.next(n))}catch(d){m(d)}},c=n=>{try{l(o.throw(n))}catch(d){m(d)}},l=n=>n.done?f(n.value):Promise.resolve(n.value).then(p,c);l((o=o.apply(r,h)).next())});import{j as e}from"./vendor-motion-CKnIx50b.js";import{r as a,L as Y}from"./vendor-react-DqfDPpdI.js";import{z as u,w as B,v,aC as G,K as P,F as Q,aq as V,aO as W,y as _,H,k as J}from"./index-DZ_STOrs.js";const N=({className:r})=>e.jsx("svg",{className:r,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"})}),se=()=>{const[r,h]=a.useState(""),[o,f]=a.useState(!1),[m,p]=a.useState(!1),[c,l]=a.useState(""),[n,d]=a.useState(!1),[k,L]=a.useState(null),[w,g]=a.useState(!1),j=a.useRef(null),$=a.useRef(null),D=a.useRef(null),[C,S]=a.useState(0);a.useEffect(()=>{let i,x=null;const E=M=>{x||(x=M);const O=M-x,z=Math.min(1,O/1500),U=Math.floor(2547*z);S(U),z<1?i=requestAnimationFrame(E):S(2547)};return i=requestAnimationFrame(E),()=>cancelAnimationFrame(i)},[]),a.useEffect(()=>{if(m){const t=Date.now()+18e5,s=setInterval(()=>{const i=Math.max(0,Math.floor((t-Date.now())/1e3));L(i),i<=0&&(p(!1),clearInterval(s))},1e3);return()=>clearInterval(s)}},[m]);const R=a.useCallback(t=>{const s=Math.floor(t/60),i=t%60;return`${s}:${i.toString().padStart(2,"0")}`},[]),F=a.useCallback(t=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t),[]),I=a.useCallback(t=>{h(t.target.value),c&&l("")},[c]),q=a.useCallback(t=>b(null,null,function*(){var s,i;if(t.preventDefault(),!r){l("Email is required"),(s=j.current)==null||s.focus();return}if(!F(r)){l("Valid email required"),(i=j.current)==null||i.focus();return}try{u.loading("Subscribing...",{id:"subscribe"}),yield new Promise(x=>setTimeout(x,600)),u.success("Welcome to Furniqo!",{id:"subscribe"}),f(!0),p(!0),h(""),l(""),setTimeout(()=>f(!1),2e3)}catch(x){u.error("Try again",{id:"subscribe"})}}),[r,F]),y=a.useCallback(()=>b(null,null,function*(){const t="FURNIQO10";g(!0);try{if(navigator.clipboard&&window.isSecureContext){yield navigator.clipboard.writeText(t),u.success("Code copied!",{icon:"📋",duration:1500}),g(!1);return}const s=document.createElement("textarea");s.value=t,s.style.position="fixed",s.style.left="-999999px",s.style.top="-999999px",document.body.appendChild(s),s.focus(),s.select();const i=document.execCommand("copy");if(document.body.removeChild(s),i)u.success("Code copied!",{icon:"📋",duration:1500});else throw new Error("execCommand failed")}catch(s){u.error("Press Ctrl+C to copy",{duration:2e3})}finally{setTimeout(()=>g(!1),800)}}),[]),A=a.useCallback(()=>b(null,null,function*(){y()}),[y]),T="FURNIQO10",X=a.useMemo(()=>[...Array(15)].map((t,s)=>({id:s,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,delay:Math.random()*3,duration:4+Math.random()*3,size:1+Math.random()*2})),[]);return e.jsxs("section",{ref:$,className:"relative py-6 sm:py-8 md:py-10 overflow-hidden",style:{background:"linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #db2777 50%, #7c3aed 75%, #4f46e5 100%)",backgroundSize:"200% 200%"},children:[e.jsx("div",{className:"absolute inset-0 pointer-events-none animate-gradient-shift",style:{background:"radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)"}}),e.jsx("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:X.map(t=>e.jsx("div",{className:"absolute rounded-full bg-white/15 animate-float-particle",style:{left:t.left,top:t.top,width:`${t.size}px`,height:`${t.size}px`,animationDelay:`${t.delay}s`,animationDuration:`${t.duration}s`}},t.id))}),e.jsx("div",{className:"absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"}),e.jsx("div",{className:"absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slower"}),e.jsx("div",{className:"w-full px-[2%] sm:px-[3%] md:px-[4%] relative z-10",children:e.jsxs("div",{className:"max-w-xl mx-auto text-center",children:[e.jsxs("div",{className:"inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full mb-3 border border-white/20",children:[e.jsx("div",{className:"animate-spin-slow",children:e.jsx(N,{className:"h-2.5 w-2.5 text-amber-300"})}),e.jsx("span",{className:"text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider",children:"EXCLUSIVE 10% OFF"}),e.jsx(N,{className:"h-2.5 w-2.5 text-amber-300"})]}),e.jsxs("h2",{className:"text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 tracking-tight px-2",children:["Join the"," ",e.jsxs("span",{className:"relative inline-block",children:[e.jsx("span",{className:"relative z-10 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent",children:"Furniqo"}),e.jsx("span",{className:"absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full"})]})," ","Family"]}),e.jsxs("p",{className:"text-[11px] sm:text-xs text-white/80 mb-4 max-w-sm mx-auto leading-relaxed px-3",children:["Get ",e.jsx("span",{className:"font-bold text-amber-300",children:"10% OFF"})," your first order + early access"]}),m&&e.jsxs("div",{className:"relative mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xl overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer"}),e.jsx("button",{onClick:()=>p(!1),className:"absolute top-1.5 right-1.5 z-20 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors",children:e.jsx(B,{className:"h-2.5 w-2.5 text-white"})}),e.jsxs("div",{className:"relative z-10 text-center",children:[e.jsxs("p",{className:"text-white text-[10px] sm:text-xs font-semibold mb-1.5 flex items-center justify-center gap-1",children:[e.jsx(N,{className:"h-3 w-3"}),"Your code is ready!"]}),e.jsxs("div",{className:"flex items-center justify-center gap-2 mb-1.5",children:[e.jsx("code",{ref:D,className:"bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono text-white font-bold text-sm sm:text-base tracking-wider border border-white/30 cursor-pointer hover:bg-white/30 transition-colors select-all",onClick:A,title:"Click to copy",children:T}),e.jsxs("button",{onClick:y,className:"flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white text-[10px] font-medium",disabled:w,children:[w?e.jsx("div",{className:"animate-spin",children:e.jsx(v,{className:"h-3 w-3"})}):e.jsx(G,{className:"h-3 w-3"}),e.jsx("span",{className:"hidden xs:inline",children:w?"Copied!":"Copy"})]})]}),e.jsxs("div",{className:"flex items-center justify-center gap-2 mt-1.5 pt-1.5 border-t border-white/20",children:[e.jsxs("p",{className:"text-white/80 text-[9px] flex items-center gap-1",children:[e.jsx(P,{className:"h-2.5 w-2.5"}),"Expires: ",e.jsx("span",{className:"font-mono font-bold text-white",children:k?R(k):"30:00"})]}),e.jsxs(Y,{to:"/products",className:"text-white text-[9px] font-semibold hover:underline flex items-center gap-1 transition-all",children:["Shop Now ",e.jsx(Q,{className:"h-2 w-2"})]})]})]})]}),e.jsxs("form",{onSubmit:q,className:"max-w-[280px] xs:max-w-sm mx-auto",children:[e.jsxs("div",{className:`flex items-center gap-1.5 p-1 rounded-full transition-all duration-200 ${n?"bg-white/20 ring-2 ring-white/30":"bg-white/10"}`,children:[e.jsxs("div",{className:"relative flex-grow min-w-0",children:[e.jsx(V,{className:"absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/60"}),e.jsx("input",{ref:j,type:"email",value:r,onChange:I,onFocus:()=>d(!0),onBlur:()=>d(!1),placeholder:"Email",className:`w-full pl-7 pr-2 py-1.5 text-[11px] rounded-full bg-transparent text-white placeholder-white/50 focus:outline-none transition-all ${c?"ring-2 ring-red-400":""}`})]}),e.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white text-primary-600 rounded-full font-semibold text-[10px] sm:text-[11px] transition-all hover:bg-neutral-100 flex-shrink-0 active:scale-95",disabled:o,children:o?e.jsxs("div",{className:"flex items-center gap-0.5",children:[e.jsx(v,{className:"h-2.5 w-2.5"}),e.jsx("span",{className:"hidden xs:inline",children:"Done!"})]}):e.jsxs("div",{className:"flex items-center gap-0.5",children:[e.jsx("span",{className:"hidden xs:inline",children:"Subscribe"}),e.jsx("span",{className:"xs:hidden",children:"Sub"}),e.jsx(W,{className:"h-2.5 w-2.5"})]})})]}),c&&e.jsx("p",{className:"text-left mt-1 text-[9px] text-red-300 px-2",children:c}),e.jsx("div",{className:"flex items-center justify-center gap-2 mt-2 flex-wrap",children:[{icon:_,label:"No spam"},{icon:v,label:"Unsubscribe"},{icon:H,label:"10% off"}].map((t,s)=>e.jsxs("div",{className:"flex items-center gap-0.5 text-white/50 text-[8px] sm:text-[9px] hover:text-white transition-colors duration-150",children:[e.jsx(t.icon,{className:"h-2 w-2"}),e.jsx("span",{children:t.label})]},s))})]}),e.jsxs("div",{className:"mt-3 flex flex-col items-center justify-center gap-1.5",children:[e.jsx("div",{className:"flex items-center justify-center gap-0.5",children:[...Array(5)].map((t,s)=>e.jsx(J,{className:"h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-300 fill-current"},s))}),e.jsxs("div",{className:"flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap",children:[e.jsxs("div",{className:"flex -space-x-1 flex-shrink-0",children:[["#6366f1","#8b5cf6","#a855f7","#d946ef"].map((t,s)=>e.jsx("div",{className:"w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/30 flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5",style:{background:t},children:String.fromCharCode(65+s)},s)),e.jsxs("div",{className:"w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5",children:[C.toLocaleString(),"+"]})]}),e.jsxs("span",{className:"text-[8px] sm:text-[9px] text-white/70 flex-shrink-0",children:[C.toLocaleString(),"+ joined this month"]})]})]})]})}),e.jsx("style",{children:`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 0%; opacity: 0.5; }
          50% { background-position: 100% 100%; opacity: 0.8; }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-25px) translateX(var(--tx, 15px)); opacity: 0; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.3; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 20s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
          --tx: 15px;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2.5s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `})]})};export{se as N};
