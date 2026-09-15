/* HAIWA FABRICS — site behavior: mobile nav, language switch, forms. */
(function(){
  "use strict";

  /* ---------- Mobile drawer ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.querySelector(".mobile-drawer");
  var drawerClose = document.querySelector(".drawer-close");
  function openDrawer(){ if(drawer){ drawer.classList.add("open"); document.body.style.overflow="hidden"; } }
  function closeDrawer(){ if(drawer){ drawer.classList.remove("open"); document.body.style.overflow=""; } }
  if(toggle) toggle.addEventListener("click", openDrawer);
  if(drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if(drawer){
    drawer.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeDrawer); });
  }

  /* ---------- Language switcher ---------- */
  var LANG_KEY = "hx_lang";
  function getLang(){
    var saved = null;
    try{ saved = localStorage.getItem(LANG_KEY); }catch(e){}
    return (saved && window.HX_I18N[saved]) ? saved : "en";
  }
  function setLang(code){
    if(!window.HX_I18N[code]) return;
    try{ localStorage.setItem(LANG_KEY, code); }catch(e){}
    applyLang(code);
  }
  function applyLang(code){
    var dict = window.HX_I18N[code] || window.HX_I18N.en;
    var en = window.HX_I18N.en;
    document.documentElement.lang = code;
    document.documentElement.dir = dict._dir || "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      var val = dict[key] !== undefined ? dict[key] : en[key];
      if(val !== undefined) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var key = el.getAttribute("data-i18n-ph");
      var val = dict[key] !== undefined ? dict[key] : en[key];
      if(val !== undefined) el.setAttribute("placeholder", val);
    });
    document.querySelectorAll(".lang-menu button").forEach(function(btn){
      btn.setAttribute("aria-current", btn.getAttribute("data-lang") === code ? "true" : "false");
    });
    var current = document.querySelector(".lang-current");
    if(current && dict._label) current.textContent = dict._label;
  }
  document.querySelectorAll(".lang-menu button").forEach(function(btn){
    btn.addEventListener("click", function(){
      setLang(btn.getAttribute("data-lang"));
      var wrap = btn.closest(".lang-switch");
      if(wrap) wrap.classList.remove("open");
    });
  });
  var langSwitch = document.querySelector(".lang-switch");
  var langToggleBtn = document.querySelector(".lang-toggle-btn");
  if(langToggleBtn && langSwitch){
    langToggleBtn.addEventListener("click", function(e){
      e.stopPropagation();
      langSwitch.classList.toggle("open");
    });
    document.addEventListener("click", function(e){
      if(!langSwitch.contains(e.target)) langSwitch.classList.remove("open");
    });
  }
  applyLang(getLang());

  /* ---------- Forms: intercept submit, show confirmation (no backend wired yet) ---------- */
  document.querySelectorAll("form[data-lead-form]").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var success = document.querySelector(form.getAttribute("data-success-target"));
      form.style.display = "none";
      if(success) success.classList.add("show");
      if(success) success.scrollIntoView({behavior:"smooth", block:"center"});
    });
  });

  /* ---------- Header shadow / shrink on scroll (subtle) ---------- */
  var header = document.querySelector(".site-header");
  if(header){
    var lastY = 0;
    window.addEventListener("scroll", function(){
      var y = window.scrollY;
      header.style.borderBottomColor = y > 8 ? "var(--line)" : "var(--line)";
      lastY = y;
    }, {passive:true});
  }
})();
