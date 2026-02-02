document.addEventListener('DOMContentLoaded', () => {
    initGalaxyBackground();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initParticleEffects();
    initFlowerRain(); // 🌸 Hujan bunga effect
    initMusicPlayer(); // 🎵 Music player with play button
});

function initGalaxyBackground() {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const stars = [];
    const nebulaClouds = [];
    const shootingStars = [];
    const starCount = 300;
    const nebulaCount = 5;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initStars();
        initNebula();
    });
    
    class Star {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * 0.5 + 0.1;
            this.brightness = Math.random();
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDirection = 1;
        }
        
        update() {
            this.brightness += this.twinkleSpeed * this.twinkleDirection;
            if (this.brightness >= 1 || this.brightness <= 0.3) {
                this.twinkleDirection *= -1;
            }
            
            this.y -= this.speed * 0.5;
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
        }
        
        draw() {
            const alpha = this.brightness;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();
            
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                gradient.addColorStop(0, `rgba(124, 58, 237, ${alpha * 0.3})`);
                gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }
    
    class NebulaCloud {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 200 + 100;
            this.color = this.getRandomColor();
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.1;
            this.opacity = Math.random() * 0.15 + 0.05;
        }
        
        getRandomColor() {
            const colors = [
                '124, 58, 237',  
                '6, 182, 212',   
                '244, 114, 182', 
                '99, 102, 241', 
                '45, 212, 191',  
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < -this.radius * 2) this.x = width + this.radius;
            if (this.x > width + this.radius * 2) this.x = -this.radius;
            if (this.y < -this.radius * 2) this.y = height + this.radius;
            if (this.y > height + this.radius * 2) this.y = -this.radius;
        }
        
        draw() {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
    
    class ShootingStar {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.5;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 15 + 10;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
            this.opacity = 0;
            this.active = false;
            this.delay = Math.random() * 500 + 200;
        }
        
        update() {
            if (!this.active) {
                this.delay--;
                if (this.delay <= 0) {
                    this.active = true;
                    this.opacity = 1;
                }
                return;
            }
            
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            
            if (this.x > width || this.y > height) {
                this.reset();
            }
        }
        
        draw() {
            if (!this.active) return;
            
            const tailX = this.x - Math.cos(this.angle) * this.length;
            const tailY = this.y - Math.sin(this.angle) * this.length;
            
            const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            

            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    function initStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
    }
    
    function initNebula() {
        nebulaClouds.length = 0;
        for (let i = 0; i < nebulaCount; i++) {
            nebulaClouds.push(new NebulaCloud());
        }
    }
    
    function initShootingStars() {
        for (let i = 0; i < 3; i++) {
            shootingStars.push(new ShootingStar());
        }
    }
    
    initStars();
    initNebula();
    initShootingStars();

    function animate() {
        ctx.clearRect(0, 0, width, height);
 
        nebulaClouds.forEach(cloud => {
            cloud.update();
            cloud.draw();
        });
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (!navToggle || !mobileMenu) return;
    
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(
        '.skill-category, .project-card, .section-header, .about-content, .contact-content'
    );
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const levelFill = card.querySelector('.level-fill');
                if (levelFill) {
                    const width = levelFill.style.width;
                    levelFill.style.width = '0%';
                    setTimeout(() => {
                        levelFill.style.width = width;
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillCards.forEach(card => {
        observer.observe(card);
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Mohon lengkapi semua field!', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Mengirim...</span>';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('✅ Pesan berhasil dikirim ke Owner!', 'success');
                form.reset();
                console.log('Form submission successful');
            } else if (response.status === 429) {
                showNotification('Terlalu banyak pesan. Tunggu sebentar!', 'error');
                console.log('Rate limit exceeded');
            } else if (response.status === 400) {
                showNotification('Cek konfigurasi Formsubmit.co!', 'error');
                console.log('Bad request - check Formsubmit.co configuration');
            } else {
                console.log('AJAX failed, trying regular submit');
                form.submit();
            }
        } catch (error) {
            console.log('Fetch error:', error);
            try {
                form.submit();
            } catch (submitError) {
                showNotification('Gagal mengirim pesan. Coba lagi!', 'error');
            }
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        fontFamily: 'inherit',
        fontSize: '1rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
    });

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function initParticleEffects() {
    const interactiveElements = document.querySelectorAll('.btn, .project-card, .skill-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', createParticles);
    });
}

function createParticles(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: #7c3aed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 5;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0, y = 0, opacity = 1;
        
        function animateParticle() {
            x += vx * 0.05;
            y += vy * 0.05;
            opacity -= 0.03;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(animateParticle);
    }
}

function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

initActiveNavHighlight();

function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.remove();
        }, 300);
    });
}

