/* ============================================================
   Roger B. Jantio — shared behaviour
   Feature-detected: each page runs only the parts it contains.
   ============================================================ */
(function(){
'use strict';
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- in-page anchors (survives sandboxed preview frames) ---------- */
document.addEventListener('click', function(e){
  var a = e.target.closest('a[href^="#"]');
  if(!a) return;
  var id = a.getAttribute('href').slice(1);
  if(!id) return;
  var t = document.getElementById(id);
  if(!t) return;
  e.preventDefault();
  var nav = document.querySelector('.nav');
  var off = (nav ? nav.offsetHeight : 0) + 10;
  window.scrollTo({top:t.getBoundingClientRect().top + window.pageYOffset - off, behavior: reduce ? 'auto' : 'smooth'});
});

/* ---------- reveal on scroll ----------
   Flag the document first so the hidden state in CSS only ever applies when
   this script is running; otherwise a JS failure would leave elements blank. */
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(reduce || !('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  document.documentElement.classList.add('js-reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.25, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

/* ---------- mobile nav ---------- */
(function(){
  var b=document.querySelector('.burger'), l=document.querySelector('.nav-links');
  if(!b||!l) return;
  b.addEventListener('click', function(){
    var open=l.classList.toggle('open');
    b.setAttribute('aria-expanded', open?'true':'false');
  });
})();

/* ---------- generative contour field ---------- */
function contour(cx,cy,r,phase,amp,steps,xs){
  var d='',i,t,rr,x,y;
  for(i=0;i<=steps;i++){
    t=i/steps*Math.PI*2;
    rr=r*(1 + amp*0.34*Math.sin(3*t+phase) + amp*0.20*Math.sin(5*t-phase*1.7)
            + amp*0.12*Math.sin(8*t+phase*0.6) + amp*0.07*Math.sin(13*t-phase*2.3));
    x=cx+rr*Math.cos(t)*(xs||1.45); y=cy+rr*Math.sin(t);
    d+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);
  }
  return d+'Z';
}
document.querySelectorAll('.field').forEach(function(host){
  var W=1400,H=900,layers=[
    {cls:'fl-1',n:9,r0:110,step:44,phase:0.4,amp:1.00,rate:0.14},
    {cls:'fl-2',n:7,r0:250,step:62,phase:2.1,amp:0.72,rate:0.24},
    {cls:'fl-3',n:6,r0:430,step:78,phase:4.3,amp:0.50,rate:0.36}
  ];
  layers.forEach(function(L){
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 '+W+' '+H);
    svg.setAttribute('preserveAspectRatio','xMidYMid slice');
    svg.setAttribute('class',L.cls);
    var g=document.createElementNS('http://www.w3.org/2000/svg','g'),i;
    for(i=0;i<L.n;i++){
      var p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d',contour(W*0.62,H*0.48,L.r0+i*L.step,L.phase+i*0.42,L.amp,190));
      g.appendChild(p);
    }
    svg.appendChild(g); svg.dataset.rate=L.rate; host.appendChild(svg);
  });
});
if(!reduce){
  var svgs=[].slice.call(document.querySelectorAll('.field svg')),ticking=false;
  var move=function(){
    var vh=window.innerHeight;
    svgs.forEach(function(s){
      var rect=s.parentNode.getBoundingClientRect();
      if(rect.bottom<-200||rect.top>vh+200) return;
      var prog=(rect.top+rect.height/2-vh/2)/vh;
      s.style.transform='translate(-50%, calc(-50% + '+(-prog*130*parseFloat(s.dataset.rate)).toFixed(1)+'px))';
    });
    ticking=false;
  };
  window.addEventListener('scroll',function(){ if(!ticking){ticking=true;requestAnimationFrame(move);} },{passive:true});
  window.addEventListener('resize',move);
  move();
}

/* ---------- image slots ---------- */
document.querySelectorAll('.ph, .hero-shot, .photoband, .gallery .gimg').forEach(function(el){
  var img=el.querySelector('img'); if(!img) return;
  img.addEventListener('error',function(){ el.classList.add('empty'); });
  if(img.complete && img.naturalWidth===0) el.classList.add('empty');
});

/* ---------- video cards: privacy-friendly click-to-load ----------
   The thumbnail comes from YouTube's image host; the player iframe is only
   created on click, so nothing tracks the visitor until they ask for it. */
(function(){
  document.querySelectorAll('.vplayer img[data-fallback]').forEach(function(img){
    img.addEventListener('error', function(){
      if(img.dataset.done) return;
      img.dataset.done = '1';
      img.src = img.dataset.fallback;
    });
  });
  document.querySelectorAll('[data-yt] .vbtn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var box = btn.closest('[data-yt]'), id = box && box.dataset.yt;
      if(!id) return;
      if(location.protocol === 'file:'){
        window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener');
        return;
      }
      box.classList.add('playing');
      var f = document.createElement('iframe');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(f);
    });
  });
})();

