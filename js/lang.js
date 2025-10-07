let translations = {};
let currentLang = localStorage.getItem("language") || "en";

function getLangSelect() { return document.getElementById("lang-select"); }
function safeSetSelect(lang) { const s = getLangSelect(); if (s) s.value = lang; }

function fetchTranslations() {
  return fetch("./json/lang.json")
    .then(res => res.json())
    .then(data => { translations = data; return data; });
}

function applyTranslations(lang) {
  if (!translations[lang]) {
    console.warn("Missing translations for", lang);
    return;
  }
  currentLang = lang;

  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    const text = translations[lang][key];
    if (typeof text === "undefined") return;
    if (/<\/?[a-z][\s\S]*>/i.test(text)) el.innerHTML = text;
    else el.textContent = text;
  });

  document.querySelectorAll("[data-lang-placeholder]").forEach(el => {
    const key = el.getAttribute("data-lang-placeholder");
    const text = translations[lang][key];
    if (typeof text !== "undefined") el.setAttribute("placeholder", text);
  });

  document.querySelectorAll("[data-lang-value]").forEach(el => {
    const key = el.getAttribute("data-lang-value");
    const text = translations[lang][key];
    if (typeof text !== "undefined") el.value = text;
  });
}

function setLanguage(lang, opts = { save: true, scroll: true }) {
  if (!translations[lang]) return;
  currentLang = lang;
  if (opts.save) localStorage.setItem("language", lang);
  applyTranslations(lang);
  safeSetSelect(lang);
  if (opts.scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

fetchTranslations()
  .then(() => {
    setLanguage(localStorage.getItem("language") || currentLang, { save: false, scroll: false });

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        const s = getLangSelect();
        if (s) {
          s.value = currentLang;
          s.addEventListener("change", e => setLanguage(e.target.value));
        }
      });
    } else {
      const s = getLangSelect();
      if (s) {
        s.value = currentLang;
        s.addEventListener("change", e => setLanguage(e.target.value));
      }
    }
  })
  .catch(err => console.error("Failed to load lang.json", err));

window.applyTranslations = applyTranslations;
window.setLanguage = setLanguage;

window.addEventListener("hashchange", () => {
  const lang = localStorage.getItem("language") || "en";
  applyTranslations(lang);
  safeSetSelect(lang);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("popstate", () => {
  const lang = localStorage.getItem("language") || "en";
  applyTranslations(lang);
  safeSetSelect(lang);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

(function tryAngularHook() {
  if (!window.angular) return;
  try {
    const injector = angular.element(document.body).injector();
    if (!injector) return;
    const $rootScope = injector.get('$rootScope');
    $rootScope.$on('$routeChangeSuccess', function() {
      const lang = localStorage.getItem("language") || "en";
      applyTranslations(lang);
      safeSetSelect(lang);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } catch (e) {
    console.warn("Angular translation hook not attached:", e);
  }
})();

app.controller("ProductViewController", function($scope) {
    $scope.currentLang = localStorage.getItem("language") || "en";

    $scope.switchLang = function(lang) {
        $scope.currentLang = lang;
        localStorage.setItem("language", lang);
    };

    $scope.product = productData[0]; 
});

app.filter("translate", function() {
    var dict = {
        "AVAILABLE MODELS": { en: "AVAILABLE MODELS", id: "MODEL TERSEDIA" },
        "MODEL": { en: "MODEL", id: "MODEL" },
        "PRODUCT_NOT_FOUND": { en: "Product Not Found", id: "Produk Tidak Ditemukan" }
    };

    return function(key, lang) {
        return dict[key] ? dict[key][lang] : key;
    };
});

app.controller("ProductViewController", function($scope, $routeParams) {
    $scope.currentLang = localStorage.getItem("language") || "en";

    $scope.switchLang = function(lang) {
        $scope.currentLang = lang;
        localStorage.setItem("language", lang);
    };

    const productId = parseInt($routeParams.id, 10) || 1;
    $scope.product = productData.find(p => p.id === productId);
});

app.controller("ProductViewController", function($scope, $routeParams) {
    $scope.currentLang = localStorage.getItem("language") || "en";

    $scope.switchLang = function(lang) {
        $scope.currentLang = lang;
        localStorage.setItem("language", lang);
    };

    const productId = parseInt($routeParams.id, 10) || 1;
    $scope.product = productData.find(p => p.id === productId);
});

function setLanguage(lang, opts = { save: true, scroll: true }) {
  if (!translations[lang]) return;
  currentLang = lang;
  if (opts.save) localStorage.setItem("language", lang);
  applyTranslations(lang);
  safeSetSelect(lang);
  if (opts.scroll) window.scrollTo({ top: 0, behavior: "smooth" });

  // 🔔 kasih tau Angular / app lain
  window.dispatchEvent(new Event("languageChanged"));
}
