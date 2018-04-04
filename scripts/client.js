Client = {
	/**
	 * Initialise client and sets up binds
	 * @public
	 */
	Initialise() {
		Client._commands = {};
		Client._help_functions = {};

		Client._AddCommand("help", function (tokens) {
			Display.LogMessage(Client._HelpText());
		});
		Client._AddHelpFunction("//help", "Shows this help text");

		// Bind a key to a follow on command
		Client._AddCommand("bind", function (tokens) {
			if (tokens.length == 1) {
				Display.LogError("Not enough arguments specified to //bind.");
			} else if (tokens.length == 2) {
				Input.RemoveBind(tokens[1]);
			} else {
				Input.AddBind(tokens[1], function () {
					Util.TryCommand(tokens[2]);
				});
			}
		});
		Client._AddHelpFunction("//bind key command", "Binds \\i{key} to \\i{command}");
		Client._AddHelpFunction("//bind key", "Unbinds \\i{key}");

		// Clear screen command
		Client._AddCommand("clear", function (tokens) {
			Display.ClearFrame("log");
		});
		Client._AddHelpFunction("//clear", "Clears the history log");

		// Zoom command
		Client._AddCommand("zoom", function (tokens) {
			if (tokens.length == 1) {
				Display.MapZoom(0);
			} else if (tokens[1] == "in") {
				Display.MapZoom(1);
			} else if (tokens[1] == "out") {
				Display.MapZoom(-1);
			} else {
				Display.LogError("Wrong arguments. Must specify 'in' or 'out'.");
			}
		});
		Client._AddHelpFunction("//zoom in", "Zooms the map in");
		Client._AddHelpFunction("//zoom out", "Zooms the map out");

		// Server debug commands
		Client._AddCommand("server", function (tokens) {
			if (tokens.length == 1) {
				Display.LogMessage("Server status: " + Server.Status());
				return;
			}
			switch (tokens[1]) {
				case "connect":
					Server.Connect();
					break;
				case "disconnect":
					Server.Disconnect();
					break;
				case "status":
					Display.LogMessage("Server status: " + Server.Status());
					break;
				case "ping":
					Server.Ping();
					break;
				case "send":
					if (tokens.length > 2) {
						Server.SendMessage(tokens[2]);
					} else {
						Server.Ping();
					}
				default:
					Display.LogMessage("Wrong arguments. Use //help for usage.");
					break;
			}
		});
		Client._AddHelpFunction("//server status", "Gives server status");
		Client._AddHelpFunction("//server connect", "Attempt to connect to server");
		Client._AddHelpFunction("//server disconnect", "Disconnects from server");
		Client._AddHelpFunction("//server ping", "Pong!");
		Client._AddHelpFunction("//server send [message]", "Sends plain text \\i{message} to server");
	},

	/**
	 * RunCommand is default way of executing a command to the client.
	 * 
	 * @public
	 * @param {string} command Inputted command eg: "//help"
	 */
	RunCommand(command) {
		// Get command and tail
		command = command.slice(2);
		var tokens = Util.Tokenise(command);

		if (tokens[0] in Client._commands) {
			Client._commands[tokens[0]].call(this, tokens);
		} else {
			Display.LogError("Could not find command `" + tokens[0] + "`");
			return;
		}
	},

	/**
	 * _AddCommand adds a keyword that triggers an action on press.
	 * 
	 * @private
	 * @param {string} command Plain text command eg "/move n"
	 * @param {Function} action Function to trigger on key press
	 */
	_AddCommand(command, action) {
		Client._commands[command] = action;
	},

	/**
	 * _AddHelpFunction adds commands to a list for when user types `//help`.
	 * Note, should only be for client side commands (starting with //)
	 * 
	 * @private
	 * @param {string} command eg: "//help"
	 * @param {string} message eg: "Shows the help menu"
	 */
	_AddHelpFunction(command, message) {
		Client._help_functions[command] = message;
	},

	/**
	 * _HelpText collates and pretty prints the client help functions
	 * 
	 * @returns {string} Formatted version of client help functions
	 */
	_HelpText() {
		var longest = 0;
		var keys = Object.keys(Client._help_functions);
		keys.sort();

		for (let key of keys) {
			longest = Math.max(key.length, longest);
		}
		longest += 4;

		var message = "== \\u{CLIENT COMMANDS} == <br>";

		for (let key of keys) {
			message += "\\command{" + key + "} ";
			message += Array(longest - key.length).join(".");
			message += " " + Client._help_functions[key];
			message += "<br>";
		}

		return message;
	},
};
