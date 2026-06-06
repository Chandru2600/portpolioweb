/**
 * Portfolio Interactivity & Premium Dynamic Effects
 * Chandrashekhar M Loni
 */

document.addEventListener('DOMContentLoaded', () => {


    // Dark mode is fixed — no toggle needed


    // ==========================================================================
    // FLOATING PARTICLES CANVAS
    // ==========================================================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    let animFrame;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function getParticleColor() {
        // Dark mode is fixed, always use gold particle colors
        return `rgba(220, 175, 45, ${Math.random() * 0.4 + 0.05})`;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            color: getParticleColor(),
            life: Math.random() * 200 + 100,
            age: 0,
        };
    }

    function initParticles() {
        if (!canvas || !ctx) return;
        cancelAnimationFrame(animFrame);
        resizeCanvas();
        particles = Array.from({ length: 70 }, createParticle);
        animateParticles();
    }

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.dx;
            p.y += p.dy;
            p.age++;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Fade in/out
            const progress = p.age / p.life;
            const alpha = progress < 0.2
                ? progress / 0.2
                : progress > 0.8
                ? (1 - progress) / 0.2
                : 1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.5})`);
            ctx.fill();

            // Draw connection lines between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dist = Math.hypot(p.x - q.x, p.y - q.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, `${(1 - dist / 120) * 0.12})`);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Respawn particle
            if (p.age >= p.life) {
                particles[i] = createParticle();
            }
        });

        animFrame = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    initParticles();


    // ==========================================================================
    // HAMBURGER MENU
    // ==========================================================================
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuLinksContainer = document.querySelector('.menu-links');
    const mobileLinks = document.querySelectorAll('.menu-links a');

    const toggleMenu = () => {
        hamburgerIcon.classList.toggle('open');
        menuLinksContainer.classList.toggle('open');
    };

    if (hamburgerIcon) hamburgerIcon.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (menuLinksContainer && menuLinksContainer.classList.contains('open')) {
            const isClickInsideMenu = menuLinksContainer.contains(e.target);
            const isClickOnHamburger = hamburgerIcon.contains(e.target);
            if (!isClickInsideMenu && !isClickOnHamburger) {
                hamburgerIcon.classList.remove('open');
                menuLinksContainer.classList.remove('open');
            }
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            hamburgerIcon.classList.remove('open');
            menuLinksContainer.classList.remove('open');
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.getBoundingClientRect().top + window.pageYOffset - 90,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================================================
    // FLOATING HEADER & ACTIVE SECTION HIGHLIGHTS
    // ==========================================================================
    const desktopNav = document.getElementById('desktop-nav');
    const hamburgerNav = document.getElementById('hamburger-nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScrollEffects = () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            desktopNav.classList.add('scroll');
            hamburgerNav.classList.add('scroll');
        } else {
            desktopNav.classList.remove('scroll');
            hamburgerNav.classList.remove('scroll');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (scrollY >= top && scrollY < top + section.clientHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        [...navLinks, ...mobileLinks].forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 100,
                    behavior: 'smooth'
                });
            }
        });
    });


    // Statistics section removed.


    // ==========================================================================
    // PROJECT FILTER PILLS
    // ==========================================================================
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                const matches = filter === 'all' || categories.includes(filter);

                if (matches) {
                    card.style.display = '';
                    // Re-trigger reveal animation
                    card.classList.remove('active');
                    void card.offsetWidth; // force reflow
                    setTimeout(() => card.classList.add('active'), 30);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ==========================================================================
    // INTERSECTION OBSERVER — SCROLL REVEALS
    // ==========================================================================
    const elementsToReveal = [];

    document.querySelectorAll('section:not(#profile)').forEach(el => elementsToReveal.push(el));
    document.querySelectorAll('.details-container').forEach(el => elementsToReveal.push(el));
    document.querySelectorAll('.text-container').forEach(el => elementsToReveal.push(el));
    document.querySelectorAll('#skill article').forEach(el => elementsToReveal.push(el));
    document.querySelectorAll('.projects-grid .project-card').forEach(el => elementsToReveal.push(el));
    document.querySelectorAll('.project-filters').forEach(el => elementsToReveal.push(el));
    document.querySelectorAll('.timeline-item').forEach(el => elementsToReveal.push(el));

    elementsToReveal.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elementsToReveal.forEach(el => revealObserver.observe(el));


    // ==========================================================================
    // 3D CARD TILT EFFECT
    // ==========================================================================
    function applyTilt(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            const tiltX = dy * -6;   // degrees
            const tiltY = dx * 6;

            card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;

            // Spotlight position
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${mouseX}px`);
            card.style.setProperty('--mouse-y', `${mouseY}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    }

    document.querySelectorAll('.project-card').forEach(applyTilt);


    // ==========================================================================
    // SPOTLIGHT HOVER FOR SKILL ARTICLES & DETAILS CONTAINERS
    // ==========================================================================
    document.querySelectorAll('.details-container, #skill article, .timeline-content, .contact-card-link').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });


    // ==========================================================================
    // INTERACTIVE DETAILS MODAL
    // ==========================================================================
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    const openModal = (card) => {
        const fullDetails = card.querySelector('.project-full-details');
        if (fullDetails && modal && modalBody) {
            const clone = fullDetails.cloneNode(true);
            clone.style.display = 'block';
            modalBody.innerHTML = '';
            modalBody.appendChild(clone);
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                if (!modal.classList.contains('open') && modalBody) {
                    modalBody.innerHTML = '';
                }
            }, 400);
        }
    };

    // Use event delegation so dynamically toggled cards still work
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-details');
        if (btn) {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            if (card) openModal(card);
        }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
    });


    // ==========================================================================
    // HERO TYPEWRITER EFFECT
    // ==========================================================================
    const subtitleEl = document.querySelector('.section__text__p2');
    if (subtitleEl) {
        const originalText = subtitleEl.textContent.trim();
        const phrases = [
            'Final Year AIML Student @ SDMCET Dharwad',
            'Full-Stack Developer',
            'AI & ML Enthusiast',
            'Mobile App Developer',
        ];
        subtitleEl.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        subtitleEl.appendChild(cursor);

        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function typeLoop() {
            const current = phrases[phraseIdx];
            if (!deleting) {
                subtitleEl.textContent = current.slice(0, charIdx + 1);
                subtitleEl.appendChild(cursor);
                charIdx++;
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeLoop, 2200);
                    return;
                }
                setTimeout(typeLoop, 60);
            } else {
                subtitleEl.textContent = current.slice(0, charIdx - 1);
                subtitleEl.appendChild(cursor);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(typeLoop, 400);
                    return;
                }
                setTimeout(typeLoop, 35);
            }
        }
        setTimeout(typeLoop, 800);
    }


    // ==========================================================================
    // SCROLL PROGRESS BAR
    // ==========================================================================
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px; width: 0%;
        background: linear-gradient(90deg, hsl(221,83%,53%), hsl(38,92%,50%));
        z-index: 9999; transition: width 0.1s ease; pointer-events: none;
        box-shadow: 0 0 10px rgba(220,175,45,0.5);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    });


    // ==========================================================================
    // CONTACT FORM HANDLER (WEB3FORMS AJAX SUBMIT)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state on button
            const submitBtn = contactForm.querySelector('.submit-btn');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');
            
            const originalText = submitBtnText.textContent;
            const originalIconClass = submitBtnIcon.className;
            
            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending...';
            submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
            
            if (formStatus) {
                formStatus.className = 'form-status-message';
                formStatus.style.display = 'none';
            }

            const formData = new FormData(contactForm);
            
            // Web3Forms API endpoint submission
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Successful Submission
                    if (formStatus) {
                        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                        formStatus.className = 'form-status-message success';
                    }
                    contactForm.reset();
                } else {
                    // Error Response
                    console.error(response);
                    if (formStatus) {
                        formStatus.textContent = json.message || 'Something went wrong. Please try again.';
                        formStatus.className = 'form-status-message error';
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                if (formStatus) {
                    formStatus.textContent = 'Network error. Please check your connection and try again.';
                    formStatus.className = 'form-status-message error';
                }
            })
            .finally(() => {
                // Re-enable and reset button states
                submitBtn.disabled = false;
                submitBtnText.textContent = originalText;
                submitBtnIcon.className = originalIconClass;
                setTimeout(() => {
                    if (formStatus) {
                        formStatus.style.display = 'block';
                    }
                }, 100);
            });
        });
    }


    // ==========================================================================
    // EASTER EGG MINI-GAME: CODE SNAKE
    // ==========================================================================
    
    // Modal Selectors
    const gameModal = document.getElementById('game-modal');
    const gameTriggerBtn = document.getElementById('game-trigger-btn');
    const gameNavBtn = document.getElementById('game-nav-btn');
    const gameNavBtnMobile = document.getElementById('game-nav-btn-mobile');
    const gameModalCloseBtn = document.getElementById('game-modal-close-btn');
    const gameBackBtn = document.getElementById('game-back-btn');
    const gameModalTitle = document.getElementById('game-modal-title');
    const gameHeaderScores = document.getElementById('game-header-scores');

    // Views
    const gameSelectionView = document.getElementById('game-selection-view');
    const snakeGameView = document.getElementById('snake-game-view');
    const bugGameView = document.getElementById('bughunter-game-view');

    // Select Cards
    const btnSelectSnake = document.getElementById('btn-select-snake');
    const btnSelectBug = document.getElementById('btn-select-bughunter');
    
    // Canvas & Game UI Selectors (Snake)
    const gameCanvas = document.getElementById('game-canvas');
    const gameCtx = gameCanvas ? gameCanvas.getContext('2d') : null;
    const gameScoreEl = document.getElementById('game-header-score');
    const gameHighScoreEl = document.getElementById('game-header-high-score');
    const gameStartOverlay = document.getElementById('game-start-overlay');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const gameStartBtn = document.getElementById('game-start-btn');
    const gameRestartBtn = document.getElementById('game-restart-btn');

    // Bug Hunter Selectors
    const bugTimerEl = document.getElementById('bug-timer');
    const bugLivesEl = document.getElementById('bug-lives');
    const bugScoreEl = document.getElementById('bug-score');
    const bugCells = document.querySelectorAll('.bug-cell');
    const bugStartOverlay = document.getElementById('bug-start-overlay');
    const bugOverOverlay = document.getElementById('bug-over-overlay');
    const bugStartBtn = document.getElementById('bug-start-btn');
    const bugRestartBtn = document.getElementById('bug-restart-btn');
    const bugEndTitle = document.getElementById('bug-end-title');
    const bugEndMessage = document.getElementById('bug-end-message');
    
    // Grid Setup
    const GRID_SIZE = 15;
    const CELL_SIZE = 20; // 15 cells * 20px = 300px
    
    // Snake State variables
    let gameSnake = [];
    let gameDirection = 'right';
    let gameNextDirection = 'right';
    let gameFood = { x: 0, y: 0 };
    let gameScore = 0;
    let gameHighScore = 0;
    let gameLoopInterval = null;
    let gameIsPlaying = false;
    let gameAudioCtx = null;

    // Bug Hunter State variables
    let bugScore = 0;
    let bugHighScore = 0;
    let bugLives = 3;
    let bugTimeRemaining = 30;
    let bugTimerInterval = null;
    let bugSpawnInterval = null;
    let bugIsPlaying = false;
    let bugActiveIndex = -1;
    let bugSpawnSpeed = 1000;

    // Triggering Konami Code sequence
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let inputHistory = [];

    document.addEventListener('keydown', (e) => {
        const normalizedKey = e.key === 'B' ? 'b' : (e.key === 'A' ? 'a' : e.key);
        inputHistory.push(normalizedKey);
        inputHistory = inputHistory.slice(-konamiSequence.length);
        
        if (inputHistory.join(',') === konamiSequence.join(',')) {
            openGame();
            inputHistory = []; // clear buffer
        }
    });

    // View switcher functions
    function showGameMenu() {
        stopGame();
        stopBugGame();
        
        if (snakeGameView) snakeGameView.style.display = 'none';
        if (bugGameView) bugGameView.style.display = 'none';
        if (gameBackBtn) gameBackBtn.style.display = 'none';
        if (gameHeaderScores) gameHeaderScores.style.display = 'none';
        if (gameSelectionView) gameSelectionView.style.display = 'block';
        if (gameModalTitle) gameModalTitle.textContent = 'Code Arcade';
    }

    function showSnakeGame() {
        if (gameSelectionView) gameSelectionView.style.display = 'none';
        if (bugGameView) bugGameView.style.display = 'none';
        if (snakeGameView) snakeGameView.style.display = 'block';
        if (gameBackBtn) gameBackBtn.style.display = 'flex';
        if (gameHeaderScores) gameHeaderScores.style.display = 'flex';
        if (gameModalTitle) gameModalTitle.textContent = 'Code Snake';
        
        loadHighScore();
        resetGame();
    }

    function showBugGame() {
        if (gameSelectionView) gameSelectionView.style.display = 'none';
        if (snakeGameView) snakeGameView.style.display = 'none';
        if (bugGameView) bugGameView.style.display = 'block';
        if (gameBackBtn) gameBackBtn.style.display = 'flex';
        if (gameHeaderScores) gameHeaderScores.style.display = 'flex';
        if (gameModalTitle) gameModalTitle.textContent = 'Bug Hunter';
        
        loadBugHighScore();
        resetBugGame();
    }

    // Modal Control Bindings
    if (gameTriggerBtn) gameTriggerBtn.addEventListener('click', (e) => { e.stopPropagation(); openGame(); });
    if (gameNavBtn) gameNavBtn.addEventListener('click', (e) => { e.stopPropagation(); openGame(); });
    if (gameNavBtnMobile) gameNavBtnMobile.addEventListener('click', (e) => { e.stopPropagation(); openGame(); });
    if (gameModalCloseBtn) gameModalCloseBtn.addEventListener('click', closeGame);
    if (gameBackBtn) gameBackBtn.addEventListener('click', showGameMenu);
    
    if (btnSelectSnake) btnSelectSnake.addEventListener('click', showSnakeGame);
    if (btnSelectBug) btnSelectBug.addEventListener('click', showBugGame);

    if (gameModal) {
        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) closeGame();
        });
    }

    function openGame() {
        if (gameModal) {
            gameModal.classList.add('open');
            gameModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            showGameMenu();
        }
    }

    function closeGame() {
        if (gameModal) {
            gameModal.classList.remove('open');
            gameModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            stopGame();
            stopBugGame();
        }
    }

    // Audio Synth via Web Audio API
    function initAudio() {
        if (!gameAudioCtx) {
            gameAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playSound(type) {
        initAudio();
        if (!gameAudioCtx) return;
        if (gameAudioCtx.state === 'suspended') {
            gameAudioCtx.resume();
        }
        
        const oscillator = gameAudioCtx.createOscillator();
        const gainNode = gameAudioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(gameAudioCtx.destination);
        
        if (type === 'eat') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, gameAudioCtx.currentTime); // C5 note
            oscillator.frequency.exponentialRampToValueAtTime(880, gameAudioCtx.currentTime + 0.08); // A5 note
            gainNode.gain.setValueAtTime(0.06, gameAudioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, gameAudioCtx.currentTime + 0.08);
            oscillator.start();
            oscillator.stop(gameAudioCtx.currentTime + 0.08);
        } else if (type === 'crash') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(180, gameAudioCtx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(50, gameAudioCtx.currentTime + 0.25);
            gainNode.gain.setValueAtTime(0.12, gameAudioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, gameAudioCtx.currentTime + 0.25);
            oscillator.start();
            oscillator.stop(gameAudioCtx.currentTime + 0.25);
        } else if (type === 'pop') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, gameAudioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(900, gameAudioCtx.currentTime + 0.04);
            gainNode.gain.setValueAtTime(0.03, gameAudioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, gameAudioCtx.currentTime + 0.04);
            oscillator.start();
            oscillator.stop(gameAudioCtx.currentTime + 0.04);
        } else if (type === 'squish') {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(350, gameAudioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1100, gameAudioCtx.currentTime + 0.09);
            gainNode.gain.setValueAtTime(0.08, gameAudioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, gameAudioCtx.currentTime + 0.09);
            oscillator.start();
            oscillator.stop(gameAudioCtx.currentTime + 0.09);
        } else if (type === 'miss') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(120, gameAudioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.1, gameAudioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, gameAudioCtx.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(gameAudioCtx.currentTime + 0.15);
        } else if (type === 'win') {
            // Arpeggio
            const now = gameAudioCtx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                const osc = gameAudioCtx.createOscillator();
                const gain = gameAudioCtx.createGain();
                osc.connect(gain);
                gain.connect(gameAudioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.08);
                gain.gain.setValueAtTime(0.05, now + i * 0.08);
                gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.2);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.2);
            });
        }
    }

    // High Score logic
    function loadHighScore() {
        gameHighScore = parseInt(localStorage.getItem('cmloni_snake_highscore') || '0', 10);
        if (gameHighScoreEl) gameHighScoreEl.textContent = gameHighScore;
    }

    function saveHighScore() {
        if (gameScore > gameHighScore) {
            gameHighScore = gameScore;
            localStorage.setItem('cmloni_snake_highscore', gameHighScore);
            if (gameHighScoreEl) gameHighScoreEl.textContent = gameHighScore;
        }
    }

    // Bug Hunter High Score logic
    function loadBugHighScore() {
        bugHighScore = parseInt(localStorage.getItem('cmloni_bughunter_highscore') || '0', 10);
        if (gameHighScoreEl) gameHighScoreEl.textContent = bugHighScore;
    }

    // Bug Hunter Save High Score
    function saveBugHighScore() {
        if (bugScore > bugHighScore) {
            bugHighScore = bugScore;
            localStorage.setItem('cmloni_bughunter_highscore', bugHighScore);
            if (gameHighScoreEl) gameHighScoreEl.textContent = bugHighScore;
        }
    }

    // Game Loop Methods
    function resetGame() {
        gameScore = 0;
        if (gameScoreEl) gameScoreEl.textContent = '0';
        if (gameStartOverlay) gameStartOverlay.style.display = 'flex';
        if (gameOverOverlay) gameOverOverlay.style.display = 'none';
        gameDirection = 'right';
        gameNextDirection = 'right';
        
        if (gameCtx) {
            gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawGrid();
        }
    }

    function drawGrid() {
        if (!gameCtx) return;
        gameCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        gameCtx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            gameCtx.beginPath();
            gameCtx.moveTo(i * CELL_SIZE, 0);
            gameCtx.lineTo(i * CELL_SIZE, gameCanvas.height);
            gameCtx.stroke();
            
            gameCtx.beginPath();
            gameCtx.moveTo(0, i * CELL_SIZE);
            gameCtx.lineTo(gameCanvas.width, i * CELL_SIZE);
            gameCtx.stroke();
        }
    }

    function spawnFood() {
        let attempts = 0;
        while (attempts < 100) {
            const rx = Math.floor(Math.random() * GRID_SIZE);
            const ry = Math.floor(Math.random() * GRID_SIZE);
            
            // Check if coordinates overlap with snake body
            const collision = gameSnake.some(part => part.x === rx && part.y === ry);
            if (!collision) {
                gameFood = { x: rx, y: ry };
                return;
            }
            attempts++;
        }
        gameFood = { x: 0, y: 0 };
    }

    function startGame() {
        initAudio();
        gameSnake = [
            { x: 6, y: 7 },
            { x: 5, y: 7 },
            { x: 4, y: 7 }
        ];
        gameDirection = 'right';
        gameNextDirection = 'right';
        gameScore = 0;
        if (gameScoreEl) gameScoreEl.textContent = '0';
        spawnFood();
        
        if (gameStartOverlay) gameStartOverlay.style.display = 'none';
        if (gameOverOverlay) gameOverOverlay.style.display = 'none';
        
        gameIsPlaying = true;
        if (gameLoopInterval) clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameStep, 200);
    }

    function stopGame() {
        gameIsPlaying = false;
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }
    }

    function triggerGameOver() {
        stopGame();
        playSound('crash');
        saveHighScore();
        if (gameOverOverlay) gameOverOverlay.style.display = 'flex';
    }

    function gameStep() {
        if (!gameIsPlaying || !gameCtx) return;
        
        gameDirection = gameNextDirection;
        const newHead = { ...gameSnake[0] };
        
        switch (gameDirection) {
            case 'up': newHead.y--; break;
            case 'down': newHead.y++; break;
            case 'left': newHead.x--; break;
            case 'right': newHead.x++; break;
        }
        
        // Wall collisions
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            triggerGameOver();
            return;
        }
        
        // Self collisions
        const selfCollision = gameSnake.some(part => part.x === newHead.x && part.y === newHead.y);
        if (selfCollision) {
            triggerGameOver();
            return;
        }
        
        // Push new head
        gameSnake.unshift(newHead);
        
        // Food collision
        if (newHead.x === gameFood.x && newHead.y === gameFood.y) {
            gameScore += 10;
            if (gameScoreEl) gameScoreEl.textContent = gameScore;
            playSound('eat');
            spawnFood();
        } else {
            gameSnake.pop();
        }
        
        renderFrame();
    }

    function renderFrame() {
        if (!gameCtx) return;
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawGrid();
        
        // Render Steaming Coffee food emoji
        gameCtx.font = '16px serif';
        gameCtx.textAlign = 'center';
        gameCtx.textBaseline = 'middle';
        gameCtx.fillText('☕', gameFood.x * CELL_SIZE + CELL_SIZE / 2, gameFood.y * CELL_SIZE + CELL_SIZE / 2);
        
        // Dark mode is fixed — always use gold/dark palette
        const headColor = 'hsl(38, 92%, 50%)';
        const bodyColor = 'rgba(220, 175, 45, 0.45)';
        const glowColor = 'rgba(220, 175, 45, 0.4)';
        
        gameCtx.shadowBlur = 8;
        gameCtx.shadowColor = glowColor;
        
        gameSnake.forEach((part, index) => {
            gameCtx.fillStyle = index === 0 ? headColor : bodyColor;
            
            // Draw a rounded cell block
            const r = 4; // Corner radius
            const x = part.x * CELL_SIZE + 1;
            const y = part.y * CELL_SIZE + 1;
            const w = CELL_SIZE - 2;
            const h = CELL_SIZE - 2;
            
            gameCtx.beginPath();
            gameCtx.moveTo(x + r, y);
            gameCtx.lineTo(x + w - r, y);
            gameCtx.quadraticCurveTo(x + w, y, x + w, y + r);
            gameCtx.lineTo(x + w, y + h - r);
            gameCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            gameCtx.lineTo(x + r, y + h - r);
            gameCtx.quadraticCurveTo(x, y + h, x, y + h - r);
            gameCtx.lineTo(x, y + r);
            gameCtx.quadraticCurveTo(x, y, x + r, y);
            gameCtx.closePath();
            gameCtx.fill();
        });
        
        gameCtx.shadowBlur = 0; // Clear blur settings
    }

    // Keyboard bindings for navigating snake
    document.addEventListener('keydown', (e) => {
        if (!gameIsPlaying) return;
        
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Lock browser scrolling
        }
        
        switch (e.key) {
            case 'ArrowUp':
                if (gameDirection !== 'down') gameNextDirection = 'up';
                break;
            case 'ArrowDown':
                if (gameDirection !== 'up') gameNextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (gameDirection !== 'right') gameNextDirection = 'left';
                break;
            case 'ArrowRight':
                if (gameDirection !== 'left') gameNextDirection = 'right';
                break;
        }
    });

    // Start Overlay click triggers
    if (gameStartBtn) gameStartBtn.addEventListener('click', startGame);
    if (gameRestartBtn) gameRestartBtn.addEventListener('click', startGame);

    // Mobile Navigation Controls
    document.querySelectorAll('.mobile-ctrl-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (!gameIsPlaying) return;
            const mobileDir = button.getAttribute('data-dir');
            
            switch (mobileDir) {
                case 'up':
                    if (gameDirection !== 'down') gameNextDirection = 'up';
                    break;
                case 'down':
                    if (gameDirection !== 'up') gameNextDirection = 'down';
                    break;
                case 'left':
                    if (gameDirection !== 'right') gameNextDirection = 'left';
                    break;
                case 'right':
                    if (gameDirection !== 'left') gameNextDirection = 'right';
                    break;
            }
        });
    });

    // ==========================================================================
    // BUG HUNTER MINI-GAME LOGIC
    // ==========================================================================

    function resetBugGame() {
        bugScore = 0;
        bugLives = 3;
        bugTimeRemaining = 30;
        
        if (bugScoreEl) bugScoreEl.textContent = '0';
        if (gameScoreEl) gameScoreEl.textContent = '0';
        if (bugTimerEl) bugTimerEl.textContent = '30';
        if (bugLivesEl) bugLivesEl.textContent = '❤️❤️❤️';
        
        if (bugStartOverlay) bugStartOverlay.style.display = 'flex';
        if (bugOverOverlay) bugOverOverlay.style.display = 'none';
        
        bugCells.forEach(cell => {
            cell.classList.remove('active', 'squished', 'miss-flash');
        });
        bugActiveIndex = -1;
    }

    function startBugGame() {
        initAudio();
        resetBugGame();
        
        if (bugStartOverlay) bugStartOverlay.style.display = 'none';
        
        bugIsPlaying = true;
        bugSpawnSpeed = 1000;
        
        if (bugTimerInterval) clearInterval(bugTimerInterval);
        bugTimerInterval = setInterval(bugTick, 1000);
        
        if (bugSpawnInterval) clearTimeout(bugSpawnInterval);
        bugSpawnInterval = setTimeout(spawnBugLoop, 500);
    }

    function stopBugGame() {
        bugIsPlaying = false;
        if (bugTimerInterval) {
            clearInterval(bugTimerInterval);
            bugTimerInterval = null;
        }
        if (bugSpawnInterval) {
            clearTimeout(bugSpawnInterval);
            bugSpawnInterval = null;
        }
        
        bugCells.forEach(cell => {
            cell.classList.remove('active', 'squished');
        });
        bugActiveIndex = -1;
    }

    function bugTick() {
        if (!bugIsPlaying) return;
        bugTimeRemaining--;
        
        if (bugTimerEl) bugTimerEl.textContent = bugTimeRemaining;
        
        if (bugTimeRemaining <= 0) {
            triggerBugGameOver(true);
        }
    }

    function spawnBugLoop() {
        if (!bugIsPlaying) return;
        
        // Hide previous active bug
        bugCells.forEach(cell => cell.classList.remove('active', 'squished'));
        
        // Pick new random cell
        let newIndex = Math.floor(Math.random() * bugCells.length);
        while (newIndex === bugActiveIndex) {
            newIndex = Math.floor(Math.random() * bugCells.length);
        }
        
        bugActiveIndex = newIndex;
        bugCells[bugActiveIndex].classList.add('active');
        playSound('pop');
        
        // Speed up as score increases
        bugSpawnSpeed = Math.max(450, 1000 - Math.floor(bugScore / 50) * 100);
        
        bugSpawnInterval = setTimeout(spawnBugLoop, bugSpawnSpeed);
    }

    function handleBugCellClick(cell) {
        if (!bugIsPlaying) return;
        
        const cellIndex = parseInt(cell.getAttribute('data-index'), 10);
        
        if (cellIndex === bugActiveIndex && cell.classList.contains('active')) {
            // Success! Patched bug.
            cell.classList.remove('active');
            cell.classList.add('squished');
            playSound('squish');
            
            bugScore += 10;
            if (bugScoreEl) bugScoreEl.textContent = bugScore;
            if (gameScoreEl) gameScoreEl.textContent = bugScore;
            
            // Clear squish class after animation completes
            setTimeout(() => {
                cell.classList.remove('squished');
            }, 200);
            
            // Force quick respawn
            clearTimeout(bugSpawnInterval);
            bugSpawnInterval = setTimeout(spawnBugLoop, 150);
        } else {
            // Missed! Lost a life (Compilation Error)
            bugLives--;
            playSound('miss');
            
            if (bugLivesEl) {
                bugLivesEl.textContent = bugLives > 0 ? '❤️'.repeat(bugLives) : '💀';
            }
            
            cell.classList.add('miss-flash');
            setTimeout(() => {
                cell.classList.remove('miss-flash');
            }, 350);
            
            if (bugLives <= 0) {
                triggerBugGameOver(false);
            }
        }
    }

    function triggerBugGameOver(isTimeOut) {
        stopBugGame();
        saveBugHighScore();
        
        if (bugOverOverlay) {
            bugOverOverlay.style.display = 'flex';
            
            if (bugEndTitle && bugEndMessage) {
                if (isTimeOut) {
                    if (bugScore >= 120) {
                        bugEndTitle.textContent = 'CLEAN COMPILE';
                        bugEndTitle.className = 'error-text gold-color';
                        bugEndMessage.textContent = `All bugs patched successfully! Score: ${bugScore}`;
                        playSound('win');
                    } else {
                        bugEndTitle.textContent = 'TIME EXPIRED';
                        bugEndTitle.className = 'error-text';
                        bugEndMessage.textContent = `Repository partially patched. Score: ${bugScore}`;
                        playSound('crash');
                    }
                } else {
                    bugEndTitle.textContent = 'SYSTEM CRASH';
                    bugEndTitle.className = 'error-text';
                    bugEndMessage.textContent = `Syntax errors overloaded compiler. Score: ${bugScore}`;
                    playSound('crash');
                }
            }
        }
    }

    // Attach Bug Hunter click events
    bugCells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            handleBugCellClick(cell);
        });
    });

    if (bugStartBtn) bugStartBtn.addEventListener('click', startBugGame);
    if (bugRestartBtn) bugRestartBtn.addEventListener('click', startBugGame);

});