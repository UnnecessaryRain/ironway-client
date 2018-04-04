Util = {
	/**
	 * Tokenise splits strings on spaces or double quoted strings
	 * Eg: my "red dog" smells  ==>  ["my", "red dog", "smells"] 
	 * 
	 * @public
	 * @param {string} input_string String of space delimited or quote words
	 * @returns {(string|Array)} Array of words split by spaces or quotes
	 */
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

	/**
	 * EscapeHtml sanitises and escapes html
	 * 
	 * @public
	 * @param {string} text Text with html elements in it
	 * @returns {string} Escaped plain text
	 */
	EscapeHtml(text) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(text));
		return div.innerHTML;
	},

	/**
	 * TryCommand called by Input detects type of command and sends to client
	 * or server.
	 * 
	 * @param {string} command String from user input
	 */
	TryCommand(command) {
		command = command.trim();		
		if (command == "") {
			return;
		}
		
		command = Util.EscapeHtml(command);

		// Check if client command or not
		if (command.startsWith("//")) {
			Client.RunCommand(command);
		} else {
			Server.RunCommand(command);
		}
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