/* =========================================================
   Alexandra Blair Antablin — portfolio interactions
   ========================================================= */
(function () {
    "use strict";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    /* ---------- Footer year ---------- */
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Recommendations (data-driven) ---------- */
    const products = [
        { name: "Vessi", link: "https://vessi.com/" },
        { name: "Lume", link: "https://lumedeodorant.com/" },
        { name: "Hairstory", link: "https://hairstory.com/" },
        { name: "Ridge", link: "https://ridge.com/" },
        { name: "Sundays for Dogs", link: "https://sundaysfordogs.com/" },
        { name: "Sugar Bunny Shop", link: "https://www.sugarbunnyshop.com" }
    ];
    const media = [
        { name: "Dropout", link: "https://www.dropout.tv/" },
        { name: "Not Another D&D Podcast", link: "https://naddpod.com/" },
        { name: "Fool & Scholar Productions", link: "https://foolandscholar.com/" },
        { name: "The NoSleep Podcast", link: "https://www.thenosleeppodcast.com/" },
        { name: "Rusty Quill", link: "https://rustyquill.com/" },
        { name: "The Philip DeFranco Show", link: "https://www.youtube.com/@PhilipDeFranco" }
    ];
    const renderRecs = (items, targetId) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.innerHTML = items.map(it => `
            <a class="card rec" href="${it.link}" target="_blank" rel="noopener noreferrer">
                <span class="rec__name">${it.name}</span>
                <span class="rec__link">Visit site ↗</span>
            </a>`).join("");
    };
    renderRecs(products, "products");
    renderRecs(media, "media");

    /* ---------- Mobile nav toggle ---------- */
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const menu = $("#navMenu");
    const closeMenu = () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    };
    if (toggle) {
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
        });
        menu.addEventListener("click", e => { if (e.target.matches("a")) closeMenu(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    }

    /* ---------- Nav: scrolled state + scroll spy + depth gauge ---------- */
    const sections = $$("main section[id]");
    const navLinks = $$(".nav__link");
    const fill   = $(".depth-gauge__fill");
    const marker = $(".depth-gauge__marker");
    const value  = $(".depth-gauge__value");
    const zoneLabel = $("#depthZone");
    const gears  = $$(".depth-gauge__marker .gear");
    const seaZones = $$(".sea-zone");
    const ZONE_NAMES = ["Sea turtle", "Manta ray", "Tiger shark", "Jellyfish", "Anglerfish"];
    let lastGear = "snorkel", lastZone = -1;
    const MAX_DEPTH = 1000; // metres, for flavour

    let ticking = false;
    const onScroll = () => {
        const y = window.scrollY;

        nav.classList.toggle("is-scrolled", y > 24);

        // depth gauge
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? Math.min(y / docH, 1) : 0;
        if (fill)   fill.style.height = (pct * 100) + "%";
        if (marker) marker.style.top = (pct * 100) + "%";
        if (value)  value.textContent = Math.round(pct * MAX_DEPTH) + "m";

        // dive-gear morph: snorkel → scuba → submarine
        const gear = pct < 0.30 ? "snorkel" : pct < 0.60 ? "scuba" : "sub";
        if (gear !== lastGear) {
            gears.forEach(g => g.classList.toggle("is-on", g.dataset.gear === gear));
            lastGear = gear;
        }

        // sea-life zone: a new creature drifts in every 20% of depth
        const zone = Math.min(4, Math.floor(pct / 0.2));
        if (zone !== lastZone) {
            seaZones.forEach(z => z.classList.toggle("active", Number(z.dataset.zone) === zone));
            if (zoneLabel) zoneLabel.textContent = ZONE_NAMES[zone];
            lastZone = zone;
        }

        // scroll spy
        const mid = y + window.innerHeight * 0.35;
        let current = sections[0] ? sections[0].id : "";
        for (const sec of sections) {
            if (sec.offsetTop <= mid) current = sec.id;
        }
        navLinks.forEach(l => {
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + current);
        });

        ticking = false;
    };
    window.addEventListener("scroll", () => {
        if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    /* ---------- Scroll reveal ---------- */
    const revealEls = $$(".reveal");
    if (prefersReduced || !("IntersectionObserver" in window)) {
        revealEls.forEach(el => el.classList.add("in-view"));
    } else {
        // small stagger for grids
        $$(".projects__grid .project").forEach((el, i) => el.style.setProperty("--d", (i * 90) + "ms"));
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
        revealEls.forEach(el => io.observe(el));
    }

    /* ---------- Project card pointer glow ---------- */
    $$(".project").forEach(card => {
        card.addEventListener("pointermove", e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
            card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        });
    });

    /* ---------- Hero role rotator ---------- */
    const rotator = $("#roleRotator");
    if (rotator && !prefersReduced) {
        const roles = [
            "Biochemist",
            "Lab Scientist",
            "Marine Biology Enthusiast",
            "Lifelong Learner",
            "Programming Enthusiast",
            "Dolphin Superfan 🐬"
        ];
        let ri = 0, ci = 0, deleting = false;
        const tick = () => {
            const word = roles[ri];
            ci += deleting ? -1 : 1;
            rotator.textContent = word.slice(0, ci);
            let delay = deleting ? 45 : 90;
            if (!deleting && ci === word.length) { deleting = true; delay = 1600; }
            else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 1200);
    }

    /* ---------- Canvas ocean: rising bubbles + drifting plankton ---------- */
    const canvas = $("#bubbles");
    if (canvas && !prefersReduced) {
        const ctx = canvas.getContext("2d");
        let w, h, dpr, particles = [], raf;

        const rand = (a, b) => a + Math.random() * (b - a);

        const makeParticle = (atBottom) => {
            const glow = Math.random() < 0.22; // some bioluminescent specks
            return {
                x: rand(0, w),
                y: atBottom ? rand(0, h) : h + rand(0, 60),
                r: glow ? rand(0.6, 1.8) : rand(1.5, 5.5),
                speed: rand(8, 34),          // px per second upward
                sway: rand(0.4, 1.6),
                phase: rand(0, Math.PI * 2),
                glow
            };
        };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const target = Math.round(Math.min(110, (w * h) / 14000));
            particles = Array.from({ length: target }, () => makeParticle(true));
        };

        let last = performance.now();
        const draw = (now) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            ctx.clearRect(0, 0, w, h);
            for (const p of particles) {
                p.y -= p.speed * dt;
                p.phase += dt * p.sway;
                const x = p.x + Math.sin(p.phase) * 12;
                if (p.y < -10) { Object.assign(p, makeParticle(false)); }

                if (p.glow) {
                    ctx.beginPath();
                    ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(120, 240, 230, 0.9)";
                    ctx.shadowColor = "rgba(94, 234, 212, 0.9)";
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    ctx.beginPath();
                    ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(150, 200, 255, 0.30)";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    // little highlight
                    ctx.beginPath();
                    ctx.arc(x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.28, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(200, 230, 255, 0.45)";
                    ctx.fill();
                }
            }
            raf = requestAnimationFrame(draw);
        };

        const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(draw); };
        resize();
        start();

        let rt;
        window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 180); }, { passive: true });
        // pause when tab hidden (save battery)
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) cancelAnimationFrame(raf); else start();
        });
    }
})();
