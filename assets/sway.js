// Wind: every hanging decoration sways on its own; scrolling adds gusts.
(function(){
  var BG=[{"f": "sway/b00.png", "x": 164, "y": 0, "w": 51, "h": 64, "ox": 49.0, "oy": 0.0, "a": 1}, {"f": "sway/b01.png", "x": 244, "y": 0, "w": 60, "h": 115, "ox": 53.3, "oy": 0.0, "a": 1}, {"f": "sway/b02.png", "x": 29, "y": 167, "w": 50, "h": 55, "ox": 48.0, "oy": 1.8, "a": 1}, {"f": "sway/b03.png", "x": 0, "y": 194, "w": 26, "h": 65, "ox": 42.3, "oy": 1.5, "a": 1}, {"f": "sway/b04.png", "x": 44, "y": 209, "w": 38, "h": 55, "ox": 46.1, "oy": 1.8, "a": 1}, {"f": "sway/b05.png", "x": 79, "y": 209, "w": 36, "h": 61, "ox": 44.4, "oy": 1.6, "a": 1}, {"f": "sway/b06.png", "x": 103, "y": 164, "w": 42, "h": 74, "ox": 46.4, "oy": 1.4, "a": 1}, {"f": "sway/b07.png", "x": 125, "y": 217, "w": 32, "h": 55, "ox": 48.4, "oy": 1.8, "a": 1}, {"f": "sway/b08.png", "x": 161, "y": 176, "w": 40, "h": 78, "ox": 46.2, "oy": 1.3, "a": 1}, {"f": "sway/b09.png", "x": 215, "y": 192, "w": 35, "h": 72, "ox": 45.7, "oy": 1.4, "a": 1}, {"f": "sway/b10.png", "x": 255, "y": 202, "w": 33, "h": 68, "ox": 47.0, "oy": 1.5, "a": 1}, {"f": "sway/b11.png", "x": 0, "y": 27, "w": 130, "h": 173, "ox": 46.2, "oy": 0.6, "a": 0.35}, {"f": "sway/b12.png", "x": 529, "y": 0, "w": 36, "h": 38, "ox": 48.6, "oy": 0.0, "a": 1}, {"f": "sway/b13.png", "x": 576, "y": 0, "w": 38, "h": 101, "ox": 51.3, "oy": 0.0, "a": 1}, {"f": "sway/b14.png", "x": 626, "y": 14, "w": 31, "h": 128, "ox": 56.5, "oy": 0.8, "a": 1}, {"f": "sway/b15.png", "x": 657, "y": 61, "w": 32, "h": 109, "ox": 60.9, "oy": 0.9, "a": 1}, {"f": "sway/b16.png", "x": 685, "y": 97, "w": 31, "h": 102, "ox": 66.1, "oy": 1.0, "a": 1}, {"f": "sway/b17.png", "x": 706, "y": 127, "w": 35, "h": 90, "ox": 72.9, "oy": 1.1, "a": 1}, {"f": "sway/b18.png", "x": 718, "y": 151, "w": 43, "h": 81, "ox": 79.1, "oy": 1.2, "a": 1}, {"f": "sway/b19.png", "x": 743, "y": 170, "w": 37, "h": 75, "ox": 79.7, "oy": 1.3, "a": 1}, {"f": "sway/b20.png", "x": 764, "y": 182, "w": 32, "h": 72, "ox": 76.6, "oy": 1.4, "a": 1}, {"f": "sway/b21.png", "x": 782, "y": 196, "w": 30, "h": 64, "ox": 76.7, "oy": 1.6, "a": 1}, {"f": "sway/b22.png", "x": 537, "y": 176, "w": 18, "h": 68, "ox": 52.8, "oy": 1.5, "a": 1}, {"f": "sway/b23.png", "x": 557, "y": 179, "w": 29, "h": 76, "ox": 55.2, "oy": 1.3, "a": 1}, {"f": "sway/b24.png", "x": 582, "y": 191, "w": 29, "h": 69, "ox": 62.1, "oy": 1.4, "a": 1}, {"f": "sway/b25.png", "x": 608, "y": 204, "w": 29, "h": 65, "ox": 67.2, "oy": 1.5, "a": 1}, {"f": "sway/b26.png", "x": 965, "y": 0, "w": 79, "h": 258, "ox": 63.3, "oy": 0.0, "a": 1.3}, {"f": "sway/b27.png", "x": 1384, "y": 154, "w": 56, "h": 104, "ox": 91.1, "oy": -3.8, "a": 1.3}];
  var FG=[{"f": "fg-flag-0.png", "x": 130, "y": 281, "w": 102, "h": 177, "l": [130, 300], "r": [227, 291], "ox": 47.5, "oy": 5.6}, {"f": "fg-flag-1.png", "x": 294, "y": 212, "w": 132, "h": 226, "l": [294, 258], "r": [423, 213], "ox": 48.9, "oy": 0.4}, {"f": "fg-flag-2.png", "x": 510, "y": 137, "w": 156, "h": 203, "l": [510, 187], "r": [662, 138], "ox": 48.7, "oy": 0.5}, {"f": "fg-flag-3.png", "x": 764, "y": 19, "w": 210, "h": 309, "l": [766, 94], "r": [967, 20], "ox": 48.8, "oy": 0.3}];
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene=document.getElementById('scene'), layer=document.getElementById('swayBg'), fgBox=document.getElementById('fgPapel');
  if(!scene||!layer) return;
  var items=[];
  function rnd(a,b){return a+Math.random()*(b-a);}
  // flags from the real ceiling photo
  BG.forEach(function(d){
    var im=new Image(); im.src='assets/img/'+d.f; im.alt=''; im.draggable=false;
    im.style.transformOrigin=d.ox+'% '+d.oy+'%'; layer.appendChild(im);
    items.push({el:im,d:d,kind:'bg',amp:3.2*d.a,ph:rnd(0,6.3),ph2:rnd(0,6.3),w1:rnd(.7,1.2),w2:rnd(1.6,2.4),g:rnd(.7,1.3)});
  });
  // foreground papel picado string (4 flags) + string
  var svgNS='http://www.w3.org/2000/svg', path=null, fgItems=[];
  if(fgBox){
    var svg=document.createElementNS(svgNS,'svg'); svg.setAttribute('viewBox','0 0 1080 464'); svg.setAttribute('preserveAspectRatio','none');
    path=document.createElementNS(svgNS,'path'); svg.appendChild(path); fgBox.appendChild(svg);
    FG.forEach(function(d){
      var im=new Image(); im.src='assets/img/'+d.f; im.alt=''; im.draggable=false;
      im.style.left=(d.x/1080*100)+'%'; im.style.top=(d.y/464*100)+'%'; im.style.width=(d.w/1080*100)+'%';
      im.style.transformOrigin=d.ox+'% '+d.oy+'%'; fgBox.appendChild(im);
      var it={el:im,d:d,kind:'fg',amp:5,ph:rnd(0,6.3),ph2:rnd(0,6.3),w1:rnd(.6,1),w2:rnd(1.4,2),g:rnd(.8,1.2)};
      items.push(it); fgItems.push(it);
    });
  }
  // chile ristras
  [].forEach.call(document.querySelectorAll('.fg-ristra'),function(el){
    items.push({el:el,kind:'ristra',amp:2.2,ph:rnd(0,6.3),ph2:rnd(0,6.3),w1:rnd(.45,.7),w2:rnd(1.1,1.5),g:rnd(.8,1.1)});
  });

  // place ceiling flags on the photo (same mapping as the background)
  window.__ejSway=function(P,s){
    items.forEach(function(it){ if(it.kind!=='bg') return; var d=it.d, p=P(d.x,d.y);
      it.el.style.left=p[0]+'px'; it.el.style.top=p[1]+'px'; it.el.style.width=(d.w*s)+'px'; it.el.style.height=(d.h*s)+'px'; });
  };
  if(window.__ejLayout) window.__ejLayout();

  var lastY=window.scrollY, gust=0, last=performance.now();
  function frame(now){
    var dt=Math.min(50,now-last)/1000; last=now; var t=now/1000;
    var y=window.scrollY, vel=(y-lastY)/Math.max(dt,.001); lastY=y;
    gust+=(Math.max(-1,Math.min(1,vel/1800))-gust)*Math.min(1,dt*3);   // scroll = gust (signed)
    var breeze=.75+.25*Math.sin(t*.23)+.15*Math.sin(t*.61);              // slow changing wind
    for(var i=0;i<items.length;i++){
      var it=items[i];
      var a=it.amp*breeze*(.65*Math.sin(t*it.w1+it.ph)+.35*Math.sin(t*it.w2+it.ph2)) + gust*it.amp*2.6*it.g;
      var sk=a*.35;
      var dy=0;
      if(it.kind==='fg') dy=Math.sin(t*1.1+it.ph)*3*(1+Math.abs(gust)*2);
      it.el.style.transform=(dy?'translateY('+dy.toFixed(2)+'px) ':'')+'rotate('+a.toFixed(3)+'deg) skewX('+sk.toFixed(3)+'deg)';
    }
    if(path&&fgItems.length){
      var pts=[[-40,330+Math.sin(t*1.1)*4]];
      fgItems.forEach(function(it,k){ var b=Math.sin(t*1.1+it.ph)*3*(1+Math.abs(gust)*2)*464/ (fgBox.offsetHeight||464);
        pts.push([it.d.l[0],it.d.l[1]+b]); pts.push([it.d.r[0],it.d.r[1]+b]); });
      pts.push([1120,0]);
      var dstr='M'+pts[0][0]+','+pts[0][1];
      for(var k=1;k<pts.length;k++){ var p0=pts[k-1],p1=pts[k],mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2+((k%2)?6:2)*(1+Math.abs(gust)); dstr+=' Q'+mx+','+my+' '+p1[0]+','+p1[1]; }
      path.setAttribute('d',dstr);
    }
    if(!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
