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
};

window.onload = function () {
	Display.Initialise();
	Server.Initialise();
	Input.Initialise();
	Client.Initialise();

	Display.LogMessage("Client initialised.");

	Server.Connect();
}

window.onbeforeunload = function () {
	Server.Disconnect();
}