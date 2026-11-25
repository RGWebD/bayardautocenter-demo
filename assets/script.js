(()=>{
const d=document,root=d.documentElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $=(s,c=d)=>c.querySelector(s),$$=(s,c=d)=>[...c.querySelectorAll(s)];

/* open / closed badge — America/New_York, Mon–Fri 8–18 */
function nyNow(){const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const o={};p.forEach(x=>o[x.type]=x.value);const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];return{day:days.indexOf(o.weekday),min:(+o.hour%24)*60+(+o.minute)}}
function status(){const n=nyNow(),wk=n.day>=1&&n.day<=5,open=wk&&n.min>=480&&n.min<1080;let t;
 if(open)t='Open now · until 6 PM';else if(wk&&n.min<480)t='Closed · opens 8 AM';else if(n.day===5||n.day===6||n.day===0)t='Closed · opens Mon 8 AM';else t='Closed · opens 8 AM tomorrow';
 $$('[data-status]').forEach(el=>{el.classList.toggle('open',open);el.classList.toggle('closed',!open);const s=$('span',el);if(s)s.textContent=t});
 $$('.hours tr').forEach(tr=>tr.classList.toggle('today',+tr.dataset.d===n.day));}
status();setInterval(status,60000);

/* header, progress, mobile bar */
const hdr=$('.hdr'),prog=$('.progress'),mbar=$('.mbar');
function onScroll(){const y=scrollY,h=root.scrollHeight-innerHeight;hdr&&hdr.classList.toggle('scrolled',y>30);if(prog)prog.style.transform=`scaleX(${h>0?y/h:0})`;if(mbar)mbar.classList.toggle('show',y>220)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* mobile nav */
const bg=$('.burger'),mn=$('.mnav');
if(bg&&mn){bg.addEventListener('click',()=>{const o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);mn.classList.toggle('open',o);d.body.style.overflow=o?'hidden':''});
 $$('a',mn).forEach(a=>a.addEventListener('click',()=>{bg.setAttribute('aria-expanded','false');mn.classList.remove('open');d.body.style.overflow=''}))}

/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('[data-r],.stagger').forEach(el=>{if(RM)el.classList.add('in');else io.observe(el)});
$$('.stagger').forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=(i*80)+'ms'));

/* hero start lights */
const hero=$('.hero');
if(hero){const L=$$('.lights i',hero);
 if(RM){L.forEach(l=>l.classList.add('on'));hero.classList.add('go')}
 else{L.forEach((l,i)=>setTimeout(()=>l.classList.add('on'),120+i*170));setTimeout(()=>{L.forEach(l=>l.classList.remove('on'));hero.classList.add('go')},120+5*170+260);setTimeout(()=>L.forEach(l=>l.classList.add('on')),2600)}}

/* parallax: hero layers + page hero bg + why image */
const px=$$('[data-px]');let mx=0,my=0;
if(!RM&&px.length){
 if(FINE&&hero)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;tick()});
 function tick(){const y=scrollY;px.forEach(el=>{const f=+el.dataset.px,m=+(el.dataset.pm||0);const r=el.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;el.style.translate=`${(mx*m).toFixed(1)}px ${(y*f+my*m*.6).toFixed(1)}px`})}
 addEventListener('scroll',()=>requestAnimationFrame(tick),{passive:true});tick()}
const wi=$('.why-img img');
if(wi&&!RM)addEventListener('scroll',()=>{const r=wi.parentElement.getBoundingClientRect();const p=(r.top+r.height/2-innerHeight/2)/innerHeight;wi.style.transform=`scale(1.12) translateY(${(p*-40).toFixed(1)}px)`},{passive:true});

/* counters + gauges */
function runCount(el){const end=+el.dataset.count,dec=+(el.dataset.dec||0),out=$('b',el)||el;const g=el.closest('.gauge');const arc=g&&$('.val',g);
 if(arc){const L=+arc.dataset.len,f=+arc.dataset.frac;arc.style.strokeDashoffset=L*(1-f);const n=$('.ndl',g);if(n)n.style.transform=`rotate(${n.dataset.deg}deg)`}
 if(RM){out.textContent=end.toFixed(dec);return}
 const t0=performance.now(),D=1800;(function f(t){const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,4);out.textContent=(end*e).toFixed(dec);if(k<1)requestAnimationFrame(f);else out.textContent=end.toFixed(dec)})(t0)}
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){runCount(e.target);cio.unobserve(e.target)}}),{threshold:.4});
$$('[data-count]').forEach(el=>cio.observe(el));