/* ---------- interactive stage chart ---------- */
(function(){
  var barsEl=document.getElementById('bars'); if(!barsEl) return;
  var rlab=document.getElementById('rlab'), fl=document.getElementById('filters');
  var DATA={
    all:{Angel:6,'Pre-seed':9,Seed:11,'Series A':5},
    us:{Angel:2,'Pre-seed':3,Seed:5,'Series A':3},
    ee:{Angel:1,'Pre-seed':3,Seed:2,'Series A':1},
    'in':{Angel:2,'Pre-seed':1,Seed:2,'Series A':1},
    af:{Angel:1,'Pre-seed':2,Seed:2,'Series A':0}
  };
  var LABELS={all:'All regions',us:'United States',ee:'Eastern Europe','in':'India',af:'Africa'};
  var ORDER=['Angel','Pre-seed','Seed','Series A'];
  var max=0; ORDER.forEach(function(k){ if(DATA.all[k]>max) max=DATA.all[k]; });
  function draw(key){
    var d=DATA[key];
    barsEl.innerHTML=ORDER.map(function(k){
      return '<li><span class="bl">'+k+'</span><span class="tr"><i></i></span><span class="vl">'+(d[k]||0)+'</span></li>';
    }).join('');
    if(rlab) rlab.textContent=LABELS[key];
    requestAnimationFrame(function(){
      [].slice.call(barsEl.children).forEach(function(li,i){
        li.querySelector('i').style.width=((d[ORDER[i]]||0)/max*100)+'%';
      });
    });
  }
  if(fl) fl.addEventListener('click',function(e){
    var b=e.target.closest('.fbtn'); if(!b) return;
    this.querySelectorAll('.fbtn').forEach(function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
    draw(b.dataset.r);
  });
  if(reduce || !('IntersectionObserver' in window)) draw('all');
  else{
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ draw('all'); io.disconnect(); } }); },{threshold:.15});
    io.observe(barsEl);
  }
})();

/* ---------- cumulative positions chart ---------- */
(function(){
  var svg=document.getElementById('spark'); if(!svg) return;
  var years=[2019,2020,2021,2022,2023,2024,2025,2026], vals=[2,4,7,11,16,22,27,31];
  var W=420,H=190,PL=30,PR=8,PT=14,PB=26,maxV=32;
  function X(i){ return PL+i*(W-PL-PR)/(years.length-1); }
  function Y(v){ return H-PB-(v/maxV)*(H-PT-PB); }
  var out='';
  [0,8,16,24,32].forEach(function(g){
    out+='<line class="grid" x1="'+PL+'" y1="'+Y(g)+'" x2="'+(W-PR)+'" y2="'+Y(g)+'"/>';
    out+='<text x="0" y="'+(Y(g)+3)+'">'+g+'</text>';
  });
  var line=vals.map(function(v,i){ return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1); }).join('');
  out+='<path class="area" d="'+line+'L'+X(years.length-1)+' '+Y(0)+'L'+X(0)+' '+Y(0)+'Z"/>';
  out+='<path class="ln" d="'+line+'"/>';
  vals.forEach(function(v,i){ out+='<circle class="pt" cx="'+X(i).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="3"/>'; });
  years.forEach(function(y,i){ if(i%2===0||i===years.length-1) out+='<text x="'+(X(i)-11)+'" y="'+(H-8)+'">'+String(y).slice(2)+'</text>'; });
  svg.innerHTML=out;
  if(reduce) return;
  var ln=svg.querySelector('.ln'), len=ln.getTotalLength(), fired=false;
  ln.style.strokeDasharray=len; ln.style.strokeDashoffset=len;
  svg.querySelectorAll('.pt').forEach(function(c){ c.style.opacity=0; });
  function run(){
    if(fired) return; fired=true;
    ln.style.transition='stroke-dashoffset 1.3s cubic-bezier(.3,.7,.3,1)';
    ln.style.strokeDashoffset=0;
    svg.querySelectorAll('.pt').forEach(function(c,i){
      c.style.transition='opacity .3s'; setTimeout(function(){ c.style.opacity=1; },180+i*130);
    });
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ run(); io.disconnect(); } }); },{threshold:.3});
    io.observe(svg);
  } else run();
})();

/* ---------- portfolio table ---------- */
(function(){
  var body=document.getElementById('pfbody'); if(!body) return;
  var PF=[
    ['Seed','Applied AI &middot; enterprise','United States'],
    ['Series A','AI infrastructure','United States'],
    ['Seed','Developer tooling','United States'],
    ['Angel','Applied AI &middot; enterprise','United States'],
    ['Pre-seed','Vertical AI','Eastern Europe'],
    ['Seed','Data infrastructure','Eastern Europe'],
    ['Pre-seed','Developer tooling','Eastern Europe'],
    ['Angel','Applied AI &middot; services','India'],
    ['Series A','Fintech &middot; AI','India'],
    ['Pre-seed','Vertical AI','Africa'],
    ['Seed','Trade &amp; logistics AI','Africa']
  ];
  body.innerHTML=PF.map(function(r){
    return '<tr><td class="co">Undisclosed</td><td><span class="chip chip-a">'+r[0]+'</span></td><td>'+r[1]+'</td><td class="g">'+r[2]+'</td></tr>';
  }).join('');
})();

