let translations = {};
let currentLang = localStorage.getItem("language") || "en";

fetch("./json/lang.json")
  .then(res => res.json())
  .then(data => {
    console.log("Loaded translations:", data);
    translations = data;
    applyTranslations(currentLang);

    const langSelect = document.getElementById("lang-select");
    if (langSelect) langSelect.value = currentLang;
  })
  .catch(err => console.error("Error loading lang.json:", err));

function applyTranslations(lang) {
  if (!translations[lang]) {
    console.warn("Bahasa " + lang + " tidak ditemukan di lang.json");
    return;
  }

  currentLang = lang;

  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-lang-placeholder]").forEach(el => {
    const key = el.getAttribute("data-lang-placeholder");
    if (translations[lang][key]) {
      el.setAttribute("placeholder", translations[lang][key]);
    }
  });

  document.querySelectorAll("[data-lang-value]").forEach(el => {
    const key = el.getAttribute("data-lang-value");
    if (translations[lang][key]) {
      el.value = translations[lang][key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.addEventListener("change", e => {
      const newLang = e.target.value;
      localStorage.setItem("language", newLang);
      applyTranslations(newLang);

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});
