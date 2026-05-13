(function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;

    const ctx   = canvas.getContext('2d');
    let W, H, stars, animId;

    const STAR_COUNT = 220;
    const NEBULA_COUNT = 4;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildStars();
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function buildStars() {
        stars = Array.from({ length: STAR_COUNT }, () => ({
            x:    rand(0, W),
            y:    rand(0, H),
            r:    rand(0.3, 1.6),
            a:    rand(0.1, 0.7),
            da:   rand(0.0003, 0.0012) * (Math.random() < 0.5 ? 1 : -1),
            dx:   rand(-0.04, 0.04),
            dy:   rand(-0.02, 0.02),
        }));
    }

    function drawNebula() {
        const nebs = [
            { x: W * 0.12, y: H * 0.2,  rx: W * 0.35, ry: H * 0.3,  color: '0,212,255',  a: 0.025 },
            { x: W * 0.85, y: H * 0.75, rx: W * 0.3,  ry: H * 0.28, color: '123,111,255', a: 0.022 },
            { x: W * 0.5,  y: H * 0.5,  rx: W * 0.4,  ry: H * 0.35, color: '0,212,255',  a: 0.012 },
            { x: W * 0.7,  y: H * 0.15, rx: W * 0.22, ry: H * 0.2,  color: '70,60,200',  a: 0.018 },
        ];

        nebs.forEach(n => {
            const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.rx, n.ry));
            g.addColorStop(0,   `rgba(${n.color},${n.a})`);
            g.addColorStop(0.5, `rgba(${n.color},${n.a * 0.4})`);
            g.addColorStop(1,   `rgba(${n.color},0)`);
            ctx.save();
            ctx.scale(n.rx / Math.max(n.rx, n.ry), n.ry / Math.max(n.rx, n.ry));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(
                n.x / (n.rx / Math.max(n.rx, n.ry)),
                n.y / (n.ry / Math.max(n.rx, n.ry)),
                Math.max(n.rx, n.ry), 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        });
    }

    function tick() {
        ctx.clearRect(0, 0, W, H);
      
        const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.75);
        vg.addColorStop(0,   'rgba(7,7,15,0)');
        vg.addColorStop(1,   'rgba(7,7,15,0.7)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);

        drawNebula();

        stars.forEach(s => {
            s.a += s.da;
            if (s.a > 0.75 || s.a < 0.06) s.da *= -1;

            s.x += s.dx;
            s.y += s.dy;
            if (s.x < -2) s.x = W + 2;
            if (s.x > W + 2) s.x = -2;
            if (s.y < -2) s.y = H + 2;
            if (s.y > H + 2) s.y = -2;

            ctx.save();
            ctx.globalAlpha = s.a;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.restore();
        });

        animId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        resize();
        tick();
    });

    resize();
    tick();
}());

(function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastY = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 20);
        lastY = y;
    }, { passive: true });
}());

(function initNavActive() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    function onScroll() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}());

(function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}());

(function initReveal() {
    const targets = [
        '.section-header',
        '.about-image',
        '.about-text',
        '.skill-category',
        '.project-card',
        '.contact-info',
        '.hero-badge',
        '.hero-buttons',
        '.hero-stats',
    ];

    const all = document.querySelectorAll(targets.join(','));

    all.forEach(el => el.classList.add('reveal'));

    const hero = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-stats');
    hero.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
        el.classList.add('reveal');
    });

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    all.forEach(el => io.observe(el));

    hero.forEach(el => {
        setTimeout(() => el.classList.add('visible'), 80);
    });
}());

(function initSkillBars() {
    const fills = document.querySelectorAll('.level-fill');

    fills.forEach(fill => {
        const target = fill.style.width;
        fill.style.width = '0%';

        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    requestAnimationFrame(() => { fill.style.width = target; });
                    io.unobserve(fill);
                }
            });
        }, { threshold: 0.5 });

        io.observe(fill);
    });
}());
