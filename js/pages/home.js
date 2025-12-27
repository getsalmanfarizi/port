// ===================================
// THEME TOGGLE SCROLL STATE
// ===================================
const themeToggleButton = document.querySelector(".theme-toggle button");
const triggerSection = document.querySelector("#home"); // ganti id section

function handleScroll() {
    const sectionBottom = triggerSection.offsetTop + triggerSection.offsetHeight;

    if (window.scrollY >= sectionBottom) {
        themeToggleButton.classList.add("scrolled");
    } else {
        themeToggleButton.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();


// ===================================
// GSAP REGISTER
// ===================================
gsap.registerPlugin(ScrollTrigger);

// ===================================
// ANIMATED ON SCROLL AFTER PRELOAD
// ===================================
function enableAnimatedOnScroll() {

    gsap.to("#typed-title", {
        scrollTrigger: {
            trigger: "body",
            start: "0 top",
            end: "+=112",
            scrub: 0.8
        },
        scale: 0.90,
        y: 10,
        filter: "blur(10px)",
        letterSpacing: "12px",
        opacity: 0,
        ease: "none"
    });

    gsap.to("#typed-subtitle", {
        scrollTrigger: {
            trigger: "body",
            start: "12 top",
            end: "+=152",
            scrub: 0.8
        },
        scale: 0.80,
        y: 10,
        filter: "blur(10px)",
        letterSpacing: "8px",
        opacity: 0,
        ease: "none"
    });

    gsap.to(".btn-social", {
        scrollTrigger: {
            trigger: "body",
            start: "32px top",
            end: "+=172",
            scrub: 0.8
        },
        scale: 0.80,
        y: 42,
        rotate: 10,
        filter: "blur(10px)",
        x: (i, el, arr) => {
            const center = (arr.length - 1) / 2;
            return (i - center) * 24;
        },
        opacity: 0,
        "--shadow-dark-x": "0px",
        "--shadow-dark-y": "0px",
        "--shadow-dark-blur": "0px",
        "--shadow-dark-color": "rgba(0,0,0,0.0)",

        "--shadow-light-x": "0px",
        "--shadow-light-y": "0px",
        "--shadow-light-blur": "0px",
        "--shadow-light-color": "rgba(255,255,255,0.0)",

        ease: "power1.out",
        stagger: { each: 0.03, from: "center" }
    });

    gsap.to("#container-theShow", {
        scrollTrigger: {
            trigger: "body",
            start: "86px top",
            end: "+=182",
            scrub: 0.8
        },
        filter: "blur(9px)",
        opacity: 0,
        scale: 0.7,
        y: 86,
        ease: "none"
    });
}

// ===================================
// PRELOAD CONFIG
// ===================================
const PRELOAD_KEY = "hasVisited";
const TYPED_KEY = "typedDone";

// ===================================
// ELEMENT SELECTORS
// ===================================
const selectorsAll = [
    "#typed-title",
    "#typed-subtitle",
    ".btn-social",
    "#container-theShow"
];

gsap.set(".credit", {
    visibility: "hidden",
    opacity: 0
});

// ===================================
// HIDE ELEMENTS (FIXED)
// ===================================
function hideElements() {
    selectorsAll.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
        });
    });
}

// ===================================
// SHOW ALL ELEMENTS (SAFE RESTORE)
// ===================================
function showAllElements() {
    gsap.set(selectorsAll, {
        visibility: "visible",
        opacity: 1,
        clearProps: "transform,filter"
    });
}


// ===================================
// TYPED TEXT MODULE
// ===================================
const title = document.getElementById("typed-title");
const subtitle = document.getElementById("typed-subtitle");

function typeTextWithMode(element, text, baseSpeed = 100, callback) {
    element.innerHTML = "";
    element.style.visibility = "visible";
    element.style.opacity = "1";

    const cursor = document.createElement("span");
    cursor.classList.add(
        "cursor",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
    );

    element.appendChild(cursor);

    let i = 0;

    function blink(duration) {
        let visible = true;
        const blinkInterval = setInterval(() => {
            cursor.style.backgroundColor = visible
                ? document.body.classList.contains("dark-mode")
                    ? "#f5f5f7"
                    : "#1d1d1f"
                : "transparent";
            visible = !visible;
        }, 300);

        setTimeout(() => {
            clearInterval(blinkInterval);
            typeNextChar();
        }, duration);
    }

    function typeNextChar() {
        if (i >= text.length) {
            cursor.remove();
            callback && callback();
            return;
        }

        const char = text[i++];
        cursor.insertAdjacentText("beforebegin", char);

        if (char === ".") {
            blink(1200);
            return;
        }

        if (text[i] === " ") {
            blink(600);
            return;
        }

        setTimeout(typeNextChar, baseSpeed + Math.random() * baseSpeed);
    }

    typeNextChar();
}

// ===================================
// PRELOAD ANIMATION
// ===================================
function showElementsOnPreload() {

    const tl = gsap.timeline();

    tl.fromTo(
        [".btn-social", "#container-theShow", ".credit"],
        { visibility: "hidden", opacity: 0 },
        {
            visibility: "visible",
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.08
        }
    );

    tl.to({}, { duration: 0.6 });

    tl.to(".credit", {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
            gsap.set(".credit", { visibility: "hidden" });
            sessionStorage.setItem(PRELOAD_KEY, "true");

            enableAnimatedOnScroll();
            ScrollTrigger.refresh();
        }
    });
}


