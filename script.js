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

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('mobile-menu-active');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll(
        '.challenge-card, .step, .feature-card, .impact-card, .team-card, .section-header, .impact-quote, .download-content'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
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

    // --- Flip Card Tap Support (Mobile) ---
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('tap-flipped');
        });
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

    // --- Language Switcher & i18n ---
    let translations = {};
    let currentLang = localStorage.getItem('agroassist-lang') || 'en';

    function applyTranslations(lang) {
        if (!translations[lang]) return;
        const t = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                if (el.tagName === 'META') {
                    el.setAttribute('content', t[key]);
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // Update page title
        if (t.page_title) {
            document.title = t.page_title;
        }

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Update active language button
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update displayed language code
        const langCurrent = document.querySelector('.lang-current');
        if (langCurrent) {
            langCurrent.textContent = lang.toUpperCase();
        }

        // Restart typing animation with new language words
        if (t.hero_typing && Array.isArray(t.hero_typing)) {
            startTypingAnimation(t.hero_typing);
        }
    }

    // Fetch translations and init
    fetch('translations.json')
        .then(res => res.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLang);
        })
        .catch(err => {
            console.warn('Could not load translations:', err);
        });

    // Language switcher click handlers
    const langSwitcher = document.getElementById('langSwitcher');
    const langDropdown = document.getElementById('langDropdown');

    langSwitcher.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = btn.dataset.lang;
            currentLang = lang;
            localStorage.setItem('agroassist-lang', lang);
            applyTranslations(lang);
            langDropdown.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langDropdown.classList.remove('open');
    });

    // --- Typing Animation ---
    let typingTimeout = null;

    function startTypingAnimation(words) {
        const typingEl = document.getElementById('typingText');
        if (!typingEl || !words || words.length === 0) return;

        // Clear any existing timeout
        if (typingTimeout) clearTimeout(typingTimeout);

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

            typingTimeout = setTimeout(type, typingSpeed);
        }

        type();
    }

    // Initialize typing with default English words
    startTypingAnimation(['Diagnose', 'Treat', 'Prevent']);

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

});
