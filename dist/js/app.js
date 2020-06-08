



const app_version = "1.0.14.3-beta";
const previous_commit = "5f22473be3faa9cd2a50444f8bea4af46725c030";
const BEZIAPP_UPDATE_INTERVAL = 300; // update vsakih 300 sekund

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/sw.js")
		.then(() => { })
		.catch((err) => console.log("Service worker registration failed", err));
}

// Listen to messages from service workers.
if (navigator.serviceWorker) {
	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data.msg === "install") {
			window.location.replace("/index.html");
		}
	});
}

/**
 * Displays a user-friendly text to the user and
 * detailed text to developer (console)
 * @param {string} usermsg User-friendly message
 * @param {string} devmsg Developer-friendly message
 */
async function UIAlert(usermsg, devmsg) {
	if (true) { // če bo kakšen dev switch?
		M.toast({ html: usermsg });
		console.log(`[BežiApp UIAlert] ${usermsg} ${devmsg}`);
	} else {
		M.toast({ html: `${usermsg} ${devmsg}` });
	}
}

/**
 * Handles GSEC error - notifies the user and prints a console message
 * @param {Object} err GSEC error object
 */
function gsecErrorHandlerUI(err) {
	console.log(`gsecErrorHanderUI: handling ${err}`);
	if (err == GSEC_ERR_NET || err == GSEC_ERR_NET_POSTBACK_GET ||
		err == GSEC_ERR_NET_POSTBACK_POST) {

		UIAlert(D("gsecErrNet"));
	} else if (err == GSEC_ERR_LOGIN) {
		UIAlert(D("gsecErrLogin"));
		localforage.setItem("logged_in", false).then(() => {
			window.location.replace("/index.html");
		});
	} else {
		UIAlert(D("gsecErrOther"));
	}
}

var update_app_function = async function () {
	try {
		$.get("/cache_name.txt?cache_kill="+Date.now(), (data, status) => {
			var cache_name = data.split("///")[1].split("|||")[0];
			var data_to_send = {
				action: "checkversion",
				valid_cache_name: cache_name
			}
			try {
				navigator.serviceWorker.controller.postMessage(JSON.stringify(data_to_send));
			} catch (e) {
				console.log("update requested but sw is not available in app.js");
			}
		});
	} catch (e) {
		console.log("update requested but failed because of network error probably in update_app_function in app.js");
	}
}

var error_report_function = async function (msg, url, lineNo, columnNo, error) {
	// catching everything here so no looping error shit. that's the last thing we want
	try {
		localforage.getItem("errorReporting").then(async function (value) {
			let selectedE = value;
			if (value == null || value.length < 1) {
				selectedE = "on";
			}
			if (selectedE == "on") {
				var data = {};
				data.error = { "msg": msg, "url": url, "line": lineNo, "column": columnNo, "obj": error };
				data.client = { "ua": navigator.userAgent, "app_version": app_version, "previous_commit": previous_commit, "username": null };

				// Load required data
				data.client.username = await localforage.getItem("username");

				data.type = "error";
				$.post("https://beziapp-report.gimb.tk/", data);
			} else {
				console.log("error not reported as reporting is disabled!");
			}
		}).catch(() => { });
		return false;
	} catch (e) {
		console.log("error_erport_function: !!! ERROR! (caught) - probably some network error.");
	}
}

window.onerror = error_report_function;
window.onunhandledrejection = error_report_function;


document.addEventListener("DOMContentLoaded", () => {
	var update_interval = setInterval(() => { // ok, it's value is never read, so what?!
		localforage.getItem("lastUpdate").then((data) => {
			if (Math.floor(Date.now() / 1000) > data + BEZIAPP_UPDATE_INTERVAL) {
				// trigger an update
				update_app_function();
			}
		});
	}, 1000 * BEZIAPP_UPDATE_INTERVAL);
})
