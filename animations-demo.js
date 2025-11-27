// animations-demo.js
// Small demo script showing a simple hexagon canvas draw (not production, just explanatory)

// --- rotating square using requestAnimationFrame (simple game-loop demo) ---
(function rafDemo(){
  const canvas = document.getElementById('raf-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let angle = 0;
  function tick(){
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(w/2,h/2);
    ctx.rotate(angle);
    ctx.fillStyle = '#F38833';
    ctx.fillRect(-40,-40,80,80);
    ctx.restore();
    angle += 0.02; // advance rotation per frame
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// --- simple hexagon drawing demo (interactive) ---
(function hexDemo(){
  const canvas = document.getElementById('hexagon-canvas');
  const container = document.getElementById('hexagon-bg');
  if(!canvas || !container) return;
  const ctx = canvas.getContext('2d');
  // make canvas pixel-size follow CSS size
  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * devicePixelRatio);
    canvas.height = Math.floor(rect.height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  let pointer = {x:-999,y:-999};
  window.addEventListener('resize', resize);
  resize();

  container.classList.add('hexagon-visible');

  canvas.addEventListener('pointermove', (ev)=>{
    const r = canvas.getBoundingClientRect();
    pointer.x = ev.clientX - r.left;
    pointer.y = ev.clientY - r.top;
  });
  canvas.addEventListener('pointerleave', ()=>{ pointer.x = -999; pointer.y = -999 });

  // hex geometry helpers
  function hexPoints(cx,cy,size){
    const pts = [];
    for(let i=0;i<6;i++){
      const a = Math.PI/180 * (60*i - 30);
      pts.push([cx + Math.cos(a)*size, cy + Math.sin(a)*size]);
    }
    return pts;
  }

  function draw(){
    const w = canvas.width / devicePixelRatio;
    const h = canvas.height / devicePixelRatio;
    ctx.clearRect(0,0,w,h);
    const size = 22; // hex radius
    const vSize = Math.sqrt(3)*size;
    for(let y = -vSize; y < h + vSize; y += vSize*0.75){
      for(let x = -size; x < w + size; x += size*1.75){
        const px = x + ((Math.round(y / (vSize*0.75)) % 2) ? size*0.875 : 0);
        const py = y;
        const pts = hexPoints(px,py,size*0.95);
        // distance-based alpha for hover glow
        const dx = pointer.x - px;
        const dy = pointer.y - py;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const a = Math.max(0, 1 - dist/140);
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(5,112,135,${0.25 + 0.6*a})`;
        ctx.stroke();
        if(a > 0.02){
          ctx.fillStyle = `rgba(83,176,191,${0.06*a})`;
          ctx.fill();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