// ===================================
// UI STATE MACHINE
// ===================================
const UI_STATE = {
    PRELOAD: "PRELOAD",
    TOP: "TOP",
    SCROLLED: "SCROLLED"
};

let currentState = UI_STATE.PRELOAD;
let navbar = null;
let cursorTL = null;
let scrollInitialized = false;

// ===================================
// CURSOR MODULE
// ===================================
function showCursor() {
    cursorTL && cursorTL.kill();

    gsap.set(".scroll-container", { visibility: "visible" });

    cursorTL = gsap.timeline()
        .fromTo(".line", { scaleY: 0 }, { scaleY: 1, duration: 0.3 })
        .fromTo(".dot", { y: 10, scale: 0 }, { y: 0, scale: 1, duration: 0.3 }, "-=0.2")
        .to(".scroll-container button", { opacity: 1, y: 0 }, "-=0.2");
}

function hideCursor(done) {
    cursorTL && cursorTL.kill();

    cursorTL = gsap.timeline({
        onComplete() {
            gsap.set(".scroll-container", { visibility: "hidden" });
            done && done();
        }
    })
        .to(".scroll-container button", { opacity: 0, y: 4, duration: 0.12 })
        .to(".dot", { scale: 0, y: 10, duration: 0.14 }, "-=0.1")
        .to(".line", { scaleY: 0, duration: 0.24 }, "-=0.2");
}

// ===================================
// NAVBAR MODULE
// ===================================
function showNavbar() {
    if (!navbar) return;
    gsap.to(navbar, {
        y: 0,
        autoAlpha: 1,
        height: "48px",
        duration: 0.5
    });
}

function hideNavbar(done) {
    if (!navbar) return done && done();
    gsap.to(navbar, {
        y: 100,
        autoAlpha: 0,
        duration: 0.5,
        onComplete: done
    });
}

// ===================================
// SCROLL CONTROLLER
// ===================================
function initScrollController() {
    if (scrollInitialized) return;
    scrollInitialized = true;

    let lastState = null;

    window.addEventListener("scroll", () => {
        const state = window.scrollY <= 0 ? UI_STATE.TOP : UI_STATE.SCROLLED;
        if (state === lastState) return;
        lastState = state;

        if (state === UI_STATE.TOP) {
            hideNavbar(showCursor);
        } else {
            hideCursor(showNavbar);
        }
    });
}

// ===================================
// UI INIT
// ===================================
function initUI() {
    navbar = document.getElementById("navbar");

    if (window.scrollY <= 0) {
        gsap.set(navbar, { autoAlpha: 0, y: 100 });
        showCursor();
    } else {
        gsap.set(".scroll-container", { visibility: "hidden" });
        showNavbar();
    }

    initScrollController();
}

// ===================================
// SCROLL LOCK
// ===================================
function disableScroll() {
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
}

function enableScroll() {
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
}

// ===================================
// PRELOAD INIT (RELOAD SAFE)
// ===================================
function initPreload() {
    disableScroll();

    const hasVisited = sessionStorage.getItem(PRELOAD_KEY);
    const typedDone = sessionStorage.getItem(TYPED_KEY);

    // ✅ FIX: jika reload di tengah preload
    if (typedDone && !hasVisited) {
        sessionStorage.setItem(PRELOAD_KEY, "true");
    }

    if (!hasVisited) {
        hideElements();

        window.addEventListener("load", () => {
            if (!typedDone) {
                typeTextWithMode(title, "Hi, I’m Salman.", 90, () => {
                    typeTextWithMode(subtitle, "Multimedia & Digital Creator", 70, () => {
                        sessionStorage.setItem(TYPED_KEY, "true");
                        showElementsOnPreload();
                        enableScroll();
                        initUI();
                    });
                });
            } else {
                enableScroll();
                showAllElements();
                enableAnimatedOnScroll();
                ScrollTrigger.refresh();
                initUI();
            }
        });

    } else {
        enableScroll();
        showAllElements();
        enableAnimatedOnScroll();
        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
            initUI();
        });
    }
}

initPreload();

// ===================================
// NAVBAR COMPACT
// ===================================
function initNavbarCompactOnScroll() {
    const navbar = document.querySelector("nav");
    if (!navbar) return;

    let lastY = window.scrollY;
    const threshold = 8;

    function update() {
        const y = window.scrollY;
        const diff = y - lastY;

        if (y <= 0) navbar.classList.add("compact");
        else if (diff < -threshold) navbar.classList.remove("compact");
        else if (diff > threshold) navbar.classList.add("compact");

        lastY = y;
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
}

document.addEventListener("DOMContentLoaded", initNavbarCompactOnScroll);

// ===================================
// HORIZONTAL CARD
// ===================================
const track = document.querySelector(".horizontal-track");

if (track) {
    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-section",
            start: "top top",
            end: () => "+=" + getScrollAmount(),
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });
}

gsap.set([".scroll-container button", "nav a"], {
    pointerEvents: "auto"
});

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

scrollToSection();