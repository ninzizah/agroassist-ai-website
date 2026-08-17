// ========================================
// AgroAssist AI - Landing Page Scripts
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-menu-active');
        const isOpen = navLinks.classList.contains('mobile-menu-active');
        mobileMenuBtn.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-menu-active');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll(
        '.challenge-card, .step, .feature-card, .impact-card, .team-card, .section-header, .impact-quote, .download-content'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Animate impact numbers on scroll ---
    const impactNumbers = document.querySelectorAll('.impact-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const finalText = el.textContent;
                const num = parseInt(finalText);
                if (!isNaN(num)) {
                    let current = 0;
                    const suffix = finalText.replace(String(num), '');
                    const duration = 1500;
                    const step = num / (duration / 16);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= num) {
                            current = num;
                            clearInterval(timer);
                        }
                        el.textContent = Math.floor(current) + suffix;
                    }, 16);
                }
                numberObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    impactNumbers.forEach(el => numberObserver.observe(el));

    // --- Typing Animation ---
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const words = ['Diagnose', 'Treat', 'Prevent'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 300;
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

});
