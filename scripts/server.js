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
		Server._Write([messageStr]);
	},

	// _Write converts message object to JSON and sends to server
	_Write(messages) {
		if (Server._socket.readyState != 1) {
			Display.LogError("Could not connect to server. Please check connection.");
			return;
		}

		var packet = {};
		packet.metadata = Auth.GetMetadata();
		packet.client_messages = [];
		packet.server_messages = messages;

		var payload = Server._Serialise(packet);
		console.log(payload);
		Server._socket.send(payload);
	},
	
	// _Serialise converts js object to JSON string
	_Serialise(packetObj) {
		return JSON.stringify(packetObj);
	},

	// _Deserialise converts JSON string to js object and verifies
	_Deserialise(packetStr) {
		var packet = JSON.parse(packetStr);
		if (packet.metadata == undefined) {
			console.error("No field 'metadata' attached to packet", packetStr);
			return {};
		}

		// TODO() : Auth packet.metadata against client Auth

		if (packet.client_messages == undefined) {
			console.error("No field 'client_messages' attached to packet", packetStr);
			return {};
		}
		return packet;
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
		var packet = Server._Deserialise(event.data);

		for (update in packet.client_messages) {
			var message = packet.client_messages[update];
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
