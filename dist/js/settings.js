// settings.js -- TODO

async function setLanguage(langCode)  {
    localforage.setItem("chosenLang", langCode).then((value) => {
        console.log("Language set: " + value);
        UIAlert(D("languageSet"), "setLanguage(): languageSet");
    });
}

async function setTheme(targetTheme) {
    localforage.setItem("theme", targetTheme).then((value) => {
        console.log("Theme set: " + value);
        UIAlert(D("themeSet"), "setTheme(): themeSet");
    });
}

document.addEventListener("DOMContentLoaded", async () => {

    $("#select-language").on("change", function() {
        setLanguage($(this).find(":selected").val());
    });

    $("#select-theme").on("change", function() {
        setTheme($(this).find(":selected").val());
    });

    localforage.getItem("chosenLang").then((value) => {
        let selectedLanguage = value ?? "sl";
        $(`#option-${selectedLanguage}`).attr("selected", true);
    }).catch(() => {});

    localforage.getItem("theme").then((value) => {
        let selectedTheme = value ?? "themeLight";
        $(`#option-${selectedTheme}`).attr("selected", true);
    }).catch(() => {});

    // Setup side menu
    const menus = document.querySelectorAll(".side-menu");
    M.Sidenav.init(menus, { edge: "right", draggable: true });

    var elems = document.querySelectorAll(".theme-select");
    M.FormSelect.init(elems, {});
    
    // Setup language select dropdown
    var elems = document.querySelectorAll(".lang-select");
    M.FormSelect.init(elems, {});
});