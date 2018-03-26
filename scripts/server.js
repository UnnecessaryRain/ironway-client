Server = {
	Initialise() {},

	// RunCommand sends command straight to server
	RunCommand(command) {
		command = command.trim();
		command = Utils.EscapeHtml(command);

		// Double check it's not a client command
		if (command.startsWith("//")) {
			Client.RunCommand(command);
			return;
		}

		Input.RecordHistory(command);
		Server._Send(command);
	},

	// Connect to server and address
	Connect() {
		if (!("WebSocket" in window)) {
			alert("WebSockets are not supported by your browser. Please upgrade to connect to the server.");
			Display.LogError("WebSockets are not supported by your browser. Please upgrade to connect to the server.");
			return;
		}

		Display.LogMessage("Opening websocket to ws://127.0.0.1:8080...");
		Server._socket = new WebSocket("ws://127.0.0.1:8080/ws");

		Server._socket.onopen = function () {
			Display.LogMessage("Connected to server.");
			Display.LogMessage("Sending test message...");
			Server.Ping();
		}

		Server._socket.onerror = function () {
			Display.LogError("Could not connect to server. Please check connection.");
		}

		Server._socket.onclose = function () {
			Display.LogMessage("Server has disconnected.");
		}

		Server._socket.onmessage = function (event) {
			console.log(event.data);
			Display.LogMessage("Message recieved!");
		}
	},

	// Disconnect from the server
	Disconnect() {
		// TODO(Samuel-Lewis) : Send some logout mesage
		Server._socket.close();
	},

	// Ping sends a ping
	Ping() {
		Server._Send("Ping!");
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

	// _Send JSONified message to server
	_Send(message) {
		if (Server._socket.readyState != 1) {
			Display.LogError("Could not connect to server. Please check connection.");
			return;
		}

		var payload = {
			"messages": [message],
		}

		Server._socket.send(JSON.stringify(payload));
	},
};