/* tilt cards */
if(FINE&&!RM)$$('.tcard,.pcard').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--ry',(x*10).toFixed(2)+'deg');c.style.setProperty('--rx',(-y*10).toFixed(2)+'deg')});c.addEventListener('pointerleave',()=>{c.style.setProperty('--ry','0deg');c.style.setProperty('--rx','0deg')})});

/* magnetic buttons */
if(FINE&&!RM)$$('.btn.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.transform=`translate(${x*.22}px,${y*.32}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});

/* scroll-drawn timeline */
$$('.tl').forEach(tl=>{const p=$('.draw',tl),steps=$$('.step',tl);const svg=$('svg.line',tl);
 function upd(){const r=tl.getBoundingClientRect(),H=r.height;svg.setAttribute('viewBox',`0 0 6 ${H}`);$$('line',svg).forEach(l=>l.setAttribute('y2',H));p.style.strokeDasharray=H;
  let k=RM?1:Math.min(1,Math.max(0,(innerHeight*.62-r.top)/H));p.style.strokeDashoffset=H*(1-k);
  steps.forEach(s=>{const sr=s.getBoundingClientRect();s.classList.toggle('lit',RM||sr.top+30<innerHeight*.62)})}
 addEventListener('scroll',()=>requestAnimationFrame(upd),{passive:true});addEventListener('resize',upd);upd()});

/* carousel */
$$('.car').forEach(c=>{const tr=$('.car-track',c),sl=$$('.slide',c),dots=$('.dots',c);let i=0,tm;
 sl.forEach((s,k)=>{const b=d.createElement('button');b.type='button';b.setAttribute('aria-label','Review '+(k+1));b.onclick=()=>go(k,1);dots.appendChild(b)});
 function go(k,user){i=(k+sl.length)%sl.length;tr.style.transform=`translateX(${-100*i}%)`;$$('button',dots).forEach((b,j)=>b.setAttribute('aria-current',j===i));sl.forEach((s,j)=>s.setAttribute('aria-hidden',j!==i));if(user)auto()}
 function auto(){clearInterval(tm);if(!RM)tm=setInterval(()=>go(i+1),6500)}
 $('.pv',c).onclick=()=>go(i-1,1);$('.nx',c).onclick=()=>go(i+1,1);
 c.addEventListener('mouseenter',()=>clearInterval(tm));c.addEventListener('mouseleave',auto);c.addEventListener('focusin',()=>clearInterval(tm));
 let sx=null;tr.addEventListener('pointerdown',e=>sx=e.clientX);addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)go(i+(dx<0?1:-1),1)});
 go(0);auto()});

/* draggable gallery + lightbox */
$$('.gal-track').forEach(t=>{let down=false,sx=0,sl=0,moved=0,v=0,lx=0,raf;
 t.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=0;sx=lx=e.clientX;sl=t.scrollLeft;t.classList.add('drag');cancelAnimationFrame(raf)});
 addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));v=e.clientX-lx;lx=e.clientX;t.scrollLeft=sl-dx});
 addEventListener('pointerup',()=>{if(!down)return;down=false;t.classList.remove('drag');if(!RM){(function m(){v*=.92;t.scrollLeft-=v;if(Math.abs(v)>.5)raf=requestAnimationFrame(m)})()}});
 t.addEventListener('click',e=>{if(moved>6){e.preventDefault();e.stopPropagation();moved=0}},true)});
const lb=$('.lb');
if(lb){const items=$$('.gal-item'),im=$('img',lb),cap=$('p',lb);let k=0;
 function show(n){k=(n+items.length)%items.length;const it=items[k];im.src=it.dataset.full;im.alt=$('img',it).alt;cap.textContent=$('img',it).alt}
 items.forEach((it,n)=>it.addEventListener('click',()=>{show(n);lb.classList.add('open');lb.setAttribute('aria-hidden','false');$('.x1',lb).focus()}));
 const close=()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true');items[k].focus()};
 $('.x1',lb).onclick=close;$('.pv',lb).onclick=()=>show(k-1);$('.nx',lb).onclick=()=>show(k+1);
 lb.addEventListener('click',e=>{if(e.target===lb)close()});
 addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(k-1);if(e.key==='ArrowRight')show(k+1)})}
root.classList.add('ready');
})();
