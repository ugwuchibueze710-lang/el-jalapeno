(function(){
  var tabs=document.getElementById('menuTabs'), grid=document.getElementById('menuGrid'), note=document.getElementById('menuNote');
  function show(i){
    var c=MENU[i];
    [].forEach.call(tabs.children,function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i);});
    note.textContent=c.note||'';
    grid.innerHTML=c.items.map(function(it){
      return '<article class="dish"><div class="dish-top"><h3>'+it[0]+'</h3><span class="dots"></span><span class="price">$'+it[2]+'</span></div>'+(it[1]?'<p>'+it[1]+'</p>':'')+'</article>';
    }).join('');
  }
  MENU.forEach(function(c,i){
    var b=document.createElement('button'); b.textContent=c.cat; b.setAttribute('role','tab');
    b.onclick=function(){show(i);}; tabs.appendChild(b);
  });
  show(0);

  // ===== HERO: pin sign / plug / switch to real spots in the restaurant photo =====
  var IMG_W=1440, IMG_H=700;               // interior-cine.jpg
  var SIGN={x:590,y:226,w:585};            // back green wall, above the booths
  var OUTLET={x:1230,y:661};               // real wall outlet under the right-hand table
  var SWITCH={x:1266,y:524};
  var TABLE=[[1168,583],[1440,578],[1440,606],[1172,606]]; // tabletop edge the wire passes behind               // wall just above that table
  var hero=document.getElementById('hero'), scene=document.getElementById('scene'),
      bg=document.getElementById('heroBg'), dof=document.getElementById('heroDof'),
      sign=document.getElementById('neonSign'), sw=document.getElementById('neonSwitch'),
      hint=document.getElementById('switchHint'), plug=document.getElementById('plug'),
      copy=document.getElementById('heroCopy'),
      wp=document.getElementById('wirePath'), ws=document.getElementById('wireShine');
  function layout(){
    var W=scene.clientWidth, H=scene.clientHeight, desk=window.innerWidth>1000;
    var s=Math.max(W/IMG_W,H/IMG_H), dw=IMG_W*s, dh=IMG_H*s, ox=(W-dw)/2, oy=H-dh;
    [bg,dof].forEach(function(e){e.style.backgroundSize=dw+'px '+dh+'px';e.style.backgroundPosition=ox+'px '+oy+'px';});
    function P(x,y){return [ox+x*s, oy+y*s];}
    var sr;
    if(desk){
      var p=P(SIGN.x,SIGN.y), w=SIGN.w*s;
      sign.style.left=p[0]+'px'; sign.style.top=p[1]+'px'; sign.style.width=w+'px';
      sign.style.setProperty('--w',w+'px');
      copy.style.width=Math.max(320,Math.min(620,p[0]-W*0.05-30))+'px';
      var o=P(OUTLET.x,OUTLET.y), q=P(SWITCH.x,SWITCH.y), k=Math.max(.8,s);
      plug.style.display=''; plug.style.width=14*k+'px'; plug.style.height=20*k+'px';
      plug.style.left=(o[0]-7*k)+'px'; plug.style.top=(o[1]-10*k)+'px';
      sw.style.width=24*k+'px'; sw.style.height=38*k+'px';
      sw.style.left=(q[0]-12*k)+'px'; sw.style.top=(q[1]-19*k)+'px';
      hint.style.left=(q[0]-hint.offsetWidth/2)+'px'; hint.style.top=(q[1]-19*k-34)+'px';
      document.getElementById('wmTable').setAttribute('points',TABLE.map(function(t){var r=P(t[0],t[1]);return r[0]+','+r[1];}).join(' '));
      sr=sign.getBoundingClientRect(); var hr=scene.getBoundingClientRect();
      var x1=sr.right-hr.left-w*0.06, y1=sr.bottom-hr.top-w*0.02, x2=o[0], y2=o[1]-8*k;
      var d='M'+x1+','+y1+' C'+(x1+4)+','+(y1+(y2-y1)*.5)+' '+(x2-40)+','+(y2-30)+' '+x2+','+y2;
      wp.setAttribute('d',d); ws.setAttribute('d',d);
    } else {
      sign.style.setProperty('--w',sign.offsetWidth+'px'); copy.style.width='';
      sr=sign.getBoundingClientRect(); var hr2=scene.getBoundingClientRect();
      var cx=sr.left-hr2.left+sr.width*0.66, top=sr.bottom-hr2.top;
      plug.style.display='none'; document.getElementById('wmTable').setAttribute('points','');
      sw.style.width='30px'; sw.style.height='46px'; sw.style.left=(cx+28)+'px'; sw.style.top=(top+14)+'px';
      hint.style.left=(cx-hint.offsetWidth-8)+'px'; hint.style.top=(top+26)+'px';
      var d2='M'+cx+','+(top-6)+' C'+cx+','+(top+30)+' '+(cx+30)+','+(top+10)+' '+(cx+43)+','+(top+16);
      wp.setAttribute('d',d2); ws.setAttribute('d',d2);
    }
  }
  var actx;
  function clickSound(){
    try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)();
      var o=actx.createOscillator(), g=actx.createGain(); o.type='square'; o.frequency.value=1700;
      g.gain.setValueAtTime(.07,actx.currentTime); g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.05);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+.06);
    }catch(e){}
  }
  function setNeon(on){
    sign.classList.toggle('on',on); hero.classList.toggle('off',!on);
    sw.setAttribute('aria-pressed',on); sw.setAttribute('aria-label',on?'Turn the neon sign off':'Turn the neon sign on');
    if(on){ sign.classList.remove('flicker'); void sign.offsetWidth; sign.classList.add('flicker'); }
  }
  sw.addEventListener('click',function(){ clickSound(); hint.classList.add('gone'); setNeon(sw.getAttribute('aria-pressed')!=='true'); });
  window.addEventListener('resize',layout); window.addEventListener('load',layout);
  if(document.fonts) document.fonts.ready.then(layout);
  layout(); setNeon(true);

  // highlight today's hours
  var d=new Date().getDay(), row=document.querySelector('#hours tr[data-d="'+d+'"]'); if(row) row.classList.add('today');
  document.getElementById('yr').textContent=new Date().getFullYear();

  // nav active state + close mobile nav on click
  var links=document.querySelectorAll('.nav-links a');
  links.forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('nav-open');});});
  var secs=['menu','gallery','visit'].map(function(id){return document.getElementById(id);});
  window.addEventListener('scroll',function(){
    var y=window.scrollY+120, cur='top';
    secs.forEach(function(s){ if(s.offsetTop<=y) cur=s.id; });
    links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur);});
    document.body.classList.toggle('scrolled',window.scrollY>40);
  },{passive:true});
})();
