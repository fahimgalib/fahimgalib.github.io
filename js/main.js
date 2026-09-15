/**
 * MD. FAHIM GALIB - PORTFOLIO INTERACTION ENGINE
 * Features: Lenis Smooth Scroll, Video Cinema Modal, Dynamic Portfolio Filter, 
 * SEO Pricing Switcher, Live Time Clock, Magnetic Cursor, Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons if available
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Initialize Lenis Smooth Scroll (if loaded)
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 3. Live Dhaka Time (GMT+6)
    const liveTimeEl = document.getElementById('live-time-display');
    function updateDhakaTime() {
        if (!liveTimeEl) return;
        const options = {
            timeZone: 'Asia/Dhaka',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date());
        liveTimeEl.textContent = `${timeString} GMT+6`;
    }
    updateDhakaTime();
    setInterval(updateDhakaTime, 1000);

    // 4. Interactive Custom Cursor (Desktop Only)
    const cursorDot = document.getElementById('custom-cursor');
    const cursorFollower = document.getElementById('custom-cursor-follower');

    if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(animateFollower);
        }
        requestAnimationFrame(animateFollower);

        const interactiveElements = document.querySelectorAll('a, button, .interactive-hover, .portfolio-card, input, textarea');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.width = '64px';
                cursorFollower.style.height = '64px';
                cursorFollower.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                cursorDot.style.width = '10px';
                cursorDot.style.height = '10px';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.width = '44px';
                cursorFollower.style.height = '44px';
                cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                cursorDot.style.width = '20px';
                cursorDot.style.height = '20px';
            });
        });
    }

    // 5. Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileNavDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNavDrawer.classList.contains('translate-y-0');
            if (isOpen) {
                mobileNavDrawer.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
                mobileNavDrawer.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
            } else {
                mobileNavDrawer.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
                mobileNavDrawer.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
            }
        });

        mobileNavLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileNavDrawer.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
                mobileNavDrawer.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
            });
        });
    }

    // 6. Cinema Video Player Modal
    const videoModal = document.getElementById('cinema-video-modal');
    const videoIframe = document.getElementById('modal-video-iframe');
    const videoTitleEl = document.getElementById('modal-video-title');
    const videoCategoryEl = document.getElementById('modal-video-category');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const openModalButtons = document.querySelectorAll('[data-video-url]');

    function getVideoEmbedUrl(url) {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (match) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
            return url;
        }
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : url;
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    function openVideoModal(url, title = 'Video Showcase', category = 'Cinematography & Motion') {
        if (!videoModal || !videoIframe) return;
        const embedUrl = getVideoEmbedUrl(url);
        if (!embedUrl) return;

        videoIframe.src = embedUrl;
        if (videoTitleEl) videoTitleEl.textContent = title;
        if (videoCategoryEl) videoCategoryEl.textContent = category;

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal || !videoIframe) return;
        videoModal.classList.remove('active');
        videoIframe.src = '';
        document.body.style.overflow = '';
    }

    openModalButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = btn.getAttribute('data-video-url');
            const title = btn.getAttribute('data-video-title') || 'Featured Production';
            const category = btn.getAttribute('data-video-category') || 'Video Showcase';
            openVideoModal(url, title, category);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal || e.target.classList.contains('video-modal-backdrop-bg')) {
                closeVideoModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // 7. Dynamic Portfolio Category Filtering
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item-card');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active styling
            filterButtons.forEach(b => {
                b.classList.remove('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/40');
                b.classList.add('bg-white/[0.04]', 'text-zinc-400', 'border-white/[0.08]');
            });
            btn.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/40');
            btn.classList.remove('bg-white/[0.04]', 'text-zinc-400', 'border-white/[0.08]');

            // Filter cards with smooth transition
            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 8. Multi-Category Pricing & Dual Currency Engine
    const pricingCatButtons = document.querySelectorAll('.pricing-cat-btn');
    const pricingTabBDT = document.getElementById('pricing-tab-bdt');
    const pricingTabUSD = document.getElementById('pricing-tab-usd');
    const pricingCardsContainer = document.getElementById('pricing-cards-container');

    let currentCategory = 'video';
    let currentCurrency = 'bdt';

    const categoryTitles = {
        video: 'Video & Motion',
        web: 'Web Development',
        app: 'Mobile App',
        seo: 'SEO & Growth'
    };

    const multiCategoryPricing = {
        video: {
            bdt: {
                starter: {
                    tag: 'Quick Turnaround',
                    title: 'Short-Form Viral Pack',
                    note: 'ইনস্টাগ্রাম রিলস, টিকটক ও ইউটিউব শর্টসের জন্য হাই-রিটেনশন এডিটিং।',
                    price: '৳১৫,০০০',
                    period: '/ ১০টি ভিডিও',
                    cta: 'এই প্যাকেজটি শুরু করুন',
                    features: [
                        '১০টি হাই-রিটেনশন শর্টস / রিলস (অনূর্ধ্ব ৬০ সেকেন্ড)',
                        'ডায়নামিক ভাইরাল সাবটাইটেল, কি-ফ্রেম ও ইমোজি অ্যানিমেশন',
                        'পেশাদার কালার গ্রেডিং, জুম কাটস ও সাউন্ড ইফেক্টস (SFX)',
                        'ট্রেন্ডিং রয়্যালটি-ফ্রি ব্যাকগ্রাউন্ড মিউজিক সিঙ্ক',
                        'ভিডিও প্রতি ২ রাউন্ড রিভিশন গ্যারান্টি',
                        '৪৮-৭২ ঘণ্টার ফাস্ট ডেলিভারি'
                    ]
                },
                growth: {
                    tag: 'Creator Pro',
                    title: 'YouTube Creator Pro',
                    note: 'সবচেয়ে জনপ্রিয়! ইউটিউব লং-ফর্ম, পডকাস্ট ও স্টোরিটেলিং ভিডিওর জন্য।',
                    price: '৳২৮,০০০',
                    period: '/ ৪টি ভিডিও',
                    cta: 'গ্রোথ প্যাকেজটি বুক করুন',
                    features: [
                        '৪টি সম্পূর্ণ ইউটিউব / লং-ফর্ম ভিডিও (৮-১৫ মিনিট প্রতি ভিডিও)',
                        'সিনেমাটিক স্টোরিটেলিং, বি-রোল ইনসার্ট ও মোশন কলআউটস',
                        'পেশাদার অডিও মিক্সিং, নয়েজ ক্লিনিং ও ভয়েস এনহ্যান্সমেন্ট',
                        '৪টি কাস্টম হাই-CTR ভাইরাল থাম্বনেইল ডিজাইন অন্তর্ভুক্ত',
                        'কাস্টম লোয়ার-থার্ডস, ট্রানজিশন ও ব্র্যান্ড অ্যাসেটস',
                        'ডেডিকেটেড হোয়াটসঅ্যাপ সাপোর্ট ও প্রায়োরিটি ডেলিভারি'
                    ]
                },
                enterprise: {
                    tag: 'Cinema & 3D Motion',
                    title: 'Commercial & Cinema',
                    note: 'টিভি বিজ্ঞাপন, ৩ডি প্রোডাক্ট অ্যানিমেশন ও কর্পোরেট ডকু-ফিল্ম।',
                    price: '৳৬০,০০০+',
                    period: '/ প্রজেক্ট',
                    cta: 'এন্টারপ্রাইজ প্যাকেজ নিন',
                    features: [
                        'হাই-এন্ড ব্র্যান্ড কমার্শিয়াল / কর্পোরেট ডকু / ৩ডি মোশন',
                        'দাভিঞ্চি রিজলভ সিনেমা ৪K কালার গ্রেডিং পাইপলাইন',
                        'আফটার ইফেক্টস ও ব্লেন্ডার ৩ডি মোশন গ্রাফিক্স',
                        'পূর্ণাঙ্গ অডিও মাস্টারিং, ফলি ও স্টুডিও সাউন্ড ডিজাইন',
                        'মাল্টি-ফরম্যাট ডেলিভারি (16:9, 9:16, 1:1 Social)',
                        'আনলিমিটেড রিভিশন ও ফুল মাস্টার প্রজেক্ট ফাইলস'
                    ]
                }
            },
            usd: {
                starter: {
                    tag: 'Quick Turnaround',
                    title: 'Short-Form Viral Pack',
                    note: 'High-retention editing for TikTok, Instagram Reels & YouTube Shorts.',
                    price: '$200',
                    period: '/ 10 videos',
                    cta: 'Start Viral Pack',
                    features: [
                        '10 High-Retention Shorts / Reels / TikToks (<60s each)',
                        'Dynamic Animated Subtitles, Sound FX & Motion Zoom',
                        'Color Grading, Seamless Pacing & Retention Cuts',
                        'Royalty-Free Trending Background Sound Design',
                        '2 Revision Rounds Included per Video',
                        '48-72 Hour Turnaround Per Asset'
                    ]
                },
                growth: {
                    tag: 'Creator Pro',
                    title: 'YouTube Creator Pro',
                    note: 'Most Popular! Complete editing suite for YouTube creators & brands.',
                    price: '$450',
                    period: '/ 4 videos',
                    cta: 'Book Creator Suite',
                    features: [
                        '4 Full YouTube / Long-Form Masterpieces (8-15 mins each)',
                        'Cinematic Storytelling Pacing, B-Roll & Visual Callouts',
                        'Audio Clean-up, Mastering & Dynamic Sound Design',
                        '4 High-CTR Click-Driven Custom YouTube Thumbnails',
                        'Custom Motion Lower Thirds & Brand Color Grading',
                        'Direct WhatsApp / Slack Workflow & Fast Revisions'
                    ]
                },
                enterprise: {
                    tag: 'Cinema & 3D Motion',
                    title: 'Commercial & Cinema',
                    note: 'Broadcast commercials, 3D product motion & corporate documentaries.',
                    price: '$950+',
                    period: '/ project',
                    cta: 'Scale with Enterprise',
                    features: [
                        'Bespoke Brand Commercial / 3D Product Motion / Docu',
                        'DaVinci Resolve 4K Color Grading & Cinema Look',
                        'Advanced After Effects Motion & Blender 3D VFX',
                        'Full Studio Audio Mix, Custom Foley & Sound FX',
                        'Multi-Platform Delivery (16:9, 9:16 vertical & 1:1)',
                        'Unlimited Revisions & Complete Master Project Archive'
                    ]
                }
            }
        },
        web: {
            bdt: {
                starter: {
                    tag: 'Speed & Conversion',
                    title: 'High-Impact Landing Page',
                    note: 'নতুন প্রোডাক্ট লঞ্চ, পোর্টফোলিও বা অফার ক্যাম্পেইনের জন্য আল্ট্রা-ফাস্ট ল্যান্ডিং পেজ।',
                    price: '৳২০,০০০',
                    period: '/ প্রজেক্ট',
                    cta: 'ল্যান্ডিং পেজ শুরু করুন',
                    features: [
                        '১টি আধুনিক কাস্টম হাই-কনভার্টিং ল্যান্ডিং পেজ',
                        '১০০% মোবাইল রেসপনসিভ ও ফ্লুইড টাইপোগ্রাফি',
                        'টেইলউইন্ড সিএসএস / ক্লিন কোড (৯৮+ গুগল পেজস্পিড)',
                        'লিড ক্যাপচার ফর্ম ও সরাসরি হোয়াটসঅ্যাপ চ্যাট ইন্টিগ্রেশন',
                        'অন-পেজ এসইও ও সোশ্যাল শেয়ারিং ওপেনগ্রাফ সেটআপ',
                        'ফ্রি ১ মাস মেইনটেন্যান্স ও বাগ ফিক্সিং'
                    ]
                },
                growth: {
                    tag: 'Full-Stack Scalability',
                    title: 'Full-Stack Web App',
                    note: 'সবচেয়ে জনপ্রিয়! বিজনেস ওয়েবসাইট, কাস্টম পোর্টাল ও ডায়নামিক সিএমএস।',
                    price: '৳৫০,০০০',
                    period: '/ প্রজেক্ট',
                    cta: 'গ্রোথ প্যাকেজটি বুক করুন',
                    features: [
                        '৭-১০টি কাস্টম ডিজাইন করা হাই-স্পিড ওয়েব পেজ',
                        'নেক্সট জেএস / রিঅ্যাক্ট / ফুল-স্ট্যাক নোডজেএস আর্কিটেকচার',
                        'ডায়নামিক সিএমএস / ড্যাশবোর্ড থেকে কনটেন্ট এডিটিং',
                        'ফাস্ট ডাটাবেস ও সিকিউর রেস্ট এপিআই (REST API) সেটআপ',
                        'কোর ওয়েব ভাইটালস অপটিমাইজেশন ও গুগল অ্যানালিটিক্স ৪',
                        '৩ মাসের ফ্রি সাপোর্ট ও আর্কিটেকচার মেইনটেন্যান্স'
                    ]
                },
                enterprise: {
                    tag: 'Enterprise Platform',
                    title: 'SaaS & Custom E-Commerce',
                    note: 'জটিল কাস্টম ওয়েব অ্যাপ্লিকেশন, ই-কমার্স বা মাল্টি-ইউজার প্ল্যাটফর্ম।',
                    price: '৳১,২০,০০০+',
                    period: '/ প্রজেক্ট',
                    cta: 'এন্টারপ্রাইজ সল্যুশন নিন',
                    features: [
                        'সম্পূর্ণ এন্টারপ্রাইজ স্কেলেবল মাল্টি-টিয়ার আর্কিটেকচার',
                        'পেমেন্ট গেটওয়ে ইন্টিগ্রেশন (বিকাশ, নগদ, ভিসা, মাস্টারকার্ড)',
                        'রোল-বেজড অথেনটিকেশন, ইউজার ড্যাশবোর্ড ও ক্লাউড স্টোরেজ',
                        'স্বয়ংক্রিয় CI/CD পাইপলাইন ও সিকিউরিটি হার্ডেনিং',
                        'হাই-কনকারেন্সি ডাটাবেস অপটিমাইজেশন',
                        '৬ মাসের প্রায়োরিটি SLA টেকনিক্যাল সাপোর্ট'
                    ]
                }
            },
            usd: {
                starter: {
                    tag: 'Speed & Conversion',
                    title: 'High-Impact Landing Page',
                    note: 'Ultra-fast, high-converting bespoke landing page for products & launches.',
                    price: '$350',
                    period: '/ project',
                    cta: 'Launch Landing Page',
                    features: [
                        '1 Bespoke High-Converting Landing Page',
                        '100% Mobile Responsive & Bespoke Micro-interactions',
                        'Clean Semantic Tailwind Code (98+ Google PageSpeed)',
                        'Lead Capture Form & Instant WhatsApp / Mailgun Hook',
                        'Complete On-Page Technical SEO & OG Social Tags',
                        '1 Month Post-Launch Bug Fixing & Warranty'
                    ]
                },
                growth: {
                    tag: 'Full-Stack Scalability',
                    title: 'Full-Stack Web App',
                    note: 'Most Popular! Dynamic web platforms, company portals & CMS solutions.',
                    price: '$850',
                    period: '/ project',
                    cta: 'Build Full-Stack App',
                    features: [
                        '7 to 10 Custom Dynamic Pages with Bespoke UI/UX',
                        'Next.js / React / Node Modern Tech Stack Architecture',
                        'Custom Dynamic Headless CMS & Admin Control Panel',
                        'Secure REST/GraphQL APIs & Scalable Database',
                        'Core Web Vitals Perfection & Google Analytics 4',
                        '3 Months Dedicated Technical Maintenance & Warranty'
                    ]
                },
                enterprise: {
                    tag: 'Enterprise Platform',
                    title: 'SaaS & Custom E-Commerce',
                    note: 'Complex SaaS applications, multi-tier platforms & custom e-commerce.',
                    price: '$1,800+',
                    period: '/ project',
                    cta: 'Architect Platform',
                    features: [
                        'Scalable Cloud Architecture & Multi-Tenant Database',
                        'International Stripe / PayPal / Local Payment Pipelines',
                        'Role-Based RBAC Auth, Member Portals & Media Storage',
                        'Automated CI/CD DevOps Pipeline & Security Hardening',
                        'High Availability, Microservices & Rate Limiting',
                        '6 Months Priority SLA Support & Architecture Consulting'
                    ]
                }
            }
        },
        app: {
            bdt: {
                starter: {
                    tag: 'Fast MVP',
                    title: 'Mobile MVP Suite',
                    note: 'স্টার্টআপ বা নতুন আইডিয়া দ্রুত টেস্ট করার জন্য ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ।',
                    price: '৳৩৫,০০০',
                    period: '/ প্রজেক্ট',
                    cta: 'মোবাইল MVP শুরু করুন',
                    features: [
                        '৩-৫টি ক্লিন ও রেসপনসিভ ফ্ল্যাটার (Flutter) স্ক্রিন',
                        'অ্যান্ড্রয়েড ও আইওএস (Android & iOS) ডুয়াল সাপোর্ট',
                        'লোকাল ডাটাবেস (Hive/SQLite) ও স্মুথ ট্রানজিশন UI',
                        'ইউজার ফ্রেন্ডলি ফর্ম ও ইনপুট ভ্যালিডেশন',
                        'রিলিজ-রেডি প্রোডাকশন APK ও টেস্টফ্লাইট বিল্ড',
                        '১ মাস ফ্রি বাগ ফিক্সিং সাপোর্ট'
                    ]
                },
                growth: {
                    tag: 'Production Ready',
                    title: 'Full Commercial App',
                    note: 'সবচেয়ে জনপ্রিয়! ব্যাকএন্ড, ডাটাবেস ও নোটিফিকেশনসহ পূর্ণাঙ্গ মোবাইল অ্যাপ।',
                    price: '৳৮০,০০০',
                    period: '/ প্রজেক্ট',
                    cta: 'গ্রোথ অ্যাপ বুক করুন',
                    features: [
                        '১০-১৫টি সম্পূর্ণ স্ক্রিনসহ ফুল-ফাংশনাল ক্রস-প্ল্যাটফর্ম অ্যাপ',
                        'ফায়ারবেস / সুপাবেস / কাস্টম ব্যাকএন্ড এপিআই কানেকশন',
                        'গুগল ও ফোন ওটিপি (OTP) ইউজার অথেনটিকেশন',
                        'পুশ নোটিফিকেশন ও ইন-অ্যাপ মেসেজিং সেটআপ',
                        'গুগল প্লে স্টোর ও অ্যাপল অ্যাপ স্টোরে পাবলিশিং গাইডেন্স',
                        '৩ মাসের ডেডিকেটেড টেকনিক্যাল মেইনটেন্যান্স'
                    ]
                },
                enterprise: {
                    tag: 'Ecosystem Suite',
                    title: 'Custom Mobile Ecosystem',
                    note: 'একাধিক অ্যাপ ও অ্যাডমিন প্যানেলসহ সম্পূর্ণ এন্টারপ্রাইজ মোবাইল সলিউশন।',
                    price: '৳১,৬০,০০০+',
                    period: '/ প্রজেক্ট',
                    cta: 'এন্টারপ্রাইজ ইকোসিস্টেম নিন',
                    features: [
                        'ডুয়াল মোবাইল অ্যাপস (কাস্টমার + মার্চেন্ট/রাইডার অ্যাপ)',
                        'রিয়েলটাইম ওয়েব অ্যাডমিন ড্যাশবোর্ড ও লাইভ অ্যানালিটিক্স',
                        'রিয়েলটাইম জিপিএস ট্র্যাকিং / ওয়েবসকেটস / লাইভ চ্যাট',
                        'ইন-অ্যাপ পেমেন্ট গেটওয়ে ইন্টিগ্রেশন ও ওয়ালেট সিস্টেম',
                        'সম্পূর্ণ সোর্স কোড ও বিস্তারিত ডকুমেন্টেশন হস্তান্তর',
                        '৬ মাসের প্রায়োরিটি টেকনিক্যাল সাপোর্ট ও ফিচার আপডেট'
                    ]
                }
            },
            usd: {
                starter: {
                    tag: 'Fast MVP',
                    title: 'Mobile MVP Suite',
                    note: 'Fast cross-platform prototype to validate startup concepts quickly.',
                    price: '$550',
                    period: '/ project',
                    cta: 'Launch Mobile MVP',
                    features: [
                        '3 to 5 Polished Flutter / React Native App Screens',
                        'Single Unified Codebase for both iOS and Android',
                        'Clean Architecture, Local State & Smooth Micro-animations',
                        'Form Validation, Offline Storage & Native Device Controls',
                        'Production-Ready APK & iOS Archive Release Bundle',
                        '1 Month Post-Launch Bug Warranty'
                    ]
                },
                growth: {
                    tag: 'Production Ready',
                    title: 'Full Commercial App',
                    note: 'Most Popular! Complete mobile application with live cloud database.',
                    price: '$1,250',
                    period: '/ project',
                    cta: 'Build Commercial App',
                    features: [
                        '10 to 15 Screens Full-Featured iOS & Android App',
                        'Firebase / Supabase / Custom REST Backend Integration',
                        'Social Login (Apple, Google) & Phone OTP Auth',
                        'FCM Push Notifications & In-App Activity Feed',
                        'Google Play Store & Apple App Store Deployment Help',
                        '3 Months Dedicated Technical Maintenance'
                    ]
                },
                enterprise: {
                    tag: 'Ecosystem Suite',
                    title: 'Custom Mobile Ecosystem',
                    note: 'Complete multi-user mobile suite with web admin management dashboard.',
                    price: '$2,500+',
                    period: '/ project',
                    cta: 'Architect Ecosystem',
                    features: [
                        'Dual Mobile Apps (Client + Agent/Delivery/Partner)',
                        'Real-Time Web Admin Panel with Live Management Tools',
                        'Live Geolocation Tracking, WebSockets & Chat Architecture',
                        'Seamless Payment Gateway (Stripe/PayPal/In-App Purchases)',
                        '100% Full Source Code Ownership & Complete Tech Docs',
                        '6 Months High-Priority SLA Support & Iteration Cycles'
                    ]
                }
            }
        },
        seo: {
            bdt: {
                starter: {
                    tag: 'Local Growth',
                    title: 'Starter Organic',
                    note: 'বাংলাদেশি স্থানীয় ব্র্যান্ড ও স্টার্টআপদের জন্য আদর্শ।',
                    price: '৳১৮,০০০',
                    period: '/ মাস',
                    cta: 'এই প্যাকেজটি শুরু করুন',
                    features: [
                        'কমপ্লিট টেকনিক্যাল ওয়েবসাইট অডিট ও কোর ফিক্সেস',
                        'টপ ১৫টি হাই-ইনটেন্ট বাণিজ্যিক কিওয়ার্ড টার্গেটিং',
                        'অন-পেজ এসইও (মেটা ট্যাগ, H1-H3, ইমেজ অল্ট, ইউআরএল স্ট্রাকচার)',
                        'গুগল বিজনেস প্রোফাইল ও লোকাল ম্যাপ অপটিমাইজেশন',
                        'মাসিক কিওয়ার্ড র‍্যাঙ্কিং ও ট্রাফিক অডিট রিপোর্ট',
                        'সার্চ কনসোল ও ইনডেক্সিং এরর ফিক্সিং'
                    ]
                },
                growth: {
                    tag: 'Revenue Engine',
                    title: 'Business Accelerator',
                    note: 'সবচেয়ে জনপ্রিয়! দ্রুত অর্গানিক ট্রাফিক ও সেলস কনভার্সন বৃদ্ধির জন্য।',
                    price: '৳৩৫,০০০',
                    period: '/ মাস',
                    cta: 'গ্রোথ প্যাকেজটি বুক করুন',
                    features: [
                        'ডিপ টেকনিক্যাল এসইও ও কোর ওয়েব ভাইটালস অপটিমাইজেশন',
                        'অনূর্ধ্ব ৪০টি হাই-ইনটেন্ট কমার্শিয়াল কিওয়ার্ড ক্যাম্পেইন',
                        'প্রতিদ্বন্দ্বী ব্র্যান্ডের কনটেন্ট গ্যাপ অ্যানালাইসিস',
                        '৪টি হাই-কোয়ালিটি এসইও অপটিমাইজড কনটেন্ট / প্রতি মাস',
                        'হাই-অথরিটি নিশ ব্যাকলিংক স্ট্র্যাটেজি ও আউটরিচ',
                        'পাক্ষিক স্ট্র্যাটেজি মিটিং ও সরাসরি হোয়াটসঅ্যাপ সাপোর্ট'
                    ]
                },
                enterprise: {
                    tag: 'National Dominance',
                    title: 'Enterprise Dominance',
                    note: 'সম্পূর্ণ ন্যাশনাল ডমিন্যান্স ও মাল্টিপল কিওয়ার্ড র‍্যাঙ্কিং সমাধান।',
                    price: '৳৭০,০০০',
                    period: '/ মাস',
                    cta: 'এন্টারপ্রাইজ প্যাকেজ নিন',
                    features: [
                        'আনলিমিটেড কিওয়ার্ড ও ন্যাশনাল/গ্লোবাল সার্চ ডমিন্যান্স',
                        'প্রোগ্রামাটিক এসইও ও অ্যাডভান্সড স্কিমা গ্রাফ সেটআপ',
                        'হাই-টায়ার ডিজিটাল পিআর ও এডিটোরিয়াল ব্যাকলিংক আউটরিচ',
                        '৮+ ডেপথ পিলার আর্টিকেল ও সেলস ল্যান্ডিং পেজ কপি',
                        'কনভার্সন রেট অপটিমাইজেশন (CRO) ও হিটম্যাপ অ্যানালাইসিস',
                        'ডেডিকেটেড স্ল্যাক/হোয়াটসঅ্যাপ চ্যানেল ও ২৪/৭ প্রায়োরিটি হ্যান্ডলিং'
                    ]
                }
            },
            usd: {
                starter: {
                    tag: 'Local Growth',
                    title: 'Starter Organic',
                    note: 'Best for regional businesses, personal brands & niche blogs.',
                    price: '$250',
                    period: '/ month',
                    cta: 'Get Started with Starter',
                    features: [
                        'Complete Technical Site Audit & Core Issue Resolution',
                        'Top 15 High-Intent Commercial Keyword Targets',
                        'On-Page SEO (Meta tags, Headings, Alt text, Internal Linking)',
                        'Google Business Profile & Local Citation Setup',
                        'Monthly Ranking, Traffic & Impression Performance Report',
                        'Search Console Error Diagnostics & Rapid Indexing'
                    ]
                },
                growth: {
                    tag: 'Revenue Engine',
                    title: 'Business Accelerator',
                    note: 'Most Popular! For growing e-commerce, agencies & SaaS platforms.',
                    price: '$550',
                    period: '/ month',
                    cta: 'Accelerate with Growth',
                    features: [
                        'Deep Technical SEO Audit & Core Web Vitals Optimization',
                        'Up to 40 High-Intent Commercial & Transactional Keywords',
                        'In-Depth Competitor Gap Analysis & Pillar Strategy',
                        '4 High-Grade Search-Optimized Long-Form Articles / Month',
                        'Authority Niche Backlink Acquisition & Digital Outreach',
                        'Bi-Weekly Strategic Calls & Dedicated WhatsApp Support'
                    ]
                },
                enterprise: {
                    tag: 'National Dominance',
                    title: 'Enterprise Dominance',
                    note: 'Complete global market dominance, deep technical SEO & PR outreach.',
                    price: '$1,100',
                    period: '/ month',
                    cta: 'Scale with Enterprise',
                    features: [
                        'Unlimited Strategic Keywords with Global Rank Tracking',
                        'Programmatic SEO Architecture & Structured Data Graphs',
                        'High-Authority Digital PR & Top-Tier Editorial Backlinks',
                        '8+ Long-Form Content Silos & Funnel Landing Page Copy',
                        'Advanced Conversion Rate Optimization (CRO) & Heatmaps',
                        'Dedicated Slack/WhatsApp Channel & 24/7 Priority SLA'
                    ]
                }
            }
        }
    };

    function renderFeaturesHTML(features) {
        if (!features || !features.length) return '';
        return features.map(item => `
            <div class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${item}</span>
            </div>
        `).join('');
    }

    function updatePricingDisplay() {
        const catData = multiCategoryPricing[currentCategory];
        if (!catData) return;
        const curData = catData[currentCurrency];
        if (!curData) return;

        const catLabel = categoryTitles[currentCategory] || 'Creative Service';
        const cleanPhone = '8801888021177';

        const tiers = [
            { key: 'starter', tagId: 'price-starter-tag', titleId: 'price-starter-title', noteId: 'price-starter-note', amountId: 'price-starter-amount', periodId: 'price-starter-period', featuresId: 'price-starter-features', ctaId: 'price-starter-cta' },
            { key: 'growth', tagId: 'price-growth-tag', titleId: 'price-growth-title', noteId: 'price-growth-note', amountId: 'price-growth-amount', periodId: 'price-growth-period', featuresId: 'price-growth-features', ctaId: 'price-growth-cta' },
            { key: 'enterprise', tagId: 'price-enterprise-tag', titleId: 'price-enterprise-title', noteId: 'price-enterprise-note', amountId: 'price-enterprise-amount', periodId: 'price-enterprise-period', featuresId: 'price-enterprise-features', ctaId: 'price-enterprise-cta' }
        ];

        tiers.forEach(t => {
            const data = curData[t.key];
            if (!data) return;

            const tagEl = document.getElementById(t.tagId);
            const titleEl = document.getElementById(t.titleId);
            const noteEl = document.getElementById(t.noteId);
            const amountEl = document.getElementById(t.amountId);
            const periodEl = document.getElementById(t.periodId);
            const featuresEl = document.getElementById(t.featuresId);
            const ctaEl = document.getElementById(t.ctaId);

            if (tagEl) tagEl.textContent = data.tag;
            if (titleEl) titleEl.textContent = data.title;
            if (noteEl) noteEl.textContent = data.note;
            if (amountEl) amountEl.textContent = data.price;
            if (periodEl) periodEl.textContent = data.period;
            if (featuresEl) featuresEl.innerHTML = renderFeaturesHTML(data.features);

            if (ctaEl) {
                const ctaSpan = ctaEl.querySelector('span');
                if (ctaSpan) {
                    ctaSpan.textContent = data.cta;
                } else {
                    ctaEl.textContent = data.cta;
                }
                const msg = `Hello Fahim, I am interested in the ${catLabel} - ${data.title} package (${currentCurrency.toUpperCase()}: ${data.price}). Let's discuss details.`;
                ctaEl.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
            }
        });
    }

    // Category button click handlers
    pricingCatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedCat = btn.getAttribute('data-pricing-cat');
            if (!selectedCat || selectedCat === currentCategory) return;

            currentCategory = selectedCat;

            pricingCatButtons.forEach(b => {
                b.classList.remove('bg-emerald-500', 'text-black', 'font-semibold', 'shadow-md');
                b.classList.add('bg-white/[0.04]', 'text-zinc-400', 'border', 'border-white/[0.08]', 'hover:text-white');
            });
            btn.classList.remove('bg-white/[0.04]', 'text-zinc-400', 'border', 'border-white/[0.08]', 'hover:text-white');
            btn.classList.add('bg-emerald-500', 'text-black', 'font-semibold', 'shadow-md');

            if (pricingCardsContainer) {
                pricingCardsContainer.style.opacity = '0.5';
                pricingCardsContainer.style.transform = 'translateY(4px)';
                setTimeout(() => {
                    updatePricingDisplay();
                    pricingCardsContainer.style.opacity = '1';
                    pricingCardsContainer.style.transform = 'translateY(0)';
                }, 100);
            } else {
                updatePricingDisplay();
            }
        });
    });

    // Currency toggle handlers
    if (pricingTabBDT && pricingTabUSD) {
        pricingTabBDT.addEventListener('click', () => {
            if (currentCurrency === 'bdt') return;
            currentCurrency = 'bdt';
            pricingTabBDT.classList.add('bg-emerald-500', 'text-black', 'font-semibold');
            pricingTabBDT.classList.remove('text-zinc-400', 'hover:text-white');
            pricingTabUSD.classList.remove('bg-emerald-500', 'text-black', 'font-semibold');
            pricingTabUSD.classList.add('text-zinc-400', 'hover:text-white');

            if (pricingCardsContainer) {
                pricingCardsContainer.style.opacity = '0.6';
                setTimeout(() => {
                    updatePricingDisplay();
                    pricingCardsContainer.style.opacity = '1';
                }, 80);
            } else {
                updatePricingDisplay();
            }
        });

        pricingTabUSD.addEventListener('click', () => {
            if (currentCurrency === 'usd') return;
            currentCurrency = 'usd';
            pricingTabUSD.classList.add('bg-emerald-500', 'text-black', 'font-semibold');
            pricingTabUSD.classList.remove('text-zinc-400', 'hover:text-white');
            pricingTabBDT.classList.remove('bg-emerald-500', 'text-black', 'font-semibold');
            pricingTabBDT.classList.add('text-zinc-400', 'hover:text-white');

            if (pricingCardsContainer) {
                pricingCardsContainer.style.opacity = '0.6';
                setTimeout(() => {
                    updatePricingDisplay();
                    pricingCardsContainer.style.opacity = '1';
                }, 80);
            } else {
                updatePricingDisplay();
            }
        });
    }

    // Initialize initial pricing display (Video + BDT)
    updatePricingDisplay();

    // 9. Toast Notification System
    const toast = document.getElementById('floating-toast');
    const toastMsg = document.getElementById('floating-toast-message');
    let toastTimeout = null;

    function showToast(message, duration = 3000) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
            toast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }, duration);
    }

    // 10. Copy Email to Clipboard
    const copyEmailButtons = document.querySelectorAll('.copy-email-trigger');
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'devfahimgalib@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast(`✓ Copied ${email} to clipboard!`);
            }).catch(() => {
                showToast(`devfahimgalib@gmail.com`);
            });
        });
    });

    // 11. Contact Form Submission Handling
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name')?.value || '';
            const email = document.getElementById('form-email')?.value || '';
            const service = document.getElementById('form-service')?.value || 'General Inquiry';
            const message = document.getElementById('form-message')?.value || '';

            if (!name || !email || !message) {
                showToast('Please fill out all required fields.');
                return;
            }

            // Create mailto fallback
            const subject = encodeURIComponent(`Project Inquiry: ${service} from ${name}`);
            const body = encodeURIComponent(`Hello Fahim,\n\nMy name is ${name} (${email}).\nService required: ${service}\n\nProject details:\n${message}`);
            
            // Show toast & trigger mail client
            showToast('Opening your email client...');
            setTimeout(() => {
                window.location.href = `mailto:devfahimgalib@gmail.com?subject=${subject}&body=${body}`;
            }, 600);
        });
    }

    // 12. Active Navbar Spy on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-emerald-400', 'border-emerald-500/30', 'bg-emerald-500/10');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-emerald-400', 'border-emerald-500/30', 'bg-emerald-500/10');
            }
        });
    });

    // =========================================================================
    // 13. ADVANCED MOTION: 3D Card Tilt & Card Spotlight Tracking
    // =========================================================================
    const interactiveCards = document.querySelectorAll('.bento-card, .portfolio-card');
    
    interactiveCards.forEach(card => {
        card.classList.add('spotlight-card', 'tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update Spotlight Coords
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Calculate 3D Tilt Angle (Only on desktop fine pointers)
            if (window.matchMedia('(pointer: fine)').matches) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.matchMedia('(pointer: fine)').matches) {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            }
        });
    });

    // =========================================================================
    // 14. ADVANCED MOTION: Magnetic Button Engine
    // =========================================================================
    const magneticElements = document.querySelectorAll('.magnetic-btn, .portfolio-filter-btn');

    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (!window.matchMedia('(pointer: fine)').matches) return;
            const rect = btn.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - btnCenterX) * 0.28;
            const deltaY = (e.clientY - btnCenterY) * 0.28;

            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // =========================================================================
    // 15. ADVANCED MOTION: Scroll Reveal Intersection Observer
    // =========================================================================
    const revealTargets = document.querySelectorAll('section > div, .bento-card, .portfolio-item-card, .timeline > div');
    
    revealTargets.forEach((el, index) => {
        el.classList.add('reveal-init');
        // Add staggered delay to child cards
        if (index % 3 === 1) el.classList.add('delay-100');
        if (index % 3 === 2) el.classList.add('delay-200');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));
});
