Server = {
	Initialise() {},

	// RunCommand sends command straight to server
	RunCommand(command) {
		command = command.trim();
		command = Util.EscapeHtml(command);

		// Double check it's not a client command
		if (command.startsWith("//")) {
			Client.RunCommand(command);
			return;
		}

		Server.SendMessage(command);
	},

	// Connect to server and address
	Connect() {
		if (!("WebSocket" in window)) {
			alert("WebSockets are not supported by your browser. Please upgrade to connect to the server.");
			Display.LogError("WebSockets are not supported by your browser. Please upgrade to connect to the server.");
			return;
		}

		Display.LogMessage("Connecting to server...");
		Server._socket = new WebSocket("ws://127.0.0.1:8080/ws");

		Server._socket.onopen = function (event) {
			Server._OnOpen(event);
		}
		Server._socket.onclose = function (event) {
			Server._OnClose(event);
		}
		Server._socket.onmessage = function (event) {
			Server._OnMessage(event);
		}
		Server._socket.onerror = function (event) {
			Server._OnError(event);
		}
	},

	// Disconnect from the server
	Disconnect() {
		// TODO(#10) : Send some logout notification to server
		Server._socket.close();
	},

	// Ping sends a ping
	Ping() {
		Server.SendMessage("/ping");
	},

	// Status gets status (in words) of server
	Status() {
		switch (Server._socket.readyState) {
			case 0:
				return "Disconnected";
			case 1:
				return "Connected";
			case 2:
				return "Disconnecting";
			case 3:
				return "Closed";
			default:
				return "Unknown";
		}
	},

	// SendMessage sends plain text to interpret as command
	SendMessage(messageStr) {
		var payload = {};
		payload.messages = [messageStr];
		Server._Write(payload);
	},

	// _Write converts message object to JSON and sends to server
	_Write(message) {
		if (Server._socket.readyState != 1) {
			Display.LogError("Could not connect to server. Please check connection.");
			return;
		}

		message.metadata = Auth.GetMetadata();

		var payload = JSON.stringify(message);
		Server._socket.send(payload);
	},

	// _OnOpen event trigger from connecting to server
	_OnOpen(event) {
		Server.SendMessage(Auth.username);
		Display.LogMessage("Connected to server!");
	},

	// _OnClose event trigger from disconnecting to server
	_OnClose(event) {
		Display.LogMessage("Disconnected from server.");
	},

	// _OnMessage event trigger from recieving message from server
	_OnMessage(event) {
		var json = JSON.parse(event.data);
		if (json.updates == undefined) {
			console.error("Expected field 'updates' in server response", json);
			return;
		}

		for (update in json.updates) {
			var message = json.updates[update];
			Display.LogMessage("\\green{Server:} " + message.content);
			Display.Write(message.frame, message.content, message.mode);
		}
	},

	// _OnMessage event trigger from error with server connection
	_OnError(event) {
		console.error("Could not connect to server", event);
		Display.LogError("Could not connect to server. Please check connection.");
	},
};
