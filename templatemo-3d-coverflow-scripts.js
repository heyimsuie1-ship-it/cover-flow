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
        const languageSelect = document.getElementById('languageSelect');
        const templateSelect = document.getElementById('templateSelect');
        const customText = document.getElementById('customText');
        const brandNameInput = document.getElementById('brandName');
        const seriesNameInput = document.getElementById('seriesName');
        const seriesNumberInput = document.getElementById('seriesNumber');
        const hookToggle = document.getElementById('hookToggle');
        const ctaToggle = document.getElementById('ctaToggle');
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

        // Niche based background mapping for better storytelling
        const backgroundByNiche = {
            love: [
                'images/ocean-sunset-golden-hour.jpg',
                'images/starry-night.jpg',
                'images/serene-water-mirroring.jpg'
            ],
            family: [
                'images/forest-path.jpg',
                'images/mountain-landscape.jpg'
            ],
            selfcare: [
                'images/serene-water-mirroring.jpg',
                'images/forest-path.jpg'
            ],
            motivation: [
                'images/rolling-sand-dunes.jpg',
                'images/mountain-landscape.jpg',
                'images/starry-night.jpg'
            ],
            girlpower: [
                'images/starry-night.jpg',
                'images/rolling-sand-dunes.jpg'
            ],
            funny: [
                'images/forest-path.jpg',
                'images/mountain-landscape.jpg'
            ],
            pets: [
                'images/forest-path.jpg'
            ],
            travel: [
                'images/serene-water-mirroring.jpg',
                'images/ocean-sunset-golden-hour.jpg',
                'images/mountain-landscape.jpg'
            ],
            fitness: [
                'images/rolling-sand-dunes.jpg',
                'images/mountain-landscape.jpg'
            ],
            spiritual: [
                'images/starry-night.jpg',
                'images/serene-water-mirroring.jpg'
            ],
            business: [
                'images/mountain-landscape.jpg',
                'images/rolling-sand-dunes.jpg'
            ]
        };

        const nicheTexts = {
            english: {
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
            },
            hinglish: {
                love: [
                    "Jo tumhari soul ko samajh le, uss connection ko kabhi loose mat karna.",
                    "Sahi insan woh hai jo tumhe kabhi explain karne ki zaroorat na padne de.",
                    "Jis rishtay mein sukoon ho, usse kabhi chhodna mat.",
                    "Wahi sahi hai jo crowd mein bhi sirf tumhe dekh raha ho.",
                    "Dil ke saath khelne wale bahut milenge, dil samajhne wala rare hota hai."
                ],
                motivation: [
                    "Aaj thoda extra mehnat, kal thoda extra life.",
                    "Jo tumhara hai, woh tumse koi nahi cheen sakta – bas give up mat karo.",
                    "Kaam chupchaap karo, result khud noise banega.",
                    "Focus itna strong rakho ke excuses awaaz hi na karein.",
                    "Abhi nahi toh kabhi nahi – bas start kar do."
                ]
            },
            hindi: {
                love: [
                    "Jo इंसान आपकी रूह को समझ ले, उस रिश्ते को संभाल कर रखना.",
                    "सही रिश्ता वही है जहाँ दिल को घर जैसा सुकून मिले.",
                    "अगर कोई आपको सच में देखता है, तो उसे कभी हल्के में मत लेना.",
                    "हर किसी को आपका समय नहीं चाहिए, किसी को बस आपका साथ चाहिए.",
                    "ज़िंदगी में असली लक वह रिश्ता है जो दिल को शांत कर दे."
                ],
                motivation: [
                    "जो आज मेहनत से भागता है, कल पछतावे से नहीं बचेगा.",
                    "समय सबके पास होता है, फर्क बस प्रायोरिटी का होता है.",
                    "हारने से ज़्यादा खतरनाक है कोशिश ही न करना.",
                    "धीरे चलो लेकिन रुकना मत.",
                    "सपने वही सच होते हैं जिनके लिए नींद तक कुर्बान कर दी जाए."
                ]
            }
        };

        const hookTexts = {
            english: [
                "Read this if you overthink relationships:",
                "Reminder:",
                "POV:",
                "Not everyone will get this, but the right ones will:",
                "If you needed a sign, this is it:"
            ],
            hinglish: [
                "Ye un logon ke liye hai jo overthink karte hain:",
                "Ek chhota sa reminder:",
                "Kabhi socha hai?",
                "Agar tumhe ek sign chahiye tha, toh ye wahi hai:",
                "Dil se padhna:"
            ],
            hindi: [
                "अगर आप भी ऐसा महसूस करते हैं तो ये आपके लिए है:",
                "बस एक छोटा सा याद दिलाना:",
                "कभी सोचा है?",
                "अगर आपको किसी संकेत का इंतज़ार था, तो वही है:",
                "दिल से पढ़िए:"
            ]
        };

        const ctaTexts = {
            english: [
                "Save & share if this hits.",
                "Tag someone who needs this today.",
                "Share this if you felt this.",
                "Keep this for the days you forget your worth."
            ],
            hinglish: [
                "Agar relate kiya ho toh save karke rakh lo.",
                "Usse tag karo jo ye sunna deserve karta hai.",
                "Share karo agar ye line dil ko lagi ho.",
                "Isko save karo un dinon ke liye jab tum khud ko bhool jao."
            ],
            hindi: [
                "अगर बात दिल तक पहुँची हो तो इसे संभाल कर रखिए.",
                "जिसे इसकी ज़रूरत है उसे टैग कीजिए.",
                "महसूस हुआ हो तो इसे शेयर कीजिए.",
                "खुद की कीमत भूल जाओ, तब इसे फिर से पढ़ना."
            ]
        };

        const toneStyles = {
            soft: {
                overlayColor: 'rgba(0, 0, 0, 0.4)',
                gradientFrom: 'rgba(146, 151, 213, 0.7)',
                gradientTo: 'rgba(251, 194, 235, 0.8)',
                textColor: '#ffffff',
                accentColor: 'rgba(0,0,0,0.9)'
            },
            bold: {
                overlayColor: 'rgba(0, 0, 0, 0.45)',
                gradientFrom: 'rgba(255, 75, 90, 0.9)',
                gradientTo: 'rgba(255, 196, 0, 0.9)',
                textColor: '#ffffff',
                accentColor: 'rgba(0,0,0,0.95)'
            },
            minimal: {
                overlayColor: 'rgba(0, 0, 0, 0.4)',
                gradientFrom: 'rgba(15, 15, 15, 0.95)',
                gradientTo: 'rgba(15, 15, 15, 0.95)',
                textColor: '#ffffff',
                accentColor: 'rgba(255,255,255,0.9)'
            },
            dark: {
                overlayColor: 'rgba(0, 0, 0, 0.45)',
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
            if (!ctx || !canvas) return Promise.resolve();

            const niche = nicheSelect ? nicheSelect.value : 'motivation';
            const tone = toneSelect ? toneSelect.value : 'soft';
            const language = languageSelect ? languageSelect.value : 'english';
            const templateStyle = templateSelect ? templateSelect.value : 'classic';
            const style = toneStyles[tone] || toneStyles.soft;

            const languageBucket = (nicheTexts[language] && nicheTexts[language][niche])
                ? nicheTexts[language][niche]
                : (nicheTexts.english[niche] || nicheTexts.english.motivation);

            const mainQuote = customText && customText.value.trim()
                ? customText.value.trim()
                : pickRandom(languageBucket);

            const hookEnabled = hookToggle ? hookToggle.checked : false;
            const ctaEnabled = ctaToggle ? ctaToggle.checked : false;

            const hookBucket = hookTexts[language] || hookTexts.english;
            const ctaBucket = ctaTexts[language] || ctaTexts.english;

            const hookLine = hookEnabled ? pickRandom(hookBucket) : '';
            const ctaLine = ctaEnabled ? pickRandom(ctaBucket) : '';

            const seriesName = seriesNameInput && seriesNameInput.value.trim()
                ? seriesNameInput.value.trim()
                : '';
            const seriesNumber = seriesNumberInput && seriesNumberInput.value.trim()
                ? seriesNumberInput.value.trim()
                : '';

            const bgPool = (backgroundByNiche[niche] && backgroundByNiche[niche].length)
                ? backgroundByNiche[niche]
                : generatorBackgrounds;
            const bgSrc = pickRandom(bgPool);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = bgSrc + '?v=' + Date.now();

            return new Promise((resolve, reject) => {
                img.onload = function () {
                    // Format handling
                    const format = 'square'; // future extension if needed
                    if (format === 'square') {
                        canvas.width = 1080;
                        canvas.height = 1080;
                    }

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
                    // Slightly shorter card for less empty space
                    const cardHeight = templateStyle === 'minimal' ? h * 0.32 : h * 0.35;
                    const cardX = cardPadding;
                    const cardY = templateStyle === 'minimal' ? h * 0.3 : h * 0.32;

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

                    // Hashtag/tag strip
                    const tagHeight = 40;
                    const tagWidth = 170;
                    const tagX = cardX + 24;
                    const tagY = cardY + 24;
                    ctx.fillStyle = style.accentColor;
                    ctx.globalAlpha = 0.85;
                    ctx.beginPath();
                    ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 20);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.font = '600 15px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.fillStyle = style.textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'left';
                    const tagText = '#'.concat(niche.toUpperCase(), ' • ').concat(language === 'english' ? 'REAL TALK' : 'REAL TALK');
                    ctx.fillText(tagText, tagX + 18, tagY + tagHeight / 2);

                    // Series label (top right)
                    if (seriesName || seriesNumber) {
                        ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = style.textColor === '#ffffff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)';
                        const seriesText = seriesName && seriesNumber
                            ? seriesName + ' • ' + seriesNumber
                            : (seriesName || seriesNumber);
                        ctx.fillText(seriesText, cardX + cardWidth - 24, tagY + tagHeight / 2);
                    }

                    // Main text area
                    const textAreaX = cardX + 40;
                    const textAreaWidth = cardWidth - 80;
                    let currentY = cardY + 80;

                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';

                    // Hook / intro line
                    if (hookLine) {
                        ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                        ctx.fillStyle = style.textColor === '#ffffff'
                            ? 'rgba(255,255,255,0.9)'
                            : 'rgba(0,0,0,0.85)';
                        wrapText(ctx, hookLine, textAreaX, currentY, textAreaWidth, 26);
                        currentY += 36 * 2;
                    }

                    // Main quote
                    ctx.font = templateStyle === 'minimal'
                        ? '800 40px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        : '800 44px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.fillStyle = style.textColor;
                    // Subtle glow for quote text
                    ctx.shadowColor = 'rgba(0,0,0,0.6)';
                    ctx.shadowBlur = 6;
                    ctx.shadowOffsetY = 2;
                    const mainLineHeight = templateStyle === 'minimal' ? 46 : 50;
                    wrapText(ctx, mainQuote, textAreaX, currentY, textAreaWidth, mainLineHeight);

                    // Reset shadow for rest of elements
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetY = 0;

                    currentY += mainLineHeight * 3;

                    // CTA line at bottom-left of card
                    if (ctaLine) {
                        ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                        ctx.fillStyle = style.textColor === '#ffffff'
                            ? 'rgba(255,255,255,0.8)'
                            : 'rgba(0,0,0,0.75)';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(ctaLine, cardX + 32, cardY + cardHeight - 24);
                    }

                    // Brand / page name bottom-left with subtle glow
                    ctx.font = '600 19px "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    ctx.fillStyle = style.textColor === '#ffffff' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'bottom';
                    ctx.shadowColor = 'rgba(0,0,0,0.7)';
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetY = 2;

                    const rawBrand = (brandNameInput && brandNameInput.value.trim())
                        ? brandNameInput.value.trim()
                        : 'facebook.com/yourpage';
                    const brandText = language === 'english'
                        ? 'Follow ' + rawBrand + ' for more'
                        : 'Follow ' + rawBrand + ' for more';
                    ctx.fillText(brandText, cardX + 32, cardY + cardHeight - 24);

                    // Reset shadow
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetY = 0;

                    if (downloadBtn) {
                        downloadBtn.disabled = false;
                    }

                    resolve();
                };

                img.onerror = function () {
                    console.error('Failed to load image for generator:', bgSrc);
                    reject(new Error('Failed to load generator background'));
                };
            });
        };
            });
        }

        if (generateBtn && downloadBtn && ctx && canvas) {
            generateBtn.addEventListener('click', () => {
                generateViralImage();
            });

            downloadBtn.addEventListener('click', function () {
                const link = document.createElement('a');
                const niche = nicheSelect ? nicheSelect.value : 'post';
                link.download = `facebook-${niche}-post-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });

            // Batch generate button (now with ZIP download and higher limit)
            const buttonsContainer = document.querySelector('.generator-buttons');
            if (buttonsContainer) {
                const batchBtn = document.createElement('button');
                batchBtn.type = 'button';
                batchBtn.id = 'batchBtn';
                batchBtn.className = 'generator-btn secondary';
                batchBtn.textContent = 'Batch Generate (ZIP)';

                batchBtn.addEventListener('click', async () => {
                    const input = prompt('Kitni images generate karni hain? (1-500)', '50');
                    const parsed = parseInt(input || '0', 10);
                    if (!parsed || parsed <= 0) {
                        return;
                    }
                    const count = Math.min(Math.max(parsed, 1), 500);

                    if (!window.JSZip) {
                        alert('ZIP generate karne ke liye JSZip load nahi hua. Thodi der baad try karein.');
                        return;
                    }

                    if (downloadBtn) {
                        downloadBtn.disabled = true;
                    }
                    batchBtn.disabled = true;
                    batchBtn.textContent = 'Generating...';

                    const zip = new JSZip();
                    const folder = zip.folder('images');
                    const niche = nicheSelect ? nicheSelect.value : 'post';

                    for (let i = 0; i < count; i++) {
                        // Har image ko generate karo
                        await generateViralImage();

                        // Canvas ko PNG blob mein convert karo
                        // eslint-disable-next-line no-await-in-loop
                        const blob = await new Promise((resolve) => {
                            canvas.toBlob((b) => resolve(b), 'image/png');
                        });

                        if (blob && folder) {
                            const filename = `facebook-${niche}-post-${Date.now()}-${i + 1}.png`;
                            folder.file(filename, blob);
                        }
                    }

                    // ZIP generate karo aur ek hi baar download
                    zip.generateAsync({ type: 'blob' }).then((content) => {
                        const link = document.createElement('a');
                        const zipName = `facebook-${niche}-batch-${Date.now()}.zip`;
                        link.download = zipName;
                        link.href = URL.createObjectURL(content);
                        link.click();
                        setTimeout(() => URL.revokeObjectURL(link.href), 10000);
                    }).finally(() => {
                        if (downloadBtn) {
                            downloadBtn.disabled = false;
                        }
                        batchBtn.disabled = false;
                        batchBtn.textContent = 'Batch Generate (ZIP)';
                    });
                });

                buttonsContainer.appendChild(batchBtn);
            }

            // Initial auto-generate once page loads
            setTimeout(() => {
                generateViralImage();
            }, 800);
        }

        // Initialize
        updateCoverflow();
        container.focus();
        startAutoplay();