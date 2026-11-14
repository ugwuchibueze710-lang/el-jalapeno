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

  // NEON SIGN: wire from sign to wall outlet + light switch
  var hero=document.querySelector('.hero'), sign=document.getElementById('neonSign'),
      sw=document.getElementById('neonSwitch'), lbl=document.getElementById('switchLabel'),
      wp=document.getElementById('wirePath'), ws=document.getElementById('wireShine');
  var power=document.querySelector('.wall-power');
  function drawWire(){
    var sr=sign.getBoundingClientRect(), hr=hero.getBoundingClientRect();
    if(window.innerWidth<=720){ power.style.top=(sr.bottom-hr.top+34)+'px'; power.style.bottom='auto'; power.style.left=Math.max(12,sr.left-hr.left+sr.width*0.12)+'px'; }
    else { power.style.top=''; power.style.bottom=''; power.style.left=''; }
    var h=hero.getBoundingClientRect(), a=document.getElementById('wireStart').getBoundingClientRect(),
        b=document.getElementById('wireEnd').getBoundingClientRect();
    var x1=a.left-h.left, y1=a.top-h.top, x2=b.left-h.left+b.width/2, y2=b.top-h.top+2;
    // hangs straight down from behind the sign, sags below, then rises into the plug
    var pb=y2+b.height, low=pb+18;
    var d='M'+x1+','+y1+' C'+x1+','+(low+6)+' '+(x2+(x1-x2)*0.3)+','+(low)+' '+x2+','+(low)+' L'+x2+','+(pb-2);
    wp.setAttribute('d',d); ws.setAttribute('d',d);
  }
  var actx;
  function clickSound(){
    try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)();
      var o=actx.createOscillator(), g=actx.createGain(); o.type='square'; o.frequency.value=1800;
      g.gain.setValueAtTime(.08,actx.currentTime); g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.05);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+.06);
    }catch(e){}
  }
  function setNeon(on){
    sign.classList.toggle('on',on); hero.classList.toggle('lights-off',!on);
    sw.setAttribute('aria-pressed',on); sw.setAttribute('aria-label',on?'Turn the neon sign off':'Turn the neon sign on');
    lbl.textContent=on?'ON':'OFF';
    if(on){ sign.classList.remove('flicker'); void sign.offsetWidth; sign.classList.add('flicker'); }
  }
  sw.addEventListener('click',function(){ clickSound(); setNeon(sw.getAttribute('aria-pressed')!=='true'); });
  window.addEventListener('resize',drawWire); window.addEventListener('load',drawWire); drawWire();
  setNeon(true);

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
