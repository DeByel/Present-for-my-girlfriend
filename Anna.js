let touchStartUrlY = 0;

document.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        touchStartUrlY = e.touches[0].clientY;
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
        const touchMoveY = e.touches[0].clientY;
        
        // Detecta se está puxando a tela para baixo estando no topo
        if (window.scrollY === 0 && touchMoveY > touchStartUrlY) {
            e.preventDefault(); // Mata o pull-to-refresh do navegador
        }
    }
}, { passive: false });

const TOTAL_SLIDES = 4;

  function goTo(n) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + n).classList.add('active');
    if (n > 0 && n <= TOTAL_SLIDES) renderDots(n);
    spawnHearts();
  }

  function restart() { goTo(0); }

  function renderDots(current) {
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const el = document.getElementById('dots-' + i);
      if (!el) continue;
      el.innerHTML = '';
      for (let j = 1; j <= TOTAL_SLIDES; j++) {
        const d = document.createElement('div');
        d.className = 'dot' + (j === current ? ' active' : '');
        el.appendChild(d);
      }
    }
  }

  function spawnHearts() {
    const symbols = ['♥','♡','❤','✦'];
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const h = document.createElement('div');
        h.className = 'heart-float';
        h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        h.style.left = (10 + Math.random() * 80) + '%';
        h.style.bottom = '15%';
        h.style.color = `hsl(${320 + Math.random()*40}deg, 80%, ${60 + Math.random()*20}%)`;
        h.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 4000);
      }, i * 180);
    }
  }

  // Floating words
  const words = ['PARA SEMPRE','TE AMO','Como eu te amo garota', 'Em um mundo cheio de 69, vc é a 67'];
  const fw = document.getElementById('float-words');
  words.forEach((w, i) => {
    const el = document.createElement('div');
    el.className = 'float-word';
    el.textContent = w;
    el.style.left = (5 + (i * 12) % 85) + '%';
    el.style.animationDuration = (14 + i * 5.0) + 's';
    el.style.animationDelay = (i * 2.1) + 's';
    fw.appendChild(el);
  });


function startGalaxy() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('stars-canvas').style.display = 'none';
    if(document.getElementById('float-words')) {
        document.getElementById('float-words').style.display = 'none';
    }
    
    const scene = document.getElementById('galaxy-scene');
    scene.classList.add('active');
    
    if(!isGalaxyReady) {
        initGalaxy();
    }
}

    let rotX = 0.0; 
    let rotZ = 0.0; 
    let targetRotX = 0.0; 
    let targetRotZ = 0.0;
    let isGalaxyReady = false;
    let gParticles = []; 
    let gTexts = [];    

