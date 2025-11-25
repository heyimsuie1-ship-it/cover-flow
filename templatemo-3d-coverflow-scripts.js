/*

TemplateMo 595 3d coverflow

https://templatemo.com/tm-595-3d-coverflow

*/

// JavaScript Document

        // Coverflow functionality
        const items = document.querySelectorAll('.coverflow-item');
        const dotsContainer = document.getElementById('dots');
        const currentTitle = document.getElementById('current-title');
        const currentDescription = document.getElementById('current-description');
        const container = document.querySelector('.coverflow-container');
        const menuToggle = document.getElementById('menuToggle');
        const mainMenu = document.getElementById('mainMenu');
        let currentIndex = 3;
        let isAnimating = false;

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on menu items (except external links)
        document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
            item.addEventListener('click', (e) => {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
            }
        });

        // Image data with titles and descriptions
        const imageData = [
            {
                title: "Mountain Landscape",
                description: "Majestic peaks covered in snow during golden hour"
            },
            {
                title: "Forest Path",
                description: "A winding trail through ancient woodland"
            },
            {
                title: "Lake Reflection",
                description: "Serene waters mirroring the surrounding landscape"
            },
            {
                title: "Ocean Sunset",
                description: "Golden hour over endless ocean waves"
            },
            {
                title: "Desert Dunes",
                description: "Rolling sand dunes under vast blue skies"
            },
            {
                title: "Starry Night",
                description: "Countless stars illuminating the dark sky"
            },
            {
                title: "Waterfall",
                description: "Cascading water through lush green forest"
            }
        ];

        // Create dots
        items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.onclick = () => goToIndex(index);
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');
        let autoplayInterval = null;
        let isPlaying = true;
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');

        function updateCoverflow() {
            if (isAnimating) return;
            isAnimating = true;

            items.forEach((item, index) => {
                let offset = index - currentIndex;
                
                if (offset > items.length / 2) {
                    offset = offset - items.length;
                }
                else if (offset < -items.length / 2) {
                    offset = offset + items.length;
                }
                
                const absOffset = Math.abs(offset);
                const sign = Math.sign(offset);
                
                let translateX = offset * 220;
                let translateZ = -absOffset * 200;
                let rotateY = -sign * Math.min(absOffset * 60, 60);
                let opacity = 1 - (absOffset * 0.2);
                let scale = 1 - (absOffset * 0.1);

                if (absOffset > 3) {
                    opacity = 0;

                    translateX = sign * 800;
                }

                item.style.transform = `
                    translateX(${translateX}px) 
                    translateZ(${translateZ}px) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                `;
                item.style.opacity = opacity;
                item.style.zIndex = 100 - absOffset;

                item.classList.toggle('active', index === currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            const currentData = imageData[currentIndex];
            currentTitle.textContent = currentData.title;
            currentDescription.textContent = currentData.description;
            
            currentTitle.style.animation = 'none';
            currentDescription.style.animation = 'none';
            setTimeout(() => {
                currentTitle.style.animation = 'fadeIn 0.6s forwards';
                currentDescription.style.animation = 'fadeIn 0.6s forwards';
            }, 10);

            setTimeout(() => {
                isAnimating = false;
            }, 600);
        }

        function navigate(direction) {
            if (isAnimating) return;
            
            currentIndex = currentIndex + direction;
            
            if (currentIndex < 0) {
                currentIndex = items.length - 1;
            } else if (currentIndex >= items.length) {
                currentIndex = 0;
            }
            
            updateCoverflow();
        }

        function goToIndex(index) {
            if (isAnimating || index === currentIndex) return;
            currentIndex = index;
            updateCoverflow();
        }

        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });

        // Click on items to select
        items.forEach((item, index) => {
            item.addEventListener('click', () => goToIndex(index));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        let isSwiping = false;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            const currentX = e.changedTouches[0].screenX;
            const diff = currentX - touchStartX;
            
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
            isSwiping = false;
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 30;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                handleUserInteraction();
                
                if (diffX > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
        }

        // Initialize images and reflections
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            const reflection = item.querySelector('.reflection');
            
            img.onload = function() {

                this.parentElement.classList.remove('image-loading');
                reflection.style.setProperty('--bg-image', `url(${this.src})`);
                reflection.style.backgroundImage = `url(${this.src})`;
                reflection.style.backgroundSize = 'cover';
                reflection.style.backgroundPosition = 'center';
            };
            
            img.onerror = function() {
                this.parentElement.classList.add('image-loading');
            };
        });

        // Autoplay functionality
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCoverflow();
            }, 4000);
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
            isPlaying = false;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }

        function toggleAutoplay() {
            if (isPlaying) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        }

        function handleUserInteraction() {
            stopAutoplay();
        }

        // Add event listeners to stop autoplay on manual navigation
        items.forEach((item) => {
            item.addEventListener('click', handleUserInteraction);
        });

        document.querySelector('.nav-button.prev').addEventListener('click', handleUserInteraction);
        document.querySelector('.nav-button.next').addEventListener('click', handleUserInteraction);
        
        dots.forEach((dot) => {
            dot.addEventListener('click', handleUserInteraction);
        });

        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                handleUserInteraction();
            }
        });

        // Smooth scrolling and active menu item
        const sections = document.querySelectorAll('.section');
        const menuItems = document.querySelectorAll('.menu-item');
        const header = document.getElementById('header');
        const scrollToTopBtn = document.getElementById('scrollToTop');

        // Update active menu item on scroll
        function updateActiveMenuItem() {
            const scrollPosition = window.scrollY + 100;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    menuItems.forEach(item => {
                        if (!item.classList.contains('external')) {
                            item.classList.remove('active');
                        }
                    });
                    if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                        menuItems[index].classList.add('active');
                    }
                }
            });

            // Header background on scroll
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Show/hide scroll to top button
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', updateActiveMenuItem);

        // Smooth scroll to section
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = item.getAttribute('href');
                
                // Check if it's an internal link (starts with #)
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                // External links will open normally in new tab
            });
        });

        // Logo click to scroll to top
        document.querySelector('.logo-container').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Scroll to top button
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Form submission
        function handleSubmit(event) {
            event.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            event.target.reset();
        }

        // -----------------------------
        // Viral Image Generator Logic
        // -----------------------------

        const nicheSelect = document.getElementById('nicheSelect');
        const toneSelect = document.getElementById('toneSelect');
        const customText = document.getElementById('customText');
        const brandNameInput = document.getElementById('brandName');
        const generateBtn = document.getElementById('generateBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const canvas = document.getElementById('previewCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;

        const generatorBackgrounds = [
            'images/mountain-landscape.jpg',
            'images/forest-path.jpg',
            'images/serene-water-mirroring.jpg',
            'images/ocean-sunset-golden-hour.jpg',
            'images/rolling-sand-dunes.jpg',
            'images/starry-night.jpg',
            'images/cascading-waterfall.jpg'
        ];

        const nicheTexts = {
            love: [
                "In a world full of trends, I just want something that feels like home.",
                "If they make your soul feel seen, protect that connection.",
                "Love is not found, it’s built little by little every single day.",
                "The right person will choose you in every universe.",
                "Soft hearts deserve the safest kind of love."
            ],
            family: [
                "Family is not about perfection, it’s about showing up.",
                "The older I get, the more I realize that family time is everything.",
                "Some of the loudest laughs live inside the quietest homes.",
                "Home is not a place, it’s the people who wait for you.",
                "One day you’ll realize the little family moments were the big moments."
            ],
            selfcare: [
                "You are not behind. You are on your own timeline.",
                "Healing is not about becoming someone new, it’s about coming home to yourself.",
                "Read this again: Rest is not a reward, it’s a right.",
                "You are allowed to be both a masterpiece and a work in progress.",
                "Protect your peace like it’s your most expensive luxury."
            ],
            motivation: [
                "Five years from now, you’ll be glad you started today.",
                "Move in silence, let your work be the noise.",
                "Your future self is begging you not to give up right now.",
                "Discipline will take you places motivation never could.",
                "You don’t need more time. You need more focus."
            ],
            girlpower: [
                "Soft but not weak. Kind but not blind. A woman who knows her worth.",
                "She’s not asking for a seat at the table. She’s building her own.",
                "Be the kind of woman your younger self needed.",
                "Pretty is not the point. Power is.",
                "Her vibe is: I know who I am, and that’s my superpower."
            ],
            funny: [
                "My daily cardio? Running late to everything.",
                "Adulthood is basically emailing ‘sorry for the late reply’ until you die.",
                "Mentally I’m here, physically I need a nap.",
                "If we’re not laughing, we’re not doing life right.",
                "I don’t rise and shine, I caffeinate and hope for the best."
            ],
            pets: [
                "My dog doesn’t know they’re my emotional support system.",
                "Some angels have wings, mine has four paws.",
                "I work hard so my pet can have a better life.",
                "Who rescued who? Exactly.",
                "The best therapist has fur and can’t speak human."
            ],
            travel: [
                "Collect moments, not stuff.",
                "Some places feel like they were waiting just for you.",
                "You were not born to live in one tiny corner of the world.",
                "Turn your ‘one day’ into ‘today I booked it.’",
                "A new place can unlock a new version of you."
            ],
            fitness: [
                "You’ll never regret a workout, only the ones you skipped.",
                "Discipline is doing it even when the mood is gone.",
                "Strong looks different on everyone. Just start.",
                "One workout at a time. One day at a time.",
                "You are not chasing a look, you’re chasing a stronger life."
            ],
            spiritual: [
                "What’s meant for you will never feel forced.",
                "Sometimes rejection is just redirection in disguise.",
                "You’re not lost, you’re being realigned.",
                "The energy you give is the energy you live in.",
                "Talk to the universe like it’s already done."
            ],
            business: [
                "Build something that pays you while you sleep.",
                "Your 9–5 pays the bills. Your 7–11 builds the life.",
                "Read this again: You are allowed to be the first millionaire in your family.",
                "Don’t wait for the right time, make the time right now.",
                "Turn your skills into invoices, not just compliments."
            ]
        };

        const toneStyles = {
            soft: {
                overlayColor: 'rgba(255, 255, 255, 0.22)',
                gradientFrom: 'rgba(146, 151, 213, 0.75)',
                gradientTo: 'rgba(251, 194, 235, 0.85)',
                textColor: '#111111',
                accentColor: 'rgba(0,0,0,0.85)'
            },
            bold: {
                overlayColor: 'rgba(0, 0, 0, 0.55)',
                gradientFrom: 'rgba(255, 75, 90, 0.95)',
                gradientTo: 'rgba(255, 196, 0, 0.95)',
                textColor: '#ffffff',
                accentColor: 'rgba(0,0,0,0.9)'
            },
            minimal: {
                overlayColor: 'rgba(0, 0, 0, 0.35)',
                gradientFrom: 'rgba(15, 15, 15, 0.95)',
                gradientTo: 'rgba(15, 15, 15, 0.95)',
                textColor: '#ffffff',
                accentColor: 'rgba(255,255,255,0.9)'
            },
            dark: {
                overlayColor: 'rgba(0, 0, 0, 0.6)',
                gradientFrom: 'rgba(36, 0, 70, 0.95)',
                gradientTo: 'rgba(0, 0, 0, 0.95)',
                textColor: '#ffffff',
                accentColor: 'rgba(255,255,255,0.9)'
            }
        };

        function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            });

            if (currentLine) lines.push(currentLine);

            lines.forEach((line, index) => {
                ctx.fillText(line, x, y + index * lineHeight);
            });
        }

        function generateViralImage() {
            if (!ctx || !canvas) return;

            const niche = nicheSelect ? nicheSelect.value : 'motivation';
            const tone = toneSelect ? toneSelect.value : 'soft';
            const style = toneStyles[tone] || toneStyles.soft;

            const baseText = customText && customText.value.trim()
                ? customText.value.trim()
                : pickRandom(nicheTexts[niche] || nicheTexts.motivation);

            const bgSrc = pickRandom(generatorBackgrounds);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = bgSrc + '?v=' + Date.now();

            img.onload = function () {
                const w = canvas.width;
                const h = canvas.height;

                ctx.clearRect(0, 0, w, h);

                const imgRatio = img.width / img.height;
                const canvasRatio = w / h;
                let drawWidth, drawHeight, dx, dy;

                if (imgRatio > canvasRatio) {
                    drawHeight = h;
                    drawWidth = imgRatio * drawHeight;
                } else {
                    drawWidth = w;
                    drawHeight = drawWidth / imgRatio;
                }

                dx = (w - drawWidth) / 2;
                dy = (h - drawHeight) / 2;

                ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

                ctx.fillStyle = style.overlayColor;
                ctx.fillRect(0, 0, w, h);

                const cardPadding = w * 0.08;
                const cardWidth = w - cardPadding * 2;
                const cardHeight = h * 0.5;
                const cardX = cardPadding;
                const cardY = h * 0.27;

                const gradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight);
                gradient.addColorStop(0, style.gradientFrom);
                gradient.addColorStop(1, style.gradientTo);

                ctx.fillStyle = gradient;
                ctx.roundRect = ctx.roundRect || function (x, y, width, height, radius) {
                    if (width < 0) {
                        x = x + width;
                        width = -width;
                    }
                    if (height < 0) {
                        y = y + height;
                        height = -height;
                    }
                    if (typeof radius === 'undefined') {
                        radius = 5;
                    }
                    if (typeof radius === 'number') {
                        radius = { tl: radius, tr: radius, br: radius, bl: radius };
                    } else {
                        const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
                        for (const side in defaultRadius) {
                            radius[side] = radius[side] || defaultRadius[side];
                        }
                    }
                    ctx.beginPath();
                    ctx.moveTo(x + radius.tl, y);
                    ctx.lineTo(x + width - radius.tr, y);
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                    ctx.lineTo(x + width, y + height - radius.br);
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                    ctx.lineTo(x + radius.bl, y + height);
                    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                    ctx.lineTo(x, y + radius.tl);
                    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
                    ctx.closePath();
                };

                ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 40);
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 40;
                ctx.shadowOffsetY = 18;
                ctx.fill();
                ctx.shadowColor = 'transparent';

                const tagHeight = 40;
                const tagWidth = 140;
                const tagX = cardX + 24;
                const tagY = cardY + 24;
                ctx.fillStyle = style.accentColor;
                ctx.globalAlpha = 0.85;
                ctx.beginPath();
                ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 20);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.fillStyle = style.textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
                ctx.textBaseline = 'middle';
                ctx.fillText('#' + niche.toUpperCase(), tagX + 18, tagY + tagHeight / 2);

                ctx.font = '700 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.fillStyle = style.textColor;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';

                const textAreaX = cardX + 40;
                const textAreaY = cardY + 90;
                const textAreaWidth = cardWidth - 80;
                const lineHeight = 52;

                wrapText(ctx, baseText, textAreaX, textAreaY, textAreaWidth, lineHeight);

                ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.fillStyle = style.textColor === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';

                const brandText = (brandNameInput && brandNameInput.value.trim())
                    ? brandNameInput.value.trim()
                    : 'facebook.com/yourpage';

                ctx.fillText(brandText, cardX + cardWidth - 32, cardY + cardHeight - 24);

                if (downloadBtn) {
                    downloadBtn.disabled = false;
                }
            };

            img.onerror = function () {
                console.error('Failed to load image for generator:', bgSrc);
            };
        }

        if (generateBtn && downloadBtn && ctx && canvas) {
            generateBtn.addEventListener('click', generateViralImage);

            downloadBtn.addEventListener('click', function () {
                const link = document.createElement('a');
                const niche = nicheSelect ? nicheSelect.value : 'post';
                link.download = `facebook-${niche}-post-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });

            // Initial auto-generate once page loads
            setTimeout(generateViralImage, 800);
        }

        // Initialize
        updateCoverflow();
        container.focus();
        startAutoplay();