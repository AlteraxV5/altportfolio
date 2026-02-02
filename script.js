document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initGalaxyBackground();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initParticleEffects();
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
                showNotification('Pesan berhasil dikirim!', 'success');
                form.reset();
            } else {
                showNotification('Gagal mengirim pesan. Coba lagi!', 'error');
            }
        } catch (error) {
            form.submit();
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
