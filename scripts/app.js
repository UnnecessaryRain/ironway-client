// 
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
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(text));
		return div.innerHTML;
	},
};

window.onload = function () {
	Display.Initialise();
	Server.Initialise();
	Input.Initialise();
	Client.Initialise();

	Display.ClearFrame("log");

	Server.Connect();
}

window.onbeforeunload = function () {
	Server.Disconnect();
}
