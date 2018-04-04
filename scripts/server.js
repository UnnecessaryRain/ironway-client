Server = {
	Initialise() {},

	/**
	 * RunCommand gets a inputted command from Util.TryCommand and sends to server
	 * 
	 * @public
	 * @param {string} command Command to execute. eg: "/move n"
	 */
	RunCommand(command) {
		Server.SendMessage(command);
	},

	/**
	 * Connect tries to establish connection to server through websocket
	 * @public
	 */
	Connect() {
		if (!("WebSocket" in window)) {
			alert("WebSockets are not supported by your browser. Please upgrade to connect to the server.");
			Display.LogError("WebSockets are not supported by your browser. Please upgrade to connect to the server.");
			return;
		}

		Display.LogMessage("Connecting to server...");
		// HACK(Samuel-Lewis): Hard coded address value is always local
		Server._socket = new WebSocket("ws://" + Auth.ip + "/ws");

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

	/**
	 * Disconnects from server
	 * @public
	 */
	Disconnect() {
		// TODO(#10) : Send some logout notification to server
		Server._socket.close();
	},

	/**
	 * Ping is alias to user command /ping
	 * @public
	 */
	Ping() {
		Server.SendMessage("/ping");
	},

	/**
	 * Status gets a text representation of the status of the connection.
	 * 
	 * @public
	 * @returns {string} Status of the connection
	 */
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
	
	/**
	 * SendMessage compiles multiple messages together to send to server
	 * 
	 * @public
	 * @param {string} message Message to send to server
	 */
	SendMessage(message) {
		Server._Write([message]);
	},

	/**
	 * _Write converts message object to JSON and sends to server
	 * 
	 * @private
	 * @param {(string|Array)} messages Array of messages to send to server
	 */
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
	
	/**
	 * _Serialise converts js object to JSON string
	 * 
	 * @private
	 * @param {Object} packetObj 
	 * @returns {string} JSON version of given object
	 */
	_Serialise(packetObj) {
		return JSON.stringify(packetObj);
	},

	/**
	 * _Deserialise converts JSON string to js object and verifies
	 * 
	 * @private
	 * @param {string} packetStr 
	 * @returns {Object} JS object of given JSON string
	 */
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

	/**
	 * _OnOpen event trigger from connecting to server
	 * 
	 * @private
	 * @param {Object} event Connection event
	 */
	_OnOpen(event) {
		Server.SendMessage(Auth.username);
		Display.LogMessage("Connected to server!");
	},

	/**
	 * _OnClose event trigger from disconnecting to server
	 * 
	 * @private
	 * @param {Object} event Disconnect event
	 */
	_OnClose(event) {
		Display.LogMessage("Disconnected from server.");
	},

	/**
	 * _OnMessage event trigger from recieving message from server
	 * 
	 * @private
	 * @param {Object} event Event with message data
	 */
	_OnMessage(event) {
		var packet = Server._Deserialise(event.data);

		for (update in packet.client_messages) {
			var message = packet.client_messages[update];
			Display.Write(message.frame, message.content, message.mode);
		}
	},

	/**
	 * _OnMessage event trigger from error with server connection 
	 * 
	 * @private
	 * @param {Object} event Event with message error and status
	 */
	_OnError(event) {
		console.error("Could not connect to server", event);
		Display.LogError("Could not connect to server. Please check connection.");
	},
};