/* ============================================
   🌸 FLOWER RAIN EFFECT
   ============================================ */
function initFlowerRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'flower-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const flowers = [];
    const flowerCount = 25; // Jumlah bunga
    
    // Variasi bunga (emoji)
    const flowerTypes = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🪻', '🌼'];
    const colors = [
        '#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb',
        '#ffd700', '#ffa500', '#ff6347',
        '#dda0dd', '#ba55d3', '#9370db'
    ];
    
    class Flower {
        constructor() {
            this.reset(true);
        }
        
        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -50;
            this.size = Math.random() * 20 + 15; // Ukuran bunga 15-35px
            this.speed = Math.random() * 1 + 0.5; // Kecepatan lambat (0.5-1.5)
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02; // Rotasi pelan
            this.opacity = 1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002; // Fade out sangat pelan
            this.flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
            this.swayAmplitude = Math.random() * 50 + 30;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayOffset = Math.random() * Math.PI * 2;
            this.startY = this.y;
        }
        
        update() {
            // Gerakan jatuh perlahan ke bawah
            this.y += this.speed;
            
            // Gerakan sway (ayunan) pelan
            this.x += Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * 0.3;
            
            // Rotasi pelan
            this.rotation += this.rotationSpeed;
            
            // Fade out perlahan saat mendekati batas bawah
            if (this.y > height * 0.7) {
                this.opacity -= this.fadeSpeed;
            }
            
            // Reset jika bunga sudah di bawah atau tidak terlihat
            if (this.y > height + 50 || this.opacity <= 0) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            
            // Gambar bunga dengan efek glow
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.flowerType, 0, 0);
            
            ctx.restore();
        }
    }
    
    function initFlowers() {
        for (let i = 0; i < flowerCount; i++) {
            flowers.push(new Flower());
        }
    }
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    initFlowers();
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        flowers.forEach(flower => {
            flower.update();
            flower.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ============================================
   🎵 MUSIC PLAYER WITH COLORED BUTTON
   ============================================ */
function initMusicPlayer() {
    // Cek apakah music player sudah ada
    if (document.querySelector('.music-player')) return;
    
    const player = document.createElement('div');
    player.className = 'music-player';
    player.innerHTML = `
        <div class="music-info">
            <span class="music-title">🎵 Lofi Chill Vibes</span>
        </div>
        <button class="play-btn" id="playButton">
            <span class="play-icon">▶</span>
            <span class="pause-icon" style="display:none;">⏸</span>
        </button>
        <div class="music-controls">
            <input type="range" class="volume-slider" min="0" max="100" value="50">
        </div>
    `;
    
    // Style untuk music player
    player.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(6, 182, 212, 0.9));
        padding: 15px 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 9999;
        box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Style untuk info
    const musicInfo = player.querySelector('.music-info');
    musicInfo.style.cssText = `
        color: white;
        font-weight: 500;
        font-size: 0.9rem;
    `;
    
    // Style untuk tombol play dengan warna
    const playBtn = player.querySelector('.play-btn');
    playBtn.style.cssText = `
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f472b6, #ec4899);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(244, 114, 182, 0.5);
        transition: all 0.3s ease;
    `;
    
    playBtn.onmouseenter = () => {
        playBtn.style.transform = 'scale(1.1)';
        playBtn.style.boxShadow = '0 6px 20px rgba(244, 114, 182, 0.7)';
    };
    
    playBtn.onmouseleave = () => {
        playBtn.style.transform = 'scale(1)';
        playBtn.style.boxShadow = '0 4px 15px rgba(244, 114, 182, 0.5)';
    };
    
    // Style untuk volume slider
    const volumeSlider = player.querySelector('.volume-slider');
    volumeSlider.style.cssText = `
        width: 80px;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        cursor: pointer;
    `;
    
    // Audio element
    const audio = new Audio();
    audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    audio.loop = true;
    audio.volume = 0.5;
    
    let isPlaying = false;
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.querySelector('.play-icon').style.display = 'block';
            playBtn.querySelector('.pause-icon').style.display = 'none';
            playBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            audio.play().catch(e => {
                console.log('Audio autoplay blocked - user interaction required');
            });
            playBtn.querySelector('.play-icon').style.display = 'none';
            playBtn.querySelector('.pause-icon').style.display = 'block';
            playBtn.style.background = 'linear-gradient(135deg, #f472b6, #ec4899)';
        }
        isPlaying = !isPlaying;
    });
    
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });
    
    document.body.appendChild(player);
}