function initGalaxy() {
    isGalaxyReady = true;
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    // 1. Gerar Espiral da Galáxia
    for (let i = 0; i < 800; i++) {
        let angle = i * 0.15;
        let radius = 30 + i * 0.5;
        gParticles.push({
            x: radius * Math.cos(angle) + (Math.random() * 30 - 15),
            y: radius * Math.sin(angle) + (Math.random() * 30 - 15),
            z: Math.random() * 40 - 20,
            color: '#f5c0d8',
            size: 1.5 + Math.random() * 1
        });
    }

    // 2. Gerar Coração 3D (Densidade Ajustada)
    for (let zDepth = -30; zDepth <= 50; zDepth += 8) { // Maior espaçamento vertical
        let targetScale = Math.sqrt(1 - Math.pow((zDepth - 10) / 40, 2)) * 6;
        if (isNaN(targetScale)) targetScale = 3;

        for (let t = 0; t < Math.PI * 2; t += 0.08) { // Maior espaçamento horizontal
            let baseMaxX = 16 * Math.pow(Math.sin(t), 3);
            let baseMaxY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            gParticles.push({
                x: baseMaxX * targetScale,
                y: baseMaxY * targetScale,
                z: zDepth + (Math.random() * 2 - 1),
                color: '#ff1a4a',
                size: 1.5 + Math.random() * 1
            });
        }
    }

    // 3. Gerar Textos Flutuantes
    const phrases = ["AI, AI, AI, AI", "O QUANTO QUE EU DESEJO TE TOCAR(rs)", "EU TE AMO", "VOCÊ NÃO TEM IDEIA DE COMO EU MUDEI POR CAUSA DE YOU", "QUERO TE VER FELIZ", "QUERO TE VER SORRIR", "QUERO TE VER RINDO", "QUERO TE VER ME AMANDO", "QUERO TE VER ME QUERENDO", "QUERO TE VER ME DESEJANDO", "QUERO TE VER ME TOCANDO", "QUERO TE VER ME ABRAÇANDO"];
    for(let i = 0; i < 12; i++) {
        let radius = 160 + Math.random() * 200;
        let angle = Math.random() * Math.PI * 2;
        gTexts.push({
            text: phrases[Math.floor(Math.random() * phrases.length)],
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
            z: Math.random() * 60 - 30
        });
    }

    // 4. Controles de Toque e Mouse
    let isDown = false;
    let startX, startY;

    const start = e => {
        isDown = true;
        startX = e.touches ? e.touches[0].pageX : e.pageX;
        startY = e.touches ? e.touches[0].pageY : e.pageY;
        canvas.style.cursor = 'grabbing';
    };
    // tenho que amar muito ela msm em kkkkkkk 
    const move = e => {
        if (!isDown) return;
        let currentX = e.touches ? e.touches[0].pageX : e.pageX;
        let currentY = e.touches ? e.touches[0].pageY : e.pageY;
        
        // Atualiza os alvos
        targetRotZ -= (currentX - startX) * 0.007; 
        targetRotX -= (currentY - startY) * 0.007; 
        targetRotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, targetRotX)); 
        
        startX = currentX;
        startY = currentY;
    };

    const end = () => { isDown = false; canvas.style.cursor = 'grab'; };

    canvas.addEventListener('mousedown', start);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('touchstart', start);
    window.addEventListener('touchend', end);
    canvas.addEventListener('touchmove', move);

    // 5. Loop de Renderização
    function render() {
        if (isNaN(targetRotX) || isNaN(rotX)) { targetRotX = 0.0; rotX = 0.0; }
        if (isNaN(targetRotZ) || isNaN(rotZ)) { targetRotZ = 0.0; rotZ = 0.0; }

        rotX += (targetRotX - rotX) * 0.08;
        rotZ += (targetRotZ - rotZ) * 0.08;

        let cx = W / 2, cy = H / 2;

        // Fundo com gradiente radial (Iluminação suave)
        let bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
        bgGrad.addColorStop(0, '#260616'); 
        bgGrad.addColorStop(0.5, '#0f020a'); 
        bgGrad.addColorStop(1, '#030005'); 
        
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        let cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);
        let fov = 600; 

        // Ativa o efeito de iluminação por sobreposição (Glow)
        ctx.globalCompositeOperation = 'lighter';

        // Renderizar Partículas
        for (let i = 0; i < gParticles.length; i++) {
            let p = gParticles[i];
            let x1 = p.x * cosZ - p.y * sinZ;
            let y1 = p.x * sinZ + p.y * cosZ;
            let y2 = y1 * cosX - p.z * sinX;
            let z2 = y1 * sinX + p.z * cosX;

            let scale = fov / (fov + z2);
            let sx = cx + x1 * scale;
            let sy = cy + y2 * scale;

            if (sx >= 0 && sx <= W && sy >= 0 && sy <= H) {
                ctx.beginPath();
                ctx.arc(sx, sy, p.size * scale, 0, Math.PI * 2);
                ctx.globalAlpha = Math.max(0.1, Math.min(1, scale * 0.8));
                ctx.fillStyle = p.color;
                ctx.fill();
            }
        }

        // Reseta as propriedades para o texto não bugar
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;

        // Renderizar Textos
        ctx.font = "bold 14px 'Crimson Text', serif";
        ctx.textAlign = "center";
        
        for (let i = 0; i < gTexts.length; i++) {
            let t = gTexts[i];
            let x1 = t.x * cosZ - t.y * sinZ;
            let y1 = t.x * sinZ + t.y * cosZ;
            let y2 = y1 * cosX - t.z * sinX;
            let z2 = y1 * sinX + t.z * cosX;

            let scale = fov / (fov + z2);
            let sx = cx + x1 * scale;
            let sy = cy + y2 * scale;

            if (sx >= 0 && sx <= W && sy >= 0 && sy <= H) {
                ctx.fillStyle = `rgba(245, 192, 216, ${Math.max(0.2, Math.min(1, scale))})`;
                ctx.fillText(t.text, sx, sy);
            }
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}