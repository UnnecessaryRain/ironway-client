Util = {
	// Tokenise splits strings on spaces or double quoted strings
	Tokenise(input_string) {
		var regexp = /[^\s"]+|"([^"]*)"/gi;
		var words = [];
		var match;
		do {
			match = regexp.exec(input_string);
			if (match != null) {
				words.push(match[1] ? match[1] : match[0]);
			}
		} while (match != null);
		return words;
	},

	// EscapeHtml sanitises input and escapes html
	EscapeHtml(text) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(text));
		return div.innerHTML;
	},
};

window.onload = function () {
	Auth.Initialise();
	Display.Initialise();
	Client.Initialise();
	Server.Initialise();
	Input.Initialise();

	Display.ClearFrame("log");
	Display.ClearFrame("chat");

	Server.Connect();
}

window.onbeforeunload = function () {
	Server.Disconnect();
}
