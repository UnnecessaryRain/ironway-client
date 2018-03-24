Util = {
	// Tokenise splits strings on spaces or double quoted strings
	Tokenise: function (input_string) {
		var regexp = /[^\s"]+|"([^"]*)"/gi;
		var words = [];
		do {
			var match = regexp.exec(input_string);
			if (match != null) {
				words.push(match[1] ? match[1] : match[0]);
			}
		} while (match != null);
		return words;
	},
}

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