let translations = {};
let currentLang = "en";


fetch("./json/lang.json")
  .then(res => res.json())
  .then(data => {
    console.log("Loaded translations:", data);
    translations = data;
    setLanguage(currentLang);
  })
  .catch(err => console.error("Error loading lang.json:", err));

function setLanguage(lang) {
  if (!translations[lang]) {
    alert("Bahasa " + lang + " tidak ditemukan di lang.json");
    return;
  }

  currentLang = lang;
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    } else {
      console.warn(`No translation found for key: ${key} in ${lang}`);
    }
  });

  alert("Bahasa diganti ke " + (lang === "id" ? "Indonesia" : "English"));
}

fetch("./json/lang.json")
  .then(res => res.json())
  .then(data => {
    console.log("Loaded translations:", data);
    translations = data;
    setLanguage(currentLang);
  })
  .catch(err => console.error("Error loading lang.json:", err));
