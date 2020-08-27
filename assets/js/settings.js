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

async function setErrorReporting(targetE) {
	localforage.setItem("errorReporting", targetE).then((value) => {
		console.log("ErrorReporing set: " + value);
		UIAlert(D("errorReportingSet"), "setErrorReporting(): errorReportingSet");
	});
}

function shuffleArray(array) { // if you want options shufled each time. annoyng
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

function setUIAdditionalOptions(state) {
	var SENSITIVE_THEMES = { // themes that represent policical parties are shuffd
		"left": "Left / leva",
		"right": "Right / desna",
		"piratska": "Pirate / piratska"
	};
	if (state === true) {
		var theme_keys = Object.keys(SENSITIVE_THEMES);
		shuffleArray(theme_keys);
		theme_keys.forEach((item) => {
			var option_element = $(`<option value="${item}" id="option-${item}" data-theme="${item}">${SENSITIVE_THEMES[item]}</option>`);
			$("#select-theme").append(option_element);
		});
	} else {
		Object.keys(SENSITIVE_THEMES).forEach((item) => {
			$("#option-" + item).remove();
		});
	}
	var elems = document.querySelectorAll('#select-theme');
	M.FormSelect.init(elems, {});
}

async function setAdditionalOptions(state) { // you may show nsfw options now??
	localforage.setItem("triggerWarningAccepted", state).then((value) => {
		console.log("TriggerWarning set: " + value);
		UIAlert(D("triggerWarningSet"), "setAdditionalOptions(): triggerWarningSet");
		setUIAdditionalOptions(value);
	});
}

document.addEventListener("DOMContentLoaded", async () => {

	// Setup checkbox handler
	$("#triggered-checkbox").change(function() {
		if (this.checked) {
			setAdditionalOptions(true);
		} else {
			setAdditionalOptions(false);
		}
	});

	$("#select-language").on("change", function() {
		setLanguage($(this).find(":selected").val());
	});

	$("#select-theme").on("change", function() {
		setTheme($(this).find(":selected").val());
	});

	$("#select-errorreporting").on("change", function() {
		setErrorReporting($(this).find(":selected").val());
	});

	localforage.getItem("chosenLang").then((value) => {
		let selectedLanguage = value;
				if(value == null || value.length < 1) {
 					selectedLanguage = "sl";
				}
		$(`#option-${selectedLanguage}`).attr("selected", true);
	}).catch(() => {});

	localforage.getItem("theme").then((value) => {
		let selectedTheme = value;
				if(value == null || value.length < 1) {
					selectedTheme = "themeLight"; // default theme.
				}
		$(`#option-${selectedTheme}`).attr("selected", true);
	}).catch(() => {});

	localforage.getItem("errorReporting").then((value) => {
		let selectedE = value;
				if(value == null || value.length < 1) {
					selectedE = "on"; // defaults to reporting yes
				}
		$(`#option-${selectedE}`).attr("selected", true);
	}).catch(() => {});

	localforage.getItem("triggerWarningAccepted").then((value) => {
		if (value === true) {
			$("#triggered-checkbox").attr("checked", true);
			setUIAdditionalOptions(true);
		}
	}).catch(() => {});

	// Setup side menu
	const menus = document.querySelectorAll(".side-menu");
	M.Sidenav.init(menus, { edge: "right", draggable: true });

	var elems = document.querySelectorAll(".theme-select");
	M.FormSelect.init(elems, {});
	
	var elems = document.querySelectorAll(".errorreporting-select");
	M.FormSelect.init(elems, {});
	
	// Setup language select dropdown
	var elems = document.querySelectorAll(".lang-select");
	M.FormSelect.init(elems, {});
});
