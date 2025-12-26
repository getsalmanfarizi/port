/* =========================================================
   GLOBAL THEME SYSTEM (LIGHT / DARK)
   Tab color selalu mengikuti tema web
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const themeMeta = document.querySelector('meta[name="theme-color"]') || createThemeMeta();
  const toggleBtn = document.getElementById('toggle-theme');

  // ===============================
  // 1. DETEKSI TEMA AWAL
  // ===============================
  const storedTheme = localStorage.getItem('theme');
  const devicePrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDark = storedTheme
    ? storedTheme === 'dark'
    : devicePrefersDark;

  // ===============================
  // 2. FUNSI UNTUK MEMASTIKAN META ADA
  // ===============================
  function createThemeMeta() {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    return meta;
  }

  // ===============================
  // 3. FUNSI UPDATE TAB COLOR
  // ===============================
  function updateTabColor() {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', isDark ? '#0a0a0a' : '#fafafa');
  }

  // ===============================
  // 4. FUNSI APPLY TEMA
  // ===============================
  function applyTheme(withAnimation = true) {
    document.body.classList.toggle("dark-mode", isDark);
    updateTabColor();

    if (!toggleBtn) return;

    // ===============================
    // TANPA ANIMASI (LOAD AWAL)
    // ===============================
    if (!withAnimation) {
      toggleBtn.innerHTML = `<i data-feather="${isDark ? "sun" : "moon"}"></i>`;
      feather.replace();
      return;
    }

    const svg = toggleBtn.querySelector("svg");

    if (!svg) {
      toggleBtn.innerHTML = `<i data-feather="${isDark ? "sun" : "moon"}"></i>`;
      feather.replace();
      return;
    }

    const paths = svg.querySelectorAll("path, line, circle, polyline");

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    // ===============================
    // ROTASI & SCALE KELUAR (PELAN)
    // ===============================
    tl.to(svg, {
      rotation: isDark ? -180 : 180,
      scale: 0.5,               // mengecil dulu
      transformOrigin: "50% 50%",
      duration: 0.6
    }, 0);

    paths.forEach(el => {
      const length = el.getTotalLength();
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: 0 });

      tl.to(el, {
        strokeDashoffset: length,
        duration: 0.45,
        ease: "power4.in"
      }, 0);
    });

    // ===============================
    // GANTI ICON
    // ===============================
    tl.add(() => {
      toggleBtn.innerHTML = `<i data-feather="${isDark ? "sun" : "moon"}"></i>`;
      feather.replace();
    });

    // ===============================
    // ROTASI MASUK + SCALE NORMAL (SOFT)
    // ===============================
    tl.add(() => {
      const newSvg = toggleBtn.querySelector("svg");
      if (!newSvg) return;

      const newPaths = newSvg.querySelectorAll("path, line, circle, polyline");

      gsap.set(newSvg, {
        rotation: isDark ? 180 : -180,
        scale: 0.7,               // mulai dari kecil
        transformOrigin: "50% 50%"
      });

      newPaths.forEach(el => {
        const length = el.getTotalLength();
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: "power4.out"
        });
      });

      gsap.to(newSvg, {
        rotation: 0,
        scale: 1,                  // kembali ke normal
        duration: 0.8,
        ease: "elastic.out(1, 0.9)" // efek lebih soft dan cinematic
      });
    });
  }

  // ===============================
  // 5. TOGGLE BUTTON MANUAL
  // ===============================
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isDark = !isDark;
      localStorage.setItem("theme", isDark ? "dark" : "light");
      applyTheme(true); // 🔥 animasi aktif
    });
  }


  // ===============================
  // 6. SISTEM DARK/LIGHT MODE OTOMATIS
  // ===============================
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", e => {
    if (!storedTheme) {
      isDark = e.matches;
      applyTheme(false);
    }
  });


  // ===============================
  // 7. APPLY TEMA AWAL
  // ===============================
  applyTheme(false); // ❗ tanpa animasi

});

// ===============================
// DESKTOP SYSTEM THEME HANDLER
// ===============================

const isDesktop = window.matchMedia('(pointer: fine)').matches;
const desktopThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

if (isDesktop) {
  if (!localStorage.getItem('theme')) {
    const isDark = desktopThemeQuery.matches;

    document.body.classList.toggle('dark-mode', isDark);

    const themeMeta =
      document.querySelector('meta[name="theme-color"]') ||
      (() => {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
        return meta;
      })();

    themeMeta.setAttribute('content', isDark ? '#0a0a0a' : '#fafafa');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('themeSource', 'system');
  }

  desktopThemeQuery.addEventListener('change', e => {
    if (localStorage.getItem('themeSource') === 'system') {
      const isDark = e.matches;

      document.body.classList.toggle('dark-mode', isDark);

      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', isDark ? '#0a0a0a' : '#fafafa');
      }

      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  });
}