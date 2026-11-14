// Floating neon El Jalapeño logos — background + foreground layers, synced to scroll,
// each one hums, flickers and "buzzes" like the main neon sign.
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,1.5);
  var bg=document.createElement('canvas'), fg=document.createElement('canvas');
  bg.id='neonBg'; fg.id='neonFg'; bg.setAttribute('aria-hidden','true'); fg.setAttribute('aria-hidden','true');
  document.body.prepend(bg); document.body.appendChild(fg);
  var bctx=bg.getContext('2d'), fctx=fg.getContext('2d');
  var W=0,H=0, parts=[], fparts=[], sprites=null;

  function load(src){return new Promise(function(r){var i=new Image();i.onload=function(){r(i)};i.onerror=function(){r(null)};i.src=src;});}

  // Build lit + unlit sprites from the real logo art
  function buildSprites(art,tube){
    function mk(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c;}
    var S=160, ar=art.height/art.width, mh=Math.round(S*ar);
    function mascot(lit,blur){
      var pad=56, c=mk(S+pad*2,mh+pad*2), x=c.getContext('2d');
      if(blur) x.filter='blur('+blur+'px)';
      if(lit){
        x.shadowColor='#3fd61a'; x.shadowBlur=40; x.drawImage(tube,pad,pad,S,mh); x.drawImage(tube,pad,pad,S,mh);
        x.shadowColor='#5fe01e'; x.shadowBlur=22; x.drawImage(tube,pad,pad,S,mh);
        x.shadowColor='#b6ff7a'; x.shadowBlur=8;  x.drawImage(tube,pad,pad,S,mh);
        x.shadowBlur=0; x.drawImage(tube,pad,pad,S,mh);
        x.shadowColor='rgba(255,200,80,.55)'; x.shadowBlur=14; x.drawImage(art,pad,pad,S,mh);
      } else {
        x.globalAlpha=.35; x.drawImage(tube,pad,pad,S,mh); x.globalAlpha=.45; x.filter=(blur?'blur('+blur+'px) ':'')+'brightness(.45) saturate(.6)'; x.drawImage(art,pad,pad,S,mh);
      }
      return c;
    }
    function sign(lit,blur){
      var m=mascot(lit,blur), tw=330, c=mk(m.width+tw, m.height), x=c.getContext('2d');
      x.drawImage(m,0,0);
      if(blur) x.filter='blur('+blur+'px)';
      x.textBaseline='middle'; x.font='64px "Kaushan Script", cursive';
      var cy=c.height/2;
      function neon(txt,X,Y,col,glow,size){
        x.font=size+'px "Kaushan Script", cursive';
        if(lit){ x.shadowColor=glow; x.shadowBlur=28; x.fillStyle=col; x.fillText(txt,X,Y); x.shadowBlur=10; x.fillText(txt,X,Y); x.shadowBlur=0; x.fillStyle='#fff6f2'; x.fillText(txt,X,Y); }
        else { x.shadowBlur=0; x.fillStyle='rgba(255,230,225,.28)'; x.fillText(txt,X,Y); }
      }
      neon('El',m.width-20,cy-36,'#b6ff7a','#44e010',52);
      neon('Jalapeño',m.width+10,cy+16,'#ff6a5a','#ff1a10',70);
      return c;
    }
    return { m:[mascot(true),mascot(false)], s:[sign(true),sign(false)],
             mb:[mascot(true,6),mascot(false,6)], sb:[sign(true,6),sign(false,6)] };
  }

  function rnd(a,b){return a+Math.random()*(b-a);}
  function make(layer){
    var p={layer:layer, x:Math.random(), y:Math.random(), rot:rnd(-.35,.35), sway:rnd(0,6.28), swaySp:rnd(.2,.6),
      drift:rnd(.004,.014), hum:rnd(0,6.28), buzz:0, nextBuzz:rnd(1,14), off:0, sign:Math.random()<.3};
    if(layer==='far'){ p.size=rnd(14,24); p.a=rnd(.35,.6); p.par=.12; }
    else if(layer==='mid'){ p.size=rnd(28,46); p.a=rnd(.5,.75); p.par=.3; }
    else if(layer==='near'){ p.size=rnd(56,90); p.a=rnd(.55,.85); p.par=.55; }
    else { p.size=rnd(110,190); p.a=rnd(.08,.16); p.par=1.25; p.sign=Math.random()<.4; }
    return p;
  }
  function populate(){
    var area=W*H; parts=[]; fparts=[];
    var nf=Math.round(area/5200), nm=Math.round(area/17000), nn=Math.round(area/60000), nfg=Math.max(4,Math.round(area/180000));
    for(var i=0;i<nf;i++) parts.push(make('far'));
    for(i=0;i<nm;i++) parts.push(make('mid'));
    for(i=0;i<nn;i++) parts.push(make('near'));
    for(i=0;i<nfg;i++) fparts.push(make('fg'));
  }
  function resize(){
    W=innerWidth; H=innerHeight;
    [bg,fg].forEach(function(c){c.width=W*DPR;c.height=H*DPR;c.style.width=W+'px';c.style.height=H+'px';});
    bctx.setTransform(DPR,0,0,DPR,0,0); fctx.setTransform(DPR,0,0,DPR,0,0);
    populate();
  }

  var last=performance.now();
  function draw(ctx,list,now,dt,blurred){
    var sy=window.scrollY||0, off=document.body.classList.contains('neon-off');
    ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation=off?'source-over':'lighter';
    for(var i=0;i<list.length;i++){
      var p=list[i];
      if(!reduce){
        p.y-=p.drift*dt/1000*0.25; if(p.y<-0.2) p.y+=1.4;
        p.nextBuzz-=dt/1000;
        if(p.nextBuzz<=0){ p.buzz=rnd(.25,.9); p.nextBuzz=rnd(3,18); }
        if(p.buzz>0) p.buzz-=dt/1000;
      }
      var span=H*1.4, y=((p.y*span - sy*p.par)%span+span)%span - H*0.2;
      var x=p.x*W + Math.sin(now/1000*p.swaySp+p.sway)*10;
      var lit=!off, alpha=p.a;
      if(lit){
        alpha*= .88+.12*Math.sin(now/1000*7+p.hum);              // hum
        if(p.buzz>0){ var f=Math.random(); if(f<.45){ lit=false; alpha=p.a*.6; } else alpha*=f; } // buzz/flicker
      } else alpha=p.a*.55;
      var set=blurred?(p.sign?sprites.sb:sprites.mb):(p.sign?sprites.s:sprites.m);
      var img=set[lit?0:1], h=p.size*(p.sign?1:1.2), w=h*img.width/img.height;
      ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,alpha)); ctx.translate(x,y); ctx.rotate(p.rot);
      ctx.drawImage(img,-w/2,-h/2,w,h); ctx.restore();
    }
  }
  function frame(now){
    var dt=Math.min(64,now-last); last=now;
    if(sprites){ draw(bctx,parts,now,dt,false); draw(fctx,fparts,now,dt,true); }
    if(!reduce) requestAnimationFrame(frame);
  }

  window.addEventListener('resize',function(){ clearTimeout(window.__ejNR); window.__ejNR=setTimeout(resize,150); });
  if(reduce) window.addEventListener('scroll',function(){ requestAnimationFrame(frame); },{passive:true});
  document.addEventListener('visibilitychange',function(){ last=performance.now(); });

  resize();
  var fontReady=(document.fonts&&document.fonts.load)?document.fonts.load('64px "Kaushan Script"').catch(function(){}):Promise.resolve();
  Promise.all([load('assets/img/mascot.png'),load('assets/img/mascot-tube.png'),fontReady]).then(function(r){
    if(!r[0]||!r[1]) return;
    sprites=buildSprites(r[0],r[1]);
    requestAnimationFrame(frame);
  });
})();