/* ---------- accordions: any .acc list on the page ---------- */
(function(){
  var lists=[].slice.call(document.querySelectorAll('.acc'));
  if(!lists.length) return;
  lists.forEach(function(root){
    var heads=[].slice.call(root.querySelectorAll('.acc-hd'));
    heads.forEach(function(b,i){
      b.addEventListener('click', function(){
        var open=b.getAttribute('aria-expanded')==='true';
        b.setAttribute('aria-expanded', String(!open));
        var body=document.getElementById(b.getAttribute('aria-controls'));
        if(body){ if(open) body.setAttribute('hidden',''); else body.removeAttribute('hidden'); }
      });
      b.addEventListener('keydown', function(ev){
        var n=null;
        if(ev.key==='ArrowDown') n=Math.min(i+1,heads.length-1);
        if(ev.key==='ArrowUp')   n=Math.max(i-1,0);
        if(n!==null){ ev.preventDefault(); heads[n].focus(); }
      });
    });
  });
})();

/* ---------- career timeline ---------- */
(function(){
  var panel=document.getElementById('tlp'); if(!panel) return;
  var eras=[
    {h:'International banking and economic consulting', p:'Began in international banking, then financial and economic consulting. At J.E. Austin Associates in Cambridge, Massachusetts, advised on competitiveness, investment and private-sector development. Then, as Assistant Vice President at Meridien International Bank in New York (1989\u20131990), led the acquisition of the century-old BIAO Bank across Africa.', t:['International banking','Competitiveness','Private-sector development']},
    {h:'Founding Sterling', p:'Founded Sterling Merchant Finance to advise clients operating where capital was scarce, institutions were evolving and conventional structures were inadequate. Early work spanned economic and financial advisory, corporate restructuring, project finance and the reform of state-owned enterprises across Africa. The discipline that would define the firm was set here: when established structures do not fit, the transaction itself must be designed before capital can be raised.', t:['Advisory','Restructuring','Project finance','State-enterprise reform']},
    {h:'Financing and executing complex transactions', p:'Work expanded across power generation, telecommunications, airports and aviation, roads and bridges, mining, water and sanitation, and agriculture. Led the first two airport privatizations in Africa, managed an international African airline and worked at the forefront of telecommunications privatization \u2014 assignments requiring transaction design, institutional reform and operational leadership, not financial advice alone.', t:['Power','Aviation','Telecoms','Transport','Mining','Water']},
    {h:'From adviser to principal investor', p:'Moved beyond advising on the deployment of other people\u2019s capital to committing capital of his own, through Sterling and affiliated vehicles: direct investments, growth capital and fund strategies across emerging markets. Becoming a principal meant living with the consequences of valuation, governance, execution and timing rather than only designing the structure.', t:['Principal investment','Growth capital','Funds']},
    {h:'Investing before consensus', p:'Began building positions in AI and frontier technology ahead of broad institutional enthusiasm \u2014 directly and through SPVs, venture funds and funds of funds, with early exposure to companies including OpenAI and Anthropic alongside emerging businesses across the United States, Europe, India and Africa. The same discipline applied to a new generation of assets.', t:['AI','Frontier technology','SPVs','Venture funds','Angel\u2013Series B']}
  ];
  var btns=[].slice.call(document.querySelectorAll('.tl-btn'));
  function render(i){
    var e=eras[i];
    panel.innerHTML='<h3>'+e.h+'</h3><p>'+e.p+'</p><div class="tags">'+e.t.map(function(x){return '<span class="chip">'+x+'</span>';}).join('')+'</div>';
    if(!reduce){ panel.classList.remove('fade-in'); void panel.offsetWidth; panel.classList.add('fade-in'); }
    btns.forEach(function(b,j){ b.setAttribute('aria-selected', j===i?'true':'false'); });
  }
  btns.forEach(function(b){
    b.addEventListener('click',function(){ render(+b.dataset.i); });
    b.addEventListener('keydown',function(ev){
      var i=+b.dataset.i,n=null;
      if(ev.key==='ArrowRight') n=Math.min(i+1,eras.length-1);
      if(ev.key==='ArrowLeft')  n=Math.max(i-1,0);
      if(n!==null){ ev.preventDefault(); btns[n].focus(); render(n); }
    });
  });
  render(4);
})();

})();

/* ---------- writing: filter essays by theme ---------- */
(function(){
  var bar=document.getElementById('topicfilters'); if(!bar) return;
  var empty=document.getElementById('topicempty');
  bar.addEventListener('click',function(e){
    var b=e.target.closest('.fbtn'); if(!b) return;
    var t=b.dataset.t;
    bar.querySelectorAll('.fbtn').forEach(function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
    var shown=0;
    document.querySelectorAll('.grp').forEach(function(g){
      var n=0;
      g.querySelectorAll('.arts li').forEach(function(li){
        var ok = t==='all' || (' '+(li.dataset.t||'')+' ').indexOf(' '+t+' ')>-1;
        li.hidden=!ok; if(ok) n++;
      });
      g.hidden = n===0; shown+=n;
    });
    if(empty) empty.classList.toggle('on', shown===0);
  });
})();
